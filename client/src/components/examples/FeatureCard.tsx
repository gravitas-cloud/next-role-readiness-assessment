import FeatureCard from '../FeatureCard';
import { Target } from 'lucide-react';

export default function FeatureCardExample() {
  return (
    <div className="p-8">
      <FeatureCard 
        icon={Target}
        title="Identify Strategic Gaps"
        description="Discover exactly where you need to focus your development efforts to become C-suite ready."
      />
    </div>
  );
}
