import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Lock,
    Unlock,
    Copy,
    Download,
    Upload,
    FileText,
    Image,
    RotateCcw,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Base64Tool: React.FC = () => {
    const { toast } = useToast();
    const [inputText, setInputText] = useState<string>("");
    const [outputText, setOutputText] = useState<string>("");
    const [mode, setMode] = useState<string>("encode");
    const [encoding, setEncoding] = useState<string>("utf8");
    const [urlSafe, setUrlSafe] = useState<boolean>(false);
    const [breakLines, setBreakLines] = useState<boolean>(false);
    const [lineLength, setLineLength] = useState<string>("76");
    const [fileContent, setFileContent] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");

    const processBase64 = () => {
        if (!inputText.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some text to process",
                variant: "destructive",
            });
            return;
        }

        try {
            let result = "";

            if (mode === "encode") {
                // Encode to Base64
                result = btoa(unescape(encodeURIComponent(inputText)));

                // Apply URL-safe encoding if needed
                if (urlSafe) {
                    result = result
                        .replace(/\+/g, "-")
                        .replace(/\//g, "_")
                        .replace(/=/g, "");
                }

                // Add line breaks if needed
                if (breakLines && parseInt(lineLength) > 0) {
                    const length = parseInt(lineLength);
                    result =
                        result
                            .match(new RegExp(`.{1,${length}}`, "g"))
                            ?.join("\n") || result;
                }
            } else {
                // Decode from Base64
                let base64Input = inputText.replace(/\s/g, ""); // Remove whitespace

                // Handle URL-safe decoding
                if (
                    urlSafe ||
                    base64Input.includes("-") ||
                    base64Input.includes("_")
                ) {
                    base64Input = base64Input
                        .replace(/-/g, "+")
                        .replace(/_/g, "/");
                    // Add padding if needed
                    while (base64Input.length % 4) {
                        base64Input += "=";
                    }
                }

                result = decodeURIComponent(escape(atob(base64Input)));
            }

            setOutputText(result);
            toast({
                title: "Success",
                description: `Text ${mode}d successfully!`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${mode} text. Please check your input.`,
                variant: "destructive",
            });
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result as string;
            if (
                file.type.startsWith("image/") ||
                file.type.startsWith("video/") ||
                file.type.startsWith("audio/")
            ) {
                // For binary files, convert to base64
                const base64 = result.split(",")[1]; // Remove data URL prefix
                setFileContent(base64);
                setInputText(base64);
                setMode("decode");
            } else {
                // For text files
                setFileContent(result);
                setInputText(result);
            }
            setFileName(file.name);
            setFileType(file.type);
        };

        if (
            file.type.startsWith("image/") ||
            file.type.startsWith("video/") ||
            file.type.startsWith("audio/")
        ) {
            reader.readAsDataURL(file);
        } else {
            reader.readAsText(file);
        }
    };

    const copyToClipboard = async () => {
        if (!outputText) {
            toast({
                title: "Nothing to Copy",
                description: "Please process some text first",
                variant: "destructive",
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(outputText);
            toast({
                title: "Copied!",
                description: "Result has been copied to clipboard",
            });
        } catch (error) {
            toast({
                title: "Copy Failed",
                description: "Could not copy to clipboard",
                variant: "destructive",
            });
        }
    };

    const downloadResult = () => {
        if (!outputText) {
            toast({
                title: "Nothing to Download",
                description: "Please process some text first",
                variant: "destructive",
            });
            return;
        }

        const blob = new Blob([outputText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Downloaded!",
            description: `File saved as ${mode === "encode" ? "encoded.txt" : "decoded.txt"}`,
        });
    };

    const swapInputOutput = () => {
        if (!outputText) {
            toast({
                title: "No Output",
                description: "Please process some text first",
                variant: "destructive",
            });
            return;
        }

        setInputText(outputText);
        setOutputText("");
        setMode(mode === "encode" ? "decode" : "encode");

        toast({
            title: "Swapped",
            description: `Switched to ${mode === "encode" ? "decode" : "encode"} mode`,
        });
    };

    const clearAll = () => {
        setInputText("");
        setOutputText("");
        setFileContent("");
        setFileName("");
        setFileType("");
    };

    const loadSample = () => {
        if (mode === "encode") {
            setInputText(
                "Hello, World! This is a sample text for Base64 encoding. 🌟",
            );
        } else {
            setInputText(
                "SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4g8J+MnQ==",
            );
        }
    };

    const detectBase64 = (text: string): boolean => {
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        return (
            base64Regex.test(text.replace(/\s/g, "")) && text.length % 4 === 0
        );
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const getDataUrl = (): string => {
        if (mode === "decode" && inputText && fileType) {
            return `data:${fileType};base64,${inputText}`;
        }
        return "";
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Base64 Encoder/Decoder</h2>

            <Tabs defaultValue="converter" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="converter">Text Converter</TabsTrigger>
                    <TabsTrigger value="file">File Converter</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="converter">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="input-text">
                                            {mode === "encode"
                                                ? "Plain Text"
                                                : "Base64 Text"}
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={loadSample}
                                            >
                                                Load Sample
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setMode(
                                                        mode === "encode"
                                                            ? "decode"
                                                            : "encode",
                                                    )
                                                }
                                            >
                                                {mode === "encode" ? (
                                                    <Lock className="w-4 h-4" />
                                                ) : (
                                                    <Unlock className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                    <Textarea
                                        id="input-text"
                                        placeholder={
                                            mode === "encode"
                                                ? "Enter text to encode..."
                                                : "Enter Base64 to decode..."
                                        }
                                        value={inputText}
                                        onChange={(e) =>
                                            setInputText(e.target.value)
                                        }
                                        className="min-h-[400px] font-mono text-sm"
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            onClick={processBase64}
                                        >
                                            {mode === "encode" ? (
                                                <>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Encode
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock className="w-4 h-4 mr-2" />
                                                    Decode
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={swapInputOutput}
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={clearAll}
                                        >
                                            Clear
                                        </Button>
                                    </div>

                                    {inputText && (
                                        <div className="text-sm text-muted-foreground">
                                            Input:{" "}
                                            {formatBytes(
                                                new Blob([inputText]).size,
                                            )}{" "}
                                            | Characters: {inputText.length}
                                            {mode === "decode" && inputText && (
                                                <div className="mt-1">
                                                    {detectBase64(inputText) ? (
                                                        <span className="text-green-600">
                                                            ✓ Valid Base64
                                                        </span>
                                                    ) : (
                                                        <span className="text-orange-600">
                                                            ⚠ May not be valid
                                                            Base64
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Output Section */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="output-text">
                                            {mode === "encode"
                                                ? "Base64 Encoded"
                                                : "Decoded Text"}
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={copyToClipboard}
                                                disabled={!outputText}
                                            >
                                                <Copy className="w-4 h-4 mr-1" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={downloadResult}
                                                disabled={!outputText}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                    <Textarea
                                        id="output-text"
                                        value={outputText}
                                        readOnly
                                        className="min-h-[400px] font-mono text-sm bg-secondary/30"
                                        placeholder={`${mode === "encode" ? "Encoded" : "Decoded"} text will appear here...`}
                                    />

                                    {outputText && (
                                        <div className="text-sm text-muted-foreground">
                                            Output:{" "}
                                            {formatBytes(
                                                new Blob([outputText]).size,
                                            )}{" "}
                                            | Characters: {outputText.length}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="file">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <Label htmlFor="file-upload">
                                        Upload File
                                    </Label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                        <input
                                            id="file-upload"
                                            type="file"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer flex flex-col items-center space-y-2"
                                        >
                                            <Upload className="w-8 h-8 text-gray-400" />
                                            <span className="text-sm text-gray-600">
                                                Click to upload or drag and drop
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                Supports text files, images, and
                                                other binary files
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {fileName && (
                                    <div className="p-4 bg-secondary/30 rounded-md">
                                        <div className="flex items-center space-x-2">
                                            {fileType.startsWith("image/") ? (
                                                <Image className="w-4 h-4" />
                                            ) : (
                                                <FileText className="w-4 h-4" />
                                            )}
                                            <span className="font-medium">
                                                {fileName}
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                ({fileType})
                                            </span>
                                        </div>

                                        {fileType.startsWith("image/") &&
                                            mode === "decode" &&
                                            inputText && (
                                                <div className="mt-4">
                                                    <img
                                                        src={getDataUrl()}
                                                        alt="Decoded"
                                                        className="max-w-full max-h-64 object-contain rounded border"
                                                    />
                                                </div>
                                            )}
                                    </div>
                                )}

                                {fileContent && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label>File Content / Base64</Label>
                                            <Textarea
                                                value={inputText}
                                                onChange={(e) =>
                                                    setInputText(e.target.value)
                                                }
                                                className="min-h-[300px] font-mono text-sm"
                                                placeholder="File content will appear here..."
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Processed Output</Label>
                                            <Textarea
                                                value={outputText}
                                                readOnly
                                                className="min-h-[300px] font-mono text-sm bg-secondary/30"
                                                placeholder="Processed output will appear here..."
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <Button
                                        onClick={processBase64}
                                        disabled={!fileContent}
                                    >
                                        {mode === "encode" ? (
                                            <>
                                                <Lock className="w-4 h-4 mr-2" />
                                                Encode to Base64
                                            </>
                                        ) : (
                                            <>
                                                <Unlock className="w-4 h-4 mr-2" />
                                                Decode from Base64
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() =>
                                            setMode(
                                                mode === "encode"
                                                    ? "decode"
                                                    : "encode",
                                            )
                                        }
                                    >
                                        Switch Mode
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="default-mode">
                                        Default Mode
                                    </Label>
                                    <Select
                                        value={mode}
                                        onValueChange={setMode}
                                    >
                                        <SelectTrigger id="default-mode">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="encode">
                                                Encode (Text → Base64)
                                            </SelectItem>
                                            <SelectItem value="decode">
                                                Decode (Base64 → Text)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div class="space-y-2">
                                    <Label htmlFor="encoding">
                                        Character Encoding
                                    </Label>
                                    <Select
                                        value={encoding}
                                        onValueChange={setEncoding}
                                    >
                                        <SelectTrigger id="encoding">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="utf8">
                                                UTF-8
                                            </SelectItem>
                                            <SelectItem value="ascii">
                                                ASCII
                                            </SelectItem>
                                            <SelectItem value="latin1">
                                                Latin-1
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">
                                            Encoding Options
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="url-safe">
                                                URL-Safe Base64
                                            </Label>
                                            <Switch
                                                id="url-safe"
                                                checked={urlSafe}
                                                onCheckedChange={setUrlSafe}
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="break-lines">
                                                Break Long Lines
                                            </Label>
                                            <Switch
                                                id="break-lines"
                                                checked={breakLines}
                                                onCheckedChange={setBreakLines}
                                            />
                                        </div>

                                        {breakLines && (
                                            <div className="space-y-2">
                                                <Label htmlFor="line-length">
                                                    Line Length
                                                </Label>
                                                <Select
                                                    value={lineLength}
                                                    onValueChange={
                                                        setLineLength
                                                    }
                                                >
                                                    <SelectTrigger id="line-length">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="64">
                                                            64 characters
                                                        </SelectItem>
                                                        <SelectItem value="76">
                                                            76 characters
                                                        </SelectItem>
                                                        <SelectItem value="128">
                                                            128 characters
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">
                                            Format Info
                                        </h3>
                                        <div className="text-sm space-y-2">
                                            <div>
                                                <strong>
                                                    Standard Base64:
                                                </strong>{" "}
                                                Uses +, /, = characters
                                            </div>
                                            <div>
                                                <strong>
                                                    URL-Safe Base64:
                                                </strong>{" "}
                                                Uses -, _, no padding
                                            </div>
                                            <div>
                                                <strong>Line Breaking:</strong>{" "}
                                                Splits output into lines
                                            </div>
                                            <div>
                                                <strong>
                                                    Supported Files:
                                                </strong>{" "}
                                                Text, images, audio, video
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                                    <h3 className="font-semibold mb-2">
                                        Features:
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div>
                                            • Text and file encoding/decoding
                                        </div>
                                        <div>• URL-safe Base64 support</div>
                                        <div>
                                            • Image preview for decoded images
                                        </div>
                                        <div>• Automatic Base64 validation</div>
                                        <div>
                                            • File size and character counting
                                        </div>
                                        <div>
                                            • Copy and download functionality
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Base64Tool;
