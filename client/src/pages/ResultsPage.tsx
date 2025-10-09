import { Button } from "@/components/ui/button";
import ZoneCard from "@/components/ZoneCard";
import ScoreCircle from "@/components/ScoreCircle";
import PriorityCard from "@/components/PriorityCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Mail, Download } from "lucide-react";
import { Users, TrendingUp } from "lucide-react";
import { useLocation } from "wouter";
import logoUrl from "@assets/Gravitas Academy logo_1759991845447.png";

export default function ResultsPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Gravitas Academy" className="h-13 w-auto" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold">Your Strategic Readiness Results</h1>
            <p className="text-lg text-muted-foreground">
              Here's your personalized assessment based on your responses
            </p>
          </div>

          <ZoneCard
            zone="ZONE 3"
            title="The Strategic Contributor"
            description="You're developing strategic thinking but need to build more visibility and political capital to reach the C-suite level."
            color="secondary"
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Your Scores</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCircle
                title="Strategic Identity"
                score={28}
                maxScore={40}
                color="hsl(var(--chart-1))"
              />
              <ScoreCircle
                title="Visibility & Positioning"
                score={22}
                maxScore={40}
                color="hsl(var(--chart-2))"
              />
              <ScoreCircle
                title="Political Capital"
                score={22}
                maxScore={20}
                color="hsl(var(--chart-3))"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Your Top 2 Development Priorities</h2>
            <div className="space-y-4">
              <PriorityCard
                number={1}
                title="Build Executive Presence"
                description="Develop your communication style and decision-making visibility to establish yourself as a strategic leader in the organization."
                icon={Users}
              />
              <PriorityCard
                number={2}
                title="Expand Strategic Network"
                description="Build relationships with key stakeholders across the organization to increase your influence and political capital."
                icon={TrendingUp}
              />
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg p-8 space-y-6">
            <div className="text-center space-y-2">
              <Mail className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-xl font-semibold">Get Your Detailed PDF Report</h3>
              <p className="text-muted-foreground">
                We'll email you a comprehensive report with actionable insights and next steps within 24 hours.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => console.log('Download report')}
                data-testid="button-download-report"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Report (Once Sent)
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
