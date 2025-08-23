import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Target, CheckCircle } from "lucide-react";

const pilotos = [
  {
    id: "piloto-agenda",
    titulo: "Piloto Agenda Inteligente",
    foco: "Eliminar conflitos de agendamento",
    icone: Calendar,
    duracao: "30 dias",
    escopo: [
      "Implementação do sistema de agenda",
      "Treinamento da equipe",
      "Integração WhatsApp",
      "Monitoramento de resultados"
    ],
    metas: [
      "95% redução de conflitos",
      "80% automação de confirmações",
      "15 horas/mês economizadas"
    ],
    investimento: "R$ 2.500",
    recomendado: true,
    posicao: { left: "10%" }
  },
  {
    id: "piloto-crm",
    titulo: "Piloto CRM Médico",
    foco: "Reativar pacientes inativos",
    icone: Users,
    duracao: "45 dias",
    escopo: [
      "Setup do CRM especializado",
      "Segmentação de pacientes",
      "Campanhas de reativação",
      "Follow-up automatizado"
    ],
    metas: [
      "40% reativação de inativos",
      "25% aumento em consultas",
      "Melhoria na satisfação"
    ],
    investimento: "R$ 3.500",
    recomendado: true,
    posicao: { left: "35%" }
  },
  {
    id: "piloto-estoque",
    titulo: "Piloto Controle de Estoque",
    foco: "Eliminar perdas por vencimento",
    icone: CheckCircle,
    duracao: "20 dias",
    escopo: [
      "Sistema de controle básico",
      "Alertas de vencimento",
      "Relatórios de consumo",
      "Otimização de compras"
    ],
    metas: [
      "Zero produtos vencidos",
      "30% redução de desperdício",
      "R$ 2.000/mês economizados"
    ],
    investimento: "R$ 1.800",
    recomendado: false,
    posicao: { left: "60%" }
  },
  {
    id: "piloto-marketing",
    titulo: "Piloto Conteúdo Digital",
    foco: "Fortalecer presença digital",
    icone: Target,
    duracao: "60 dias",
    escopo: [
      "Criação de conteúdo educativo",
      "Automatização de posts",
      "Campanhas de engajamento",
      "Análise de performance"
    ],
    metas: [
      "300% mais engagement",
      "50% aumento em leads",
      "Fortalecimento da marca"
    ],
    investimento: "R$ 4.200",
    recomendado: false,
    posicao: { left: "85%" }
  }
];

interface Step4CriarProps {
  onNext: () => void;
}

export const Step4Criar = ({ onNext }: Step4CriarProps) => {
  const [selectedPiloto, setSelectedPiloto] = useState<string | null>(null);

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-4 rounded-full text-step-4 font-medium mb-6">
            🟠 ETAPA 4
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-4 to-step-5 bg-clip-text text-transparent">
            CRIAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Como vamos começar? Apresentamos pilotos acessíveis com metas claras e prazos definidos.
          </p>
        </header>

        {/* Timeline Horizontal */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="relative">
            {/* Linha Principal */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-step-4 to-step-5 transform -translate-y-1/2" />
            
            {/* Pilotos */}
            <div className="relative flex justify-between items-center min-h-[400px]">
              {pilotos.map((piloto, index) => {
                const Icon = piloto.icone;
                const isSelected = selectedPiloto === piloto.id;
                
                return (
                  <div
                    key={piloto.id}
                    className="relative flex flex-col items-center cursor-pointer group animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      left: piloto.posicao.left
                    }}
                    onMouseEnter={() => setSelectedPiloto(piloto.id)}
                    onMouseLeave={() => setSelectedPiloto(null)}
                  >
                    {/* Ponto na Timeline */}
                    <div className={`w-6 h-6 rounded-full border-4 border-step-4 bg-background transition-all duration-300 group-hover:scale-125 ${
                      piloto.recomendado ? 'animate-glow-pulse' : ''
                    } ${isSelected ? 'scale-125 bg-step-4' : ''}`} />
                    
                    {/* Badge Recomendado */}
                    {piloto.recomendado && (
                      <Badge className="absolute -top-8 bg-step-4 text-primary-foreground text-xs px-2 py-1">
                        Recomendado
                      </Badge>
                    )}

                    {/* Card do Piloto */}
                    <div className={`mt-8 w-80 step-card step-4 transition-all duration-300 ${
                      isSelected ? 'scale-105 shadow-elegant' : ''
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-step-4/20 rounded-xl">
                          <Icon className="w-6 h-6 text-step-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{piloto.titulo}</h3>
                          <p className="text-sm text-step-4">{piloto.foco}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Duração e Investimento */}
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{piloto.duracao}</span>
                          </div>
                          <div className="font-bold text-step-4">
                            {piloto.investimento}
                          </div>
                        </div>

                        {/* Escopo (visível apenas no hover) */}
                        {isSelected && (
                          <div className="animate-fade-in">
                            <h4 className="font-medium text-step-4 mb-2">Escopo:</h4>
                            <ul className="space-y-1">
                              {piloto.escopo.map((item, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-step-4" />
                                  {item}
                                </li>
                              ))}
                            </ul>

                            <h4 className="font-medium text-step-4 mb-2 mt-4">Metas:</h4>
                            <ul className="space-y-1">
                              {piloto.metas.map((meta, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                  <Target className="w-3 h-3 text-step-4" />
                                  {meta}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumo da Estratégia */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="step-card step-4 text-center animate-slide-up">
            <h3 className="text-xl font-bold mb-4">Estratégia Recomendada</h3>
            <p className="text-muted-foreground mb-6">
              Começar com os pilotos de <strong>Agenda</strong> e <strong>CRM</strong> oferece o maior retorno 
              sobre investimento e impacto imediato na operação.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-step-4/10 rounded-lg">
                <div className="text-2xl font-bold text-step-4 mb-1">75 dias</div>
                <div className="text-sm text-muted-foreground">Duração total</div>
              </div>
              <div className="p-4 bg-step-4/10 rounded-lg">
                <div className="text-2xl font-bold text-step-4 mb-1">R$ 6.000</div>
                <div className="text-sm text-muted-foreground">Investimento inicial</div>
              </div>
              <div className="p-4 bg-step-4/10 rounded-lg">
                <div className="text-2xl font-bold text-step-4 mb-1">R$ 12.000</div>
                <div className="text-sm text-muted-foreground">Retorno esperado/mês</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up">
          <p className="text-muted-foreground mb-6">
            Pilotos com ROI comprovado e baixo risco. Vamos ver o futuro integrado?
          </p>
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-step-4 hover:bg-step-4/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect"
          >
            Ver o futuro completo
          </Button>
        </div>
      </div>
    </section>
  );
};