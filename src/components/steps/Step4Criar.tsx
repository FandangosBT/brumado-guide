import { useEffect, useRef, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Clock, Target, CheckCircle, ArrowRight, CheckCircle2, Circle, FileText, Filter, UserCheck, DollarSign } from "lucide-react";
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
  cronograma?: { title: string; window: string }[];
  recomendado: boolean;
  posicao?: { left: string };
}> = [
  {
    id: "piloto-financeiro",
    titulo: "Financeiro Vivo",
    foco: "Centralizar AP/AR e visão de caixa unificada (hospedagem + eventos)",
    icone: DollarSign as unknown as IconType,
    duracao: "20 dias",
    escopo: [
      "Centros de custo e DRE simplificado",
      "Integração de receitas (OTAs/site/eventos)",
      "Alertas de vencimento e conciliação básica"
    ],
    metas: [
      "Fechamento D+2",
      "Redução de inadimplência",
      "Acurácia ≥ 99%"
    ],
    cronograma: [
      { title: "Acessos & centros de custo", window: "Dias 1–3" },
      { title: "Integração receitas/AP-AR", window: "Dias 4–10" },
      { title: "Conciliação & alertas", window: "Dias 11–15" },
      { title: "DRE + treinamento", window: "Dias 16–20" }
    ],
    recomendado: true,
    posicao: { left: "5%" }
  },
  {
    id: "piloto-agenda",
    titulo: "Agenda Integrada",
    foco: "Disponibilidade única e sem conflitos entre hospedagem e eventos",
    icone: Calendar,
    duracao: "20 dias",
    escopo: [
      "Sincronização com OTAs (Booking/Airbnb)",
      "Bloqueios por eventos e manutenção",
      "Checagem de conflito e sugestões"
    ],
    metas: [
      "Overbooking = 0",
      "Confiabilidade ≥ 99%",
      "SLA confirmação < 15 min"
    ],
    cronograma: [
      { title: "Sincronização OTAs", window: "Dias 1–5" },
      { title: "Bloqueios & regras", window: "Dias 6–10" },
      { title: "Checagem de conflitos & testes", window: "Dias 11–15" },
      { title: "Go-live & monitoramento", window: "Dias 16–20" }
    ],
    recomendado: true,
    posicao: { left: "20%" }
  },
  {
    id: "piloto-crm",
    titulo: "CRM Vivo",
    foco: "Qualificação de leads e follow-up multi-canal",
    icone: Users,
    duracao: "20 dias",
    escopo: [
      "Pipelines por nicho (casamentos, corporativo, hospedagem)",
      "Integração WhatsApp/E-mail",
      "Tarefas e lembretes automáticos"
    ],
    metas: [
      "↑ taxa de resposta",
      "↓ tempo de ciclo",
      "↑ taxa de propostas enviadas"
    ],
    cronograma: [
      { title: "Pipelines por nicho", window: "Dias 1–5" },
      { title: "Integração WA/E-mail", window: "Dias 6–10" },
      { title: "Playbooks & tarefas", window: "Dias 11–15" },
      { title: "Painéis & treinamento", window: "Dias 16–20" }
    ],
    recomendado: true,
    posicao: { left: "35%" }
  },
  {
    id: "piloto-contratos",
    titulo: "Orçamentos & Contratos Digitais",
    foco: "Templates por nicho e assinatura eletrônica com auditoria",
    icone: FileText,
    duracao: "25 dias",
    escopo: [
      "Geração de orçamento (PDF/HTML)",
      "Assinatura eletrônica (Clicksign/DocuSign)",
      "Trilhas de auditoria (hash/IP/versão)"
    ],
    metas: [
      "% assinados ≤ 7 dias",
      "Redução de retrabalho",
      "Rastreabilidade total"
    ],
    cronograma: [
      { title: "Templates por nicho", window: "Dias 1–5" },
      { title: "Geração + assinatura", window: "Dias 6–12" },
      { title: "Auditoria & webhooks", window: "Dias 13–18" },
      { title: "Go-live & métricas", window: "Dias 19–25" }
    ],
    recomendado: false,
    posicao: { left: "50%" }
  },
  {
    id: "piloto-estoque",
    titulo: "Estoque Inteligente",
    foco: "Evitar rupturas e desperdícios com mínimos e alertas",
    icone: CheckCircle,
    duracao: "35 dias",
    escopo: [
      "Cadastro + curva ABC",
      "Mínimos por item e alertas",
      "Movimentação simples"
    ],
    metas: [
      "Zero ruptura em itens A",
      "Alertas ≥ 48h",
      "Giro otimizado"
    ],
    cronograma: [
      { title: "Cadastro & curva ABC", window: "Dias 1–7" },
      { title: "Mínimos & alertas", window: "Dias 8–15" },
      { title: "Movimentação & relatórios", window: "Dias 16–25" },
      { title: "Treinamento & otimização", window: "Dias 26–35" }
    ],
    recomendado: false,
    posicao: { left: "65%" }
  },
  {
    id: "piloto-paginas",
    titulo: "Página Institucional + Landing Pages Segmentadas",
    foco: "Captação por nicho e presença digital sólida",
    icone: Target,
    duracao: "15 dias",
    escopo: [
      "Site institucional leve",
      "LPs por nicho (casamentos, corporativo, hospedagem)",
      "Integração com formulários e CRM"
    ],
    metas: [
      "↑ tráfego orgânico",
      "↑ leads qualificados",
      "Base para automações"
    ],
    cronograma: [
      { title: "Site institucional", window: "Dias 1–5" },
      { title: "LPs + formulários", window: "Dias 6–10" },
      { title: "Integração CRM & SEO", window: "Dias 11–15" }
    ],
    recomendado: false,
    posicao: { left: "80%" }
  },
  {
    id: "piloto-funil",
    titulo: "Funil Digital",
    foco: "Converter leads em propostas e contratos",
    icone: Filter,
    duracao: "15 dias",
    escopo: [
      "Qualificação automática",
      "Integração LP → CRM",
      "Medição de conversão"
    ],
    metas: [
      "↑ conversão LP → lead",
      "↓ tempo de resposta",
      "↑ propostas enviadas"
    ],
    cronograma: [
      { title: "Qualificação & formulários", window: "Dias 1–5" },
      { title: "Integração LP → CRM & automações", window: "Dias 6–10" },
      { title: "Medição & ajustes", window: "Dias 11–15" }
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
    // Auxiliar para extrair tarefas do cronograma dos pilotos definidos no header
    const getTasks = (pilotId: string, max: number = 4) => {
      const cronograma = defaultPilotos.find((p) => p.id === pilotId)?.cronograma;
      return (cronograma?.map((c) => c.title).slice(0, max)) ?? [];
    };

    return [
      {
        title: "Kickoff & Arquitetura Leve",
        description:
          "Infra mínima, acessos e templates. Conexão com software atual (API/CSV/ICS)",
        status: "completed" as const,
        window: "Semanas 1-2",
        progress: 100,
        tasks: [
          "Acessos e ambientes",
          "Templates e mensagens",
          "Definição de KPIs MVP",
        ],
      },
      {
        title: "Financeiro Vivo",
        description: "Centralização AP/AR, conciliação e DRE simplificado",
        status: "in-progress" as const,
        window: "Semanas 3-5",
        progress: 60,
        tasks: getTasks("piloto-financeiro"),
      },
      {
        title: "Agenda Integrada",
        description:
          "Calendário único: OTAs, bloqueios por eventos e checagem de conflitos",
        status: "upcoming" as const,
        window: "Semanas 6-8",
        progress: 0,
        tasks: getTasks("piloto-agenda"),
      },
      {
        title: "CRM Vivo",
        description: "Pipelines por nicho, integrações e playbooks com tarefas",
        status: "upcoming" as const,
        window: "Semanas 9-10",
        progress: 0,
        tasks: getTasks("piloto-crm"),
      },
      {
        title: "Orçamentos & Contratos Digitais",
        description: "Templates por nicho, assinatura eletrônica e auditoria",
        status: "upcoming" as const,
        window: "Fase 2 (90+ dias)",
        progress: 0,
        tasks: getTasks("piloto-contratos"),
      },
      {
        title: "Estoque Inteligente",
        description: "Cadastro/ABC, mínimos, alertas e movimentação simplificada",
        status: "upcoming" as const,
        window: "Fase 2 (90+ dias)",
        progress: 0,
        tasks: getTasks("piloto-estoque"),
      },
      {
        title: "Página Institucional + Landing Pages Segmentadas",
        description: "Presença digital sólida e captação por nicho integrada ao CRM",
        status: "upcoming" as const,
        window: "Fase 2 (90+ dias)",
        progress: 0,
        tasks: getTasks("piloto-paginas"),
      },
      {
        title: "Funil Digital",
        description: "Qualificação automática, integração LP → CRM e medição de conversão",
        status: "upcoming" as const,
        window: "Fase 2 (90+ dias)",
        progress: 0,
        tasks: getTasks("piloto-funil"),
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

                            {piloto.cronograma?.length ? (
                              <>
                                <h4 className="font-medium text-step-4 mb-2 mt-4">Plano de ação (cronograma):</h4>
                                <ul className="space-y-1">
                                  {piloto.cronograma.map((c, i) => (
                                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                                      <Clock className="w-3 h-3 text-step-4" />
                                      <span className="font-medium text-foreground">{c.window}</span>
                                      <span>— {c.title}</span>
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
              Começar com os pilotos de <strong>Financeiro Vivo</strong>, <strong>Agenda Integrada</strong> e <strong>CRM Vivo</strong> oferece o maior retorno
              sobre investimento e impacto imediato na operação.
            </p>
            <div className="flex justify-center">
              <div className="p-6 bg-step-4/10 rounded-lg">
                <div className="text-3xl font-bold text-step-4 mb-2">60 dias</div>
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