import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { RefreshCw, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Progress } from '@/components/ui/progress';

const PasswordGenerator: React.FC = () => {
  const { toast } = useToast();
  const [password, setPassword] = useState<string>('');
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeSimilar, setExcludeSimilar] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [strength, setStrength] = useState<number>(0);
  const [strengthText, setStrengthText] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(true);

  useEffect(() => {
    generatePassword();
  }, []);

  useEffect(() => {
    calculateStrength();
  }, [password]);

  const calculateStrength = () => {
    if (!password) {
      setStrength(0);
      setStrengthText('');
      return;
    }

    let score = 0;

    // Length contribution (up to 40 points)
    score += Math.min(40, password.length * 2);

    // Character variety contribution (up to 60 points)
    if (/[A-Z]/.test(password)) score += 15;
    if (/[a-z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 15;

    setStrength(score);

    if (score < 20) {
      setStrengthText('Very Weak');
    } else if (score < 40) {
      setStrengthText('Weak');
    } else if (score < 60) {
      setStrengthText('Medium');
    } else if (score < 80) {
      setStrengthText('Strong');
    } else {
      setStrengthText('Very Strong');
    }
  };

  const generatePassword = () => {
    if (!includeLowercase && !includeUppercase && !includeNumbers && !includeSymbols) {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive"
      });
      return;
    }

    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    // Characters to exclude if excludeSimilar is checked
    const similarChars = 'iIlLoO01';

    let validChars = '';
    if (includeLowercase) validChars += lowercaseChars;
    if (includeUppercase) validChars += uppercaseChars;
    if (includeNumbers) validChars += numberChars;
    if (includeSymbols) validChars += symbolChars;

    if (excludeSimilar) {
      // Remove similar characters
      for (const char of similarChars) {
        validChars = validChars.replace(char, '');
      }
    }

    let newPassword = '';
    let hasLower = !includeLowercase;
    let hasUpper = !includeUppercase;
    let hasNumber = !includeNumbers;
    let hasSymbol = !includeSymbols;

    // Ensure every selected character type is included
    while (newPassword.length < length &&
           !(hasLower && hasUpper && hasNumber && hasSymbol)) {
      const char = validChars.charAt(Math.floor(Math.random() * validChars.length));
      newPassword += char;

      if (includeLowercase && /[a-z]/.test(char)) hasLower = true;
      if (includeUppercase && /[A-Z]/.test(char)) hasUpper = true;
      if (includeNumbers && /[0-9]/.test(char)) hasNumber = true;
      if (includeSymbols && /[^A-Za-z0-9]/.test(char)) hasSymbol = true;
    }

    // Fill the rest of the password
    while (newPassword.length < length) {
      newPassword += validChars.charAt(Math.floor(Math.random() * validChars.length));
    }

    // Shuffle the password
    newPassword = newPassword.split('').sort(() => 0.5 - Math.random()).join('');

    setPassword(newPassword);

    toast({
      title: "Success",
      description: "New password generated"
    });
  };

  const copyToClipboard = () => {
    if (!password) return;

    navigator.clipboard.writeText(password);
    setCopied(true);

    toast({
      title: "Copied",
      description: "Password copied to clipboard"
    });

    setTimeout(() => setCopied(false), 2000);
  };

  const getStrengthColor = () => {
    if (strength < 20) return 'bg-destructive';
    if (strength < 40) return 'bg-orange-500';
    if (strength < 60) return 'bg-yellow-500';
    if (strength < 80) return 'bg-lime-500';
    return 'bg-green-500';
  };

  return (
    <div className="max-w-xl mx-auto">
      <Card>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                readOnly
                className="pr-24 font-mono text-lg"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={copyToClipboard}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Password Strength</Label>
                <span className="text-sm font-medium">{strengthText}</span>
              </div>
              <Progress value={strength} className={getStrengthColor()} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password-length">Password Length: {length}</Label>
              </div>
              <Slider
                id="password-length"
                min={8}
                max={64}
                step={1}
                value={[length]}
                onValueChange={([value]) => setLength(value)}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>8</span>
                <span>36</span>
                <span>64</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Character Types</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-uppercase"
                    checked={includeUppercase}
                    onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                  />
                  <Label htmlFor="include-uppercase" className="cursor-pointer">
                    Uppercase (A-Z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-lowercase"
                    checked={includeLowercase}
                    onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                  />
                  <Label htmlFor="include-lowercase" className="cursor-pointer">
                    Lowercase (a-z)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-numbers"
                    checked={includeNumbers}
                    onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                  />
                  <Label htmlFor="include-numbers" className="cursor-pointer">
                    Numbers (0-9)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="include-symbols"
                    checked={includeSymbols}
                    onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                  />
                  <Label htmlFor="include-symbols" className="cursor-pointer">
                    Symbols (!@#$%)
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="exclude-similar"
                checked={excludeSimilar}
                onCheckedChange={(checked) => setExcludeSimilar(checked as boolean)}
              />
              <Label htmlFor="exclude-similar" className="cursor-pointer">
                Exclude similar characters (i, l, 1, I, o, 0, O)
              </Label>
            </div>
          </div>

          <Button
            className="w-full"
            onClick={generatePassword}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Password
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Password is generated locally and never sent to a server</p>
            <p>• Use a password manager to securely store your passwords</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordGenerator;
