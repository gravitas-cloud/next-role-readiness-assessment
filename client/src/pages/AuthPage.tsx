import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import logoUrl from "@assets/Gravitas Academy logo_1759991845447.png";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setLocation('/assessment');
    }
  }, [user, setLocation]);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    if (pwd.length < 6) return 25;
    if (pwd.length < 8) return 50;
    if (pwd.length >= 8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return 100;
    return 75;
  };

  const strength = getPasswordStrength(password);
  const strengthColor = strength < 50 ? "bg-destructive" : strength < 75 ? "bg-yellow-500" : "bg-chart-3";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (mode === "login") {
        await loginMutation.mutateAsync({ email, password });
        // Clear form on success
        setEmail("");
        setPassword("");
      } else {
        await registerMutation.mutateAsync({ email, name, password });
        // Clear form on success
        setName("");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      // Error is already handled by the mutation's onError callback
      console.error("Auth error:", error);
    }
  };

  const isLoading = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setLocation('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              data-testid="button-back-home"
            >
              <img src={logoUrl} alt="Gravitas Academy" className="h-10 w-auto" />
            </button>
            <ThemeToggle />
          </div>

          <Card className="p-8 w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      required
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
                    required
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
                      required
                      minLength={8}
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
                type="submit"
                className="w-full" 
                size="lg"
                disabled={isLoading}
                data-testid={mode === "login" ? "button-login" : "button-register"}
              >
                {isLoading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  type="button"
                  className="text-primary hover:underline font-medium"
                  onClick={() => setMode(mode === "login" ? "register" : "login")}
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
            </form>
          </Card>
        </div>
      </div>

      <div className="hidden md:flex relative bg-primary/5 items-center justify-center p-12">
        <div className="max-w-md space-y-6 text-center">
          <h2 className="text-3xl font-semibold">Transform Your Career Trajectory</h2>
          <p className="text-lg text-muted-foreground">
            Discover your Strategic Readiness Zone and get personalized insights to help you transition from technical leadership to C-suite success.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-primary">500+</p>
              <p className="text-sm text-muted-foreground">Leaders Assessed</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-primary">12</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-semibold text-primary">15m</p>
              <p className="text-sm text-muted-foreground">Time to Complete</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
