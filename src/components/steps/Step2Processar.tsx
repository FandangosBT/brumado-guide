import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, DollarSign, Users, TrendingDown } from "lucide-react";

const problemas = [
  {
    id: "retrabalho",
    icon: Clock,
    area: "Operacional",
    problema: "Retrabalho Constante",
    impacto: "+12h/mês perdidas",
    posicao: { top: "20%", left: "15%" },
    detalhes: "Reagendamentos, confirmações manuais, busca por informações dispersas",
    metricas: {
      tempoMedio: "45 min/reagendamento",
      frequencia: "18 vezes/mês",
      custoOportunidade: "R$ 2.340"
    },
    solucaoProposta: "Automação de agenda com IA preditiva"
  },
  {
    id: "receita",
    icon: DollarSign,
    area: "Financeiro",
    problema: "Receita Limitada",
    impacto: "30% abaixo do potencial",
    posicao: { top: "30%", left: "70%" },
    detalhes: "Pacientes inativos, falta de follow-up, oportunidades perdidas",
    metricas: {
      pacientesInativos: "1.247 pacientes",
      ticketMedio: "R$ 185",
      potencialMensal: "R$ 68.495"
    },
    solucaoProposta: "CRM inteligente com campanhas automatizadas"
  },
  {
    id: "equipe",
    icon: Users,
    area: "Recursos Humanos",
    problema: "Equipe Sobrecarregada",
    impacto: "40% do tempo em tarefas manuais",
    posicao: { top: "60%", left: "25%" },
    detalhes: "Secretárias fazendo controle manual, médicos perdendo tempo com burocracia",
    metricas: {
      horasSemanais: "16h em tarefas repetitivas",
      custoHora: "R$ 35",
      desperdicio: "R$ 2.240/mês"
    },
    solucaoProposta: "Workflows automatizados e dashboards unificados"
  },
  {
    id: "pacientes",
    icon: TrendingDown,
    area: "Relacionamento",
    problema: "Pacientes Desengajados",
    impacto: "50% de taxa de abandono",
    posicao: { top: "70%", left: "65%" },
    detalhes: "Sem comunicação proativa, experiência fragmentada, baixa fidelização",
    metricas: {
      nps: "3.2/10",
      retorno: "35% taxa de retorno",
      churn: "50% abandono/ano"
    },
    solucaoProposta: "Jornada do paciente digitalizada com comunicação 360°"
  },
  {
    id: "desperdicio",
    icon: AlertCircle,
    area: "Estoque",
    problema: "Desperdício de Recursos",
    impacto: "R$ 2.500/mês em perdas",
    posicao: { top: "45%", left: "45%" },
    detalhes: "Medicamentos vencidos, compras desnecessárias, falta de controle",
    metricas: {
      itensVencidos: "12% do estoque/mês",
      comprasDesnecessarias: "R$ 1.850/mês",
      faltaControle: "85% sem tracking"
    },
    solucaoProposta: "Sistema inteligente de gestão de estoque com alertas"
  }
];

interface Step2ProcessarProps {
  onNext: () => void;
}

export const Step2Processar = ({ onNext }: Step2ProcessarProps) => {
  const [activeProblema, setActiveProblema] = useState<string | null>(null);

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-2 rounded-full text-step-2 font-medium mb-6">
            🔵 ETAPA 2
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-2 to-step-3 bg-clip-text text-transparent">
            PROCESSAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Onde o sistema está perdendo força? Vamos mapear os gargalos ocultos que drenam recursos.
          </p>
        </header>

        {/* Mapa de Calor Interativo */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="relative bg-gradient-to-br from-card to-card-hover rounded-3xl p-8 border border-border min-h-[500px] overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                {Array.from({ length: 96 }, (_, i) => (
                  <div key={i} className="border border-step-2/20" />
                ))}
              </div>
            </div>

            {/* Título do Mapa */}
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-2xl font-bold text-step-2 mb-2">Mapa de Gargalos</h2>
              <p className="text-muted-foreground">Passe o cursor sobre os pontos críticos</p>
            </div>

            {/* Problemas Posicionados */}
            {problemas.map((problema, index) => {
              const Icon = problema.icon;
              const isActive = activeProblema === problema.id;
              
              return (
                <div
                  key={problema.id}
                  className="absolute animate-glow-pulse cursor-pointer group"
                  style={problema.posicao}
                  onMouseEnter={() => setActiveProblema(problema.id)}
                  onMouseLeave={() => setActiveProblema(null)}
                >
                  {/* Ponto de Alerta */}
                  <div className={`relative w-6 h-6 rounded-full bg-step-2 shadow-lg transition-all duration-300 group-hover:scale-150 ${
                    isActive ? 'animate-glow-pulse scale-150' : ''
                  }`}>
                    <div className="absolute inset-0 rounded-full bg-step-2 animate-ping opacity-75" />
                  </div>

                   {/* Rich Tooltip */}
                  {isActive && (
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-96 z-20 animate-scale-in">
                      <div className="bg-card/95 backdrop-blur-md border border-border rounded-xl p-6 shadow-elegant">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-3 bg-step-2/20 rounded-lg">
                            <Icon className="w-6 h-6 text-step-2" />
                          </div>
                          <div>
                            <div className="font-bold text-lg">{problema.problema}</div>
                            <div className="text-sm text-step-2 font-medium">{problema.area}</div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-muted-foreground mb-4">
                          {problema.detalhes}
                        </div>

                        {/* Métricas Detalhadas */}
                        <div className="space-y-3 mb-4">
                          {Object.entries(problema.metricas).map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center py-2 px-3 bg-step-2/5 rounded-lg">
                              <span className="text-xs font-medium text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </span>
                              <span className="text-sm font-semibold text-step-2">{value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Solução Proposta */}
                        <div className="bg-gradient-to-r from-step-2/10 to-step-3/10 rounded-lg p-3 border border-step-2/20">
                          <div className="text-xs font-medium text-step-2 mb-1">SOLUÇÃO TIMEOS</div>
                          <div className="text-sm font-medium text-foreground">{problema.solucaoProposta}</div>
                        </div>

                        {/* Impact Badge */}
                        <div className="mt-4 text-center">
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-step-2/20 rounded-full">
                            <AlertCircle className="w-3 h-3 text-step-2" />
                            <span className="text-xs font-medium text-step-2">{problema.impacto}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Linhas de Conexão (quando hover) */}
            {activeProblema && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none animate-fade-in">
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--step-2))" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="hsl(var(--step-2))" stopOpacity="0.1" />
                  </linearGradient>
                </defs>
                {problemas.map((problema, index) => {
                  if (problema.id === activeProblema) return null;
                  const activeItem = problemas.find(p => p.id === activeProblema);
                  if (!activeItem) return null;
                  
                  return (
                    <line
                      key={`connection-${index}`}
                      x1={activeItem.posicao.left}
                      y1={activeItem.posicao.top}
                      x2={problema.posicao.left}
                      y2={problema.posicao.top}
                      stroke="url(#connectionGradient)"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-fade-in"
                    />
                  );
                })}
              </svg>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <div className="step-card step-2 text-center animate-slide-up">
            <div className="text-3xl font-bold text-step-2 mb-2">40hrs</div>
            <div className="text-sm text-muted-foreground">Perdidas mensalmente</div>
          </div>
          <div className="step-card step-2 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="text-3xl font-bold text-step-2 mb-2">R$ 8.500</div>
            <div className="text-sm text-muted-foreground">Potencial não realizado</div>
          </div>
          <div className="step-card step-2 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="text-3xl font-bold text-step-2 mb-2">65%</div>
            <div className="text-sm text-muted-foreground">Ineficiência operacional</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up">
          <p className="text-muted-foreground mb-6">
            Esses gargalos estão limitando o crescimento da sua clínica.
          </p>
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-step-2 hover:bg-step-2/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-step-2 focus:ring-offset-2"
            aria-label="Identificar soluções para os problemas mapeados"
          >
            Vamos identificar as soluções
          </Button>
        </div>
      </div>
    </section>
  );
};