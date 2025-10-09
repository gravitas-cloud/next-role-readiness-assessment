import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-8 hover-elevate">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
