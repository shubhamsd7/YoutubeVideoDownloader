import fs from 'fs';
import path from 'path';
import { VideoInfo, VideoFormat } from '@shared/schema';
import { getYouTubeVideoId } from '../client/src/lib/utils';
import youtubeDl from 'youtube-dl-exec';

// Function to get video information using youtube-dl-exec
export async function getVideoInfo(url: string): Promise<VideoInfo> {
  const videoId = getYouTubeVideoId(url);
  if (!videoId) {
    throw new Error('Invalid YouTube URL');
  }

  try {
    // Use youtube-dl-exec to get video information
    const videoInfo = await youtubeDl(url, {
      dumpSingleJson: true,
      noWarnings: true,
      callHome: false,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
    }) as any; // Type assertion to handle dynamic response

    // Convert the formats to our schema format
    const formats: VideoFormat[] = videoInfo.formats.map((format: any) => {
      // Determine format type more accurately
      let type = 'other';
      if (format.vcodec === 'none') {
        type = 'audio';
      } else if (format.acodec === 'none') {
        type = 'video'; // Video-only (no audio)
      } else if (format.acodec !== 'none' && format.vcodec !== 'none') {
        type = 'video'; // Video with audio
      }
      
      // Create descriptive quality label
      let qualityLabel = format.format_note || format.format || 'unknown';
      if (type === 'video' && format.acodec === 'none') {
        qualityLabel += ' (Video Only - No Sound)';
      } else if (type === 'video' && format.acodec !== 'none') {
        qualityLabel += ' (Video + Sound)';
      }
      
      return {
        formatId: format.format_id,
        extension: format.ext,
        quality: format.format_note || 'unknown',
        qualityLabel: qualityLabel,
        type: type,
        filesize: parseInt(format.filesize || format.filesize_approx || '0'),
        fps: format.fps ? parseInt(format.fps) : undefined,
      };
    });

    // Filter formats: Only MP4 files, with filesize > 0
    const rawFormats = formats
      .filter(format => format.extension === 'mp4' && format.filesize > 0)
      // Sort by video quality (highest first)
      .sort((a, b) => {
        // First sort by type (video first)
        if (a.type !== b.type) {
          return a.type === 'video' ? -1 : 1;
        }
        
        // Prioritize formats with both video and audio (check for "Video + Sound" in qualityLabel)
        const aHasAudio = a.qualityLabel?.includes('Video + Sound') || false;
        const bHasAudio = b.qualityLabel?.includes('Video + Sound') || false;
        
        if (aHasAudio !== bHasAudio) {
          return aHasAudio ? -1 : 1;
        }
        
        // Then sort by filesize (largest/highest quality first)
        return b.filesize - a.filesize;
      });
      
    // Deduplicate formats by quality to have only one format per resolution
    const qualityMap = new Map();
    const validFormats = rawFormats.filter(format => {
      // For video formats, use the quality or qualityLabel as the key
      const qualityKey = format.type === 'video' 
        ? (format.qualityLabel || format.quality || `${Math.round(format.filesize / 1000000)}MB`)
        : (format.qualityLabel || format.quality || `audio-${Math.round(format.filesize / 1000000)}MB`);
        
      // If we haven't seen this quality before, keep it
      if (!qualityMap.has(qualityKey)) {
        qualityMap.set(qualityKey, true);
        return true;
      }
      return false;
    });

    // If no MP4 formats found, include other formats and convert them
    let finalFormats = validFormats;
    if (validFormats.length === 0) {
      console.log('No MP4 formats found, will use other formats and convert');
      
      // Sort all formats by quality
      const sortedFormats = formats
        .filter(format => format.filesize > 0)
        .sort((a, b) => {
          // First sort by type (video first)
          if (a.type !== b.type) {
            return a.type === 'video' ? -1 : 1;
          }
          
          // Prioritize formats with both video and audio
          const aHasAudio = a.qualityLabel?.includes('Video + Sound') || false;
          const bHasAudio = b.qualityLabel?.includes('Video + Sound') || false;
          
          if (aHasAudio !== bHasAudio) {
            return aHasAudio ? -1 : 1;
          }
          
          // Then sort by filesize (largest/highest quality first)
          return b.filesize - a.filesize;
        });
      
      // Deduplicate other formats too
      const otherQualityMap = new Map();
      finalFormats = sortedFormats.filter(format => {
        const qualityKey = format.type === 'video' 
          ? (format.qualityLabel || format.quality || `${Math.round(format.filesize / 1000000)}MB`)
          : (format.qualityLabel || format.quality || `audio-${Math.round(format.filesize / 1000000)}MB`);
          
        if (!otherQualityMap.has(qualityKey)) {
          otherQualityMap.set(qualityKey, true);
          return true;
        }
        return false;
      });
    }

    return {
      id: videoInfo.id,
      title: videoInfo.title,
      description: videoInfo.description || 'No description available',
      thumbnailUrl: videoInfo.thumbnail || `https://img.youtube.com/vi/${videoInfo.id}/maxresdefault.jpg`,
      uploader: videoInfo.uploader || 'Unknown',
      duration: videoInfo.duration || 0,
      formats: finalFormats
    };
  } catch (error) {
    console.error('Error getting video info:', error);
    throw new Error(`Failed to get video information: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Function to download a video using youtube-dl-exec
export async function downloadVideo(videoId: string, formatId: string, outputDir: string) {
  try {
    // Ensure the output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate a unique filename with timestamp to avoid conflicts
    const timestamp = Date.now();
    const baseFilename = `${videoId}_${formatId}_${timestamp}`;
    const outputTemplate = path.join(outputDir, `${baseFilename}.%(ext)s`);

    // Start the download process
    console.log(`Downloading video ${videoId} with format ${formatId} to ${outputTemplate}`);
    
    // Force MP4 output format when possible and ensure audio is included
    const downloadOptions = {
      format: `${formatId}+bestaudio[ext=m4a]/bestaudio`, // Add best audio track to ensure sound
      output: outputTemplate,
      noWarnings: true,
      callHome: false, // Fixed property name
      mergeOutputFormat: 'mp4', // Try to merge to MP4 when possible
    };

    // Execute the download
    await youtubeDl(`https://www.youtube.com/watch?v=${videoId}`, downloadOptions);
    console.log('Download completed');

    // Find the downloaded file (replace the extension placeholder)
    const files = fs.readdirSync(outputDir);
    const downloadedFile = files.find(file => file.startsWith(baseFilename));

    if (!downloadedFile) {
      throw new Error('Download completed but file not found');
    }

    // Get the format information
    const info = await youtubeDl(`https://www.youtube.com/watch?v=${videoId}`, {
      dumpSingleJson: true,
    }) as any; // Type assertion to handle dynamic response

    // Get the format details
    const formatDetails = info.formats.find((f: any) => f.format_id === formatId);
    const extension = path.extname(downloadedFile).substring(1); // Remove the leading dot

    // Return info about the downloaded file
    return {
      formatId,
      extension,
      quality: formatDetails?.format_note || 'unknown',
      type: formatDetails?.vcodec === 'none' ? 'audio' : 
            formatDetails?.acodec === 'none' ? 'video' : 'other',
      filesize: fs.statSync(path.join(outputDir, downloadedFile)).size,
      fps: formatDetails?.fps ? parseInt(formatDetails.fps) : null,
      title: info.title,
      filePath: path.join(outputDir, downloadedFile),
      filename: downloadedFile,
    };
  } catch (error) {
    console.error('Error downloading video:', error);
    throw new Error(`Failed to download video: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
