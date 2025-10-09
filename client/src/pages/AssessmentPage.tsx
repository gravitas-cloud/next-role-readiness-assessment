import { useState } from "react";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import AssessmentQuestion from "@/components/AssessmentQuestion";
import ThemeToggle from "@/components/ThemeToggle";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";

const questions = [
  {
    id: 1,
    text: "How often do you participate in strategic planning sessions beyond your technical domain?",
    options: [
      { value: '1', label: 'Rarely or never - I focus primarily on technical execution' },
      { value: '2', label: 'Occasionally when invited to provide technical input' },
      { value: '3', label: 'Regularly - I contribute to strategic discussions' },
      { value: '4', label: 'Frequently - I lead strategic initiatives across functions' },
    ],
  },
  {
    id: 2,
    text: "How visible are you to senior leadership outside your immediate team?",
    options: [
      { value: '1', label: 'Not very visible - I mainly interact with my direct team' },
      { value: '2', label: 'Somewhat visible - Occasional exposure to senior leaders' },
      { value: '3', label: 'Moderately visible - Regular touchpoints with executives' },
      { value: '4', label: 'Highly visible - Recognized strategic contributor across organization' },
    ],
  },
];

export default function AssessmentPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: value });
  };

  const canGoNext = answers[questions[currentQuestion].id] !== undefined;
  const canGoBack = currentQuestion > 0;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      console.log('Assessment complete', answers);
      setLocation('/results');
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">Gravitas Academy</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <ProgressBar current={currentQuestion + 1} total={questions.length} />

      <div className="flex-1 py-12 px-6">
        <AssessmentQuestion
          question={questions[currentQuestion].text}
          options={questions[currentQuestion].options}
          selectedValue={answers[questions[currentQuestion].id] || ''}
          onValueChange={handleAnswerChange}
          questionNumber={currentQuestion + 1}
          totalQuestions={questions.length}
        />
      </div>

      <div className="border-t bg-background">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={!canGoBack}
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext}
            data-testid="button-next"
          >
            {currentQuestion < questions.length - 1 ? 'Next' : 'Submit'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
