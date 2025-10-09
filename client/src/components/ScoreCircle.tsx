import { Card } from "@/components/ui/card";

interface ScoreCircleProps {
  title: string;
  score: number;
  maxScore: number;
  color: string;
}

export default function ScoreCircle({ title, score, maxScore, color }: ScoreCircleProps) {
  const percentage = (score / maxScore) * 100;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className="p-6 flex flex-col items-center gap-4">
      <div className="relative h-40 w-40">
        <svg className="transform -rotate-90" width="160" height="160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="hsl(var(--border))"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold" data-testid={`score-${title.toLowerCase().replace(/\s+/g, '-')}`}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
      <h3 className="text-lg font-medium text-center">{title}</h3>
    </Card>
  );
}
