import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary"
            >
              <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
            </svg>
            <span className="text-lg font-bold gradient-text">YT DOWNLOAD</span>
          </a>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-sm font-medium hover:text-primary">
              Home
            </a>
            <a href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary">
              How It Works
            </a>
            <a href="/faq" className="text-sm font-medium text-muted-foreground hover:text-primary">
              FAQ
            </a>
            <a href="/legal" className="text-sm font-medium text-muted-foreground hover:text-primary">
              Legal
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="hidden md:flex">
              Contact
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
