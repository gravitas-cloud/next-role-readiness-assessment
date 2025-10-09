import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);
  
  return (
    <div className="w-full bg-card border-b sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Assessment Progress</span>
            <span className="text-muted-foreground">
              Step {current} of {total}
            </span>
          </div>
          <Progress value={percentage} className="h-2" data-testid="progress-bar" />
        </div>
      </div>
    </div>
  );
}
