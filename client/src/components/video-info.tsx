import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { VideoInfo as VideoInfoType } from "@shared/schema";

interface VideoInfoProps {
  videoInfo: VideoInfoType | null;
  isLoading: boolean;
}

export function VideoInfo({ videoInfo, isLoading }: VideoInfoProps) {
  if (isLoading) {
    return <VideoInfoSkeleton />;
  }

  if (!videoInfo) {
    return null;
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="relative md:w-1/3">
            <img
              src={videoInfo.thumbnailUrl}
              alt={videoInfo.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
              {formatDuration(videoInfo.duration)}
            </div>
          </div>
          <div className="p-4 md:w-2/3">
            <h3 className="text-xl font-bold mb-2 line-clamp-2">{videoInfo.title}</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Channel:</span> {videoInfo.uploader}
              </p>
              <p className="text-sm text-muted-foreground line-clamp-3">
                <span className="font-medium">Description:</span> {videoInfo.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function VideoInfoSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <Skeleton className="w-full aspect-video" />
          </div>
          <div className="p-4 md:w-2/3 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
