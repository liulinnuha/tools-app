import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileJson, Copy, Check, Download, Upload, RefreshCw, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const JsonFormatter: React.FC = () => {
  const { toast } = useToast();
  const [input, setInput] = useState<string>('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "isActive": true,\n  "hobbies": ["reading", "swimming", "coding"],\n  "address": {\n    "street": "123 Main St",\n    "city": "Anytown",\n    "country": "USA"\n  }\n}');
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [indentSize, setIndentSize] = useState<string>('2');
  const [sortKeys, setSortKeys] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const formatJson = () => {
    setIsLoading(true);
    setError('');

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(input);

      // Format the JSON with the specified options
      const formattedJson = JSON.stringify(
        parsedJson,
        sortKeys ? (key, value) => {
          // If this is an object (not an array), sort the keys
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return Object.keys(value).sort().reduce((sorted, key) => {
              sorted[key] = value[key];
              return sorted;
            }, {} as any);
          }
          return value;
        } : null,
        Number(indentSize)
      );

      setOutput(formattedJson);

      toast({
        title: "Success",
        description: "JSON formatted successfully"
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Invalid JSON",
          description: err.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const compactJson = () => {
    setIsLoading(true);
    setError('');

    try {
      // Parse the JSON to validate it
      const parsedJson = JSON.parse(input);

      // Compact the JSON (no whitespace)
      const compactedJson = JSON.stringify(parsedJson);

      setOutput(compactedJson);

      toast({
        title: "Success",
        description: "JSON compacted successfully"
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        toast({
          title: "Invalid JSON",
          description: err.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const validateJson = () => {
    setIsLoading(true);
    setError('');

    try {
      // Try to parse the JSON
      JSON.parse(input);

      setOutput("JSON is valid");
      toast({
        title: "Valid JSON",
        description: "The provided JSON is valid",
        variant: "default"
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setOutput("JSON is invalid");
        toast({
          title: "Invalid JSON",
          description: err.message,
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!output) return;

    navigator.clipboard.writeText(output);
    setCopied(true);

    toast({
      title: "Copied",
      description: "Formatted JSON copied to clipboard"
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const downloadJson = () => {
    if (!output) return;

    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'formatted.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "JSON file downloaded successfully"
    });
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setInput(content);
    };
    reader.readAsText(file);

    // Reset the file input
    e.target.value = '';
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Input JSON</h3>
            <div>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-3 w-3 mr-1" />
                Upload
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".json,application/json"
                className="hidden"
                onChange={uploadFile}
              />
            </div>
          </div>

          <div className="relative">
            <textarea
              className="w-full h-96 p-3 font-mono text-sm rounded-md border bg-background resize-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your JSON here..."
            />
          </div>
        </div>

        <div className="flex flex-col space-y-4 justify-center">
          <div className="space-y-4 bg-secondary/20 p-4 rounded-md">
            <div className="space-y-2">
              <Label htmlFor="indent-size">Indent Size</Label>
              <Select
                value={indentSize}
                onValueChange={setIndentSize}
              >
                <SelectTrigger id="indent-size" className="w-32">
                  <SelectValue placeholder="Indent size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 spaces</SelectItem>
                  <SelectItem value="4">4 spaces</SelectItem>
                  <SelectItem value="8">8 spaces</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="sort-keys"
                checked={sortKeys}
                onCheckedChange={(checked) => setSortKeys(checked as boolean)}
              />
              <Label
                htmlFor="sort-keys"
                className="cursor-pointer"
              >
                Sort Keys Alphabetically
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={formatJson}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <FileJson className="h-4 w-4 mr-2" />
              )}
              Format JSON
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={compactJson}
              disabled={isLoading}
            >
              Compact JSON
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={validateJson}
              disabled={isLoading}
            >
              Validate JSON
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Output</h3>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={copyToClipboard}
                disabled={!output}
              >
                {copied ? (
                  <Check className="h-3 w-3 mr-1" />
                ) : (
                  <Copy className="h-3 w-3 mr-1" />
                )}
                Copy
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={downloadJson}
                disabled={!output}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>

          <div className="relative">
            {error ? (
              <div className="w-full h-96 p-3 font-mono text-sm rounded-md border border-destructive bg-destructive/10 text-destructive overflow-auto">
                <div className="flex items-center mb-2">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Error:</span>
                </div>
                {error}
              </div>
            ) : (
              <textarea
                className="w-full h-96 p-3 font-mono text-sm rounded-md border bg-background resize-none"
                value={output}
                readOnly
                placeholder="Formatted JSON will appear here..."
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonFormatter;
