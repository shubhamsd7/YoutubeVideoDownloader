import { useState } from "react";
import { DownloadForm } from "@/components/download-form";
import { VideoInfo } from "@/components/video-info";
import { FormatSelector } from "@/components/format-selector";
import { DownloadHistory } from "@/components/download-history";
import { VideoInfo as VideoInfoType, VideoFormat } from "@shared/schema";

export default function Home() {
  const [videoInfo, setVideoInfo] = useState<VideoInfoType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latestDownload, setLatestDownload] = useState<VideoFormat | null>(null);

  const handleVideoInfo = (data: VideoInfoType) => {
    setVideoInfo(data);
    setIsLoading(false);
  };

  const handleDownloadComplete = (format: VideoFormat) => {
    setLatestDownload({
      ...format,
      title: videoInfo?.title || "YouTube Video",
    });
  };

  return (
    <div className="space-y-8">
      <DownloadForm 
        onVideoInfo={(data) => {
          setIsLoading(true);
          handleVideoInfo(data);
        }} 
      />

      {(isLoading || videoInfo) && (
        <VideoInfo 
          videoInfo={videoInfo} 
          isLoading={isLoading} 
        />
      )}

      {videoInfo && (
        <FormatSelector 
          videoId={videoInfo.id}
          formats={videoInfo.formats}
          onDownloadComplete={handleDownloadComplete}
        />
      )}

      <DownloadHistory latestDownload={latestDownload} />
    </div>
  );
}
