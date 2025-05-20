import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, FileText, Upload, RefreshCw, Info, Check, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface RegexMatch {
  text: string;
  start: number;
  end: number;
}

interface RegexGroup {
  index: number;
  text: string;
}

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState<string>('');
  const [flags, setFlags] = useState<string>('g');
  const [testText, setTestText] = useState<string>('');
  const [replacementText, setReplacementText] = useState<string>('');
  const [replacementResult, setReplacementResult] = useState<string>('');
  const [matches, setMatches] = useState<RegexMatch[]>([]);
  const [groups, setGroups] = useState<RegexGroup[]>([]);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('match');
  const { toast } = useToast();

  // Flag toggles
  const [globalFlag, setGlobalFlag] = useState<boolean>(true);
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState<boolean>(false);
  const [multilineFlag, setMultilineFlag] = useState<boolean>(false);
  const [dotAllFlag, setDotAllFlag] = useState<boolean>(false);
  const [unicodeFlag, setUnicodeFlag] = useState<boolean>(false);
  const [stickyFlag, setStickyFlag] = useState<boolean>(false);

  // Update flags state when toggles change
  useEffect(() => {
    let newFlags = '';
    if (globalFlag) newFlags += 'g';
    if (caseInsensitiveFlag) newFlags += 'i';
    if (multilineFlag) newFlags += 'm';
    if (dotAllFlag) newFlags += 's';
    if (unicodeFlag) newFlags += 'u';
    if (stickyFlag) newFlags += 'y';
    setFlags(newFlags);
  }, [globalFlag, caseInsensitiveFlag, multilineFlag, dotAllFlag, unicodeFlag, stickyFlag]);

  // Run regex and update matches when inputs change
  useEffect(() => {
    if (!pattern || !testText) {
      setMatches([]);
      setGroups([]);
      setError('');
      return;
    }

    try {
      // Create regex object from pattern and flags
      const regex = new RegExp(pattern, flags);

      // Find all matches
      const newMatches: RegexMatch[] = [];
      const newGroups: RegexGroup[] = [];

      if (flags.includes('g')) {
        let match;
        while ((match = regex.exec(testText)) !== null) {
          newMatches.push({
            text: match[0],
            start: match.index,
            end: match.index + match[0].length
          });

          // Extract groups
          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
              newGroups.push({
                index: i,
                text: match[i]
              });
            }
          }
        }
      } else {
        const match = regex.exec(testText);
        if (match) {
          newMatches.push({
            text: match[0],
            start: match.index,
            end: match.index + match[0].length
          });

          // Extract groups
          for (let i = 1; i < match.length; i++) {
            if (match[i] !== undefined) {
              newGroups.push({
                index: i,
                text: match[i]
              });
            }
          }
        }
      }

      setMatches(newMatches);
      setGroups(newGroups);
      setError('');

      // Handle replacement
      if (activeTab === 'replace') {
        const replaced = testText.replace(regex, replacementText);
        setReplacementResult(replaced);
      }

    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setMatches([]);
        setGroups([]);
      }
    }
  }, [pattern, flags, testText, replacementText, activeTab]);

  const handleClear = () => {
    setPattern('');
    setTestText('');
    setReplacementText('');
    setReplacementResult('');
    setMatches([]);
    setGroups([]);
    setError('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTestText(content);

      toast({
        title: "File Loaded",
        description: `${file.name} has been loaded successfully.`
      });
    };
    reader.readAsText(file);

    // Reset the file input
    e.target.value = '';
  };

  const copyToClipboard = (content: string, description: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied!",
      description
    });
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Test and debug regular expressions with this interactive tool. Match, replace, and validate patterns.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr,1fr] gap-6">
        <div className="space-y-4">
          <Card className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="regex-pattern">Regular Expression</Label>
              <div className="flex gap-2">
                <div className="bg-secondary/30 rounded px-2 py-1.5 font-mono">/</div>
                <Input
                  id="regex-pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="Enter regex pattern..."
                  className="font-mono"
                />
                <div className="bg-secondary/30 rounded px-2 py-1.5 font-mono">/{flags}</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Flags</Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag-g"
                    checked={globalFlag}
                    onCheckedChange={setGlobalFlag}
                  />
                  <Label htmlFor="flag-g" className="cursor-pointer">Global (g)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag-i"
                    checked={caseInsensitiveFlag}
                    onCheckedChange={setCaseInsensitiveFlag}
                  />
                  <Label htmlFor="flag-i" className="cursor-pointer">Case-insensitive (i)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag-m"
                    checked={multilineFlag}
                    onCheckedChange={setMultilineFlag}
                  />
                  <Label htmlFor="flag-m" className="cursor-pointer">Multiline (m)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag-s"
                    checked={dotAllFlag}
                    onCheckedChange={setDotAllFlag}
                  />
                  <Label htmlFor="flag-s" className="cursor-pointer">Dot All (s)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag-u"
                    checked={unicodeFlag}
                    onCheckedChange={setUnicodeFlag}
                  />
                  <Label htmlFor="flag-u" className="cursor-pointer">Unicode (u)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="flag-y"
                    checked={stickyFlag}
                    onCheckedChange={setStickyFlag}
                  />
                  <Label htmlFor="flag-y" className="cursor-pointer">Sticky (y)</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="test-text">Test Text</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-1" />
                  Upload File
                </Button>
                <input
                  id="file-upload"
                  type="file"
                  accept=".txt,.md,.html,.css,.js,.json,.xml,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
              <Textarea
                id="test-text"
                value={testText}
                onChange={(e) => setTestText(e.target.value)}
                placeholder="Enter text to test against the regular expression..."
                className="min-h-[150px] font-mono text-sm"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="match">Match</TabsTrigger>
                <TabsTrigger value="replace">Replace</TabsTrigger>
              </TabsList>

              <TabsContent value="match">
                {/* Match content remains visible */}
              </TabsContent>

              <TabsContent value="replace" className="space-y-3 pt-3">
                <div className="space-y-2">
                  <Label htmlFor="replacement-text">Replacement Text</Label>
                  <Input
                    id="replacement-text"
                    value={replacementText}
                    onChange={(e) => setReplacementText(e.target.value)}
                    placeholder="Enter replacement text (can use $1, $2, etc. for captured groups)..."
                    className="font-mono"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleClear}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset All
              </Button>

              {activeTab === 'replace' && replacementResult && (
                <Button
                  onClick={() => copyToClipboard(replacementResult, "Replacement result copied")}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Result
                </Button>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Invalid Regular Expression</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {activeTab === 'match' ? (
            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Match Results</h3>
                <Badge variant={matches.length > 0 ? "default" : "outline"}>
                  {matches.length} {matches.length === 1 ? 'match' : 'matches'}
                </Badge>
              </div>

              {pattern && testText && !error ? (
                matches.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Matched Text</Label>
                      <div className="rounded border p-3 bg-secondary/10 font-mono text-sm overflow-x-auto max-h-[200px] overflow-y-auto">
                        {testText.split('').map((char, index) => {
                          const isMatched = matches.some(
                            match => index >= match.start && index < match.end
                          );
                          return (
                            <span
                              key={index}
                              className={
                                isMatched
                                  ? "bg-green-200 dark:bg-green-900"
                                  : ""
                              }
                            >
                              {char === '\n' ? (
                                <span className="opacity-50">⏎<br /></span>
                              ) : char === ' ' ? (
                                <span className="opacity-50">·</span>
                              ) : char === '\t' ? (
                                <span className="opacity-50">→</span>
                              ) : (
                                char
                              )}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {matches.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Match Details</Label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {matches.map((match, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 border rounded bg-muted/50"
                            >
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="mb-1">Match {index + 1}</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(match.text, `Match ${index + 1} copied`)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="font-mono bg-background p-1 rounded">
                                {match.text}
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Position: {match.start} to {match.end} (length: {match.end - match.start})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groups.length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Captured Groups</Label>
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                          {groups.map((group, index) => (
                            <div
                              key={index}
                              className="text-sm p-2 border rounded bg-muted/50"
                            >
                              <div className="flex justify-between items-center">
                                <Badge variant="outline" className="mb-1">Group ${group.index}</Badge>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => copyToClipboard(group.text, `Group ${group.index} copied`)}
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="font-mono bg-background p-1 rounded">
                                {group.text}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 text-center text-muted-foreground border border-dashed rounded-md">
                    <AlertTriangle className="h-6 w-6 mx-auto mb-2" />
                    <p>No matches found for this pattern.</p>
                  </div>
                )
              ) : (
                <div className="p-4 text-center text-muted-foreground border border-dashed rounded-md">
                  <Info className="h-6 w-6 mx-auto mb-2" />
                  <p>{error ? "Fix the regex error and try again." : "Enter a pattern and test text to see results."}</p>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Replacement Result</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(replacementResult, "Replacement result copied")}
                  disabled={!replacementResult}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </Button>
              </div>

              {pattern && testText && !error ? (
                <div className="rounded border p-3 bg-secondary/10 font-mono text-sm overflow-x-auto max-h-[400px] overflow-y-auto">
                  {replacementResult || <span className="text-muted-foreground italic">No changes made</span>}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground border border-dashed rounded-md">
                  <Info className="h-6 w-6 mx-auto mb-2" />
                  <p>{error ? "Fix the regex error and try again." : "Enter a pattern, test text, and replacement text to see results."}</p>
                </div>
              )}

              <Alert className="bg-muted">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-xs text-muted-foreground">
                  Use <span className="font-mono">$1</span>, <span className="font-mono">$2</span>, etc. to refer to captured groups in the replacement text.
                  Use <span className="font-mono">$&</span> to refer to the entire matched text.
                </AlertDescription>
              </Alert>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
