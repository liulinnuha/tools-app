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
import { Code2, Copy, Download, Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CodeBeautifier: React.FC = () => {
    const { toast } = useToast();
    const [inputCode, setInputCode] = useState<string>("");
    const [outputCode, setOutputCode] = useState<string>("");
    const [selectedLanguage, setSelectedLanguage] =
        useState<string>("javascript");
    const [indentSize, setIndentSize] = useState<string>("2");
    const [indentType, setIndentType] = useState<string>("spaces");

    const languages = [
        { value: "php", label: "PHP" },
        { value: "blade", label: "Blade Template" },
        { value: "go", label: "Go" },
        { value: "python", label: "Python" },
        { value: "javascript", label: "JavaScript" },
        { value: "typescript", label: "TypeScript" },
        { value: "tsx", label: "TSX/JSX" },
        { value: "html", label: "HTML" },
        { value: "css", label: "CSS" },
    ];

    const beautifyCode = () => {
        if (!inputCode.trim()) {
            toast({
                title: "Empty Input",
                description: "Please enter some code to beautify",
                variant: "destructive",
            });
            return;
        }

        try {
            let beautified = "";
            const indent =
                indentType === "spaces"
                    ? " ".repeat(parseInt(indentSize))
                    : "\t";

            switch (selectedLanguage) {
                case "javascript":
                case "typescript":
                case "tsx":
                    beautified = beautifyJavaScript(inputCode, indent);
                    break;
                case "php":
                    beautified = beautifyPHP(inputCode, indent);
                    break;
                case "blade":
                    beautified = beautifyBlade(inputCode, indent);
                    break;
                case "go":
                    beautified = beautifyGo(inputCode, indent);
                    break;
                case "python":
                    beautified = beautifyPython(inputCode, indent);
                    break;
                case "html":
                    beautified = beautifyHTML(inputCode, indent);
                    break;
                case "css":
                    beautified = beautifyCSS(inputCode, indent);
                    break;
                default:
                    beautified = basicBeautify(inputCode, indent);
            }

            setOutputCode(beautified);
            toast({
                title: "Success",
                description: "Code has been beautified successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description:
                    "Failed to beautify code. Please check your syntax.",
                variant: "destructive",
            });
        }
    };

    const basicBeautify = (code: string, indent: string): string => {
        const lines = code.split("\n");
        let level = 0;
        let result = "";

        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Decrease level for closing brackets
            if (trimmed.match(/^[\}\]\)]/)) {
                level = Math.max(0, level - 1);
            }

            // Add indentation
            result += indent.repeat(level) + trimmed + "\n";

            // Increase level for opening brackets
            if (trimmed.match(/[\{\[\(]$/)) {
                level++;
            }
        }

        return result.trim();
    };

    const beautifyJavaScript = (code: string, indent: string): string => {
        // Basic JavaScript beautification
        let result = code
            .replace(/\s*{\s*/g, " {\n")
            .replace(/\s*}\s*/g, "\n}\n")
            .replace(/;\s*/g, ";\n")
            .replace(/,\s*/g, ",\n");

        return formatWithIndentation(result, indent);
    };

    const beautifyPHP = (code: string, indent: string): string => {
        let result = code
            .replace(/\s*{\s*/g, " {\n")
            .replace(/\s*}\s*/g, "\n}\n")
            .replace(/;\s*(?![^<]*>)/g, ";\n")
            .replace(/\?>\s*</g, "?>\n<")
            .replace(/<\?php\s*/g, "<?php\n");

        return formatWithIndentation(result, indent);
    };

    const beautifyBlade = (code: string, indent: string): string => {
        let result = code
            .replace(/@(if|foreach|for|while|switch)\s*\(/g, "@$1(")
            .replace(/@(endif|endforeach|endfor|endwhile|endswitch)/g, "\n@$1")
            .replace(/\{\{\s*/g, "{{ ")
            .replace(/\s*\}\}/g, " }}")
            .replace(/@extends\s*\(/g, "@extends(")
            .replace(/@section\s*\(/g, "\n@section(");

        return formatWithIndentation(result, indent);
    };

    const beautifyGo = (code: string, indent: string): string => {
        let result = code
            .replace(/\s*{\s*/g, " {\n")
            .replace(/\s*}\s*/g, "\n}\n")
            .replace(/\bfunc\s+/g, "\nfunc ")
            .replace(/\bpackage\s+/g, "package ")
            .replace(/\bimport\s+/g, "\nimport ");

        return formatWithIndentation(result, indent);
    };

    const beautifyPython = (code: string, indent: string): string => {
        const lines = code.split("\n");
        let level = 0;
        let result = "";

        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Decrease level for dedented lines
            const currentIndent = line.length - line.trimLeft().length;
            if (
                currentIndent <
                level * parseInt(indentSize.length > 0 ? indentSize : "4")
            ) {
                level--;
            }

            result += indent.repeat(level) + trimmed + "\n";

            // Increase level after colon
            if (trimmed.endsWith(":")) {
                level++;
            }
        }

        return result.trim();
    };

    const beautifyHTML = (code: string, indent: string): string => {
        let result = code
            .replace(/></g, ">\n<")
            .replace(/^\s+|\s+$/gm, "")
            .split("\n")
            .filter((line) => line.trim())
            .join("\n");

        return formatWithIndentation(result, indent);
    };

    const beautifyCSS = (code: string, indent: string): string => {
        let result = code
            .replace(/\s*{\s*/g, " {\n")
            .replace(/\s*}\s*/g, "\n}\n")
            .replace(/;\s*/g, ";\n")
            .replace(/,\s*/g, ",\n");

        return formatWithIndentation(result, indent);
    };

    const formatWithIndentation = (code: string, indent: string): string => {
        const lines = code.split("\n");
        let level = 0;
        let result = "";

        for (let line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Decrease level for closing brackets
            if (trimmed.match(/^[\}\]\)]/)) {
                level = Math.max(0, level - 1);
            }

            result += indent.repeat(level) + trimmed + "\n";

            // Increase level for opening brackets
            if (trimmed.match(/[\{\[\(]$/)) {
                level++;
            }
        }

        return result.trim();
    };

    const copyToClipboard = async () => {
        if (!outputCode) {
            toast({
                title: "Nothing to Copy",
                description: "Please beautify some code first",
                variant: "destructive",
            });
            return;
        }

        try {
            await navigator.clipboard.writeText(outputCode);
            toast({
                title: "Copied!",
                description: "Beautified code has been copied to clipboard",
            });
        } catch (error) {
            toast({
                title: "Copy Failed",
                description: "Could not copy to clipboard",
                variant: "destructive",
            });
        }
    };

    const downloadCode = () => {
        if (!outputCode) {
            toast({
                title: "Nothing to Download",
                description: "Please beautify some code first",
                variant: "destructive",
            });
            return;
        }

        const fileExtensions: { [key: string]: string } = {
            php: "php",
            blade: "blade.php",
            go: "go",
            python: "py",
            javascript: "js",
            typescript: "ts",
            tsx: "tsx",
            html: "html",
            css: "css",
        };

        const extension = fileExtensions[selectedLanguage] || "txt";
        const blob = new Blob([outputCode], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `beautified.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Downloaded!",
            description: `File saved as beautified.${extension}`,
        });
    };

    const clearAll = () => {
        setInputCode("");
        setOutputCode("");
    };

    const loadSample = () => {
        const samples: { [key: string]: string } = {
            javascript: `function calculate(a,b){if(a>b){return a+b;}else{return a-b;}}const result=calculate(5,3);console.log(result);`,
            php: `<?php class User{public function getName(){return $this->name;}public function setName($name){$this->name=$name;}}?>`,
            html: `<div><h1>Title</h1><p>This is a paragraph.</p><ul><li>Item 1</li><li>Item 2</li></ul></div>`,
            css: `body{margin:0;padding:0;}.container{display:flex;justify-content:center;}.item{background:#f0f0f0;padding:10px;}`,
            python: `def calculate(a,b):if a>b:return a+b
else:return a-b
result=calculate(5,3)
print(result)`,
            go: `package main
import "fmt"
func main(){fmt.Println("Hello World")}`,
            blade: `@extends('layout')@section('content')<div>{{$user->name}}</div>@endsection`,
            typescript: `interface User{name:string;age:number;}const user:User={name:"John",age:30};`,
            tsx: `const Component=()=>{return(<div><h1>Hello</h1></div>);};export default Component;`,
        };

        setInputCode(samples[selectedLanguage] || samples.javascript);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Code Beautifier</h2>

            <Tabs defaultValue="beautifier" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="beautifier">
                        Code Beautifier
                    </TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="beautifier">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Input Section */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="input-code">
                                            Input Code
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
                                        id="input-code"
                                        placeholder="Paste your code here..."
                                        value={inputCode}
                                        onChange={(e) =>
                                            setInputCode(e.target.value)
                                        }
                                        className="min-h-[400px] font-mono text-sm"
                                    />

                                    <div className="flex gap-2">
                                        <Button
                                            className="flex-1"
                                            onClick={beautifyCode}
                                        >
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            Beautify Code
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={clearAll}
                                        >
                                            Clear
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Output Section */}
                        <Card>
                            <CardContent className="pt-6">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="output-code">
                                            Beautified Code
                                        </Label>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={copyToClipboard}
                                                disabled={!outputCode}
                                            >
                                                <Copy className="w-4 h-4 mr-1" />
                                                Copy
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={downloadCode}
                                                disabled={!outputCode}
                                            >
                                                <Download className="w-4 h-4 mr-1" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                    <Textarea
                                        id="output-code"
                                        value={outputCode}
                                        readOnly
                                        className="min-h-[400px] font-mono text-sm bg-secondary/30"
                                        placeholder="Beautified code will appear here..."
                                    />

                                    {outputCode && (
                                        <div className="text-sm text-muted-foreground">
                                            Lines:{" "}
                                            {outputCode.split("\n").length} |
                                            Characters: {outputCode.length}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="settings">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="language">
                                        Programming Language
                                    </Label>
                                    <Select
                                        value={selectedLanguage}
                                        onValueChange={setSelectedLanguage}
                                    >
                                        <SelectTrigger id="language">
                                            <SelectValue placeholder="Select language" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {languages.map((lang) => (
                                                <SelectItem
                                                    key={lang.value}
                                                    value={lang.value}
                                                >
                                                    <Code2 className="w-4 h-4 mr-2 inline" />
                                                    {lang.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="indent-type">
                                        Indentation Type
                                    </Label>
                                    <Select
                                        value={indentType}
                                        onValueChange={setIndentType}
                                    >
                                        <SelectTrigger id="indent-type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="spaces">
                                                Spaces
                                            </SelectItem>
                                            <SelectItem value="tabs">
                                                Tabs
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="indent-size">
                                        Indent Size
                                    </Label>
                                    <Select
                                        value={indentSize}
                                        onValueChange={setIndentSize}
                                        disabled={indentType === "tabs"}
                                    >
                                        <SelectTrigger id="indent-size">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2">
                                                2 spaces
                                            </SelectItem>
                                            <SelectItem value="4">
                                                4 spaces
                                            </SelectItem>
                                            <SelectItem value="8">
                                                8 spaces
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-secondary/30 rounded-md">
                                <h3 className="font-semibold mb-2">
                                    Supported Languages:
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.value}
                                            className="flex items-center"
                                        >
                                            <Code2 className="w-3 h-3 mr-1" />
                                            {lang.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default CodeBeautifier;
