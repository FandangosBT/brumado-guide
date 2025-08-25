import { useState, useEffect } from "react";
import { StepNavigation } from "@/components/StepNavigation";
import { Step1Escutar } from "@/components/steps/Step1Escutar";
import { Step2Processar } from "@/components/steps/Step2Processar";
import { Step3Identificar } from "@/components/steps/Step3Identificar";
import { Step4Criar } from "@/components/steps/Step4Criar";
import { Step5Otimizar } from "@/components/steps/Step5Otimizar";
import { ROICalculator } from "@/components/ROICalculator";
import { MeetingScheduler } from "@/components/MeetingScheduler";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MessageSquare, Phone } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeJourney = () => {
    setIsComplete(true);
  };

  // Smooth scroll behavior
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

  if (isComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
              <MessageSquare className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-hero bg-clip-text text-transparent">
              Jornada Concluída!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Agora você viu o potencial completo de transformação da sua clínica. 
              Vamos conversar sobre como implementar essa visão?
            </p>
          </div>

          <div className="space-y-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold px-8 py-4 text-lg glow-effect transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary focus:ring-offset-2"
              onClick={() => window.open('tel:+5511999999999', '_blank')}
              aria-label="Ligar para agendar conversa estratégica"
            >
              <Phone className="w-5 h-5 mr-2" />
              Agendar Conversa (11) 99999-9999
            </Button>
            <div className="text-sm text-muted-foreground">
              Ou envie um WhatsApp para começarmos a transformação
            </div>
            <Button
              variant="outline"
              onClick={() => setIsComplete(false)}
              className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label="Revisar jornada completa novamente"
            >
              Revisar a Jornada
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background relative">
      {/* Navigation */}
      <StepNavigation
        currentStep={currentStep}
        totalSteps={totalSteps}
        onPrevious={previousStep}
        onNext={nextStep}
        canGoNext={true}
      />

      {/* Theme Toggle */}
      <div className="fixed top-8 right-8 z-40 animate-fade-in">
        <ThemeToggle />
      </div>

      {/* Floating Contact */}
      <div className="fixed bottom-8 right-8 z-40 animate-fade-in">
        <Button
          size="sm"
          className="bg-gradient-hero hover:opacity-90 text-primary-foreground shadow-elegant rounded-full px-4 py-2 transition-all duration-300 hover:scale-105"
          onClick={() => window.open('https://wa.me/5511999999999?text=Olá! Vi a proposta consultiva e gostaria de conversar sobre transformação digital para minha clínica.', '_blank')}
          aria-label="Entrar em contato via WhatsApp"
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </div>

      {/* Steps */}
      {currentStep === 0 && <Step1Escutar onNext={nextStep} />}
      {currentStep === 1 && <Step2Processar onNext={nextStep} />}
      {currentStep === 2 && <Step3Identificar onNext={nextStep} />}
      {currentStep === 3 && <Step4Criar onNext={nextStep} />}
      {currentStep === 4 && <Step5Otimizar onComplete={completeJourney} />}
      
      {/* Interactive Tools */}
      <section id="roi-calculator" className="py-20 bg-muted/10">
        <div className="container mx-auto px-6">
          <ROICalculator />
        </div>
      </section>
      
      <section id="meeting-scheduler" className="py-20">
        <div className="container mx-auto px-6">
          <MeetingScheduler />
        </div>
      </section>
    </main>
  );
};

export default Index;