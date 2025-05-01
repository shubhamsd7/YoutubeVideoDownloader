import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight gradient-text">Frequently Asked Questions</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get answers to common questions about YT DOWNLOAD
        </p>
      </div>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>General Questions</CardTitle>
          <CardDescription>Learn more about our service</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Is YT DOWNLOAD free to use?</AccordionTrigger>
              <AccordionContent>
                Yes, YT DOWNLOAD is completely free to use. There are no hidden fees or subscriptions required.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">What video formats are supported?</AccordionTrigger>
              <AccordionContent>
                YT DOWNLOAD supports a variety of formats including MP4, WebM, 3GP for video, and MP3, M4A, WAV for audio. You can choose the format that best suits your needs.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">What's the highest quality available?</AccordionTrigger>
              <AccordionContent>
                The highest quality available depends on the original video. For most videos, we support up to 1080p (Full HD). Some videos may even be available in 1440p (2K) or 2160p (4K).
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Is there a limit to how many videos I can download?</AccordionTrigger>
              <AccordionContent>
                There are no strict limits on the number of videos you can download. However, to ensure fair usage for all users, we recommend downloading videos in moderation.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Technical Questions</CardTitle>
          <CardDescription>Troubleshooting and usage details</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Where are my downloaded files saved?</AccordionTrigger>
              <AccordionContent>
                Downloaded files are saved to your default download location in your browser. You can typically change this location in your browser settings.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">What browsers are supported?</AccordionTrigger>
              <AccordionContent>
                YT DOWNLOAD works on all major browsers including Chrome, Firefox, Safari, Edge, and Opera. For the best experience, we recommend using the latest version of your browser.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Why isn't a particular video downloading?</AccordionTrigger>
              <AccordionContent>
                Some videos may be protected by copyright restrictions or may not be available for download. Additionally, if a video has just been uploaded, it might not be immediately available for download.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Does YT DOWNLOAD work on mobile devices?</AccordionTrigger>
              <AccordionContent>
                Yes, YT DOWNLOAD is designed to work on both desktop and mobile devices. The interface is responsive and adapts to different screen sizes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Legal Questions</CardTitle>
          <CardDescription>Legal information about using our service</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Is it legal to download YouTube videos?</AccordionTrigger>
              <AccordionContent>
                Downloading videos for personal use is generally acceptable in most regions. However, redistributing or using copyrighted content for commercial purposes without permission is illegal. Always respect copyright laws and use downloaded content responsibly.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Can I use downloaded videos for my projects?</AccordionTrigger>
              <AccordionContent>
                It depends on the copyright status of the video. If the video is under Creative Commons or you have permission from the creator, you may use it according to the specified terms. Otherwise, you should seek explicit permission from the copyright holder.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground">
          If you couldn't find the answer to your question, feel free to <a href="#" className="text-primary hover:underline">contact us</a> for more information.
        </p>
      </div>
    </div>
  );
}