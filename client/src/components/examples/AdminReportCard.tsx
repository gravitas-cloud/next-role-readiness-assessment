import AdminReportCard from '../AdminReportCard';

export default function AdminReportCardExample() {
  return (
    <div className="p-8 bg-background max-w-md">
      <AdminReportCard
        userName="Rajesh Kumar"
        email="rajesh.kumar@techcorp.in"
        zone="ZONE 3"
        score={72}
        completedAt="2 hours ago"
        status="pending"
        onApprove={() => console.log('Approved')}
        onPreview={() => console.log('Preview')}
      />
    </div>
  );
}
