import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ZoneCardProps {
  zone: string;
  title: string;
  description: string;
  color: "default" | "secondary" | "destructive" | "outline";
}

export default function ZoneCard({ zone, title, description, color }: ZoneCardProps) {
  return (
    <Card className="p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant={color} className="text-base px-3 py-1" data-testid={`badge-${zone}`}>
            {zone}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
}
