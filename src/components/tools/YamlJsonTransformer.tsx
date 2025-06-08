import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowRightLeft, Copy, Download, Upload, FileText, Settings } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const YamlJsonTransformer: React.FC = () => {
  const { toast } = useToast();
  const [yamlInput, setYamlInput] = useState<string>('# Example YAML\nname: John Doe\nage: 30\naddress:\n  street: 123 Main St\n  city: New York\n  country: USA\nhobbies:\n  - reading\n  - swimming\n  - coding');
  const [jsonInput, setJsonInput] = useState<string>('{\n  "name": "John Doe",\n  "age": 30,\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "country": "USA"\n  },\n  "hobbies": [\n    "reading",\n    "swimming",\n    "coding"\n  ]\n}');
  const [yamlOutput, setYamlOutput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonIndentSize, setJsonIndentSize] = useState<number>(2);
  const [yamlIndentSize, setYamlIndentSize] = useState<number>(2);

  // Simple YAML parser (basic implementation)
  const parseYaml = (yamlString: string): any => {
    const lines = yamlString.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'));
    const result: any = {};
    const stack: any[] = [{ obj: result, indent: -1 }];

    for (const line of lines) {
      const indent = line.length - line.trimStart().length;
      const content = line.trim();

      // Pop stack if current indent is less than or equal to previous
      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) {
        stack.pop();
      }

      const current = stack[stack.length - 1].obj;

      if (content.includes(':')) {
        const [key, ...valueParts] = content.split(':');
        const value = valueParts.join(':').trim();
        const cleanKey = key.trim();

        if (value === '' || value === '{}' || value === '[]') {
          // Object or array
          if (content.includes('[]')) {
            current[cleanKey] = [];
          } else {
            current[cleanKey] = {};
            stack.push({ obj: current[cleanKey], indent });
          }
        } else {
          // Simple value
          let parsedValue: any = value;
          if (value === 'true') parsedValue = true;
          else if (value === 'false') parsedValue = false;
          else if (value === 'null') parsedValue = null;
          else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value);

          current[cleanKey] = parsedValue;
        }
      } else if (content.startsWith('- ')) {
        // Array item
        const value = content.substring(2).trim();
        let parsedValue: any = value;
        if (value === 'true') parsedValue = true;
        else if (value === 'false') parsedValue = false;
        else if (value === 'null') parsedValue = null;
        else if (!isNaN(Number(value)) && value !== '') parsedValue = Number(value);

        if (Array.isArray(current)) {
          current.push(parsedValue);
        } else {
          // Find the last array in current object
          const keys = Object.keys(current);
          const lastKey = keys[keys.length - 1];
          if (Array.isArray(current[lastKey])) {
            current[lastKey].push(parsedValue);
          }
        }
      }
    }

    return result;
  };

  // Simple JSON to YAML converter
  const jsonToYaml = (obj: any, indent: number = 0): string => {
    const spaces = ' '.repeat(indent);

    if (obj === null) return 'null';
    if (typeof obj === 'boolean') return obj.toString();
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return obj;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]';
      return obj.map(item => {
        if (typeof item === 'object' && item !== null) {
          const nested = jsonToYaml(item, indent + yamlIndentSize);
          return `${spaces}- ${nested}`;
        }
        return `${spaces}- ${jsonToYaml(item, 0)}`;
      }).join('\n');
    }

    if (typeof obj === 'object') {
      const entries = Object.entries(obj);
      if (entries.length === 0) return '{}';

      return entries.map(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 0) {
            return `${spaces}${key}: []`;
          }
          const arrayItems = value.map(item => {
            if (typeof item === 'object' && item !== null) {
              const nested = jsonToYaml(item, indent + yamlIndentSize * 2);
              return `${spaces}${' '.repeat(yamlIndentSize)}- ${nested}`;
            }
            return `${spaces}${' '.repeat(yamlIndentSize)}- ${jsonToYaml(item, 0)}`;
          }).join('\n');
          return `${spaces}${key}:\n${arrayItems}`;
        } else if (typeof value === 'object' && value !== null) {
          const nested = jsonToYaml(value, indent + yamlIndentSize);
          return `${spaces}${key}:\n${nested}`;
        } else {
          return `${spaces}${key}: ${jsonToYaml(value, 0)}`;
        }
      }).join('\n');
    }

    return String(obj);
  };

  const yamlToJson = () => {
    if (!yamlInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter YAML content to convert",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = parseYaml(yamlInput);
      const jsonString = JSON.stringify(parsed, null, jsonIndentSize);
      setJsonOutput(jsonString);

      toast({
        title: "Success",
        description: "YAML converted to JSON successfully",
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "Invalid YAML format. Please check your input.",
        variant: "destructive"
      });
    }
  };

  const jsonToYamlConvert = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter JSON content to convert",
        variant: "destructive"
      });
      return;
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const yamlString = jsonToYaml(parsed);
      setYamlOutput(yamlString);

      toast({
        title: "Success",
        description: "JSON converted to YAML successfully",
      });
    } catch (error) {
      toast({
        title: "Conversion Error",
        description: "Invalid JSON format. Please check your input.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${type} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive"
      });
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    if (!content.trim()) {
      toast({
        title: "No Content",
        description: `No ${type} content to download`,
        variant: "destructive"
      });
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: `${filename} downloaded successfully`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'yaml' | 'json') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (type === 'yaml') {
        setYamlInput(content);
      } else {
        setJsonInput(content);
      }

      toast({
        title: "File Loaded",
        description: `${file.name} loaded successfully`,
      });
    };
    reader.readAsText(file);

    // Reset file input
    event.target.value = '';
  };

  const clearAll = () => {
    setYamlInput('');
    setJsonInput('');
    setYamlOutput('');
    setJsonOutput('');
  };

  const swapInputOutput = (type: 'yaml' | 'json') => {
    if (type === 'yaml') {
      setYamlInput(yamlOutput);
      setYamlOutput('');
    } else {
      setJsonInput(jsonOutput);
      setJsonOutput('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-center">YAML ⇄ JSON Transformer</h2>

      <Tabs defaultValue="yaml-to-json" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="yaml-to-json">YAML → JSON</TabsTrigger>
          <TabsTrigger value="json-to-yaml">JSON → YAML</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="yaml-to-json" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* YAML Input */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="yaml-input" className="text-lg font-semibold">YAML Input</Label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".yaml,.yml"
                        onChange={(e) => handleFileUpload(e, 'yaml')}
                        className="hidden"
                        id="yaml-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('yaml-upload')?.click()}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    id="yaml-input"
                    placeholder="Enter your YAML content here..."
                    value={yamlInput}
                    onChange={(e) => setYamlInput(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />

                  <div className="flex gap-2">
                    <Button onClick={yamlToJson} className="flex-1">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Convert to JSON
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* JSON Output */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">JSON Output</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(jsonOutput, 'JSON')}
                        disabled={!jsonOutput}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(jsonOutput, 'output.json', 'JSON')}
                        disabled={!jsonOutput}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => swapInputOutput('json')}
                        disabled={!jsonOutput}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="JSON output will appear here..."
                    value={jsonOutput}
                    readOnly
                    rows={15}
                    className="font-mono text-sm bg-secondary/20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="json-to-yaml" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* JSON Input */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="json-input" className="text-lg font-semibold">JSON Input</Label>
                    <div className="flex gap-2">
                      <input
                        type="file"
                        accept=".json"
                        onChange={(e) => handleFileUpload(e, 'json')}
                        className="hidden"
                        id="json-upload"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('json-upload')?.click()}
                      >
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    id="json-input"
                    placeholder="Enter your JSON content here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={15}
                    className="font-mono text-sm"
                  />

                  <div className="flex gap-2">
                    <Button onClick={jsonToYamlConvert} className="flex-1">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      Convert to YAML
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* YAML Output */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">YAML Output</Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(yamlOutput, 'YAML')}
                        disabled={!yamlOutput}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(yamlOutput, 'output.yaml', 'YAML')}
                        disabled={!yamlOutput}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => swapInputOutput('yaml')}
                        disabled={!yamlOutput}
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    placeholder="YAML output will appear here..."
                    value={yamlOutput}
                    readOnly
                    rows={15}
                    className="font-mono text-sm bg-secondary/20"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Formatting Settings
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="json-indent">JSON Indent Size</Label>
                      <Input
                        id="json-indent"
                        type="number"
                        min="1"
                        max="8"
                        value={jsonIndentSize}
                        onChange={(e) => setJsonIndentSize(parseInt(e.target.value) || 2)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="yaml-indent">YAML Indent Size</Label>
                      <Input
                        id="yaml-indent"
                        type="number"
                        min="1"
                        max="8"
                        value={yamlIndentSize}
                        onChange={(e) => setYamlIndentSize(parseInt(e.target.value) || 2)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Actions
                  </h3>

                  <div className="space-y-2">
                    <Button variant="destructive" onClick={clearAll} className="w-full">
                      Clear All Fields
                    </Button>

                    <div className="pt-4 text-sm text-muted-foreground">
                      <h4 className="font-medium mb-2">Supported Features:</h4>
                      <ul className="space-y-1 text-xs">
                        <li>• Basic YAML/JSON conversion</li>
                        <li>• File upload/download</li>
                        <li>• Copy to clipboard</li>
                        <li>• Configurable indentation</li>
                        <li>• Input/output swapping</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default YamlJsonTransformer;
