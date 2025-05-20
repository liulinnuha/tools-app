import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { FileImage, Upload, Download, Trash, RefreshCw, Image } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const ImageCompressor: React.FC = () => {
  const { toast } = useToast();
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedPreview, setCompressedPreview] = useState<string>('');
  const [compressedImage, setCompressedImage] = useState<Blob | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [originalSize, setOriginalSize] = useState<string>('');
  const [compressedSize, setCompressedSize] = useState<string>('');
  const [compressionRate, setCompressionRate] = useState<number>(0);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.includes('image')) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    setOriginalImage(file);
    setOriginalSize(formatBytes(file.size));

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setOriginalPreview(result);

      // Load image to get dimensions
      const img = new window.Image();
      img.onload = () => {
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);

    // Reset compression results
    setCompressedPreview('');
    setCompressedImage(null);
    setCompressedSize('');
    setCompressionRate(0);
  };

  const compressImage = () => {
    if (!originalImage || !originalPreview) {
      toast({
        title: "No Image",
        description: "Please upload an image to compress",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    // Create a canvas element to resize and compress the image
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let targetWidth = width;
      let targetHeight = height;

      // If dimensions were modified
      if (width !== img.width || height !== img.height) {
        targetWidth = width;
        targetHeight = height;
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setLoading(false);
        toast({
          title: "Error",
          description: "Could not compress image",
          variant: "destructive"
        });
        return;
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Convert canvas to Blob with the specified quality
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setLoading(false);
            toast({
              title: "Error",
              description: "Could not compress image",
              variant: "destructive"
            });
            return;
          }

          // Create URL for preview
          const compressedUrl = URL.createObjectURL(blob);
          setCompressedPreview(compressedUrl);
          setCompressedImage(blob);

          // Calculate compressed size
          const compSize = formatBytes(blob.size);
          setCompressedSize(compSize);

          // Calculate compression rate
          const rate = Math.round((1 - (blob.size / originalImage.size)) * 100);
          setCompressionRate(rate);

          setLoading(false);

          toast({
            title: "Success",
            description: `Image compressed by ${rate}%`,
          });
        },
        format, // Format (jpeg, png, webp)
        quality / 100 // Quality (0 to 1)
      );
    };
    img.src = originalPreview;
  };

  const downloadImage = () => {
    if (!compressedImage) return;

    const url = URL.createObjectURL(compressedImage);
    const link = document.createElement('a');
    link.href = url;
    link.download = `compressed-image.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Downloaded",
      description: "Compressed image downloaded successfully"
    });
  };

  const resetImage = () => {
    setOriginalImage(null);
    setOriginalPreview('');
    setCompressedPreview('');
    setCompressedImage(null);
    setOriginalSize('');
    setCompressedSize('');
    setCompressionRate(0);
    setWidth(0);
    setHeight(0);

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWidthChange = (value: number) => {
    setWidth(value);
    if (maintainRatio && originalImage) {
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.height / img.width;
        setHeight(Math.round(value * ratio));
      };
      img.src = originalPreview;
    }
  };

  const handleHeightChange = (value: number) => {
    setHeight(value);
    if (maintainRatio && originalImage) {
      const img = new window.Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        setWidth(Math.round(value * ratio));
      };
      img.src = originalPreview;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Upload Image</Label>
                {originalImage && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={resetImage}
                  >
                    <Trash className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-secondary/10 transition-colors",
                  originalImage ? "border-primary/50" : "border-muted"
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {originalPreview ? (
                  <div className="space-y-4">
                    <img
                      src={originalPreview}
                      alt="Original"
                      className="max-h-40 mx-auto object-contain rounded"
                    />
                    <div className="text-sm text-muted-foreground">
                      <p><span className="font-medium">Size:</span> {originalSize}</p>
                      <p><span className="font-medium">Dimensions:</span> {width} x {height} px</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FileImage className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="text-muted-foreground">Click to upload or drag and drop</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, WebP, GIF up to 10MB</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Quality: {quality}%</Label>
                <Slider
                  id="quality"
                  min={10}
                  max={100}
                  step={1}
                  value={[quality]}
                  onValueChange={([value]) => setQuality(value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="format">Output Format</Label>
                <Tabs
                  defaultValue={format}
                  onValueChange={(value) => setFormat(value as 'jpeg' | 'png' | 'webp')}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="jpeg">JPEG</TabsTrigger>
                    <TabsTrigger value="png">PNG</TabsTrigger>
                    <TabsTrigger value="webp">WebP</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    value={width || ''}
                    onChange={(e) => handleWidthChange(Number(e.target.value))}
                    placeholder="Width"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={height || ''}
                    onChange={(e) => handleHeightChange(Number(e.target.value))}
                    placeholder="Height"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="maintain-ratio"
                  checked={maintainRatio}
                  onChange={(e) => setMaintainRatio(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="maintain-ratio" className="cursor-pointer">
                  Maintain aspect ratio
                </Label>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={compressImage}
              disabled={!originalImage || loading}
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Compressing...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4 mr-2" />
                  Compress Image
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-4">
              <Label>Compressed Result</Label>

              {compressedPreview ? (
                <div className="space-y-4">
                  <div className="border rounded-lg p-2">
                    <img
                      src={compressedPreview}
                      alt="Compressed"
                      className="max-h-60 mx-auto object-contain rounded"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Original</p>
                      <p className="font-medium">{originalSize}</p>
                    </div>
                    <div className="p-2 bg-secondary/20 rounded-lg">
                      <p className="text-xs text-muted-foreground">Compressed</p>
                      <p className="font-medium">{compressedSize}</p>
                    </div>
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <p className="text-xs text-muted-foreground">Saved</p>
                      <p className="font-medium text-green-600 dark:text-green-400">{compressionRate}%</p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={downloadImage}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Compressed Image
                  </Button>
                </div>
              ) : (
                <div className="h-60 border-2 border-dashed rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <FileImage className="h-12 w-12 mx-auto mb-2" />
                    <p>Compressed image will appear here</p>
                  </div>
                </div>
              )}
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Images are processed in your browser and never uploaded to a server</p>
              <p>• Higher quality settings result in larger file sizes</p>
              <p>• WebP format typically provides the best compression</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageCompressor;
