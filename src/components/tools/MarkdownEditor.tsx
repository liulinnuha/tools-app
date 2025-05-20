import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, FileText, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

const MarkdownEditor: React.FC = () => {
  const [markdown, setMarkdown] = useState('# Hello World\n\nThis is a **markdown** editor.\n\n- List item 1\n- List item 2\n\n[Link example](https://example.com)\n\n```js\nconsole.log("Code block example");\n```');
  const [html, setHtml] = useState('');
  const { toast } = useToast();

  // Enhanced markdown to HTML converter
  const convertMarkdownToHtml = useCallback((markdown: string) => {
    let html = markdown
      // Headers
      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
      .replace(/^##### (.*$)/gm, '<h5>$1</h5>')
      .replace(/^###### (.*$)/gm, '<h6>$1</h6>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Lists
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      // Code blocks with language support
      .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre><code class="language-${lang || 'plain'}">${code.trim()}</code></pre>`)
      // Inline code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Horizontal rule
      .replace(/^---$/gm, '<hr>')
      // Blockquotes with nested support
      .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>')
      // Tables (basic support)
      .replace(/\|(.+)\|/g, '<table><tr><td>$1</td></tr></table>')
      // Paragraphs - must be last
      .replace(/^(?!<h|<li|<pre|<blockquote|<hr|<table)(.+)$/gm, '<p>$1</p>');

    // Enhanced list wrapping with nested support
    html = html.replace(/<li>(.*?)<\/li>/g, function(match) {
      return '<ul>' + match + '</ul>';
    }).replace(/<\/ul><ul>/g, '');

    return html;
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setHtml(convertMarkdownToHtml(markdown));
    }, 300); // Debounce preview updates

    return () => clearTimeout(timeoutId);
  }, [markdown, convertMarkdownToHtml]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast({
        title: 'Markdown Copied!',
        description: 'Markdown content has been copied to clipboard.',
      });
    } catch (err) {
      toast({
        title: 'Copy Failed',
        description: 'Failed to copy content to clipboard.',
        variant: 'destructive'
      });
    }
  }, [markdown, toast]);

  const downloadFile = useCallback((content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Downloaded!',
      description: `${filename} has been downloaded.`,
    });
  }, [toast]);

  const handleDownload = useCallback(() => {
    downloadFile(markdown, 'document.md', 'text/markdown');
  }, [markdown, downloadFile]);

  const handleHtmlDownload = useCallback(() => {
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Markdown Document</title>
          <style>
            body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 0 20px; }
            pre { background: #f6f8fa; padding: 16px; border-radius: 6px; }
            code { font-family: monospace; }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;
    downloadFile(fullHtml, 'document.html', 'text/html');
  }, [html, downloadFile]);

  const previewClasses = useMemo(() =>
    cn("p-6 min-h-[500px] overflow-auto bg-white dark:bg-gray-900"),
    []
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">Markdown Editor</h2>
      <p className="text-lg text-muted-foreground">
        Edit Markdown on the left and see the rendered preview on the right. Download your work when you're done.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Markdown Editor</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload} className="download-button">
                <Download className="h-4 w-4 mr-2" />
                Download .md
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Type your markdown here..."
            />
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Preview</h3>
            <Button size="sm" variant="outline" onClick={handleHtmlDownload} className="download-button">
              <FileText className="h-4 w-4 mr-2" />
              Download HTML
            </Button>
          </div>

          <Card className={previewClasses}>
            <div
              className="markdown-preview prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button size="lg" onClick={handleDownload} className="download-button">
          <Save className="h-5 w-5 mr-2" />
          Save Your Document
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEditor;
