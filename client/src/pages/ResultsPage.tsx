import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ZoneCard from "@/components/ZoneCard";
import ScoreCircle from "@/components/ScoreCircle";
import PriorityCard from "@/components/PriorityCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Mail, Download, Users, TrendingUp, Target, Lightbulb } from "lucide-react";
import { useLocation } from "wouter";
import logoUrl from "@assets/Gravitas Academy logo_1759991845447.png";
import { Skeleton } from "@/components/ui/skeleton";

interface AssessmentResult {
  assessment: {
    id: string;
    totalScore: number;
    zone: string;
    strategicIdentity: number;
    visibilityPositioning: number;
    politicalCapital: number;
    priority1: string;
    priority2: string;
    pdfUrl?: string;
    completedAt: string;
  };
  zoneInterpretation: {
    zone_id: string;
    title: string;
    score_range: string;
    current_reality: string;
    gap: string;
    meaning: string;
    priorities: string[];
    next_step: string;
    cta_type: string;
  };
  priorities: {
    priority1?: {
      description: string;
      development_focus: string[];
    };
    priority2?: {
      description: string;
      development_focus: string[];
    };
  };
  cta: {
    header: string;
    options: Array<{
      title: string;
      price: string;
      benefits: string[];
      cta_button: string;
    }>;
  };
}

export default function ResultsPage() {
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const assessmentId = searchParams.get('id');

  const { data: results, isLoading } = useQuery<AssessmentResult>({
    queryKey: [`/api/assessments/${assessmentId}/results`],
    enabled: !!assessmentId,
  });

  if (!assessmentId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold">Assessment not found</h2>
          <Button onClick={() => setLocation('/')}>Go to Home</Button>
        </div>
      </div>
    );
  }

  if (isLoading || !results) {
    return (
      <div className="min-h-screen">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Gravitas Academy" className="h-10 w-auto" />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="py-12 px-6">
          <div className="max-w-4xl mx-auto space-y-12">
            <Skeleton className="h-12 w-3/4 mx-auto" />
            <Skeleton className="h-32 w-full" />
            <div className="grid md:grid-cols-3 gap-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { assessment, zoneInterpretation, priorities, cta } = results;

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'ZONE_1': return 'destructive';
      case 'ZONE_2': return 'secondary';
      case 'ZONE_3': return 'default';
      case 'ZONE_4': return 'default';
      default: return 'secondary';
    }
  };

  const getPriorityIcon = (priority: string) => {
    const iconMap: Record<string, any> = {
      'Strategic Business Thinking': Target,
      'Executive Relationships': Users,
      'Strategic Communication': Lightbulb,
      'Cross-Functional Influence': TrendingUp,
      'Executive Presence': Users,
      'Political Capital': TrendingUp,
      'Strategic Opportunity Creation': Target,
      'Personal Brand Amplification': Lightbulb,
    };
    return iconMap[priority] || Users;
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Gravitas Academy" className="h-10 w-auto" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-semibold">Your Strategic Readiness Results</h1>
            <p className="text-lg text-muted-foreground">
              {zoneInterpretation.meaning}
            </p>
          </div>

          <ZoneCard
            zone={zoneInterpretation.zone_id}
            title={zoneInterpretation.title}
            description={zoneInterpretation.current_reality}
            color={getZoneColor(assessment.zone)}
          />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">Your Scores</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <ScoreCircle
                title="Strategic Identity"
                score={assessment.strategicIdentity}
                maxScore={20}
                color="hsl(var(--chart-1))"
              />
              <ScoreCircle
                title="Visibility & Positioning"
                score={assessment.visibilityPositioning}
                maxScore={20}
                color="hsl(var(--chart-2))"
              />
              <ScoreCircle
                title="Political Capital"
                score={assessment.politicalCapital}
                maxScore={20}
                color="hsl(var(--chart-3))"
              />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">Your Top 2 Development Priorities</h2>
            <div className="space-y-4">
              {priorities.priority1 && (
                <PriorityCard
                  number={1}
                  title={assessment.priority1}
                  description={priorities.priority1.description}
                  icon={getPriorityIcon(assessment.priority1)}
                />
              )}
              {priorities.priority2 && (
                <PriorityCard
                  number={2}
                  title={assessment.priority2}
                  description={priorities.priority2.description}
                  icon={getPriorityIcon(assessment.priority2)}
                />
              )}
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
              {assessment.pdfUrl ? (
                <Button 
                  size="lg"
                  onClick={() => window.open(assessment.pdfUrl, '_blank')}
                  data-testid="button-download-report"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              ) : (
                <Button 
                  size="lg"
                  disabled
                  data-testid="button-download-report"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Report Pending Approval
                </Button>
              )}
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

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-center">{cta.header}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {cta.options.map((option, index) => (
                <div key={index} className="border rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-semibold">{option.title}</h3>
                  <p className="text-2xl font-bold text-primary">{option.price}</p>
                  <ul className="space-y-2">
                    {option.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">• {benefit}</li>
                    ))}
                  </ul>
                  <Button className="w-full">{option.cta_button}</Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
