import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, ShieldCheck } from 'lucide-react';

interface LoginFormProps {
  login: (password: string) => boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ login }) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      toast({
        title: "Login successful",
        description: "You are now logged in as admin",
        variant: "default",
      });
    } else {
      toast({
        title: "Login failed",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md max-w-md mx-auto">
      <div className="flex justify-center mb-6">
        <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-primary" />
        </div>
      </div>
      <h2 className="text-xl font-semibold mb-4 text-center">Admin Login</h2>
      <form onSubmit={handleLogin}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="password">Admin Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="mt-1"
              autoComplete="current-password"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use "admin123" for demo purposes
            </p>
          </div>
          <Button type="submit" className="w-full">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Login as Admin
          </Button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
