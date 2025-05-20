import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UrlEncoder: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [activeTab, setActiveTab] = useState('encode');
  const { toast } = useToast();

  const handleEncode = () => {
    try {
      const encoded = encodeURIComponent(inputText);
      setOutputText(encoded);
    } catch (error) {
      toast({
        title: 'Encoding Error',
        description: 'Could not encode the provided text.',
        variant: 'destructive',
      });
    }
  };

  const handleDecode = () => {
    try {
      const decoded = decodeURIComponent(inputText);
      setOutputText(decoded);
    } catch (error) {
      toast({
        title: 'Decoding Error',
        description: 'Could not decode the provided text. Make sure it is a valid URL encoded string.',
        variant: 'destructive',
      });
    }
  };

  const handleReset = () => {
    setInputText('');
    setOutputText('');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    toast({
      title: 'Copied!',
      description: 'Text has been copied to clipboard.',
    });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setInputText('');
    setOutputText('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">URL Encoder/Decoder</h2>
      <p className="text-muted-foreground">
        {activeTab === 'encode'
          ? 'Convert text or URLs to URL-encoded format for safe use in URLs and query parameters.'
          : 'Convert URL-encoded text back to its original form.'}
      </p>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="space-y-4 mt-4">
          <Card className="p-4">
            <label className="block text-sm font-medium mb-2">Text to Encode</label>
            <Textarea
              placeholder="Enter text to encode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px]"
            />
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleEncode} className="mx-1" disabled={!inputText}>
              Encode
            </Button>
            <Button onClick={handleReset} variant="outline" className="mx-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {outputText && (
            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Encoded Result</label>
                <Button size="sm" variant="ghost" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[120px] bg-muted"
              />
            </Card>
          )}
        </TabsContent>

        <TabsContent value="decode" className="space-y-4 mt-4">
          <Card className="p-4">
            <label className="block text-sm font-medium mb-2">URL-Encoded Text</label>
            <Textarea
              placeholder="Enter URL-encoded text to decode..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[120px]"
            />
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleDecode} className="mx-1" disabled={!inputText}>
              Decode
            </Button>
            <Button onClick={handleReset} variant="outline" className="mx-1">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {outputText && (
            <Card className="p-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">Decoded Result</label>
                <Button size="sm" variant="ghost" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <Textarea
                value={outputText}
                readOnly
                className="min-h-[120px] bg-muted"
              />
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UrlEncoder;
