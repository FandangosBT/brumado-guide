import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Target, CheckCircle, ArrowRight, CheckCircle2, Circle, FileText, Filter, UserCheck } from "lucide-react";
import { getPilots, trackPilotRecommendedSeen, trackPilotSelect, trackStepComplete, trackCtaClick } from "@/lib/sdk";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";


type IconType = typeof Calendar;

const defaultPilotos: Array<{
  id: string;
  titulo: string;
  foco: string;
  icone: IconType;
  duracao?: string;
  escopo?: string[];
  metas?: string[];
  recomendado: boolean;
  posicao?: { left: string };
}> = [
  {
    id: "piloto-agenda",
    titulo: "Agenda Inteligente",
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
    recomendado: true,
    posicao: { left: "5%" }
  },
  {
    id: "piloto-crm",
    titulo: "CRM Médico",
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
    recomendado: true,
    posicao: { left: "20%" }
  },
  {
    id: "piloto-estoque",
    titulo: "Controle de Estoque",
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
    recomendado: false,
    posicao: { left: "35%" }
  },
  {
    id: "piloto-marketing",
    titulo: "Conteúdo Digital",
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
    recomendado: false,
    posicao: { left: "50%" }
  },
  {
    id: "piloto-contratos",
    titulo: "Gestão de Contratos Digitais",
    foco: "Mitigar risco judicial",
    icone: FileText,
    duracao: "20 dias",
    escopo: [
      "Digitalização de contratos",
      "Templates padronizados",
      "Assinatura eletrônica",
      "Auditoria automática"
    ],
    metas: [
      "90% redução de riscos legais",
      "50% economia em papel",
      "Processamento 10x mais rápido"
    ],
    recomendado: false,
    posicao: { left: "65%" }
  },
  {
    id: "piloto-funil",
    titulo: "Funil Digital",
    foco: "Converter clientes vindos da web",
    icone: Filter,
    duracao: "15 dias",
    escopo: [
      "Landing pages otimizadas",
      "Sistema de captação de leads",
      "Automações de marketing",
      "Análise de conversão"
    ],
    metas: [
      "200% mais conversões",
      "Lead qualification automática",
      "Redução de CAC em 40%"
    ],
    recomendado: false,
    posicao: { left: "80%" }
  },
  {
    id: "piloto-portal",
    titulo: "Área do Cliente",
    foco: "Reduzir workload pela implementação de um portal de auto serviço",
    icone: UserCheck,
    duracao: "15 dias",
    escopo: [
      "Portal do paciente",
      "Agendamento online",
      "Histórico de consultas",
      "Sistema de tickets"
    ],
    metas: [
      "60% redução no atendimento",
      "95% satisfação do paciente",
      "Aumento de retenção"
    ],
    recomendado: false,
    posicao: { left: "95%" }
  }
];

interface Step4CriarProps {
  onNext: () => void;
  sessionId?: string;
}

export const Step4Criar = ({ onNext, sessionId }: Step4CriarProps) => {
  const [selectedPiloto, setSelectedPiloto] = useState<string | null>(null);
  const [pilotos, setPilotos] = useState(defaultPilotos);
  const recommendedSeenRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    getPilots()
      .then(({ data }) => {
        if (!mounted || !Array.isArray(data)) return;
        // Mapear estrutura da API para nossa UI
        const mapped = data.map((p, idx) => ({
          id: p.id,
          titulo: p.title,
          foco: p.focus,
          icone: [Calendar, Users, CheckCircle, Target][idx % 4] as IconType,
          duracao: p.durationWeeks ? `${p.durationWeeks} semanas` : undefined,
          recomendado: p.recommended,
          posicao: { left: `${10 + idx * 25}%` }
        }));
        setPilotos(mapped);
      })
      .catch(() => { /* mantém fallback */ })
      .finally(() => { /* no-op */ });
    return () => { mounted = false; };
  }, []);

  const roadmapItems = useMemo(() => {
    // Pequena personalização com base no piloto selecionado para reforçar autoridade
    const focus = pilotos.find(p => p.id === selectedPiloto)?.titulo ?? "Agenda + CRM";
    return [
      {
        title: "Kickoff & Arquitetura Leve",
        description: "Infra mínima, acessos e templates. Conexão com software atual (API/CSV/ICS)",
        status: "completed" as const,
        window: "Semanas 1-2",
        progress: 100,
        tasks: ["Acessos e ambientes", "Templates e mensagens", "Definição de KPIs MVP"],
      },
      {
        title: focus,
        description: "Entrega do piloto com rotas críticas cobertas e medição de impacto",
        status: "in-progress" as const,
        window: "Semanas 3-4",
        progress: 60,
        tasks: ["Fluxos principais on-line", "Dashboard básico", "Treinamento da equipe"],
      },
      {
        title: "Contratos Digitais",
        description: "Templates versionados, assinatura e auditoria",
        status: "upcoming" as const,
        window: "Semanas 5-8",
        progress: 0,
        tasks: ["Templates por especialidade", "Integração de assinatura", "Logs e trilhas"],
      },
      {
        title: "Estoque / Conteúdo",
        description: "Alertas, curva ABC e calendário editorial automatizado",
        status: "upcoming" as const,
        window: "Semanas 9-12",
        progress: 0,
        tasks: ["Importação CSV", "Alertas mínimos", "Pautas e agendamento"],
      },
    ];
  }, [selectedPiloto, pilotos]);

  const getStatusColor = (status: "completed" | "in-progress" | "upcoming") => {
    switch (status) {
      case "completed": return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "in-progress": return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = (status: "completed" | "in-progress" | "upcoming") => {
    switch (status) {
      case "completed": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "in-progress": return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Circle className="w-4 h-4 text-muted-foreground" />;
    }
  };



  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6" id="criar-roadmap">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-4 rounded-full text-step-4 font-medium mb-6">
            🟠 ETAPA 4
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-4 to-step-5 bg-clip-text text-transparent">
            CRIAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Plano de 90 dias com entregas semanais, baixo risco e alto impacto.
          </p>
        </header>

        {/* Pilotos (Grid responsivo sem scroll horizontal) */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="relative">
            {/* Pilotos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pilotos.map((piloto, index) => {
                const Icon = piloto.icone;
                const isSelected = selectedPiloto === piloto.id;
                
                return (
                  <div
                    key={piloto.id}
                    className="relative flex flex-col items-center cursor-pointer group animate-fade-in"
                    style={{ 
                      animationDelay: `${index * 0.1}s`
                    }}
                    onMouseEnter={() => {
                      setSelectedPiloto(piloto.id);
                      if (sessionId && piloto.recomendado && !recommendedSeenRef.current[piloto.id]) {
                        recommendedSeenRef.current[piloto.id] = true;
                        trackPilotRecommendedSeen(sessionId, piloto.id);
                      }
                    }}
                    onMouseLeave={() => setSelectedPiloto(null)}
                    onClick={() => {
                      setSelectedPiloto(piloto.id);
                      if (sessionId) trackPilotSelect(sessionId, piloto.id);
                    }}
                  >
                    {/* Indicador */}
                    <div className={`w-6 h-6 rounded-full border-4 border-step-4 bg-background transition-transform duration-base ease-q7 group-hover:scale-110 ${
                      piloto.recomendado ? 'motion-safe:animate-glow-pulse' : ''
                    } ${isSelected ? 'scale-110 bg-step-4' : ''}`} />
                    
                    {/* Badge Recomendado */}
                    {piloto.recomendado && (
                      <Badge className="absolute -top-8 bg-step-4 text-primary-foreground text-xs px-2 py-1">
                        Recomendado
                      </Badge>
                    )}

                    {/* Card do Piloto */}
                    <div className={`mt-4 w-full step-card step-4 transition-transform duration-base ease-q7 ${
                      isSelected ? 'scale-[1.01] shadow-elegant' : ''
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-step-4/20 rounded-xl">
                          <Icon className="w-6 h-6 text-step-4" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-base leading-tight truncate" title={piloto.titulo}>{piloto.titulo}</h3>
                          <p className="text-xs text-step-4 truncate" title={piloto.foco}>{piloto.foco}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* Prazo de Entrega */}
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Prazo: {piloto.duracao ?? '—'}</span>
                        </div>

                        {/* Escopo (visível no hover/seleção) */}
                        {isSelected && piloto.escopo?.length ? (
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

                            {piloto.metas?.length ? (
                              <>
                                <h4 className="font-medium text-step-4 mb-2 mt-4">Metas:</h4>
                                <ul className="space-y-1">
                                  {piloto.metas.map((meta, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                      <Target className="w-3 h-3 text-step-4" />
                                      {meta}
                                    </li>
                                  ))}
                                </ul>
                              </>
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Roadmap de 90 dias */}
        <div className="max-w-5xl mx-auto mb-12">
          {roadmapItems.map((item, idx) => (
            <Card key={idx} className="mb-6 hover:shadow-elegant transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(item.status)}
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="secondary" className={getStatusColor(item.status)}>
                      {item.status === 'completed' ? 'Concluído' : item.status === 'in-progress' ? 'Em andamento' : 'Próximo'}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{item.window}</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <Progress value={item.progress} className="h-2" />
                  <span className="text-xs text-muted-foreground w-10 text-right">{item.progress}%</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {item.tasks.map((t) => (
                    <div key={t} className="text-sm text-muted-foreground flex items-center gap-2">
                      <ArrowRight className="w-4 h-4" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo da Estratégia */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="step-card step-4 text-center animate-slide-up">
            <h3 className="text-xl font-bold mb-4">Estratégia Recomendada</h3>
            <p className="text-muted-foreground mb-6">
              Começar com os pilotos de <strong>Agenda</strong> e <strong>CRM</strong> oferece o maior retorno 
              sobre investimento e impacto imediato na operação.
            </p>
            <div className="flex justify-center">
              <div className="p-6 bg-step-4/10 rounded-lg">
                <div className="text-3xl font-bold text-step-4 mb-2">75 dias</div>
                <div className="text-base text-muted-foreground">Previsão de entrega</div>
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="text-center animate-slide-up flex flex-col items-center gap-3">

          <Button 
            onClick={() => { if (sessionId) { trackStepComplete(sessionId, "Criar", { selectedPilot: selectedPiloto }); } onNext(); }}
            size="lg"
            className="bg-step-4 hover:bg-step-4/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect transition-transform duration-base ease-q7"
          >
            Ver o futuro completo
          </Button>
        </div>
      </div>
    </section>
  );
};