import { useState } from "react";
import AuthForm from "@/components/AuthForm";
import ThemeToggle from "@/components/ThemeToggle";
import { useLocation } from "wouter";
import logoUrl from "@assets/Gravitas Academy logo_1759991845447.png";

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [, setLocation] = useLocation();

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

          <AuthForm 
            mode={mode} 
            onToggleMode={() => setMode(mode === "login" ? "register" : "login")} 
          />
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
