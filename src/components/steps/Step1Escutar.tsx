import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, ClipboardList, Rocket, TrendingUp, CalendarDays, User, CheckCircle2, Target } from "lucide-react";
import { generateScreenshotPDF } from "@/utils/pdf-generator";
import { trackCtaClick, trackStepComplete } from "@/lib/sdk";

interface Step1EscutarProps {
  onNext: () => void;
  sessionId?: string;
}

const scannerData = {
  cliente: "Quinta de Brumado",
  data: "Setembro/2025",
  consultoria: "Q7 Ops",
  contextoGeral:
    "A Quinta de Brumado atua em duas frentes principais: hospedagem e eventos (casamentos, aniversários e corporativos), com integração entre ambas. A operação é administrada por três sócios (Felipe, Sandra e Peninha), mas sem um sistema centralizado. Hoje, a gestão é feita em Excel + WhatsApp + sistema parcial de hospedagem (OTA/Booking), o que gera dificuldade no controle financeiro consolidado, falta de integração entre hospedagem e eventos, perda de tempo na geração de orçamentos personalizados e insegurança quanto à disponibilidade (risco de overbooking). Felipe ressaltou a necessidade de um sistema próprio e flexível, que preserve a personalização do atendimento em eventos e seja capaz de integrar as operações no futuro.",
  processos: {
    financeiro: [
      "Controle feito em Excel.",
      "Sistema atual não gera relatórios claros.",
      "Dificuldade para consolidar despesas, receitas e investimentos.",
      "Falta de previsibilidade de fluxo de caixa.",
    ],
    hospedagem: [
      "Uso de plataformas externas (Booking/OTAs).",
      "Risco de overbooking por ausência de integração direta com agenda interna.",
      "Agenda no Google Calendar usada manualmente.",
    ],
    eventos: [
      "Orçamentos personalizados feitos de forma manual (contato a contato).",
      "Planilhas usadas para simular custos.",
      "Sem histórico organizado de propostas.",
      "Processos de follow-up não estruturados.",
    ],
    estoque: [
      "Controle em planilhas e anotações.",
      "Sem alertas automáticos de reposição ou vencimento.",
      "Risco de compras emergenciais.",
    ],
    captacao: [
      "Site atual funciona apenas como “outdoor digital” (fotos bonitas, pouca informação estruturada).",
      "Leads chegam pelo WhatsApp → sem qualificação prévia.",
      "Redes sociais ativas, mas sem integração com CRM.",
      "Grande volume de contatos manuais para filtrar (ex.: 350 noivas para ligar).",
    ],
    comunicacao: [
      "WhatsApp é o canal central, mas não integrado ao sistema.",
      "Hospedagem aceita automação no atendimento inicial.",
      "Eventos exigem contato humano e personalizado.",
    ],
  },
  gargalos: [
    "Sobrecarga financeira: uso de Excel e relatórios fragmentados impede visão estratégica.",
    "Perda de previsibilidade: falta de integração entre hospedagem e eventos gera insegurança.",
    "Retrabalho em orçamentos: cálculos refeitos diversas vezes, com alto risco de erro.",
    "Captação de leads ineficiente: contatos chegam frios, demandando alto esforço de atendimento.",
    "Dependência de processos manuais em estoque, contratos e agendamento.",
  ],
  alavancas: {
    curtoPrazo: [
      "OpsUnit – Financeiro Vivo + CRM: Centralizar contas a pagar/receber; Relatórios automáticos e dashboards de fluxo de caixa; Integração inicial de leads/eventos com hospedagem.",
      "OpsUnit – Agenda Integrada: Sincronização com OTAs (Booking/Airbnb); Controle de disponibilidade em tempo real; Área interna de agenda para eventos.",
    ],
    medioPrazo: [
      "OpsUnit – Gestão de Orçamentos & Contratos Digitais: Geração automática de propostas personalizadas; Assinatura eletrônica integrada; Histórico organizado de negociações.",
      "OpsUnit – Estoque Inteligente: Controle de insumos (restaurante + eventos); Alertas de validade e reposição.",
    ],
    longoPrazo: [
      "BrandForge – Funil Digital & Infraestrutura de Captação: Landing pages segmentadas (casamentos, aniversários, hospedagem); Formulários de pré-qualificação → leads mais quentes; Integração com CRM para follow-up automático.",
      "TimeOS – Inteligência de Mercado via WhatsApp: Relatórios de ocupação, sazonalidade e receita; Insights preditivos de demanda; Atendimento integrado multicanal.",
    ],
  },
  jornada: {
    passo1:
      "Financeiro + Agenda Integrada (Piloto): Centralizar fluxo financeiro; Eliminar risco de overbooking.",
    passo2:
      "CRM Vivo + Orçamentos Digitais: Estruturar follow-up de leads; Reduzir tempo de geração de propostas.",
    passo3:
      "Estoque Inteligente: Controle preventivo de insumos; Redução de compras emergenciais.",
    passo4:
      "Funil Digital e Marketing Integrado: Leads mais qualificados via páginas segmentadas; Integração com o CRM.",
    passoFinal:
      "TimeOS (Integração Total): Inteligência contínua de gestão via WhatsApp.",
  },
  ganhos: [
    "+10 horas semanais livres dos sócios/administradores.",
    "Zero risco de overbooking entre hospedagem e eventos.",
    "70% menos tempo gasto na geração de orçamentos.",
    "Previsibilidade financeira com dashboards automáticos.",
    "Leads mais quentes, reduzindo esforço de prospecção.",
  ],
  resumo:
    "Hoje a Quinta funciona com muito esforço manual e improvisos. Pequenas automações no financeiro e na agenda integrada já trarão clareza e segurança imediatas. A partir disso, contratos digitais, estoque e captação estruturada vão permitir escalar sem perder o toque humano que diferencia a experiência da Quinta.",
};

export const Step1Escutar = ({ onNext, sessionId }: Step1EscutarProps) => {
  const generateScannerPDF = () => {
    if (sessionId) {
      trackCtaClick(sessionId, "scanner_pdf_download", { step: "Escutar" });
    }
    // Criar link para download do arquivo PDF
    const link = document.createElement('a');
    link.href = '/Scanner-Operacional-EPICO-Quinta-de-Brumado.pdf';
    link.download = 'Scanner-Operacional-EPICO-Quinta-de-Brumado.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNext = () => {
    if (sessionId) {
      trackStepComplete(sessionId, "Escutar", { scannerPreset: "QuintaDeBrumado" });
    }
    onNext();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-1 rounded-full text-step-1 font-medium mb-4">
            🟣 ETAPA 1
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-step-1 to-step-2 bg-clip-text text-transparent">
            ESCUTAR
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Scanner Operacional ÉPICO — diagnóstico visual e interativo, pronto para apresentação.
          </p>
        </header>

        {/* Ações Rápidas */}
        <div className="flex justify-center mb-6 gap-3">
          <Button variant="outline" onClick={generateScannerPDF} className="border-step-1 text-step-1">
            <FileText className="w-4 h-4 mr-2" /> Gerar PDF do Scanner
          </Button>
        </div>

        {/* Conteúdo (para screenshot) */}
        <div id="scanner-epico" className="max-w-5xl mx-auto space-y-6">
          {/* Cabeçalho do Relatório */}
          <Card className="step-card step-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-step-1" /> Scanner Operacional ÉPICO
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="bg-step-1/10 text-step-1">Cliente: {scannerData.cliente}</Badge>
              <Badge variant="secondary" className="bg-step-1/10 text-step-1">Data: {scannerData.data}</Badge>
              <Badge variant="secondary" className="bg-step-1/10 text-step-1">Consultoria: {scannerData.consultoria}</Badge>
            </CardContent>
          </Card>

          <Accordion type="multiple" className="space-y-4">
            {/* 1. Contexto Geral */}
            <AccordionItem value="contexto" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><User className="w-4 h-4 text-step-1" /> 1. Contexto Geral</div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="step-card step-1">
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{scannerData.contextoGeral}</p>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 2. Processos Atuais */}
            <AccordionItem value="processos" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-step-1" /> 2. Processos Atuais (Mapeamento)</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(scannerData.processos).map(([k, items]) => (
                    <Card key={k} className="step-card step-1">
                      <CardHeader>
                        <CardTitle className="text-base capitalize">{formatKey(k)}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {(items as string[]).map((it, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 3. Gargalos Invisíveis */}
            <AccordionItem value="gargalos" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-step-1" /> 3. Gargalos Invisíveis (Impacto Real)</div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="step-card step-1">
                  <CardContent>
                    <ul className="space-y-2">
                      {scannerData.gargalos.map((it, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* 4. Alavancas Tecnológicas */}
            <AccordionItem value="alavancas" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><Rocket className="w-4 h-4 text-step-1" /> 4. Alavancas Tecnológicas (Oportunidades)</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="step-card step-1">
                    <CardHeader><CardTitle className="text-base">🎯 Curto Prazo</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scannerData.alavancas.curtoPrazo.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="step-card step-1">
                    <CardHeader><CardTitle className="text-base">🛠 Médio Prazo</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scannerData.alavancas.medioPrazo.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="step-card step-1">
                    <CardHeader><CardTitle className="text-base">🚀 Longo Prazo</CardTitle></CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {scannerData.alavancas.longoPrazo.map((it, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-step-1 mt-0.5" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 5. Jornada Recomendada */}
            <AccordionItem value="jornada" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><Badge variant="secondary" className="bg-step-1/20 text-step-1">Roadmap</Badge> 5. Jornada Recomendada</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ["1️⃣ Piloto Operacional", scannerData.jornada.passo1],
                    ["2️⃣ Documentos", scannerData.jornada.passo2],
                    ["3️⃣ Estoque", scannerData.jornada.passo3],
                    ["4️⃣ Marketing", scannerData.jornada.passo4],
                  ].map(([title, text]) => (
                    <Card key={title as string} className="step-card step-1">
                      <CardHeader><CardTitle className="text-base">{title}</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-muted-foreground">{text as string}</p></CardContent>
                    </Card>
                  ))}
                  <Card className="step-card step-1 md:col-span-2">
                    <CardHeader><CardTitle className="text-base">5️⃣ Passo Final – TimeOS</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-muted-foreground">{scannerData.jornada.passoFinal}</p></CardContent>
                  </Card>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 6. Ganhos Esperados */}
            <AccordionItem value="ganhos" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-step-1" /> 6. Ganhos Esperados</div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {scannerData.ganhos.map((g, idx) => (
                    <Card key={idx} className="step-card step-1">
                      <CardContent className="flex items-center gap-2 py-4">
                        <Target className="w-5 h-5 text-step-1" />
                        <span className="text-sm text-muted-foreground">{g}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* 7. Resumo */}
            <AccordionItem value="resumo" className="border-none">
              <AccordionTrigger>
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-step-1" /> 7. Resumo</div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="step-card step-1">
                  <CardContent>
                    <blockquote className="border-l-2 border-step-1 pl-4 text-muted-foreground italic">
                      “{scannerData.resumo}”
                    </blockquote>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button onClick={handleNext} size="lg" className="bg-step-1 hover:bg-step-1/90 text-primary-foreground font-semibold px-8 py-3 text-lg">
            Continuar
          </Button>
        </div>
      </div>
    </section>
  );
};

function formatKey(key: string) {
  switch (key) {
    case "financeiro":
      return "Financeiro";
    case "hospedagem":
      return "Hospedagem";
    case "eventos":
      return "Eventos";
    case "estoque":
      return "Estoque & Insumos";
    case "captacao":
      return "Captação de Leads & Marketing";
    case "comunicacao":
      return "Comunicação & Atendimento";
    default:
      return key;
  }
}