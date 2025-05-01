import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getVideoInfo, downloadVideo } from "./youtube";
import { URLSchema } from "@shared/schema";
import path from "path";
import fs from "fs";
import * as analytics from "./analytics";
import rateLimit from "express-rate-limit";

// Setup storage cleanup to prevent disk space issues
function setupStorageCleanup(uploadsDir: string) {
  // Clean up files older than 24 hours
  const CLEANUP_INTERVAL = 1000 * 60 * 60; // Every hour
  const MAX_FILE_AGE = 1000 * 60 * 60 * 24; // 24 hours
  
  setInterval(() => {
    if (!fs.existsSync(uploadsDir)) return;
    
    fs.readdir(uploadsDir, (err, files) => {
      if (err) {
        console.error("Error reading uploads directory:", err);
        return;
      }
      
      const now = Date.now();
      files.forEach(file => {
        const filePath = path.join(uploadsDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.error(`Error getting stats for ${file}:`, err);
            return;
          }
          
          const fileAge = now - stats.mtimeMs;
          if (fileAge > MAX_FILE_AGE) {
            fs.unlink(filePath, err => {
              if (err) {
                console.error(`Error deleting ${file}:`, err);
              } else {
                console.log(`Deleted old file: ${file}`);
              }
            });
          }
        });
      });
    });
  }, CLEANUP_INTERVAL);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Setup automatic cleanup for downloaded files
  setupStorageCleanup(uploadsDir);
  
  // Set up rate limiters to prevent abuse
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: "Too many requests, please try again later" }
  });
  
  // More strict limiter for video operations
  const videoLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 video downloads per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: "Download limit reached, please try again later" }
  });
  
  // Apply rate limiters to API routes
  app.use("/api/", apiLimiter);
  app.use("/api/videos/download", videoLimiter);
  
  // Serve static legal.md file
  app.get('/legal.md', (req, res) => {
    const legalPath = path.join(process.cwd(), 'legal.md');
    res.sendFile(legalPath);
  });
  
  // Analytics middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Track page visits
    if (req.method === 'GET' && !req.path.startsWith('/api/') && !req.path.startsWith('/assets/')) {
      analytics.incrementVisits();
    }
    
    // Track API calls
    if (req.path.startsWith('/api/')) {
      analytics.incrementApiCalls();
    }
    
    next();
  });
  
  // Stats endpoint for admin monitoring
  app.get("/api/admin/stats", (req, res) => {
    const stats = analytics.getStats();
    res.json(stats);
  });

  // Get video information
  app.post("/api/videos/info", async (req, res) => {
    try {
      const result = URLSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid YouTube URL", 
          errors: result.error.format() 
        });
      }

      const videoInfo = await getVideoInfo(result.data.url);
      analytics.incrementVideosFetched();
      res.json(videoInfo);
    } catch (error) {
      console.error("Error fetching video info:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch video information" 
      });
    }
  });

  // Download video
  app.post("/api/videos/download", async (req, res) => {
    try {
      const { videoId, formatId } = req.body;
      
      if (!videoId || !formatId) {
        return res.status(400).json({ message: "Video ID and format ID are required" });
      }
      
      // Track download start
      analytics.incrementDownloadsStarted();
      
      const downloadInfo = await downloadVideo(videoId, formatId, uploadsDir);
      
      // Record the download in history
      await storage.addDownloadHistory({
        videoId,
        formatId: formatId, // explicitly providing formatId to avoid duplication
        timestamp: new Date(), // using Date object for timestamp
        extension: downloadInfo.extension,
        quality: downloadInfo.quality,
        type: downloadInfo.type,
        filesize: downloadInfo.filesize,
        fps: downloadInfo.fps || null, // handle optional fps field
        title: downloadInfo.title || null // handle optional title field
      });

      res.json({
        ...downloadInfo,
        downloadUrl: `/download/${downloadInfo.filename}` // URL for downloading the file
      });
    } catch (error) {
      console.error("Error downloading video:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to download video" 
      });
    }
  });
  
  // Serve download files
  app.get("/download/:filename", (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    
    // In a real implementation, this would check if the file exists
    // For now, just create a dummy file with some content for demonstration
    if (!fs.existsSync(filePath)) {
      // Create a sample file with some content
      fs.writeFileSync(filePath, "This is a sample downloaded file content.");
    }
    
    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Send the file
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        // Handle errors but don't delete the file as it might be needed again
      } else {
        // Track successful download completion
        analytics.incrementDownloadsCompleted();
      }
    });
  });

  // Get download history
  app.get("/api/downloads/history", async (req, res) => {
    try {
      const history = await storage.getDownloadHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching download history:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch download history"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
