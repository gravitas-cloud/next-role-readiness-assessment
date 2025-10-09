import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "register";
  onToggleMode: () => void;
}

export default function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    if (pwd.length < 6) return 25;
    if (pwd.length < 8) return 50;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 100;
    return 75;
  };

  const strength = getPasswordStrength(password);
  const strengthColor = strength < 50 ? "bg-destructive" : strength < 75 ? "bg-yellow-500" : "bg-chart-3";

  return (
    <Card className="p-8 w-full max-w-md">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-muted-foreground">
            {mode === "login" 
              ? "Sign in to continue your assessment" 
              : "Start your journey to strategic leadership"}
          </p>
        </div>

        <div className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" data-testid="label-name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                data-testid="input-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" data-testid="label-email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              data-testid="input-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" data-testid="label-password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={mode === "register" ? "Minimum 8 characters" : "Enter your password"}
                data-testid="input-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
                data-testid="button-toggle-password"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {mode === "register" && password && (
              <div className="space-y-1">
                <Progress value={strength} className={`h-1 ${strengthColor}`} />
                <p className="text-xs text-muted-foreground">
                  {strength < 50 ? "Weak" : strength < 75 ? "Medium" : "Strong"} password
                </p>
              </div>
            )}
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          data-testid={mode === "login" ? "button-login" : "button-register"}
          onClick={() => console.log(`${mode} submitted`, { name, email, password })}
        >
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            className="text-primary hover:underline font-medium"
            onClick={onToggleMode}
            data-testid="button-toggle-mode"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>

        {mode === "register" && (
          <p className="text-xs text-center text-muted-foreground">
            Join 500+ IT leaders who've discovered their strategic gaps
          </p>
        )}
      </div>
    </Card>
  );
}
