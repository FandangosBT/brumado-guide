import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StepNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  canGoNext?: boolean;
}

const stepColors = [
  "bg-step-1",
  "bg-step-2", 
  "bg-step-3",
  "bg-step-4",
  "bg-step-5"
];

export const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onPrevious, 
  onNext,
  canGoNext = true 
}: StepNavigationProps) => {
  return (
    <nav className="step-nav" aria-label="Navegação entre etapas">
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPrevious}
          disabled={currentStep === 0}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Etapa anterior"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Voltar
        </Button>

        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`progress-dot ${
                i === currentStep 
                  ? `active ${stepColors[i]}` 
                  : i < currentStep 
                    ? "bg-muted-foreground" 
                    : "bg-muted"
              }`}
              aria-label={`Etapa ${i + 1}${i === currentStep ? ' - atual' : ''}`}
            />
          ))}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNext}
          disabled={currentStep === totalSteps - 1 || !canGoNext}
          className="text-muted-foreground hover:text-foreground"
          aria-label="Próxima etapa"
        >
          Avançar
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      <div className="text-xs text-muted-foreground mt-2 text-center">
        Etapa {currentStep + 1} de {totalSteps}
      </div>
    </nav>
  );
};