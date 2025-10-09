import PriorityCard from '../PriorityCard';
import { Users } from 'lucide-react';

export default function PriorityCardExample() {
  return (
    <div className="p-8 bg-background">
      <PriorityCard
        number={1}
        title="Build Executive Presence"
        description="Develop your communication style and decision-making visibility to establish yourself as a strategic leader in the organization."
        icon={Users}
      />
    </div>
  );
}
