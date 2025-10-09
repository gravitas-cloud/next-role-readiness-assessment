import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminReportCard from "@/components/AdminReportCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Award, Search, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const mockReports = [
  {
    id: '1',
    userName: 'Rajesh Kumar',
    email: 'rajesh.kumar@techcorp.in',
    zone: 'ZONE 3',
    score: 72,
    completedAt: '2 hours ago',
    status: 'pending' as const,
  },
  {
    id: '2',
    userName: 'Priya Sharma',
    email: 'priya.sharma@innovate.in',
    zone: 'ZONE 2',
    score: 58,
    completedAt: '5 hours ago',
    status: 'approved' as const,
  },
  {
    id: '3',
    userName: 'Amit Patel',
    email: 'amit.patel@solutions.in',
    zone: 'ZONE 4',
    score: 85,
    completedAt: '1 day ago',
    status: 'sent' as const,
  },
];

export default function AdminPage() {
  const [reports, setReports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<typeof mockReports[0] | null>(null);

  const handleApprove = (id: string) => {
    setReports(reports.map(r => 
      r.id === id ? { ...r, status: 'approved' as const } : r
    ));
    console.log('Approved report:', id);
  };

  const handlePreview = (report: typeof mockReports[0]) => {
    setSelectedReport(report);
    setPreviewOpen(true);
  };

  const filteredReports = reports.filter(r => 
    r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => console.log('Logout')}
              data-testid="button-logout"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Assessment Reports</h1>
            <p className="text-muted-foreground">Review and approve reports for email delivery</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              className="pl-9 w-full sm:w-80"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
        </div>

        <div className="grid gap-4">
          {filteredReports.map((report) => (
            <AdminReportCard
              key={report.id}
              userName={report.userName}
              email={report.email}
              zone={report.zone}
              score={report.score}
              completedAt={report.completedAt}
              status={report.status}
              onApprove={() => handleApprove(report.id)}
              onPreview={() => handlePreview(report)}
            />
          ))}
        </div>

        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No reports found matching your search.</p>
          </div>
        )}
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              {selectedReport?.userName} - {selectedReport?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 rounded-lg p-8 space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold">Strategic Readiness Report</h3>
              <p className="text-muted-foreground">Zone: {selectedReport?.zone}</p>
              <p className="text-lg">Total Score: {selectedReport?.score}/100</p>
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground text-center">
                Full PDF preview would be displayed here
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
