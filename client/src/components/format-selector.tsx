import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatBytes } from "@/lib/utils";
import { VideoFormat } from "@shared/schema";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, FileVideo, Music, FileType, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FormatSelectorProps {
  videoId: string;
  formats: VideoFormat[];
  onDownloadComplete: (format: VideoFormat) => void;
}

export function FormatSelector({ videoId, formats, onDownloadComplete }: FormatSelectorProps) {
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const { toast } = useToast();

  if (!formats || formats.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">No formats available for this video</p>
        </CardContent>
      </Card>
    );
  }

  // Group formats by type
  const videoFormats = formats.filter((f) => f.type === "video");
  const audioFormats = formats.filter((f) => f.type === "audio");
  const otherFormats = formats.filter((f) => f.type !== "video" && f.type !== "audio");

  async function handleDownload(format: VideoFormat) {
    setDownloadingFormat(format.formatId);
    setDownloadProgress(0);

    try {
      // Start a download and track progress
      const downloadData = await apiRequest<{
        downloadUrl: string;
        filename: string;
        extension: string;
      }>("/api/videos/download", {
        method: "POST",
        data: {
          videoId,
          formatId: format.formatId,
        }
      });

      // Simulate progress for demo purposes
      const interval = setInterval(() => {
        setDownloadProgress((prev) => {
          const next = prev + Math.random() * 10;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 500);
      
      // Create a link element and trigger the download
      if (downloadData && downloadData.downloadUrl) {
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadData.downloadUrl;
        downloadLink.download = downloadData.filename || `youtube-video.${format.extension}`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
      
      setTimeout(() => {
        clearInterval(interval);
        setDownloadProgress(100);
        
        // Reset after a delay to show completed progress
        setTimeout(() => {
          setDownloadingFormat(null);
          setDownloadProgress(0);
          onDownloadComplete(format);
          
          toast({
            title: "Download complete",
            description: `Successfully downloaded ${format.quality} ${format.extension} file to your computer`,
          });
        }, 1000);
      }, 2500);
    } catch (error) {
      setDownloadingFormat(null);
      setDownloadProgress(0);
      
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download the video",
        variant: "destructive",
      });
    }
  }

  function getFormatIcon(type: string) {
    switch (type) {
      case "video":
        return <FileVideo className="h-6 w-6" />;
      case "audio":
        return <Music className="h-6 w-6" />;
      default:
        return <FileType className="h-6 w-6" />;
    }
  }

  // Check if we have MP4 formats specifically
  const mp4VideoFormats = videoFormats.filter(f => f.extension === 'mp4');
  const mp4AudioFormats = audioFormats.filter(f => f.extension === 'mp4' || f.extension === 'mp3');
  
  return (
    <div className="space-y-4">
      {videoFormats.length === 0 && audioFormats.length === 0 ? (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No formats available</AlertTitle>
          <AlertDescription>
            No video formats were found for this video. Try another video.
          </AlertDescription>
        </Alert>
      ) : (
        <Tabs defaultValue="video">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="video">Video ({videoFormats.length})</TabsTrigger>
            <TabsTrigger value="audio">Audio ({audioFormats.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="video" className="mt-4">
            {mp4VideoFormats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mp4VideoFormats.map((format) => (
                  <FormatCard
                    key={format.formatId}
                    format={format}
                    isDownloading={downloadingFormat === format.formatId}
                    progress={downloadProgress}
                    onDownload={() => handleDownload(format)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videoFormats.map((format) => (
                  <FormatCard
                    key={format.formatId}
                    format={format}
                    isDownloading={downloadingFormat === format.formatId}
                    progress={downloadProgress}
                    onDownload={() => handleDownload(format)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="audio" className="mt-4">
            {mp4AudioFormats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mp4AudioFormats.map((format) => (
                  <FormatCard
                    key={format.formatId}
                    format={format}
                    isDownloading={downloadingFormat === format.formatId}
                    progress={downloadProgress}
                    onDownload={() => handleDownload(format)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {audioFormats.map((format) => (
                  <FormatCard
                    key={format.formatId}
                    format={format}
                    isDownloading={downloadingFormat === format.formatId}
                    progress={downloadProgress}
                    onDownload={() => handleDownload(format)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

interface FormatCardProps {
  format: VideoFormat;
  isDownloading: boolean;
  progress: number;
  onDownload: () => void;
}

function FormatCard({ format, isDownloading, progress, onDownload }: FormatCardProps) {
  return (
    <Card className="format-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {getFormatIcon(format.type)}
            <div>
              <CardTitle className="text-base">
                {format.quality || "Standard"}
                <Badge variant="outline" className="ml-2">
                  .{format.extension}
                </Badge>
              </CardTitle>
              <CardDescription>{format.qualityLabel || format.extension.toUpperCase()}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Size:</span>
          <span className="font-medium">{formatBytes(format.filesize)}</span>
        </div>
        {format.fps && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">FPS:</span>
            <span className="font-medium">{format.fps}</span>
          </div>
        )}
        {isDownloading && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-center mt-1">{Math.round(progress)}%</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={onDownload} 
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

function getFormatIcon(type: string) {
  switch (type) {
    case "video":
      return <FileVideo className="h-6 w-6" />;
    case "audio":
      return <Music className="h-6 w-6" />;
    default:
      return <FileType className="h-6 w-6" />;
  }
}
