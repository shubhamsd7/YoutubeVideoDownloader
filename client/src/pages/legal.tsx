import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Legal() {
  const [legalText, setLegalText] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/legal.md")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load legal information");
        }
        return response.text();
      })
      .then((text) => {
        setLegalText(text);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading legal content:", error);
        setIsLoading(false);
        setLegalText("# Error\n\nUnable to load legal information. Please try again later.");
      });
  }, []);

  // Simple Markdown parser using a more direct approach
  const formatMarkdown = (text: string) => {
    const lines = text.split('\n');
    let html = '';
    let inOrderedList = false;
    let inUnorderedList = false;
    
    // Process line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Headers
      if (line.startsWith('# ')) {
        html += `<h1 class="text-3xl font-bold mb-4 mt-8">${line.substring(2)}</h1>`;
      } 
      else if (line.startsWith('## ')) {
        html += `<h2 class="text-2xl font-bold mb-3 mt-6">${line.substring(3)}</h2>`;
      } 
      else if (line.startsWith('### ')) {
        html += `<h3 class="text-xl font-bold mb-2 mt-4">${line.substring(4)}</h3>`;
      } 
      // Ordered list items
      else if (/^\d+\.\s/.test(line)) {
        if (!inOrderedList) {
          html += '<ol class="mb-4 list-decimal ml-6">';
          inOrderedList = true;
        }
        html += `<li class="ml-6 mb-1">${line.replace(/^\d+\.\s/, '')}</li>`;
        
        // Check if next line is not an ordered list item
        if (i === lines.length - 1 || !/^\d+\.\s/.test(lines[i + 1])) {
          html += '</ol>';
          inOrderedList = false;
        }
      } 
      // Unordered list items
      else if (line.startsWith('* ')) {
        if (!inUnorderedList) {
          html += '<ul class="mb-4 list-disc ml-6">';
          inUnorderedList = true;
        }
        html += `<li class="ml-6 mb-1">${line.substring(2)}</li>`;
        
        // Check if next line is not an unordered list item
        if (i === lines.length - 1 || !lines[i + 1].startsWith('* ')) {
          html += '</ul>';
          inUnorderedList = false;
        }
      } 
      // Empty line means paragraph break
      else if (line.trim() === '') {
        // Ensure we close any open lists
        if (inOrderedList) {
          html += '</ol>';
          inOrderedList = false;
        }
        if (inUnorderedList) {
          html += '</ul>';
          inUnorderedList = false;
        }
        html += '<br />';
      } 
      // Regular paragraph
      else {
        // Ensure we close any open lists
        if (inOrderedList) {
          html += '</ol>';
          inOrderedList = false;
        }
        if (inUnorderedList) {
          html += '</ul>';
          inUnorderedList = false;
        }
        html += `<p class="mb-4">${line}</p>`;
      }
    }
    
    // Ensure all lists are closed at the end
    if (inOrderedList) html += '</ol>';
    if (inUnorderedList) html += '</ul>';
    
    return html;
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div 
            className="prose max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(legalText) }}
          />
        )}
      </div>
    </div>
  );
}