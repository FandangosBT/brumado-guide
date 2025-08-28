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
  cliente: "Dra. Giovana – Clínica Odontológica",
  data: "Agosto/2025",
  consultoria: "Q7 Ops",
  contextoGeral:
    "A clínica opera com três doutoras e três secretárias, atendendo em modelo compartilhado de pacientes. Apesar da qualidade clínica reconhecida, a operação apresenta dependência excessiva de processos manuais, o que gera sobrecarga, risco de erros e perda de previsibilidade. A Dra. Giovana demonstra forte preocupação com personalização e atenção ao paciente, não aceitando automações ‘frias’. As soluções precisam ser tecnológicas, mas com tom humano.",
  processos: {
    agenda: [
      "Gerido de forma manual em software básico",
      "Três agendas paralelas → risco de duplicidade",
      "Sem lembretes automáticos e recuperação de faltas/inativos",
      "Confusão para pacientes sobre qual doutora/secretária atende",
    ],
    contratos: [
      "Preenchimento manual de dados de pacientes",
      "Retrabalho frequente (CPF, endereço, assinatura)",
      "Perda de tempo administrativo",
    ],
    estoque: [
      "Controle feito em planilha de Excel",
      "Sem alertas automáticos",
      "Risco de ruptura e compras emergenciais",
    ],
    comunicacao: [
      "Orçamento personalizado em PDF → enviado por WhatsApp",
      "Follow-up manual após 2 dias (processo inventado)",
      "Sem histórico organizado ou CRM",
    ],
    marketing: [
      "Dra. Giovana centraliza publicações",
      "Perfeccionismo gera bloqueios → baixa consistência",
      "Consultoria externa em fase inicial (calendário macro)",
    ],
    cobrancas: [
      "Utilização de PIX e links de cartão (positivo)",
      "Eliminação de boletos",
      "Sem automação de lembretes financeiros",
    ],
  },
  gargalos: [
    "Duplicidade de agendamentos → perda de tempo + desgaste",
    "Sobrecarga administrativa → contratos e anotações manuais",
    "Perda de previsibilidade → sem métricas de ocupação/retorno",
    "Dependência de memória/anotações → processos improvisados",
    "Falta de consistência digital → redes irregulares",
    "Ausência de CRM → leads/orçamentos sem acompanhamento",
  ],
  alavancas: {
    curtoPrazo: [
      "OpsUnit – Agenda Lucrativa + CRM Vivo (confirmações automáticas, recuperação de inativos, integração de agendas)",
      "OpsUnit – Gestão de Contratos Digitais (geração automática, assinatura eletrônica)",
    ],
    medioPrazo: [
      "OpsUnit – Estoque Inteligente (controle automatizado, alertas de reposição)",
      "BrandForge – Suporte Digital (calendário editorial com roteiros, automação de publicações)",
    ],
    longoPrazo: [
      "TimeOS – Painel central integrando agenda, contratos, estoque e CRM",
      "Dashboards com indicadores de produtividade, fluxo financeiro e recorrência",
    ],
  },
  jornada: {
    passo1: "Piloto Operacional (Agenda + CRM Vivo): eliminar duplicidade de agendas, padronizar confirmações, recuperar inativos",
    passo2: "Automação de Documentos: digitalizar contratos e reduzir carga manual",
    passo3: "Expansão para Estoque Inteligente: controle de insumos com alertas",
    passo4: "Estrutura Digital e Marketing Automatizado: rotina editorial sem sobrecarga",
    passoFinal: "TimeOS (Integração Total): dashboard único com clareza operacional e financeira",
  },
  ganhos: [
    "+10h livres/semana para a equipe administrativa",
    "Zero risco de duplicidade de agendas",
    "Redução de 70% no tempo com contratos/papelada",
    "Maior previsibilidade da taxa de ocupação",
    "Consistência digital sem demandar esforço diário",
    "Base pronta para expansão organizada",
  ],
  resumo:
    "Hoje sua clínica funciona bem, mas à custa de esforço manual e improvisos. O Scanner Operacional mostra que pequenas automações — começando pela agenda e contratos — podem liberar tempo, reduzir erros e dar previsibilidade sem perder a personalização que seus pacientes valorizam. A evolução natural é integrar tudo no TimeOS, para que você tenha clareza e segurança em cada decisão.",
};

export const Step1Escutar = ({ onNext, sessionId }: Step1EscutarProps) => {
  const generateScannerPDF = () => {
    if (sessionId) {
      trackCtaClick(sessionId, "scanner_pdf_download", { step: "Escutar" });
    }
    // Criar link para download do arquivo PDF
    const link = document.createElement('a');
    link.href = '/Scanner-Operacional-EPICO.pdf';
    link.download = 'Scanner-Operacional-EPICO.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNext = () => {
    if (sessionId) {
      trackStepComplete(sessionId, "Escutar", { scannerPreset: "DraGiovana" });
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
    case "agenda":
      return "Agendamento & Agenda";
    case "contratos":
      return "Contratos & Documentos";
    case "estoque":
      return "Estoque & Insumos";
    case "comunicacao":
      return "Comunicação & Orçamentos";
    case "marketing":
      return "Marketing & Redes";
    case "cobrancas":
      return "Cobranças & Pagamentos";
    default:
      return key;
  }
}