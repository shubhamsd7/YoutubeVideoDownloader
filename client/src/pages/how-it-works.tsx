import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Search, 
  Download, 
  FileVideo, 
  List, 
  ArrowRight, 
  CheckCircle2 
} from "lucide-react";

export default function HowItWorks() {
  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight gradient-text">How YT DOWNLOAD Works</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our simple 4-step process makes downloading YouTube videos quick and easy
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <StepCard 
          number={1} 
          title="Enter YouTube URL" 
          description="Paste any valid YouTube video URL into the search box" 
          icon={<Search className="h-10 w-10" />}
        />
        <StepCard 
          number={2} 
          title="Choose Format" 
          description="Select from high-quality video, audio-only, or other formats" 
          icon={<List className="h-10 w-10" />}
        />
        <StepCard 
          number={3} 
          title="Download" 
          description="Click the download button for your preferred format and quality" 
          icon={<Download className="h-10 w-10" />}
        />
        <StepCard 
          number={4} 
          title="Enjoy Offline" 
          description="Your file is saved to your device for offline viewing" 
          icon={<FileVideo className="h-10 w-10" />}
        />
      </div>

      <Card className="max-w-5xl mx-auto">
        <CardHeader>
          <CardTitle>Why Choose YT DOWNLOAD?</CardTitle>
          <CardDescription>Fast, reliable, and easy-to-use</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Feature
            title="Multiple Format Options"
            description="Choose from a variety of video and audio formats to suit your needs"
          />
          <Feature
            title="High-Quality Downloads"
            description="Get access to the highest quality available, up to 1080p or higher"
          />
          <Feature
            title="Fast Processing"
            description="Our optimized servers ensure quick analysis and download speeds"
          />
          <Feature
            title="No Registration Required"
            description="No need to create an account to use our service"
          />
          <Feature
            title="Completely Free"
            description="All features are available at no cost to you"
          />
        </CardContent>
      </Card>

      <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
        <h2 className="text-2xl font-bold">Ready to try it?</h2>
        <p className="text-muted-foreground">
          Head back to the <a href="/" className="text-primary hover:underline">home page</a> and enter a YouTube URL to get started!
        </p>
      </div>
    </div>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function StepCard({ number, title, description, icon }: StepCardProps) {
  return (
    <Card className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <div className="space-y-2">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              Step {number}
            </div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface FeatureProps {
  title: string;
  description: string;
}

function Feature({ title, description }: FeatureProps) {
  return (
    <div className="flex items-start space-x-3">
      <CheckCircle2 className="h-5 w-5 mt-0.5 text-primary" />
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}