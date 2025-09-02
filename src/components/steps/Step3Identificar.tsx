import { useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Heart, Layers, Server, Shield, Rocket, Tag, Database, Boxes, FileText } from "lucide-react";
import { trackFavorite, trackFlip, trackTagToggle, trackStepComplete, trackCtaClick } from "@/lib/sdk";


interface ModuleItem {
  id: string;
  title: string;
  objetivo: string;
  fluxos: Array<{ id: string; title: string; bullets: string[] }>;
  entregaveis: string[];
  stackMinima: string[];
  kpis: string[];
  tags: string[];
}

interface Step3IdentificarProps {
  onNext: () => void;
  sessionId?: string;
}

const BLUEPRINT = {
  cliente: "Quinta do Brumado (Hospedagem + Eventos)",
  consultoria: "Q7 Ops",
  objetivo: "Entregar um blueprint enxuto, validável em 90 dias por módulo, com baixo risco e alto impacto, evolutivo para TimeOS.",
  principios: ["Leve", "Modular", "Integrável", "Reversível"],
  camadas: {
    interface: "Interface & Painéis – Next.js/React + Tailwind (dashboards e formulários: agenda, reservas, eventos, orçamentos/contratos, estoque, financeiro)",
    orquestracao: "Orquestração & Agentes – n8n/Make/Zapier (MVP) + Workers Node.js/TS para lógicas críticas",
    integracoes: "Integrações – WhatsApp (Meta Cloud), E‑signature (Clicksign/DocuSign), E‑mail/Calendar (Google), Planilhas (Sheets)",
    dados: "Dados – PostgreSQL + Redis (filas/cache) + Storage S3/Backblaze (documentos)",
    seguranca: "Segurança & LGPD – Auth.js, perfis (admin/atendimento/financeiro), auditoria, retenção, consentimento",
    deploy: "Deploy – Docker + docker‑compose em VPS (Hetzner/OCI/Linode) com backups diários",
  },
  conexao: {
    a: [
      "Cenário A (API disponível): ler/escrever reservas, eventos, hóspedes e finanças",
    ],
    b: [
      "Cenário B (sem API): ingestão por CSV/planilha diária",
      "ICS/iCal para calendário e disponibilidade",
      "Se imprescindível: RPA leve (Puppeteer) para extrair dados",
    ],
  },
};

const MODULES: ModuleItem[] = [
  {
    id: "financeiro_agenda",
    title: "OpsUnit Financeiro Vivo + Agenda Integrada (MVP ~90 dias)",
    objetivo: "Dar visibilidade AP/AR por centro de custo e unificar calendário (hospedagem + eventos) com anti-overbooking.",
    fluxos: [
      { id: "A", title: "Conciliação de Receitas", bullets: [
        "OTAs (import/transacional), reservas diretas (site), eventos (orçamento aprovado → fatura)",
      ]},
      { id: "B", title: "Agenda Única", bullets: [
        "Leitura/gravação em calendário interno",
        "Ingestão ICS/iCal de canais externos",
        "Bloqueios por eventos (montagem/limpeza)",
      ]},
      { id: "C", title: "Anti-Overbooking", bullets: [
        "Checagem de conflito (espaço/quarto/data) ao criar reserva/evento",
        "Sugestão de janela alternativa",
      ]},
      { id: "D", title: "Alertas", bullets: [
        "Pagamentos a vencer, saldo em aberto por evento, datas críticas",
      ]},
    ],
    entregaveis: [
      "Painel Financeiro (DRE simplificado, AP/AR, centros de custo)",
      "Painel Agenda/Disponibilidade (ocupação por data/área/quarto, bloqueios de evento)",
      "Conectores: OTAs (iCal), Google Calendar, export CSV",
      "Stack mínima: Next.js, Node.js/TS, n8n, Postgres, Redis, Meta WhatsApp Cloud API, Auth.js",
      "KPIs MVP: Overbooking = 0; acurácia de ocupação ≥ 99%; fechamento de caixa D+2; SLA confirmação < 15 min",
    ],
    stackMinima: [],
    kpis: [],
    tags: ["financeiro", "agenda", "otas", "ical", "overbooking"],
  },
  {
    id: "crm_orcamentos_contratos",
    title: "CRM Vivo + Orçamentos & Contratos Digitais (MVP ~90 dias)",
    objetivo: "Padronizar a qualificação de leads por nicho e acelerar orçamentos e assinaturas digitais.",
    fluxos: [
      { id: "A", title: "Orçamento Guiado", bullets: [
        "Formulário por nicho → cálculo automático de pacotes/itens → PDF/HTML",
      ]},
      { id: "B", title: "Assinatura Eletrônica", bullets: [
        "Envio para Clicksign/DocuSign",
        "Webhook de retorno atualiza status",
      ]},
      { id: "C", title: "Arquivamento & Auditoria", bullets: [
        "PDF em S3; hash, data, IP, versão do template; vínculo ao evento/reserva",
      ]},
    ],
    entregaveis: [
      "Painel de Leads/Propostas/Contratos (pendente, enviado, assinado, expirado)",
      "Templates versionados por nicho",
      "Integração com assinatura + webhooks",
      "Stack mínima: Next.js, Node.js/TS (template engine), Clicksign/DocuSign SDK, S3, Postgres",
      "KPIs MVP: Tempo de ciclo orçamento→assinatura; % assinados ≤ 7 dias; retrabalho evitado (#)",
    ],
    stackMinima: [],
    kpis: [],
    tags: ["crm", "orcamentos", "contratos", "assinatura", "s3"],
  },
  {
    id: "estoque_inteligente",
    title: "OpsUnit Estoque Inteligente (MVP ~90 dias)",
    objetivo: "Visibilidade de insumos críticos (hotelaria/cozinha/eventos), alertas e prevenção de rupturas.",
    fluxos: [
      { id: "A", title: "Cadastro & Curva ABC", bullets: [
        "Importação inicial (CSV/planilha)",
        "Definição de estoque mínimo por item",
      ]},
      { id: "B", title: "Movimentação Simples", bullets: [
        "Entradas/saídas, lote/validade",
      ]},
      { id: "C", title: "Alertas", bullets: [
        "Atingiu mínimo → WhatsApp/E‑mail com sugestão de reposição",
      ]},
    ],
    entregaveis: [
      "Painel de níveis, itens a faltar, curva ABC, consumo/mês",
      "Importação CSV; trilha de auditoria",
      "Stack mínima: Next.js, Node.js/TS, Postgres, n8n (alertas); opcional: leitura de código de barras via webcam",
      "KPIs MVP: Rupturas evitadas; itens abaixo do mínimo; giro itens A; custo mensal estimado",
    ],
    stackMinima: [],
    kpis: [],
    tags: ["estoque", "hotelaria", "eventos", "curva_abc"],
  },
  {
    id: "brandforge",
    title: "BrandForge: Funil Digital & Captação Segmentada (MVP ~90 dias)",
    objetivo: "Transformar o site em motor de captação qualificada com LPs por nicho + integração ao CRM.",
    fluxos: [
      { id: "A", title: "Landing Pages por Nicho", bullets: [
        "Formulários de pré-briefing por nicho (hospedagem, casamento, aniversário, corporativo)",
      ]},
      { id: "B", title: "Qualificação Automática", bullets: [
        "Entra no pipeline com tags (nicho, data, orçamento)",
      ]},
      { id: "C", title: "Agenda/Disponibilidade no Site", bullets: [
        "Consulta de datas e integração com Agenda",
      ]},
    ],
    entregaveis: [
      "Biblioteca de templates; painel de conteúdos; integração de agendamento",
      "Stack mínima: Next.js, Node.js/TS, integração Meta/Buffer, Postgres",
      "KPIs MVP: Posts/semana; conclusão de pauta; engajamento básico; taxa de leads qualificados por LP",
    ],
    stackMinima: [],
    kpis: [],
    tags: ["brandforge", "funil", "captacao", "lp", "crm"],
  },
];

const DATA_MODEL = {
  tabelas: [
    "Hóspede",
    "Evento",
    "Reserva",
    "Espaço",
    "Quarto",
    "Pacote",
    "Orçamento",
    "Contrato",
    "CentroCusto",
    "Fatura",
    "Lead",
    "InteraçãoWhatsApp",
    "Insumo",
    "MovEstoque",
    "Usuário",
    "Perfil",
    "AuditLog"
  ],
  rels: [
    "Hóspede 1‑N Reserva/Evento/Contrato",
    "Espaço/Quarto 1‑N Reserva/Evento",
    "Insumo 1‑N MovEstoque"
  ],
  padroes: [
    "UUID",
    "timestamps",
    "soft‑delete",
    "versionamento de template",
    "encrypt at rest (campos sensíveis)",
    "masking em UI"
  ],
};

const SECURITY = {
  bases: ["Execução de contrato", "Legítimo interesse (transparência)"],
  controles: ["Perfis de acesso (admin/atendimento/financeiro)", "2FA opcional", "TLS", "Backup diário + retenção 30 dias", "Logs imutáveis (WORM) para contratos"],
  privacidade: ["Consentimento explícito para WhatsApp", "Opt‑out fácil"],
};

const DEPLOY = {
  infra: ["VPS 2–4 vCPU / 4–8GB RAM", "Docker", "Nginx reverse proxy", "Let’s Encrypt"],
  cicd: ["GitHub Actions → build e deploy"],
  observability: ["Uptime Kuma/Healthchecks", "Winston + (Loki opcional)", "Métricas básicas"],
};

const ROADMAP = [
  "SSO (unificação de identidades e permissões)",
  "Data Lake leve (Supabase + dbt)",
  "Recomendações automatizadas (sazonalidade/ocupação)",
  "Cockpit único (agenda, reservas, eventos, estoque, finanças)",
];

const CRITERIA = [
  "Financeiro+Agenda: overbooking = 0; ocupação confiável ≥ 99%; fechamento de caixa D+2; SLA confirmação < 15 min",
  "CRM+Orçamentos/Contratos: ≥ 80% de propostas com resposta ≤ 7 dias; ≥ 90% contratos assinados ≤ 7 dias",
  "Estoque: zero ruptura em itens ‘A’; alertas ≥ 48h antes do esgotamento",
  "BrandForge/Funil: ≥ 3 posts/semana por 8 semanas; pauta aprovada ≤ 48h; conversão LP→lead qualificado (baseline a definir)",
];

export const Step3Identificar = ({ onNext, sessionId }: Step3IdentificarProps) => {
  const selectedTagsRef = useRef<Record<string, boolean>>({});
  const favoritesRef = useRef<Record<string, boolean>>({});
  const flippedRef = useRef<Record<string, number>>({});

  const categories = useMemo(() => ["Financeiro", "Agenda", "Comercial/CRM", "Marketing", "Estoque", "Dados"], []);

  const toggleFavorite = (id: string) => {
    favoritesRef.current[id] = !favoritesRef.current[id];
    if (sessionId) trackFavorite(sessionId, id, !!favoritesRef.current[id]);
  };

  const flipCard = (id: string) => {
    const count = (flippedRef.current[id] || 0) + 1;
    flippedRef.current[id] = count;
    const to = count % 2 === 1 ? 'back' : 'front';
    if (sessionId) trackFlip(sessionId, id, to);
  };

  const toggleTag = (id: string, tag: string) => {
    const key = `${id}:${tag}`;
    selectedTagsRef.current[key] = !selectedTagsRef.current[key];
    if (sessionId) trackTagToggle(sessionId, id, tag, !!selectedTagsRef.current[key]);
  };



  const handleNext = () => {
    if (sessionId) {
      const favs = Object.keys(favoritesRef.current).filter(k=>favoritesRef.current[k]);
      const tags = Object.keys(selectedTagsRef.current).filter(k=>selectedTagsRef.current[k]);
      trackStepComplete(sessionId, "Identificar", { favorites: favs, tags });
    }
    onNext();
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-3 rounded-full text-step-3 font-medium mb-6">
            🟢 ETAPA 3
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-3 to-step-4 bg-clip-text text-transparent">
            IDENTIFICAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Arquitetura leve + módulos MVP integráveis aos sistemas atuais da Quinta (hospedagem e eventos).
          </p>
        </header>

        {/* Filtros por Categoria */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map(cat => (
              <Badge key={cat} variant="secondary" className="cursor-pointer">
                <Layers className="w-3 h-3 mr-1" /> {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Arquitetura */}
        <Card className="step-card step-3 mb-10 bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2"><Layers className="w-5 h-5 text-step-3" /> Arquitetura Leve + Stack de Automação Mínima</CardTitle>
            <CardDescription>Princípios técnicos + integração com sistema atual para implementação sem ruptura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="secondary" className="bg-step-3/10 text-step-3">Cliente: {BLUEPRINT.cliente}</Badge>
              <Badge variant="secondary" className="bg-step-3/10 text-step-3">Consultoria: {BLUEPRINT.consultoria}</Badge>
              <Badge variant="secondary" className="bg-step-3/10 text-step-3">Objetivo: 90 dias/módulo</Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{BLUEPRINT.objetivo}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">Princípios</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  {BLUEPRINT.principios.map((p) => (<li key={p}>{p}</li>))}
                </ul>
                <h3 className="text-sm font-semibold text-foreground mt-4 mb-2 flex items-center gap-2"><Server className="w-4 h-4 text-step-3" /> Camadas</h3>
                <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                  <li>{BLUEPRINT.camadas.interface}</li>
                  <li>{BLUEPRINT.camadas.orquestracao}</li>
                  <li>{BLUEPRINT.camadas.integracoes}</li>
                  <li>{BLUEPRINT.camadas.dados}</li>
                  <li>{BLUEPRINT.camadas.seguranca}</li>
                  <li>{BLUEPRINT.camadas.deploy}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Database className="w-4 h-4 text-step-3" />
                  Conexão com os sistemas atuais da Quinta
                </h3>

                {/* Cenário A */}
                <div className="mb-4 p-4 rounded-xl border-2 border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <div className="text-sm font-semibold text-green-700 dark:text-green-400">Cenário A: API Disponível</div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    {BLUEPRINT.conexao.a.map((c) => (
                      <li key={c} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>

                {/* Cenário B */}
                <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/20">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">Cenário B: Sem API</div>
                  </div>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                    {BLUEPRINT.conexao.b.map((c) => (
                      <li key={c} className="leading-relaxed">{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Destaque da Integração */}
        <Card className="step-card bg-gradient-to-r from-step-3/10 to-step-4/10 border-step-3/30 mb-10">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 text-step-3">🎯 Diferencial Competitivo</h3>
              <p className="text-muted-foreground">
                <strong>Sem ruptura dos sistemas atuais.</strong> Implementação gradual que se integra ao que já funciona,
                garantindo continuidade dos processos enquanto adiciona automação inteligente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Conexão por Módulo */}
        <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300 mb-10">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2"><FileText className="w-5 h-5 text-step-3" /> Integração por Módulo</CardTitle>
            <CardDescription>Como cada solução se conecta aos sistemas atuais da Quinta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2">Financeiro + Agenda Integrada</h4>
                  <p className="text-sm text-muted-foreground">
                    Concilia receitas (OTAs, reservas diretas, eventos) e unifica calendário (hospedagem + eventos) com iCal/Google Calendar; anti-overbooking.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 mb-2">Contratos Digitais</h4>
                  <p className="text-sm text-muted-foreground">
                    Recebe dados do hóspede/cliente do CRM/Agenda para geração automática de contratos
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 mb-2">Estoque Inteligente</h4>
                  <p className="text-sm text-muted-foreground">
                    Importa movimentações de estoque via CSV ou integração direta com sistema atual
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-pink-50/50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800">
                  <h4 className="text-sm font-semibold text-pink-700 dark:text-pink-400 mb-2">BrandForge</h4>
                  <p className="text-sm text-muted-foreground">
                    Recebe dados de hóspedes/clientes para personalização de conteúdo e lembretes automáticos
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grid de Módulos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {MODULES.map((mod) => (
            <Card key={mod.id} className="p-4 group bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300 hover:scale-[1.01]">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-2"><Boxes className="w-4 h-4 text-step-3" /> {mod.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{mod.objetivo}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="icon" variant="ghost" aria-label="Favoritar"
                    onClick={() => toggleFavorite(mod.id)}
                  >
                    <Heart className={`w-5 h-5 ${favoritesRef.current[mod.id] ? 'text-red-500 fill-red-500' : ''}`} />
                  </Button>
                  <Button size="icon" variant="ghost" aria-label="Salvar para revisar"
                    onClick={() => toggleFavorite(mod.id)}
                  >
                    <Bookmark className={`w-5 h-5 ${favoritesRef.current[mod.id] ? 'text-yellow-500 fill-yellow-500' : ''}`} />
                  </Button>
                </div>
              </div>

              {/* Tags */}
              {mod.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {mod.tags.map(tag => (
                    <span key={`${mod.id}-${tag}`} className="tag-pill step-3 cursor-pointer"
                      onClick={() => toggleTag(mod.id, tag)}
                      role="button" aria-label={`Tag ${tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Fluxos (Swimlanes) */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="w-3 h-3 text-step-3" />
                  Fluxos (swimlanes)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                  {mod.fluxos.map(f => (
                    <div key={f.id} className="p-3 rounded-lg bg-muted/30 overflow-hidden">
                      <div className="text-xs font-semibold mb-1 line-clamp-1">{f.id}) {f.title}</div>
                      <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1 max-h-20 overflow-y-auto pr-1">
                        {f.bullets.map(b => (<li key={b} className="truncate">{b}</li>))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Frente e Verso */}
              <div className="mt-4">
                <div className="relative [perspective:1200px] overflow-hidden rounded-xl">
                  <div
                    className="absolute inset-0 rounded-lg bg-card/80 supports-[backdrop-filter]:backdrop-blur border border-border/60 p-4 [backface-visibility:hidden] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] transition-transform duration-500"
                  >
                    <div className="text-sm font-medium mb-3">Entregáveis</div>
                    <Button size="sm" variant="secondary" className="mt-3" onClick={() => flipCard(mod.id)}>
                      Ver entregáveis
                    </Button>
                  </div>
                  <div
                    className="absolute inset-0 rounded-lg bg-muted/80 supports-[backdrop-filter]:backdrop-blur border border-border/60 p-4 [backface-visibility:hidden] [transform-style:preserve-3d] [transform:rotateY(180deg)] group-hover:[transform:rotateY(0deg)] transition-transform duration-500 overflow-y-auto"
                  >
                    <div className="text-sm font-medium mb-3">Entregáveis</div>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
                      {mod.entregaveis.map(e => (<li key={e}>{e}</li>))}
                    </ul>
                    <Button size="sm" variant="outline" className="mt-4" onClick={() => flipCard(mod.id)}>
                      Voltar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Secções adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="w-4 h-4 text-step-3" /> Dados & Modelo de Informação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Tabelas principais</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DATA_MODEL.tabelas.map(t => (<li key={t}>{t}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Relacionamentos</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DATA_MODEL.rels.map(r => (<li key={r}>{r}</li>))}
                  </ul>
                  <div className="font-medium mt-3 mb-1">Padrões</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DATA_MODEL.padroes.map(p => (<li key={p}>{p}</li>))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-step-3" /> Segurança, LGPD e Governança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Bases legais</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {SECURITY.bases.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                  <div className="font-medium mt-3 mb-1">Privacidade</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {SECURITY.privacidade.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Controles</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {SECURITY.controles.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Server className="w-4 h-4 text-step-3" /> Deploy & Observability</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="font-medium mb-1">Infra</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DEPLOY.infra.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">CI/CD</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DEPLOY.cicd.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
                <div>
                  <div className="font-medium mb-1">Observability</div>
                  <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                    {DEPLOY.observability.map(x => (<li key={x}>{x}</li>))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="step-card bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Rocket className="w-4 h-4 text-step-3" /> Roadmap de Evolução para TimeOS</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {ROADMAP.map(x => (<li key={x}>{x}</li>))}
              </ul>
            </CardContent>
          </Card>

          <Card className="step-card lg:col-span-2 bg-card/60 supports-[backdrop-filter]:backdrop-blur border border-border/60 rounded-2xl shadow-sm hover:shadow-elegant transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Layers className="w-4 h-4 text-step-3" /> Critérios de Aceite por Módulo (MVP)</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                {CRITERIA.map(x => (<li key={x}>{x}</li>))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
          <Badge variant="secondary" className="bg-step-3/10 text-step-3">Cliente: {BLUEPRINT.cliente}</Badge>
          <Badge variant="secondary" className="bg-step-3/10 text-step-3">Data: Agosto/2025</Badge>
          <Badge variant="secondary" className="bg-step-3/10 text-step-3">Consultoria: {BLUEPRINT.consultoria}</Badge>

        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => { if (sessionId) { trackStepComplete(sessionId, "Identificar", { favorites: Object.keys(favoritesRef.current).filter(k=>favoritesRef.current[k]), tags: Object.keys(selectedTagsRef.current).filter(k=>selectedTagsRef.current[k]) }); } onNext(); }}
            size="lg"
            className="bg-step-3 hover:bg-step-3/90 text-primary-foreground font-semibold px-8 py-3 text-lg"
          >
            Avançar para criação do plano
          </Button>
        </div>
      </div>
    </section>
  );
};