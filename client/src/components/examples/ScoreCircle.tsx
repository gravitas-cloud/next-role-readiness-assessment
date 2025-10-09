import ScoreCircle from '../ScoreCircle';

export default function ScoreCircleExample() {
  return (
    <div className="p-8 bg-background">
      <ScoreCircle
        title="Strategic Identity"
        score={28}
        maxScore={40}
        color="hsl(var(--chart-1))"
      />
    </div>
  );
}
