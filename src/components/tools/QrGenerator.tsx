import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { QrCode, Download, RefreshCw, Clipboard, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const QrGenerator: React.FC = () => {
  const { toast } = useToast();
  const [content, setContent] = useState<string>('https://example.com');
  const [size, setSize] = useState<number>(200);
  const [color, setColor] = useState<string>('#000000');
  const [bgColor, setBgColor] = useState<string>('#FFFFFF');
  const [format, setFormat] = useState<string>('png');
  const [errorCorrection, setErrorCorrection] = useState<string>('M');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQrCode();
  }, []);

  const generateQrCode = async () => {
    if (!content) {
      toast({
        title: "Error",
        description: "Please enter content for the QR code",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    // This is a placeholder for a real QR code generation service
    // In a real app, you would use a QR code library or API
    try {
      // For demo purposes, we'll use a QR code API service
      const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(content)}&size=${size}x${size}&color=${color.substring(1)}&bgcolor=${bgColor.substring(1)}&ecc=${errorCorrection.toLowerCase()}`;

      setQrUrl(apiUrl);

      toast({
        title: "Success",
        description: "QR Code generated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
      console.error("QR code generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQrCode = () => {
    if (!qrUrl) return;

    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `qrcode-${new Date().getTime()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "QR code downloaded successfully"
    });
  };

  const copyQrUrl = () => {
    if (!qrUrl) return;

    navigator.clipboard.writeText(qrUrl);
    setCopied(true);

    toast({
      title: "Copied",
      description: "QR code URL copied to clipboard"
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                placeholder="Enter text or URL"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size ({size}px)</Label>
              <Slider
                id="size"
                min={100}
                max={500}
                step={10}
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">QR Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="color"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bg-color">Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="bg-color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-8 p-1"
                  />
                  <Input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="error-correction">Error Correction</Label>
              <RadioGroup
                value={errorCorrection}
                onValueChange={setErrorCorrection}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="L" id="L" />
                  <Label htmlFor="L">Low (7%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="M" id="M" />
                  <Label htmlFor="M">Medium (15%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Q" id="Q" />
                  <Label htmlFor="Q">Quartile (25%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="H" id="H" />
                  <Label htmlFor="H">High (30%)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="format">Output Format</Label>
              <Select
                value={format}
                onValueChange={setFormat}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="svg">SVG</SelectItem>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={generateQrCode}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <QrCode className="mr-2 h-4 w-4" />
                  Generate QR Code
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-col items-center justify-center">
          {qrUrl ? (
            <div className="flex flex-col items-center space-y-4">
              <div className="relative bg-white p-4 rounded-lg shadow-md">
                <img
                  src={qrUrl}
                  alt="Generated QR Code"
                  className="max-w-full h-auto"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={copyQrUrl}
                >
                  {copied ? (
                    <Check className="mr-2 h-4 w-4" />
                  ) : (
                    <Clipboard className="mr-2 h-4 w-4" />
                  )}
                  Copy URL
                </Button>
                <Button
                  onClick={downloadQrCode}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-6 border border-dashed rounded-lg bg-muted/50">
              <QrCode className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p>Generate a QR code to see the preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QrGenerator;
