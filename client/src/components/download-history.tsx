import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { VideoFormat } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatBytes, formatDuration } from "@/lib/utils";
import { FileVideo, Music, FileType, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

interface DownloadHistoryProps {
  latestDownload: VideoFormat | null;
}

export function DownloadHistory({ latestDownload }: DownloadHistoryProps) {
  const [history, setHistory] = useState<any[]>([]);

  const { data, isLoading } = useQuery({
    queryKey: ["/api/downloads/history"],
    staleTime: 60 * 1000, // 1 minute
  });

  useEffect(() => {
    if (data) {
      setHistory(data);
    }
  }, [data]);

  useEffect(() => {
    if (latestDownload) {
      const timestamp = new Date().toISOString();
      setHistory((prev) => 
        [{ ...latestDownload, timestamp }, ...prev].slice(0, 10)
      );
    }
  }, [latestDownload]);

  function getFormatIcon(type: string) {
    switch (type) {
      case "video":
        return <FileVideo className="h-4 w-4" />;
      case "audio":
        return <Music className="h-4 w-4" />;
      default:
        return <FileType className="h-4 w-4" />;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Download History</CardTitle>
        <CardDescription>Your recent downloads</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-center text-sm text-muted-foreground py-4">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-4">No download history yet</p>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {history.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded-md">
                      {getFormatIcon(item.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{item.title || "YouTube Video"}</h4>
                        <span className="text-xs text-muted-foreground">
                          .{item.extension}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileType className="h-3 w-3" />
                          {item.quality} {formatBytes(item.filesize)}
                        </span>
                        {item.timestamp && (
                          <>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(item.timestamp), "h:mm a")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(item.timestamp), "MMM d, yyyy")}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < history.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
