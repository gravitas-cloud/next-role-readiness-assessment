import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Check, Eye } from "lucide-react";

interface AdminReportCardProps {
  userName: string;
  email: string;
  zone: string;
  score: number;
  completedAt: string;
  status: "pending" | "approved" | "sent";
  onApprove: () => void;
  onPreview: () => void;
}

export default function AdminReportCard({
  userName,
  email,
  zone,
  score,
  completedAt,
  status,
  onApprove,
  onPreview,
}: AdminReportCardProps) {
  const statusColor = 
    status === "sent" ? "default" : 
    status === "approved" ? "secondary" : 
    "outline";

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3 flex-1">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="font-semibold truncate" data-testid="text-user-name">{userName}</h3>
              <p className="text-sm text-muted-foreground truncate">{email}</p>
            </div>
          </div>
          <Badge variant={statusColor} data-testid={`badge-status-${status}`}>
            {status === "sent" ? "Sent" : status === "approved" ? "Approved" : "Pending"}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Zone</p>
            <p className="font-medium" data-testid="text-zone">{zone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Score</p>
            <p className="font-medium" data-testid="text-score">{score}/100</p>
          </div>
          <div>
            <p className="text-muted-foreground">Completed</p>
            <p className="font-medium">{completedAt}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onPreview}
            data-testid="button-preview"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          {status === "pending" && (
            <Button
              variant="default"
              className="flex-1"
              onClick={onApprove}
              data-testid="button-approve"
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
