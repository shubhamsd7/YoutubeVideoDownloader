import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { urlSchema } from "@/lib/validators";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  url: urlSchema,
});

type FormValues = z.infer<typeof formSchema>;

interface DownloadFormProps {
  onVideoInfo: (data: any) => void;
}

export function DownloadForm({ onVideoInfo }: DownloadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(data: FormValues) {
    setIsLoading(true);
    try {
      const videoInfo = await apiRequest("/api/videos/info", {
        method: "POST",
        data: { url: data.url }
      });
      onVideoInfo(videoInfo);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch video information",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">YT DOWNLOAD</CardTitle>
        <CardDescription>
          Enter a YouTube URL to download videos in various formats and qualities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter YouTube URL (e.g., https://www.youtube.com/watch?v=...)"
                        {...field}
                        className="flex-1"
                        disabled={isLoading}
                      />
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading
                          </>
                        ) : (
                          "Analyze"
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        This tool helps you download YouTube videos for personal use. Please respect copyright laws.
      </CardFooter>
    </Card>
  );
}
