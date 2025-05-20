import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Upload, Hash, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CharacterCounter: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [characterCount, setCharacterCount] = useState<number>(0);
  const [characterNoSpacesCount, setCharacterNoSpacesCount] = useState<number>(0);
  const [wordCount, setWordCount] = useState<number>(0);
  const [sentenceCount, setSentenceCount] = useState<number>(0);
  const [paragraphCount, setParagraphCount] = useState<number>(0);
  const [lineCount, setLineCount] = useState<number>(0);
  const [readingTime, setReadingTime] = useState<number>(0);
  const { toast } = useToast();

  // Update counts whenever text changes
  useEffect(() => {
    // Character count
    setCharacterCount(text.length);

    // Character count without spaces
    setCharacterNoSpacesCount(text.replace(/\s/g, '').length);

    // Word count (handles multiple spaces and other whitespace correctly)
    setWordCount(text.trim() === '' ? 0 : text.trim().split(/\s+/).length);

    // Sentence count (simplistic but works for basic text)
    setSentenceCount(text === '' ? 0 : text.split(/[.!?]+/).filter(Boolean).length);

    // Paragraph count
    setParagraphCount(text === '' ? 0 : text.split(/\n\s*\n/).filter(Boolean).length || 1);

    // Line count
    setLineCount(text === '' ? 0 : text.split(/\n/).length);

    // Reading time (average reading speed is ~200-250 words per minute)
    setReadingTime(Math.ceil(wordCount / 225));
  }, [text, wordCount]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setText(content);

      toast({
        title: "File Loaded",
        description: `${file.name} has been loaded successfully.`
      });
    };
    reader.readAsText(file);

    // Reset the file input
    e.target.value = '';
  };

  const handleClear = () => {
    setText('');
    toast({
      title: "Cleared",
      description: "Text has been cleared."
    });
  };

  const copyToClipboard = (content: string, description: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Count characters, words, sentences, and paragraphs in your text. Also estimates reading time.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto] gap-6">
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Enter Text</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.md,.html,.css,.js,.json,.xml,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  disabled={!text}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Clear
                </Button>
              </div>
            </div>
            <Textarea
              value={text}
              onChange={handleTextChange}
              placeholder="Type or paste your text here..."
              className="min-h-[300px] font-mono text-sm resize-none"
            />
          </Card>
        </div>

        <div className="lg:w-72 space-y-4">
          <Card className="p-4">
            <h3 className="font-medium mb-4">Text Statistics</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Characters:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{characterCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(characterCount.toString(), "Character count copied")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Characters (no spaces):</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{characterNoSpacesCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(characterNoSpacesCount.toString(), "Character count (no spaces) copied")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Words:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{wordCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(wordCount.toString(), "Word count copied")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Sentences:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{sentenceCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(sentenceCount.toString(), "Sentence count copied")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Paragraphs:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{paragraphCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(paragraphCount.toString(), "Paragraph count copied")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lines:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono">{lineCount}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(lineCount.toString(), "Line count copied")}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Reading time:</span>
                  <span className="font-medium">{readingTime} min</span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-muted/50">
            <h3 className="font-medium mb-2">Word Density</h3>
            {text ? (
              <div className="space-y-2 text-sm">
                {getTopWords(text, 5).map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="font-mono">{item.word}</span>
                    <span className="text-muted-foreground">{item.count}×</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Enter text to see word frequency</p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper function to get the most common words
function getTopWords(text: string, limit: number) {
  // Skip common words (articles, prepositions, etc.)
  const skipWords = new Set(['the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'is', 'are']);

  // Count words
  const words = text.toLowerCase().match(/\b[a-z']+\b/g) || [];
  const wordCounts: Record<string, number> = {};

  for (const word of words) {
    if (word.length < 3 || skipWords.has(word)) continue;
    wordCounts[word] = (wordCounts[word] || 0) + 1;
  }

  // Sort by frequency
  return Object.entries(wordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

export default CharacterCounter;
