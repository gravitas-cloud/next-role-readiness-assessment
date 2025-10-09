import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface PriorityCardProps {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
}

export default function PriorityCard({ number, title, description, icon: Icon }: PriorityCardProps) {
  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="shrink-0">
          <Badge variant="default" className="h-8 w-8 rounded-full flex items-center justify-center p-0">
            {number}
          </Badge>
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold" data-testid={`priority-${number}-title`}>{title}</h3>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
