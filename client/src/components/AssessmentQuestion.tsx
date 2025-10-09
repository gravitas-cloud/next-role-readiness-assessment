import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface AssessmentQuestionProps {
  question: string;
  options: { value: string; label: string }[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function AssessmentQuestion({
  question,
  options,
  selectedValue,
  onValueChange,
  questionNumber,
  totalQuestions,
}: AssessmentQuestionProps) {
  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Question {questionNumber} of {totalQuestions}</span>
            <span>{Math.round((questionNumber / totalQuestions) * 100)}% Complete</span>
          </div>
          <h2 className="text-2xl font-medium">{question}</h2>
        </div>

        <RadioGroup value={selectedValue} onValueChange={onValueChange}>
          <div className="space-y-3">
            {options.map((option) => (
              <div key={option.value} className="relative">
                <Label
                  htmlFor={option.value}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all hover-elevate ${
                    selectedValue === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                  data-testid={`option-${option.value}`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="shrink-0" />
                  <span className="flex-1">{option.label}</span>
                  {selectedValue === option.value && (
                    <Check className="h-5 w-5 text-primary shrink-0" />
                  )}
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="h-4 w-4 text-chart-3" />
          <span>Your answer is automatically saved</span>
        </div>
      </div>
    </Card>
  );
}
