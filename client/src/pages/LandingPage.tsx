import { Button } from "@/components/ui/button";
import HeroSection from "@/components/HeroSection";
import FeatureCard from "@/components/FeatureCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Target, TrendingUp, Users, Clock, Shield } from "lucide-react";
import { useLocation } from "wouter";
import logoUrl from "@assets/Gravitas Academy logo_1759991845447.png";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Gravitas Academy" className="h-13 w-auto" />
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/auth')}
              data-testid="button-signin"
            >
              Sign In
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <HeroSection />

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">Why Take This Assessment?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understand exactly where you stand and what you need to focus on to transition from technical leadership to C-suite success.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon={Target}
              title="Identify Strategic Gaps"
              description="Discover exactly where you need to focus your development efforts to become C-suite ready."
            />
            <FeatureCard
              icon={TrendingUp}
              title="Get Personalized Insights"
              description="Receive a detailed analysis of your strengths and priority development areas."
            />
            <FeatureCard
              icon={Users}
              title="Join Elite Leaders"
              description="Connect with 500+ senior IT professionals who are making the leap to strategic roles."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">How It Works</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">1</span>
              </div>
              <h3 className="text-xl font-medium">Answer 12 Questions</h3>
              <p className="text-muted-foreground">
                Complete our strategic readiness diagnostic in just 12-15 minutes.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">2</span>
              </div>
              <h3 className="text-xl font-medium">Get Instant Results</h3>
              <p className="text-muted-foreground">
                Discover your Strategic Readiness Zone and top 2 priorities immediately.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-2xl font-semibold text-primary">3</span>
              </div>
              <h3 className="text-xl font-medium">Receive Full Report</h3>
              <p className="text-muted-foreground">
                Get a detailed PDF report via email with actionable insights and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold">Trusted by Senior IT Leaders</h2>
          </div>

          <div className="bg-card border rounded-lg p-8 space-y-6">
            <div className="flex gap-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-2xl font-semibold text-primary">RK</span>
              </div>
              <div className="space-y-2">
                <p className="text-lg italic">
                  "This assessment gave me clarity on exactly what I needed to work on. Within 6 months, I moved from VP Engineering to CTO. The insights were spot-on."
                </p>
                <div>
                  <p className="font-semibold">Rajesh Kumar</p>
                  <p className="text-sm text-muted-foreground">CTO, Tech Solutions India</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-semibold">Ready to Discover Your Strategic Readiness?</h2>
          <p className="text-lg opacity-90">
            Join 500+ IT leaders who've taken control of their career trajectory.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-base"
            onClick={() => setLocation('/auth')}
            data-testid="button-start-cta"
          >
            Start Your Free Assessment
          </Button>
          <div className="flex items-center justify-center gap-8 pt-4 text-sm opacity-75">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>12-15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>100% Free</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© 2025 Gravitas Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
