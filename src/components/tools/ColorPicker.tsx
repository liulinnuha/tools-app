import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Copy, RefreshCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const ColorPicker: React.FC = () => {
  const [red, setRed] = useState(51);
  const [green, setGreen] = useState(102);
  const [blue, setBlue] = useState(204);
  const [alpha, setAlpha] = useState(1);
  const [hex, setHex] = useState('#3366cc');
  const [hsl, setHsl] = useState({ h: 220, s: 50, l: 50 });
  const [activeTab, setActiveTab] = useState('rgb');

  const { toast } = useToast();

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h *= 60;
    }

    return {
      h: Math.round(h),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // Convert HEX to RGB
  const hexToRgb = (hex: string) => {
    // Remove the # if it exists
    hex = hex.replace('#', '');

    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
  };

  // Update RGB from HSL
  const updateRgbFromHsl = () => {
    const { r, g, b } = hslToRgb(hsl.h, hsl.s, hsl.l);
    setRed(r);
    setGreen(g);
    setBlue(b);
    setHex(rgbToHex(r, g, b));
  };

  // Update HSL from RGB
  const updateHslFromRgb = () => {
    const newHsl = rgbToHsl(red, green, blue);
    setHsl(newHsl);
  };

  // Update all values when RGB changes
  useEffect(() => {
    setHex(rgbToHex(red, green, blue));
    updateHslFromRgb();
  }, [red, green, blue]);

  // Handle hex input change
  const handleHexChange = (value: string) => {
    // Only allow valid hex characters
    const hexInput = value.replace(/[^0-9A-Fa-f#]/g, '');

    // Make sure we have a # at the start
    const formattedHex = hexInput.startsWith('#') ? hexInput : '#' + hexInput;

    // Limit to 7 characters (#RRGGBB)
    const validHex = formattedHex.substring(0, 7);

    setHex(validHex);

    // Only convert to RGB if we have a valid hex color
    if (validHex.length === 7) {
      const { r, g, b } = hexToRgb(validHex);
      setRed(r);
      setGreen(g);
      setBlue(b);
    }
  };

  // Handle HSL changes
  const handleHueChange = (value: number[]) => {
    setHsl({ ...hsl, h: value[0] });
    updateRgbFromHsl();
  };

  const handleSaturationChange = (value: number[]) => {
    setHsl({ ...hsl, s: value[0] });
    updateRgbFromHsl();
  };

  const handleLightnessChange = (value: number[]) => {
    setHsl({ ...hsl, l: value[0] });
    updateRgbFromHsl();
  };

  // Copy color to clipboard in different formats
  const copyToClipboard = (format: 'hex' | 'rgb' | 'rgba' | 'hsl') => {
    let text = '';

    switch (format) {
      case 'hex':
        text = hex;
        break;
      case 'rgb':
        text = `rgb(${red}, ${green}, ${blue})`;
        break;
      case 'rgba':
        text = `rgba(${red}, ${green}, ${blue}, ${alpha})`;
        break;
      case 'hsl':
        text = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
        break;
    }

    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${format.toUpperCase()} color value copied to clipboard.`,
    });
  };

  // Generate a random color
  const generateRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    setRed(r);
    setGreen(g);
    setBlue(b);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Choose colors in different formats and copy the values to use in your projects.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="p-4">
            <div className="space-y-4">
              <div
                className="w-full h-32 rounded-md border"
                style={{
                  backgroundColor: `rgba(${red}, ${green}, ${blue}, ${alpha})`,
                  backgroundImage: 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                }}
              />

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => copyToClipboard('hex')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HEX
                </Button>
                <Button onClick={() => copyToClipboard('rgb')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy RGB
                </Button>
                <Button onClick={() => copyToClipboard('rgba')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy RGBA
                </Button>
                <Button onClick={() => copyToClipboard('hsl')}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy HSL
                </Button>
              </div>

              <Button onClick={generateRandomColor} variant="outline" className="w-full">
                <RefreshCcw className="h-4 w-4 mr-2" />
                Random Color
              </Button>
            </div>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="rgb">RGB</TabsTrigger>
                <TabsTrigger value="hex">HEX</TabsTrigger>
                <TabsTrigger value="hsl">HSL</TabsTrigger>
              </TabsList>

              <TabsContent value="rgb" className="space-y-4 mt-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Red: {red}</span>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={red}
                        onChange={(e) => setRed(Number(e.target.value))}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <Slider
                      value={[red]}
                      min={0}
                      max={255}
                      step={1}
                      onValueChange={(value) => setRed(value[0])}
                      className="h-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Green: {green}</span>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={green}
                        onChange={(e) => setGreen(Number(e.target.value))}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <Slider
                      value={[green]}
                      min={0}
                      max={255}
                      step={1}
                      onValueChange={(value) => setGreen(value[0])}
                      className="h-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Blue: {blue}</span>
                      <Input
                        type="number"
                        min="0"
                        max="255"
                        value={blue}
                        onChange={(e) => setBlue(Number(e.target.value))}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <Slider
                      value={[blue]}
                      min={0}
                      max={255}
                      step={1}
                      onValueChange={(value) => setBlue(value[0])}
                      className="h-4"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Alpha: {alpha.toFixed(2)}</span>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={alpha}
                        onChange={(e) => setAlpha(Number(e.target.value))}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <Slider
                      value={[alpha * 100]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => setAlpha(value[0] / 100)}
                      className="h-4"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hex" className="space-y-4 mt-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="block">HEX Color Code</label>
                    <Input
                      value={hex}
                      onChange={(e) => handleHexChange(e.target.value)}
                      className="font-mono"
                      maxLength={7}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="h-20 rounded-md border" style={{ backgroundColor: `#${hex.substring(1, 3)}0000` }} />
                      <span className="block mt-2 font-mono text-sm">R: {hex.substring(1, 3)}</span>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-md border" style={{ backgroundColor: `#00${hex.substring(3, 5)}00` }} />
                      <span className="block mt-2 font-mono text-sm">G: {hex.substring(3, 5)}</span>
                    </div>
                    <div className="text-center">
                      <div className="h-20 rounded-md border" style={{ backgroundColor: `#0000${hex.substring(5, 7)}` }} />
                      <span className="block mt-2 font-mono text-sm">B: {hex.substring(5, 7)}</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hsl" className="space-y-4 mt-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Hue: {hsl.h}°</span>
                      <Input
                        type="number"
                        min="0"
                        max="360"
                        value={hsl.h}
                        onChange={(e) => {
                          setHsl({ ...hsl, h: Number(e.target.value) });
                          updateRgbFromHsl();
                        }}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <div className="h-4 rounded-md" style={{
                      background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                    }}>
                      <Slider
                        value={[hsl.h]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={handleHueChange}
                        className="h-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Saturation: {hsl.s}%</span>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={hsl.s}
                        onChange={(e) => {
                          setHsl({ ...hsl, s: Number(e.target.value) });
                          updateRgbFromHsl();
                        }}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <div className="h-4 rounded-md" style={{
                      background: `linear-gradient(to right, hsl(${hsl.h}, 0%, ${hsl.l}%), hsl(${hsl.h}, 100%, ${hsl.l}%))`
                    }}>
                      <Slider
                        value={[hsl.s]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleSaturationChange}
                        className="h-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Lightness: {hsl.l}%</span>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={hsl.l}
                        onChange={(e) => {
                          setHsl({ ...hsl, l: Number(e.target.value) });
                          updateRgbFromHsl();
                        }}
                        className="w-16 h-8 text-center"
                      />
                    </div>
                    <div className="h-4 rounded-md" style={{
                      background: `linear-gradient(to right, hsl(${hsl.h}, ${hsl.s}%, 0%), hsl(${hsl.h}, ${hsl.s}%, 50%), hsl(${hsl.h}, ${hsl.s}%, 100%))`
                    }}>
                      <Slider
                        value={[hsl.l]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={handleLightnessChange}
                        className="h-4"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
