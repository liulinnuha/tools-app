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
import { Minimize2, Copy, Download, FileText, Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CSSMinifier: React.FC = () => {
    const { toast } = useToast();
    const [inputCSS, setInputCSS] = useState<string>("");
    const [outputCSS, setOutputCSS] = useState<string>("");
    const [minificationLevel, setMinificationLevel] =
        useState<string>("standard");
    const [removeComments, setRemoveComments] = useState<boolean>(true);
    const [removeWhitespace, setRemoveWhitespace] = useState<boolean>(true);
    const [mergeDuplicates, setMergeDuplicates] = useState<boolean>(false);
    const [optimizeColors, setOptimizeColors] = useState<boolean>(true);
    const [shortenProperties, setShortenProperties] = useState<boolean>(true);
    const [removeSemicolons, setRemoveSemicolons] = useState<boolean>(false);
    const [stats, setStats] = useState<{
        originalSize: number;
        minifiedSize: number;
        compressionRatio: number;
        savings: number;
    } | null>(null);

    const minifyCSS = () => {
        if (!inputCSS.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some CSS code to minify",
                variant: "destructive",
            });
            return;
        }

        try {
            let minified = inputCSS;
            const originalSize = inputCSS.length;

            // Remove comments
            if (removeComments) {
                minified = removeAllComments(minified);
            }

            // Remove unnecessary whitespace
            if (removeWhitespace) {
                minified = removeExtraWhitespace(minified);
            }

            // Optimize colors
            if (optimizeColors) {
                minified = optimizeColorValues(minified);
            }

            // Shorten properties
            if (shortenProperties) {
                minified = shortenCSSProperties(minified);
            }

            // Remove unnecessary semicolons
            if (removeSemicolons) {
                minified = removeUnnecessarySemicolons(minified);
            }

            // Merge duplicate selectors (basic implementation)
            if (mergeDuplicates) {
                minified = mergeDuplicateSelectors(minified);
            }

            // Apply minification level
            switch (minificationLevel) {
                case "light":
                    minified = lightMinification(minified);
                    break;
                case "standard":
                    minified = standardMinification(minified);
                    break;
                case "aggressive":
                    minified = aggressiveMinification(minified);
                    break;
            }

            const minifiedSize = minified.length;
            const savings = originalSize - minifiedSize;
            const compressionRatio = (savings / originalSize) * 100;

            setOutputCSS(minified);
            setStats({
                originalSize,
                minifiedSize,
                compressionRatio: parseFloat(compressionRatio.toFixed(2)),
                savings,
            });

            toast({
                title: "Success",
                description: `CSS minified successfully! Saved ${savings} bytes (${compressionRatio.toFixed(1)}%)`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Failed to minify CSS. Please check your CSS syntax.",
                variant: "destructive",
            });
        }
    };

    const removeAllComments = (css: string): string => {
        // Remove /* */ comments
        return css.replace(/\/\*[\s\S]*?\*\//g, "");
    };

    const removeExtraWhitespace = (css: string): string => {
        return css
            .replace(/\s+/g, " ") // Multiple spaces to single space
            .replace(/\s*{\s*/g, "{") // Remove spaces around {
            .replace(/\s*}\s*/g, "}") // Remove spaces around }
            .replace(/\s*;\s*/g, ";") // Remove spaces around ;
            .replace(/\s*:\s*/g, ":") // Remove spaces around :
            .replace(/\s*,\s*/g, ",") // Remove spaces around ,
            .replace(/^\s+|\s+$/g, "") // Trim start and end
            .replace(/\n\s*/g, ""); // Remove newlines and following spaces
    };

    const optimizeColorValues = (css: string): string => {
        return (
            css
                // Convert hex colors to shorter format when possible
                .replace(
                    /#([0-9a-fA-F])\1([0-9a-fA-F])\2([0-9a-fA-F])\3/g,
                    "#$1$2$3",
                )
                // Convert rgb to hex when shorter
                .replace(
                    /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g,
                    (match, r, g, b) => {
                        const hex =
                            "#" +
                            parseInt(r).toString(16).padStart(2, "0") +
                            parseInt(g).toString(16).padStart(2, "0") +
                            parseInt(b).toString(16).padStart(2, "0");
                        return hex.length <= match.length ? hex : match;
                    },
                )
                // Optimize color names
                .replace(/\bwhite\b/g, "#fff")
                .replace(/\bblack\b/g, "#000")
                .replace(/\bred\b/g, "#f00")
                .replace(/\bblue\b/g, "#00f")
                .replace(/\bgreen\b/g, "#008000")
                .replace(/\byellow\b/g, "#ff0")
                .replace(/\bcyan\b/g, "#0ff")
                .replace(/\bmagenta\b/g, "#f0f")
        );
    };

    const shortenCSSProperties = (css: string): string => {
        return (
            css
                // Shorten margin/padding
                .replace(/margin:\s*(\S+)\s+\1\s+\1\s+\1/g, "margin:$1")
                .replace(/padding:\s*(\S+)\s+\1\s+\1\s+\1/g, "padding:$1")
                .replace(/margin:\s*(\S+)\s+(\S+)\s+\1\s+\2/g, "margin:$1 $2")
                .replace(/padding:\s*(\S+)\s+(\S+)\s+\1\s+\2/g, "padding:$1 $2")
                // Remove unnecessary units
                .replace(/(\s|:)0px/g, "$10")
                .replace(/(\s|:)0em/g, "$10")
                .replace(/(\s|:)0%/g, "$10")
                .replace(/(\s|:)0pt/g, "$10")
                .replace(/(\s|:)0rem/g, "$10")
                // Remove leading zeros
                .replace(/(\s|:)0+\.(\d+)/g, "$1.$2")
        );
    };

    const removeUnnecessarySemicolons = (css: string): string => {
        // Remove semicolon before closing brace
        return css.replace(/;(\s*})/g, "$1");
    };

    const mergeDuplicateSelectors = (css: string): string => {
        // Basic implementation - merge identical selectors
        const selectorMap: { [key: string]: string[] } = {};
        const rules = css.match(/[^{}]+\{[^{}]*\}/g) || [];

        rules.forEach((rule) => {
            const match = rule.match(/^([^{]+)\{([^}]*)\}$/);
            if (match) {
                const selector = match[1].trim();
                const properties = match[2].trim();
                if (!selectorMap[selector]) {
                    selectorMap[selector] = [];
                }
                selectorMap[selector].push(properties);
            }
        });

        let merged = "";
        Object.keys(selectorMap).forEach((selector) => {
            const properties = selectorMap[selector]
                .join(";")
                .replace(/;+/g, ";");
            merged += `${selector}{${properties}}`;
        });

        return merged;
    };

    const lightMinification = (css: string): string => {
        return css
            .replace(/\s*{\s*/g, " { ")
            .replace(/\s*}\s*/g, " }\n")
            .replace(/\s*;\s*/g, "; ");
    };

    const standardMinification = (css: string): string => {
        return css
            .replace(/\s*{\s*/g, "{")
            .replace(/\s*}\s*/g, "}")
            .replace(/\s*;\s*/g, ";")
            .replace(/\s*:\s*/g, ":")
            .replace(/\s*,\s*/g, ",");
    };

    const aggressiveMinification = (css: string): string => {
        return css
            .replace(/\s+/g, " ")
            .replace(/\s*{\s*/g, "{")
            .replace(/\s*}\s*/g, "}")
            .replace(/\s*;\s*/g, ";")
            .replace(/\s*:\s*/g, ":")
            .replace(/\s*,\s*/g, ",")
            .replace(/;\s*}/g, "}")
            .replace(/^\s+|\s+$/g, "")
            .replace(/\n/g, "");
    };

    const copyToClipboard = async () => {
        if (!outputCSS) {
            toast({
                title: "Nothing to Copy",
                description: "Please minify some CSS first",
                variant: "destructive",
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(outputCSS);
            toast({
                title: "Copied!",
                description: "Minified CSS has been copied to clipboard",
            });
        } catch (error) {
            toast({
                title: "Copy Failed",
                description: "Could not copy to clipboard",
                variant: "destructive",
            });
        }
    };

    const downloadCSS = () => {
        if (!outputCSS) {
            toast({
                title: "Nothing to Download",
                description: "Please minify some CSS first",
                variant: "destructive",
            });
            return;
        }

        const blob = new Blob([outputCSS], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "minified.css";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Downloaded!",
            description: "File saved as minified.css",
        });
    };

    const clearAll = () => {
        setInputCSS("");
        setOutputCSS("");
        setStats(null);
    };

    const loadSample = () => {
        const sampleCSS = `/* Main Styles */
body {
    margin: 0px;
    padding: 0px;
    background-color: #ffffff;
    font-family: Arial, sans-serif;
    line-height: 1.5;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px 20px 20px 20px;
}

.header {
    background-color: #333333;
    color: white;
    padding: 10px;
    text-align: center;
}

.button {
    background-color: rgb(0, 123, 255);
    color: #ffffff;
    border: 0px solid transparent;
    padding: 10px 20px 10px 20px;
    cursor: pointer;
    border-radius: 5px;
}

.button:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }

    .button {
        width: 100%;
        margin-bottom: 10px;
    }
}`;

        setInputCSS(sampleCSS);
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">CSS Minifier</h2>

            <Tabs defaultValue="minifier" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="minifier">CSS Minifier</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="minifier">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="input-css">
                                            Input CSS
                                        </Label>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={loadSample}
                                        >
                                            Load Sample
                                        </Button>
                                    </div>
                                    <Textarea
                                        id="input-css"
                                        placeholder="Paste your CSS code here..."
                                        value={inputCSS}
                                        onChange={(e) =>
                                            setInputCSS(e.target.value)
                                        }
                                        className="min-h-[400px] font-mono text-sm"
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            onClick={minifyCSS}
                                        >
                                            <Minimize2 className="w-4 h-4 mr-2" />
                                            Minify CSS
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={clearAll}
                                        >
                                            Clear
                                        </Button>
                                    </div>

                                    {inputCSS && (
                                        <div className="text-sm text-muted-foreground">
                                            Original:{" "}
                                            {formatBytes(inputCSS.length)} |
                                            Lines: {inputCSS.split("\n").length}
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
                                        <Label htmlFor="output-css">
                                            Minified CSS
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={copyToClipboard}
                                                disabled={!outputCSS}
                                            >
                                                <Copy className="w-4 h-4 mr-1" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={downloadCSS}
                                                disabled={!outputCSS}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                    <Textarea
                                        id="output-css"
                                        value={outputCSS}
                                        readOnly
                                        className="min-h-[400px] font-mono text-sm bg-secondary/30"
                                        placeholder="Minified CSS will appear here..."
                                    />

                                    {outputCSS && (
                                        <div className="text-sm text-muted-foreground">
                                            Minified:{" "}
                                            {formatBytes(outputCSS.length)} |
                                            Lines:{" "}
                                            {outputCSS.split("\n").length}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistics */}
                    {stats && (
                        <Card className="mt-6">
                            <CardContent className="pt-6">
                                <h3 className="font-semibold mb-4 flex items-center">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Compression Statistics
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center p-4 bg-secondary/30 rounded-md">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {formatBytes(stats.originalSize)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Original Size
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-secondary/30 rounded-md">
                                        <div className="text-2xl font-bold text-green-600">
                                            {formatBytes(stats.minifiedSize)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Minified Size
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-secondary/30 rounded-md">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {formatBytes(stats.savings)}
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Bytes Saved
                                        </div>
                                    </div>
                                    <div className="text-center p-4 bg-secondary/30 rounded-md">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {stats.compressionRatio}%
                                        </div>
                                        <div className="text-sm text-muted-foreground">
                                            Compression
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="minification-level">
                                        Minification Level
                                    </Label>
                                    <Select
                                        value={minificationLevel}
                                        onValueChange={setMinificationLevel}
                                    >
                                        <SelectTrigger id="minification-level">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="light">
                                                Light - Preserve readability
                                            </SelectItem>
                                            <SelectItem value="standard">
                                                Standard - Balanced compression
                                            </SelectItem>
                                            <SelectItem value="aggressive">
                                                Aggressive - Maximum compression
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="font-semibold">
                                            Basic Options
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="remove-comments">
                                                Remove Comments
                                            </Label>
                                            <Switch
                                                id="remove-comments"
                                                checked={removeComments}
                                                onCheckedChange={
                                                    setRemoveComments
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="remove-whitespace">
                                                Remove Whitespace
                                            </Label>
                                            <Switch
                                                id="remove-whitespace"
                                                checked={removeWhitespace}
                                                onCheckedChange={
                                                    setRemoveWhitespace
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="remove-semicolons">
                                                Remove Last Semicolons
                                            </Label>
                                            <Switch
                                                id="remove-semicolons"
                                                checked={removeSemicolons}
                                                onCheckedChange={
                                                    setRemoveSemicolons
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-semibold">
                                            Advanced Options
                                        </h3>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="optimize-colors">
                                                Optimize Colors
                                            </Label>
                                            <Switch
                                                id="optimize-colors"
                                                checked={optimizeColors}
                                                onCheckedChange={
                                                    setOptimizeColors
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="shorten-properties">
                                                Shorten Properties
                                            </Label>
                                            <Switch
                                                id="shorten-properties"
                                                checked={shortenProperties}
                                                onCheckedChange={
                                                    setShortenProperties
                                                }
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="merge-duplicates">
                                                Merge Duplicates
                                            </Label>
                                            <Switch
                                                id="merge-duplicates"
                                                checked={mergeDuplicates}
                                                onCheckedChange={
                                                    setMergeDuplicates
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                                    <h3 className="font-semibold mb-2 flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Optimization Features:
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div>
                                            • Remove comments and whitespace
                                        </div>
                                        <div>
                                            • Optimize color values (hex, rgb)
                                        </div>
                                        <div>
                                            • Shorten margin/padding values
                                        </div>
                                        <div>
                                            • Remove unnecessary units (0px → 0)
                                        </div>
                                        <div>
                                            • Remove leading zeros (0.5 → .5)
                                        </div>
                                        <div>• Merge duplicate selectors</div>
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

export default CSSMinifier;
