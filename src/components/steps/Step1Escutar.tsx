import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Clock, Users, FileText, TrendingDown, AlertTriangle } from "lucide-react";

const dores = [
  {
    id: "agenda",
    icon: Clock,
    titulo: "Agenda Desorganizada",
    resumo: "Conflitos de horários e pacientes perdidos",
    impacto: "15+ horas/mês perdidas com retrabalho",
    detalhes: "Agendamentos duplos, pacientes não avisados sobre mudanças, secretárias sobrecarregadas tentando organizar manualmente os horários."
  },
  {
    id: "documentos",
    icon: FileText,
    titulo: "Documentos Dispersos",
    resumo: "Prontuários e contratos espalhados",
    impacto: "30% do tempo perdido procurando arquivos",
    detalhes: "Contratos físicos perdidos, prontuários em diferentes sistemas, documentos importantes sem backup digital."
  },
  {
    id: "comunicacao",
    icon: Users,
    titulo: "Comunicação Fragmentada",
    resumo: "Pacientes desconectados e insatisfeitos",
    impacto: "40% de pacientes inativos",
    detalhes: "Sem follow-up pós-consulta, comunicação apenas reativa, pacientes esquecidos no sistema."
  },
  {
    id: "estoque",
    icon: TrendingDown,
    titulo: "Controle de Estoque Manual",
    resumo: "Produtos vencidos e desperdício",
    impacto: "R$ 2.000+ perdidos mensalmente",
    detalhes: "Medicamentos vencidos, falta de produtos essenciais, compras desnecessárias por falta de controle."
  },
  {
    id: "emergencias",
    icon: AlertTriangle,
    titulo: "Gestão de Emergências",
    resumo: "Falta de preparação para urgências",
    impacto: "Stress e perda de credibilidade",
    detalhes: "Sem protocolos claros, equipe despreparada, pacientes em situação crítica mal atendidos."
  }
];

interface Step1EscutarProps {
  onNext: () => void;
}

export const Step1Escutar = ({ onNext }: Step1EscutarProps) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-1 rounded-full text-step-1 font-medium mb-6">
            🟣 ETAPA 1
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-1 to-step-2 bg-clip-text text-transparent">
            ESCUTAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Validamos as dores que você sente no dia a dia. Cada problema tem um impacto real no seu negócio.
          </p>
        </header>

        {/* Accordion de Dores */}
        <div className="max-w-4xl mx-auto mb-12">
          <Accordion 
            type="multiple" 
            value={expandedItems}
            onValueChange={handleAccordionChange}
            className="space-y-4"
          >
            {dores.map((dor, index) => {
              const Icon = dor.icon;
              return (
                <AccordionItem key={dor.id} value={dor.id} className="border-none">
                  <div className={`step-card step-1 animate-fade-in`} 
                       style={{ animationDelay: `${index * 0.1}s` }}>
                    <AccordionTrigger className="flex items-center justify-between w-full text-left hover:no-underline group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-step-1/20 rounded-xl group-hover:bg-step-1/30 transition-colors">
                          <Icon className="w-6 h-6 text-step-1" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{dor.titulo}</h3>
                          <p className="text-muted-foreground">{dor.resumo}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-step-1">{dor.impacto}</div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                      <div className="pl-16">
                        <p className="text-muted-foreground leading-relaxed">
                          {dor.detalhes}
                        </p>
                        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                          <div className="text-sm font-medium text-step-1 mb-1">Impacto Mensurado:</div>
                          <div className="text-sm text-muted-foreground">{dor.impacto}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </div>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up">
          <p className="text-muted-foreground mb-6">
            Reconhece algumas dessas situações na sua clínica?
          </p>
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-step-1 hover:bg-step-1/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect"
          >
            Ok, entendi. Vamos adiante
          </Button>
        </div>
      </div>
    </section>
  );
};