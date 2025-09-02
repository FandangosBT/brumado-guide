import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, CalendarDays, FileSignature, Package, MessageSquare, Megaphone, AlertTriangle, Link2 } from "lucide-react";
import { generateScreenshotPDF } from "@/utils/pdf-generator";
import { trackHover, trackClick, trackStepComplete, trackCtaClick } from "@/lib/sdk";

interface Step2ProcessarProps {
  onNext: () => void;
  sessionId?: string;
}

const META = {
  lead: "Quinta de Brumado (Hospedagem + Eventos)",
  data: "Setembro/2025",
  consultoria: "Q7 Ops",
};

type CategoryId = "financeiro" | "agenda" | "orcamentos" | "estoque" | "captacao" | "comunicacao";

const CATEGORIES: Array<{
  id: CategoryId;
  icon: typeof CalendarDays;
  title: string;
  bullets: string[];
  impacto: string;
  impactoScore: number; // 0-100
  esforcoScore: number; // 0-100 (quanto menor, melhor)
}> = [
  {
    id: "financeiro",
    icon: FileText,
    title: "Financeiro & Gestão de Custos",
    bullets: [
      "Controle realizado em Excel, paralelo ao sistema atual.",
      "Relatórios financeiros confusos, sem visão consolidada.",
      "Dificuldade em prever fluxo de caixa e rentabilidade de eventos.",
      "Alto risco de erro nos cálculos (orçamentos refeitos várias vezes).",
    ],
    impacto:
      "Perda de clareza sobre custos reais, risco de decisões equivocadas e insegurança nos investimentos.",
    impactoScore: 95,
    esforcoScore: 50,
  },
  {
    id: "agenda",
    icon: CalendarDays,
    title: "Agenda & Disponibilidade",
    bullets: [
      "Agenda da hospedagem controlada manualmente no Google Calendar.",
      "Plataformas externas (Booking/OTAs) não integradas.",
      "Risco de overbooking entre reservas de hospedagem e eventos.",
      "Ausência de um calendário unificado acessível a todos os administradores.",
    ],
    impacto:
      "Perda de credibilidade com clientes, retrabalho e desgaste operacional.",
    impactoScore: 85,
    esforcoScore: 45,
  },
  {
    id: "orcamentos",
    icon: FileSignature,
    title: "Orçamentos & Propostas",
    bullets: [
      "Orçamentos personalizados feitos manualmente, sem padronização.",
      "Alto tempo gasto para calcular valores → risco de inconsistência.",
      "Follow-up improvisado, sem CRM ou histórico organizado.",
    ],
    impacto:
      "Lentidão no fechamento de contratos, perda de oportunidades e desgaste dos administradores.",
    impactoScore: 80,
    esforcoScore: 60,
  },
  {
    id: "estoque",
    icon: Package,
    title: "Estoque & Insumos",
    bullets: [
      "Controle manual em planilhas/anotações.",
      "Sem alertas automáticos de validade ou reposição.",
      "Compras emergenciais frequentes, aumentando custos.",
    ],
    impacto:
      "Interrupções de operação, desperdício financeiro e falta de previsibilidade em insumos críticos.",
    impactoScore: 70,
    esforcoScore: 55,
  },
  {
    id: "captacao",
    icon: Megaphone,
    title: "Captação de Leads & Marketing",
    bullets: [
      "Site atual funciona apenas como “outdoor digital”.",
      "Leads chegam pelo WhatsApp sem qualificação prévia.",
      "Grande volume de contatos manuais (ex.: 350 noivas para ligar).",
      "Falta de segmentação (casamento, hospedagem, eventos corporativos).",
    ],
    impacto:
      "Perda de tempo em triagem manual, contatos esquecidos e baixa previsibilidade de conversão.",
    impactoScore: 75,
    esforcoScore: 65,
  },
  {
    id: "comunicacao",
    icon: MessageSquare,
    title: "Comunicação & Atendimento",
    bullets: [
      "Hospedagem aceita automação, mas eventos exigem personalização total.",
      "Falta de integração entre canais (site, WhatsApp, redes sociais).",
      "Administradores sobrecarregados com atendimento manual.",
    ],
    impacto:
      "Ineficiência no relacionamento com clientes, perda de escalabilidade e risco de experiências negativas.",
    impactoScore: 78,
    esforcoScore: 60,
  },
];



// Conexões entre categorias correlatas
const RELATED: Record<CategoryId, CategoryId[]> = {
  financeiro: ["agenda", "orcamentos"],
  agenda: ["orcamentos", "comunicacao", "estoque"],
  orcamentos: ["comunicacao", "captacao", "financeiro"],
  estoque: ["agenda"],
  captacao: ["comunicacao", "orcamentos"],
  comunicacao: ["agenda", "captacao", "orcamentos"],
};


export const Step2Processar = ({ onNext, sessionId }: Step2ProcessarProps) => {
  const hoveredRef = useRef<Record<string, number>>({});
  const [active, setActive] = useState<CategoryId | null>(null);

  const onCardEnter = (id: CategoryId) => {
    setActive(id);
    if (sessionId) trackHover(sessionId, "Processar", id);
    hoveredRef.current[id] = (hoveredRef.current[id] || 0) + 1;
  };

  const onCardLeave = () => setActive(null);

  const onCardClick = (id: CategoryId) => {
    if (sessionId) trackClick(sessionId, "Processar", id);
  };

  const handleGeneratePdf = () => {
    if (sessionId) {
      trackCtaClick(sessionId, "gargalos_pdf_download", { step: "Processar" });
    }
    // Criar link para download do arquivo PDF
    const link = document.createElement('a');
    link.href = '/Mapa-de-Gargalos-Invisiveis-Quinta-de-Brumado.pdf';
    link.download = 'Mapa-de-Gargalos-Invisiveis-Quinta-de-Brumado.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNext = () => {
    if (sessionId) {
      const hovered = Object.keys(hoveredRef.current);
      trackStepComplete(sessionId, "Processar", { hovered });
    }
    onNext();
  };

  const isConnected = (id: CategoryId) => {
    if (!active) return false;
    return active === id || (RELATED[active] || []).includes(id);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-2 rounded-full text-step-2 font-medium mb-4">
            🔵 ETAPA 2
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-step-2 to-step-3 bg-clip-text text-transparent">
            PROCESSAR
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mapa de Gargalos Invisíveis — onde a operação perde eficiência sem você perceber.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            📌 Mapa de Gargalos Invisíveis – Quinta de Brumado
          </p>
        </header>

        {/* Meta + Ações */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Badge variant="secondary" className="bg-step-2/10 text-step-2">Lead: {META.lead}</Badge>
          <Badge variant="secondary" className="bg-step-2/10 text-step-2">Data: {META.data}</Badge>
          <Badge variant="secondary" className="bg-step-2/10 text-step-2">Consultoria: {META.consultoria}</Badge>
          <Button variant="outline" onClick={handleGeneratePdf} className="border-step-2 text-step-2">
            <FileText className="w-4 h-4 mr-2" /> Gerar PDF do Mapa
          </Button>
        </div>

        {/* Contexto Geral */}
        <div className="max-w-4xl mx-auto mb-6">
          <Card className="step-card step-2">
            <CardContent className="pt-6 text-muted-foreground leading-relaxed">
              A Quinta possui estrutura física diferenciada e grande potencial de crescimento em hospedagem e eventos. Porém, a operação depende de processos manuais e sistemas fragmentados. Durante a conversa, emergiram gargalos não imediatamente visíveis, mas que comprometem eficiência, previsibilidade e escala sustentável.
            </CardContent>
          </Card>
        </div>

        {/* Mapa */}
        <div id="gargalos-mapa" className="relative max-w-6xl mx-auto">
          {/* Matriz Impacto x Esforço */}
          <div className="mb-6">
            <Card className="step-card step-2">
              <CardHeader>
                <CardTitle className="text-lg">Matriz Impacto x Esforço</CardTitle>
                <CardDescription>Priorize visualmente: alto impacto e baixo esforço primeiro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-64 rounded-xl border border-border overflow-hidden bg-card/70">
                  {/* Eixos */}
                  <div className="absolute left-0 right-0 top-1/2 h-px bg-border" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-px bg-border" />
                  {/* Labels dos eixos */}
                  <div className="absolute left-2 top-2 text-[10px] text-muted-foreground">Impacto (↑ melhor)</div>
                  <div className="absolute right-2 bottom-2 text-[10px] text-muted-foreground">Esforço (→ maior)</div>
                  {/* Quadrantes */}
                  <div className="absolute left-8 top-8 text-[10px] font-medium text-step-2 z-10">Ganhos Rápidos</div>
                  <div className="absolute right-8 top-8 text-[10px] font-medium text-muted-foreground z-10">Projetos Estratégicos</div>
                  <div className="absolute left-8 bottom-8 text-[10px] font-medium text-muted-foreground z-10">Baixa Prioridade</div>
                  <div className="absolute right-8 bottom-8 text-[10px] font-medium text-muted-foreground z-10">Reavaliar</div>

                  {/* Pontos */}
                  {CATEGORIES.map((cat) => {
                    const left = `${Math.min(95, Math.max(5, cat.esforcoScore))}%`;
                    const top = `${Math.min(95, Math.max(5, 100 - cat.impactoScore))}%`;
                    const connected = isConnected(cat.id);
                    return (
                      <button
                        key={`pt-${cat.id}`}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 px-2 py-1 rounded-full border text-[10px] transition-transform duration-fast ease-q7 ${
                          connected ? "bg-step-2/20 border-step-2 text-step-2" : "bg-muted/50 border-border text-muted-foreground"
                        }`}
                        style={{ left, top }}
                        onMouseEnter={() => onCardEnter(cat.id)}
                        onMouseLeave={onCardLeave}
                        onClick={() => onCardClick(cat.id)}
                        aria-label={`Ponto da matriz: ${cat.title}`}
                      >
                        <span className={`inline-block w-2 h-2 rounded-full ${connected ? "bg-step-2" : "bg-muted-foreground/60"}`} />
                        <span className="whitespace-nowrap">{cat.title}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, index) => {
              const Icon = cat.icon;
              const connected = isConnected(cat.id);
              return (
                <Card
                  key={cat.id}
                  className={`step-card step-2 animate-scale-in cursor-pointer transition-transform duration-base ease-q7 ${
                    connected ? "ring-2 ring-step-2 shadow-elegant" : "hover:shadow-elegant"
                  } ${active && !connected ? "opacity-80" : ""}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                  onMouseEnter={() => onCardEnter(cat.id)}
                  onMouseLeave={onCardLeave}
                  onClick={() => onCardClick(cat.id)}
                  aria-label={`Gargalo: ${cat.title}`}
                  role="button"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-step-2/15 rounded-xl">
                        <Icon className="w-6 h-6 text-step-2" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{cat.title}</CardTitle>
                        <CardDescription className="text-muted-foreground">Gargalos invisíveis</CardDescription>
                      </div>
                      {connected && active !== cat.id && (
                        <div className="ml-auto inline-flex items-center gap-1 text-xs text-step-2">
                          <Link2 className="w-3 h-3" /> Relacionado a {formatTitle(active!)}
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {cat.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="w-4 h-4 text-step-2 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Régua Impacto x Esforço */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Impacto</div>
                        <Progress value={cat.impactoScore} className="h-2" />
                        <div className="text-[10px] text-muted-foreground mt-1">Alto é melhor</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-muted-foreground mb-1">Esforço</div>
                        <Progress value={cat.esforcoScore} className="h-2 bg-muted [&>div]:bg-step-2/70" />
                        <div className="text-[10px] text-muted-foreground mt-1">Baixo é melhor</div>
                      </div>
                    </div>

                    {/* Impacto resumido */}
                    <div className="p-3 rounded-lg bg-step-2/10 border border-step-2/20 mt-4">
                      <div className="text-xs font-medium text-step-2 mb-1">Impacto</div>
                      <div className="text-sm text-muted-foreground">{cat.impacto}</div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Conclusão e Oportunidades */}
        <div className="max-w-4xl mx-auto mt-8">
          <Card className="step-card step-2">
            <CardHeader>
              <CardTitle>Conclusão e Oportunidades</CardTitle>
              <CardDescription>Oportunidade de evolução modular</CardDescription>
            </CardHeader>
            <CardContent className="text-muted-foreground leading-relaxed">
              <p className="mb-4">
                A Quinta de Brumado está presa em uma rotina de retrabalho manual, duplicidade de processos e baixa previsibilidade financeira. Os gargalos invisíveis afetam diretamente a experiência dos clientes e a capacidade de crescimento sustentável.
              </p>
              <ul className="space-y-2">
                <li>• Passo inicial: OpsUnit – Financeiro Vivo + Agenda Integrada (impacto imediato, reduz risco de erro e dá clareza financeira).</li>
                <li>• Expansão natural: Orçamentos & Contratos Digitais + CRM Vivo (mais previsibilidade comercial).</li>
                <li>• Médio prazo: Estoque Inteligente e Funil Digital (eficiência operacional + captação qualificada).</li>
                <li>• Longo prazo: TimeOS (integração total, inteligência de mercado e gestão via WhatsApp).</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button
            onClick={handleNext}
            size="lg"
            className="bg-step-2 hover:bg-step-2/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect transition-transform duration-base ease-q7 hover:scale-105 focus:ring-2 focus:ring-step-2 focus:ring-offset-2"
            aria-label="Identificar soluções para os gargalos mapeados"
          >
            Vamos identificar as soluções
          </Button>
        </div>
      </div>
    </section>
  );
};

function formatTitle(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id)?.title ?? id;
}