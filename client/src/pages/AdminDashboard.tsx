import { useQuery, useMutation } from "@tanstack/react-query";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, CheckCircle, FileText, Mail } from "lucide-react";
import { Assessment } from "@shared/schema";

interface AssessmentWithUser extends Assessment {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function AdminDashboard() {
  const { admin, isAuthenticated, logout } = useAdminAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  if (!isAuthenticated) {
    setLocation("/admin/login");
    return null;
  }

  const { data: pendingAssessments = [], isLoading } = useQuery<AssessmentWithUser[]>({
    queryKey: ["/api/admin/assessments/pending"],
  });

  const approveMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      const res = await apiRequest("POST", `/api/admin/assessments/${assessmentId}/approve`);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/assessments/pending"] });
      toast({
        title: "Assessment approved",
        description: data.subscriberId 
          ? "Report approved and synced to MailerLite successfully"
          : "Report approved but MailerLite sync failed",
        variant: data.subscriberId ? "default" : "destructive",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Approval failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    await logout.mutateAsync();
    setLocation("/admin/login");
  };

  const getZoneBadgeVariant = (zone: string | null) => {
    switch (zone) {
      case "ZONE_1":
        return "destructive";
      case "ZONE_2":
        return "secondary";
      case "ZONE_3":
        return "default";
      case "ZONE_4":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Logged in as {admin?.email}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            data-testid="button-admin-logout"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Pending Report Approvals</CardTitle>
            <CardDescription>
              Review and approve assessment reports before sending to users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center py-8 text-muted-foreground">Loading...</p>
            ) : pendingAssessments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No pending approvals
              </p>
            ) : (
              <div className="space-y-4">
                {pendingAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="border rounded-lg p-4 hover-elevate"
                    data-testid={`assessment-${assessment.id}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold" data-testid={`text-user-name-${assessment.id}`}>
                            {assessment.user?.name || "Unknown User"}
                          </h3>
                          <Badge variant={getZoneBadgeVariant(assessment.zone)}>
                            {assessment.zone?.replace("_", " ") || "N/A"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground" data-testid={`text-user-email-${assessment.id}`}>
                          {assessment.user?.email || "No email"}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            Score: <strong>{assessment.totalScore}/60</strong>
                          </span>
                          <span className="text-muted-foreground">
                            Priority 1: <strong>{assessment.priority1}</strong>
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Completed: {assessment.completedAt ? new Date(assessment.completedAt).toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {assessment.pdfUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            data-testid={`button-preview-pdf-${assessment.id}`}
                          >
                            <a href={assessment.pdfUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4 mr-2" />
                              Preview PDF
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(assessment.id)}
                          disabled={approveMutation.isPending || !assessment.reportGenerated}
                          data-testid={`button-approve-${assessment.id}`}
                        >
                          {approveMutation.isPending ? (
                            "Approving..."
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve & Send
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Card */}
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Approvals
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingAssessments.length}</div>
              <p className="text-xs text-muted-foreground">
                Waiting for approval
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
