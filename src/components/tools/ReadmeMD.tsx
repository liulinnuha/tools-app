import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Download, FileText, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'github-markdown-css';

const ReadmeMD: React.FC = () => {
  const [markdown, setMarkdown] = useState(`# README Template

## Project Title
A brief description of what this project does and who it's for.

## Features
- Feature 1
- Feature 2
- Feature 3

## Installation
\`\`\`bash
npm install my-project
cd my-project
\`\`\`

## Usage
\`\`\`javascript
import { myFunction } from 'my-project'

// Example usage
myFunction()
\`\`\`

## API Reference
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| \`api_key\` | \`string\` | Your API key |

## Contributing
Pull requests are welcome. For major changes, please open an issue first.

## License
[MIT](https://choosealicense.com/licenses/mit/)`);

  const { toast } = useToast();

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      toast({
        title: 'README Copied!',
        description: 'README content has been copied to clipboard.',
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
    downloadFile(markdown, 'README.md', 'text/markdown');
  }, [markdown, downloadFile]);

  const previewClasses = useMemo(() =>
    cn("p-6 min-h-[500px] overflow-auto bg-white dark:bg-gray-900"),
    []
  );

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-4">README.md Editor</h2>
      <p className="text-lg text-muted-foreground">
        Create and edit your README.md with live GitHub-style preview. Download when you're done.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Editor</h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={handleCopy}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button size="sm" variant="outline" onClick={handleDownload} className="download-button">
                <Download className="h-4 w-4 mr-2" />
                Download README.md
              </Button>
            </div>
          </div>

          <Card className="p-4">
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Write your README.md here..."
            />
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-medium">Preview</h3>
          </div>

          <Card className={previewClasses}>
            <div className="markdown-body">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({node, inline, className, children, ...props}) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={tomorrow}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-center mt-6">
        <Button size="lg" onClick={handleDownload} className="download-button">
          <Save className="h-5 w-5 mr-2" />
          Save README.md
        </Button>
      </div>
    </div>
  );
};

export default ReadmeMD;
