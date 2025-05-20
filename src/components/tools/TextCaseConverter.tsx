import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { TabsContent, Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, RefreshCw } from 'lucide-react';

const TextCaseConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const convertCase = (type: string) => {
    if (!input) return;

    let result = '';
    switch (type) {
      case 'upper':
        result = input.toUpperCase();
        break;
      case 'lower':
        result = input.toLowerCase();
        break;
      case 'title':
        result = input.replace(/\w\S*/g, txt =>
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );
        break;
      case 'sentence':
        result = input.toLowerCase().replace(/(^\w|\.\s+\w)/g, letter =>
          letter.toUpperCase()
        );
        break;
      case 'camel':
        result = input.toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
        break;
      case 'pascal':
        result = input.toLowerCase()
          .replace(/(^|[^a-zA-Z0-9]+)(.)/g, (_, __, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = input.toLowerCase()
          .replace(/\s+/g, '_')
          .replace(/[^a-zA-Z0-9_]/g, '');
        break;
      case 'kebab':
        result = input.toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9-]/g, '');
        break;
      default:
        result = input;
    }
    setOutput(result);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Text copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Text Case Converter</h2>
      <p className="text-muted-foreground">
        Convert text between different cases: uppercase, lowercase, title case, and more.
      </p>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Input Text</label>
            <Textarea
              placeholder="Enter text to convert..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button variant="outline" onClick={() => convertCase('upper')}>UPPERCASE</Button>
            <Button variant="outline" onClick={() => convertCase('lower')}>lowercase</Button>
            <Button variant="outline" onClick={() => convertCase('title')}>Title Case</Button>
            <Button variant="outline" onClick={() => convertCase('sentence')}>Sentence case</Button>
            <Button variant="outline" onClick={() => convertCase('camel')}>camelCase</Button>
            <Button variant="outline" onClick={() => convertCase('pascal')}>PascalCase</Button>
            <Button variant="outline" onClick={() => convertCase('snake')}>snake_case</Button>
            <Button variant="outline" onClick={() => convertCase('kebab')}>kebab-case</Button>
          </div>

          {output && (
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">Converted Text:</label>
              <div className="relative">
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[100px] bg-muted"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(output)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TextCaseConverter;
