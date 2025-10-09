import ZoneCard from '../ZoneCard';

export default function ZoneCardExample() {
  return (
    <div className="p-8 bg-background">
      <ZoneCard
        zone="ZONE 3"
        title="The Strategic Contributor"
        description="You're developing strategic thinking but need to build more visibility and political capital to reach the C-suite level."
        color="secondary"
      />
    </div>
  );
}
