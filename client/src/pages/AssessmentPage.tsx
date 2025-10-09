import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ProgressBar from "@/components/ProgressBar";
import AssessmentQuestion from "@/components/AssessmentQuestion";
import ThemeToggle from "@/components/ThemeToggle";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "wouter";
import logoUrl from "@assets/Gravitas Academy logo_1759991845447.png";
import { Skeleton } from "@/components/ui/skeleton";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuestionOption {
  value: number;
  label: string;
}

interface Question {
  id: string;
  section: string;
  order: number;
  text: string;
  options: QuestionOption[];
}

interface AssessmentContent {
  opening: {
    title: string;
    introduction: string;
    time_estimate: string;
    value_proposition: string;
  };
  questions: Question[];
  sections: Array<{
    section_id: string;
    section_title: string;
    section_description: string;
  }>;
}

export default function AssessmentPage() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: assessmentContent, isLoading: questionsLoading } = useQuery<AssessmentContent>({
    queryKey: ['/api/assessment/questions'],
  });

  // Create assessment on mount
  const createAssessmentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/assessments");
      return res.json();
    },
    onSuccess: (data) => {
      setAssessmentId(data.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Submit assessment
  const submitAssessmentMutation = useMutation({
    mutationFn: async (responses: Record<string, number>) => {
      const res = await apiRequest("POST", `/api/assessments/${assessmentId}/submit`, responses);
      return res.json();
    },
    onSuccess: (data) => {
      setLocation(`/results?id=${data.id}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit assessment. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (!assessmentId) {
      createAssessmentMutation.mutate();
    }
  }, []);

  if (questionsLoading || !assessmentContent || !assessmentId) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b bg-background">
          <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Gravitas Academy" className="h-10 w-auto" />
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex-1 py-12 px-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const questions = assessmentContent.questions;

  const handleAnswerChange = (value: string) => {
    setAnswers({ ...answers, [questions[currentQuestion].id]: parseInt(value) });
  };

  const canGoNext = answers[questions[currentQuestion].id] !== undefined;
  const canGoBack = currentQuestion > 0;

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit the assessment
      submitAssessmentMutation.mutate(answers);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const currentQ = questions[currentQuestion];
  const formattedOptions = currentQ.options.map(opt => ({
    value: opt.value.toString(),
    label: opt.label
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Gravitas Academy" className="h-10 w-auto" />
          </div>
          <ThemeToggle />
        </div>
      </header>

      <ProgressBar current={currentQuestion + 1} total={questions.length} />

      <div className="flex-1 py-12 px-6">
        <AssessmentQuestion
          question={currentQ.text}
          options={formattedOptions}
          selectedValue={answers[currentQ.id]?.toString() || ''}
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
            disabled={!canGoBack || submitAssessmentMutation.isPending}
            data-testid="button-back"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canGoNext || submitAssessmentMutation.isPending}
            data-testid="button-next"
          >
            {submitAssessmentMutation.isPending ? (
              "Submitting..."
            ) : currentQuestion < questions.length - 1 ? (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
