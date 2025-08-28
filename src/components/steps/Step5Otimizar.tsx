import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  FileText,
  Package,
  TrendingUp,
  Clock,
  DollarSign,
  Activity,
  MessageSquare,
  Settings,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Zap,
  Brain,
  BarChart3,
  Target,
  TrendingDown,
  ShoppingCart,
  Check,
  X,
  Calculator,
  Timer,
  Plus,
  Minus
} from "lucide-react";
import { trackWidgetInteraction, trackCtaClick } from "@/lib/sdk";


// Debounce hook para atrasar o recálculo do orçamento
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const widgets = [
  {
    id: "agenda",
    titulo: "Ocupação da Agenda",
    valor: "92%",
    tendencia: "+15%",
    cor: "step-1",
    icon: Calendar,
    detalhes: "Taxa de ocupação otimizada com IA preditiva"
  },
  {
    id: "pacientes",
    titulo: "Pacientes Reativados",
    valor: "847",
    tendencia: "+340%",
    cor: "step-2", 
    icon: Users,
    detalhes: "Campanhas automatizadas de reativação"
  },
  {
    id: "receita",
    titulo: "Receita Mensal",
    valor: "R$ 125k",
    tendencia: "+45%",
    cor: "step-3",
    icon: DollarSign,
    detalhes: "Crescimento sustentável com automação"
  },
  {
    id: "estoque",
    titulo: "Eficiência Estoque",
    valor: "98.5%",
    tendencia: "+25%",
    cor: "step-4",
    icon: Package,
    detalhes: "Zero desperdício com alertas inteligentes"
  },
  {
    id: "satisfacao",
    titulo: "Satisfação Pacientes",
    valor: "4.9/5",
    tendencia: "+18%",
    cor: "step-5",
    icon: Activity,
    detalhes: "NPS alto com experiência otimizada"
  },
  {
    id: "comunicacao",
    titulo: "Resp. Automática",
    valor: "2.3 min",
    tendencia: "-75%",
    cor: "step-1",
    icon: MessageSquare,
    detalhes: "Tempo médio de resposta automatizada"
  }
];

const integracoes = [
  "OpsUnit Agenda",
  "OpsUnit CRM",
  "OpsUnit Estoque",
  "BrandForge Content",
  "TimeOS Central"
];

type ProdutoOrcamento = {
  id: string;
  nome: string;
  descricao: string;
  precoBase: number;
  economiaMensal?: number; // economia estimada mensal deste produto
  modulos: Array<{ id: string; nome: string; preco: number; obrigatorio: boolean; economiaMensal?: number }>;
  icon: typeof Calendar;
  cor: string;
  roiPrevisto: number;
  paybackMeses: number;
};

const orcamentoOptions: ProdutoOrcamento[] = [
  {
    id: "agenda-crm",
    nome: "OpsUnit Agenda + CRM Vivo",
    descricao: "Sistema completo de agendamento inteligente com CRM integrado",
    precoBase: 8640,
    economiaMensal: 2500, // redução de no-shows, automação de confirmações
    modulos: [],
    icon: Calendar,
    cor: "blue",
    roiPrevisto: 340,
    paybackMeses: 3
  },
  {
    id: "estoque-inteligente",
    nome: "OpsUnit Estoque Inteligente",
    descricao: "Sistema inteligente de gestão de insumos e materiais",
    precoBase: 3500,
    economiaMensal: 1200, // redução de desperdício e compras
    modulos: [],
    icon: Package,
    cor: "orange",
    roiPrevisto: 280,
    paybackMeses: 4
  },
  {
    id: "contratos-digitais",
    nome: "OpsUnit Gestão de Contratos",
    descricao: "Sistema completo de gestão documental e assinaturas digitais",
    precoBase: 5760,
    economiaMensal: 900, // redução de horas administrativas e riscos
    modulos: [],
    icon: FileText,
    cor: "purple",
    roiPrevisto: 420,
    paybackMeses: 3
  },
  {
    id: "brandforge-infraestrutura",
    nome: "BrandForge Infraestrutura Digital",
    descricao: "Sistema de gestão de conteúdo e presença digital automatizada",
    precoBase: 0,
    modulos: [
      { id: "calendario-editorial", nome: "Calendário Editorial", preco: 5760, obrigatorio: false, economiaMensal: 800 },
      { id: "funil-digital-crm", nome: "Funil Digital + Painel Admin + CRM", preco: 8200, obrigatorio: false, economiaMensal: 1500 },
      { id: "area-cliente", nome: "Área do Cliente", preco: 2800, obrigatorio: false, economiaMensal: 700 }
    ],
    icon: Target,
    cor: "pink",
    roiPrevisto: 380,
    paybackMeses: 5
  },
  {
    id: "timeos-integration",
    nome: "TimeOS - Integração dos agentes ao Whatsapp e Inteligência de Mercado",
    descricao: "Sistema completo de integração com WhatsApp e análise inteligente de mercado",
    precoBase: 18720,
    economiaMensal: 1800, // automação de atendimento e inteligência
    modulos: [],
    icon: MessageSquare,
    cor: "cyan",
    roiPrevisto: 450,
    paybackMeses: 4
  }
];

interface Step5OtimizarProps {
  onComplete: () => void;
  sessionId?: string;
}

export const Step5Otimizar = ({ onComplete, sessionId }: Step5OtimizarProps) => {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showOrcamento, setShowOrcamento] = useState(false);

  // Estado do modelo de precificação
  const [modeloPrecificacao, setModeloPrecificacao] = useState<'licenca' | 'assinatura'>('licenca');

  // Estado do carrinho de compras
  const [carrinho, setCarrinho] = useState<{
    [key: string]: {
      selecionado: boolean;
      modulos: { [key: string]: boolean };
    };
  }>({});

  // Estado debounced do carrinho (300ms)
  const debouncedCarrinho = useDebounce(carrinho, 300);

  // Receita/economia mensal estimada dinâmica com base nas seleções
  const calcularEconomiaMensal = (cartState = debouncedCarrinho) => {
    let economia = 0;
    Object.entries(cartState).forEach(([produtoId, config]) => {
      if (!config.selecionado) return;
      const produto = orcamentoOptions.find(p => p.id === produtoId);
      if (!produto) return;
      if (produto.economiaMensal) economia += produto.economiaMensal;
      produto.modulos.forEach(modulo => {
        if (config.modulos[modulo.id] && modulo.economiaMensal) economia += modulo.economiaMensal;
      });
    });
    return economia;
  };

  const receitaMensalEstimada = calcularEconomiaMensal(debouncedCarrinho);

  // Auto-select products for assinatura model
  useEffect(() => {
    if (modeloPrecificacao === 'assinatura') {
      const novosProdutos: Record<string, { selecionado: boolean; modulos: Record<string, boolean> }> = {};
      orcamentoOptions.forEach(produto => {
        if (produto.id !== 'timeos-integration') {
          novosProdutos[produto.id] = { selecionado: true, modulos: {} };
          produto.modulos.forEach(modulo => {
            if (modulo.obrigatorio) {
              novosProdutos[produto.id].modulos[modulo.id] = true;
            }
          });
        }
      });
      setCarrinho(novosProdutos);
    } else {
      setCarrinho({});
    }
  }, [modeloPrecificacao]);

  const startSimulation = () => {
    setIsSimulating(!isSimulating);
  };



  // Funções do carrinho de compras
  const toggleProduto = (produtoId: string) => {
    setCarrinho(prev => ({
      ...prev,
      [produtoId]: {
        selecionado: prev[produtoId]?.selecionado ? !prev[produtoId].selecionado : true,
        modulos: prev[produtoId]?.modulos ?? {}
      }
    }));
  };

  const toggleModulo = (produtoId: string, moduloId: string) => {
    setCarrinho(prev => ({
      ...prev,
      [produtoId]: {
        selecionado: prev[produtoId]?.selecionado ?? false,
        modulos: {
          ...prev[produtoId]?.modulos,
          [moduloId]: prev[produtoId]?.modulos?.[moduloId] ? !prev[produtoId].modulos[moduloId] : true
        }
      }
    }));
  };

  // Cálculo de custos totais baseado no modelo de precificação
  const calcularCustoTotal = (cartState = debouncedCarrinho) => {
    if (modeloPrecificacao === 'assinatura') {
      const VALOR_COMBO_MENSAL = 2870; // Valor fixo para combo sem TimeOS
      const VALOR_TIMEOS_MENSAL = 1490; // Valor para TimeOS individual
      let temCombo = false;
      let temTimeOS = false;
      Object.entries(cartState).forEach(([produtoId, config]) => {
        if (config.selecionado) {
          if (produtoId === 'timeos-integration') temTimeOS = true;
          else temCombo = true;
        }
      });
      return (temCombo ? VALOR_COMBO_MENSAL : 0) + (temTimeOS ? VALOR_TIMEOS_MENSAL : 0);
    }
    // Licença permanente: soma dos preços-base e módulos
    let total = 0;
    Object.entries(cartState).forEach(([produtoId, config]) => {
      if (config.selecionado) {
        const produto = orcamentoOptions.find(p => p.id === produtoId);
        if (produto) {
          total += produto.precoBase;
          produto.modulos.forEach(modulo => {
            if (config.modulos[modulo.id]) total += modulo.preco;
          });
        }
      }
    });
    return total;
  };

  // Cálculo de ROI baseado no modelo de precificação
  const calcularROI = (cartState = debouncedCarrinho) => {
    const custoTotal = calcularCustoTotal(cartState);
    if (custoTotal === 0) return { porcentagem: 0, paybackMeses: 0, retornoMensal: 0 };

    // Economia mensal baseada nas seleções do carrinho
    const economiaMensal = receitaMensalEstimada;
    const retornoMensal = economiaMensal;

    let paybackMeses: number;
    let roiAnual: number;

    if (modeloPrecificacao === 'assinatura') {
      // Para assinatura, o custo é mensal e fixo
      paybackMeses = Math.ceil(custoTotal / economiaMensal);
      roiAnual = ((retornoMensal * 12) / (custoTotal * 12)) * 100;
    } else {
      // Para licença permanente, custo é único
      paybackMeses = Math.ceil(custoTotal / economiaMensal);
      roiAnual = ((retornoMensal * 12) / custoTotal) * 100;
    }

    return {
      porcentagem: Math.round(roiAnual),
      paybackMeses,
      retornoMensal: Math.round(retornoMensal)
    };
  };

  const custoTotal = calcularCustoTotal(debouncedCarrinho);
  const roiData = calcularROI(debouncedCarrinho);

  // Para o Step Card de ROI, calcular investimento total considerando assinatura
  const investimentoTotalAnual = modeloPrecificacao === 'assinatura' ? custoTotal * 12 : custoTotal;

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-5 rounded-full text-step-5 font-medium mb-6">
            🔴 ETAPA 5
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-5 to-step-1 bg-clip-text text-transparent">
            OTIMIZAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O Futuro Integrado: Veja como todos os sistemas trabalham juntos no TimeOS.
          </p>
        </header>

        {/* Cockpit Simulado */}
        <div className="max-w-7xl mx-auto mb-12">
          <div className="step-card step-5 p-8">
            {/* Header do Dashboard */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">TimeOS Dashboard</h2>
                <p className="text-muted-foreground">Visão unificada da sua clínica</p>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startSimulation}
                  className={`${isSimulating ? 'bg-step-5 text-primary-foreground' : ''}`}
                >
                  <Settings className={`w-4 h-4 mr-2 ${isSimulating ? 'animate-spin' : ''}`} />
                  {isSimulating ? 'Simulando...' : 'Simular'}
                </Button>
                <Badge variant="secondary" className="bg-step-5/20 text-step-5">
                  TEMPO REAL
                </Badge>
              </div>
            </div>

            {/* Grid de Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {widgets.map((widget, index) => {
                const Icon = widget.icon;
                const isActive = activeWidget === widget.id;
                
                return (
                  <div
                    key={widget.id}
                    className={`interactive-card p-6 cursor-pointer transition-all duration-300 animate-scale-in ${
                      isActive ? 'scale-105 shadow-elegant' : ''
                    } ${isSimulating ? 'animate-glow-pulse' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => setActiveWidget(widget.id)}
                    onMouseLeave={() => setActiveWidget(null)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 bg-${widget.cor}/20 rounded-lg`}>
                        <Icon className={`w-5 h-5 text-${widget.cor}`} />
                      </div>
                      <div className={`text-xs font-medium px-2 py-1 rounded-full bg-${widget.cor}/10 text-${widget.cor}`}>
                        {widget.tendencia}
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-2xl font-bold mb-1">{widget.valor}</div>
                      <div className="text-sm text-muted-foreground">{widget.titulo}</div>
                    </div>

                    {isActive && (
                      <div className="mt-4 pt-4 border-t border-border animate-fade-in">
                        <p className="text-xs text-muted-foreground">
                          {widget.detalhes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Fluxo de Integrações */}
            <div className="border-t border-border pt-8">
              <h3 className="text-lg font-semibold mb-6 text-center">Sistemas Integrados</h3>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {integracoes.map((integracao, index) => (
                  <div
                    key={integracao}
                    className={`flex items-center gap-2 px-4 py-2 bg-muted/20 rounded-full text-sm animate-fade-in ${
                      isSimulating ? 'animate-glow-pulse' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-step-5 animate-pulse" />
                    {integracao}
                  </div>
                ))}
              </div>
              
              {/* Conexões Visuais */}
              {isSimulating && (
                <div className="mt-6 text-center animate-fade-in">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-step-5/10 rounded-full">
                    <Activity className="w-4 h-4 text-step-5 animate-pulse" />
                    <span className="text-sm text-step-5">Sincronizando dados em tempo real...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Resultados Projetados */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Impacto Esperado em 12 meses</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="step-card step-5 text-center animate-slide-up">
              <TrendingUp className="w-8 h-8 text-step-5 mx-auto mb-4" />
              <div className="text-3xl font-bold text-step-5 mb-2">+65%</div>
              <div className="text-sm text-muted-foreground">Aumento na receita</div>
            </div>
            <div className="step-card step-5 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Clock className="w-8 h-8 text-step-5 mx-auto mb-4" />
              <div className="text-3xl font-bold text-step-5 mb-2">-80%</div>
              <div className="text-sm text-muted-foreground">Redução em tarefas manuais</div>
            </div>
            <div className="step-card step-5 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Users className="w-8 h-8 text-step-5 mx-auto mb-4" />
              <div className="text-3xl font-bold text-step-5 mb-2">+450%</div>
              <div className="text-sm text-muted-foreground">Pacientes reativados</div>
            </div>
          </div>

          {/* ROI Summary */}
          <div className="mt-8 step-card step-5 text-center animate-slide-up">
            <h4 className="text-xl font-bold mb-4">Retorno sobre Investimento</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Investimento Total (12 meses)</div>
                <div className="text-2xl font-bold">R$ {investimentoTotalAnual.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Retorno Projetado</div>
                <div className="text-2xl font-bold text-step-5">R$ {(roiData.retornoMensal * 12).toLocaleString()}</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-step-5/10 rounded-lg">
              <div className="text-lg font-bold text-step-5">ROI: {roiData.porcentagem}%</div>
              <div className="text-sm text-muted-foreground">Payback em {roiData.paybackMeses} meses</div>
            </div>
          </div>
        </div>

                 {/* Seção de Composição de Orçamento */}
         {showOrcamento && (
           <div className="max-w-7xl mx-auto mb-20">
             <Card className="bg-gradient-to-br from-slate-900/90 to-blue-900/90 border border-blue-400/30 backdrop-blur-sm">
               <CardHeader className="relative text-center pb-8">
                 <Button
                   variant="ghost"
                   size="sm"
                   className="absolute top-4 right-4 text-white hover:bg-white/10"
                   onClick={() => setShowOrcamento(false)}
                   aria-label="Fechar composer de orçamento"
                 >
                   <X className="w-4 h-4" />
                 </Button>
                 <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-400/30 rounded-full text-green-300 mb-4">
                   <ShoppingCart className="w-4 h-4" />
                   <span className="text-sm font-medium">COMPOSITOR DE ORÇAMENTO</span>
                 </div>
                 <CardTitle className="text-3xl font-bold text-white mb-2">
                   Personalize Sua Solução
                 </CardTitle>
                 <CardDescription className="text-blue-100/70 text-lg mb-6">
                   Selecione os módulos que fazem sentido para sua clínica e veja o ROI em tempo real
                 </CardDescription>

                 {/* Toggle Modelo de Precificação */}
                 <div className="flex items-center justify-center mb-6">
                   <div className="relative inline-flex h-12 items-center rounded-full bg-white/10 p-1 backdrop-blur-sm border border-white/20">
                     <button
                       onClick={() => setModeloPrecificacao('licenca')}
                       className={`relative inline-flex h-8 items-center rounded-full px-6 text-sm font-medium transition-all duration-300 ${
                         modeloPrecificacao === 'licenca'
                           ? 'text-white bg-blue-500/80 shadow-lg'
                           : 'text-blue-100/70 hover:text-white'
                       }`}
                     >
                       Licença Permanente
                     </button>
                     <button
                       onClick={() => setModeloPrecificacao('assinatura')}
                       className={`relative inline-flex h-8 items-center rounded-full px-6 text-sm font-medium transition-all duration-300 ${
                         modeloPrecificacao === 'assinatura'
                           ? 'text-white bg-blue-500/80 shadow-lg'
                           : 'text-blue-100/70 hover:text-white'
                       }`}
                     >
                       Assinatura Mensal
                     </button>
                   </div>
                 </div>

                 {custoTotal > 0 && (
                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-400/30 rounded-full">
                     <span className="text-green-300 text-sm font-medium">
                       {modeloPrecificacao === 'assinatura' ? 'Custo Mensal:' : 'Investimento Total:'}
                     </span>
                     <span className="text-green-400 font-bold">R$ {custoTotal.toLocaleString()}</span>
                   </div>
                 )}
               </CardHeader>

               <CardContent>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   {/* Produtos Disponíveis */}
                   <div className="space-y-6">
                     <h4 className="text-xl font-bold text-white mb-4">Soluções Disponíveis</h4>

                     {orcamentoOptions.map((produto) => {
                       const ProdutoIcon = produto.icon;
                       const isSelected = carrinho[produto.id]?.selecionado ?? false;

                       return (
                         <Card
                           key={produto.id}
                           className={`transition-all duration-300 cursor-pointer ${
                             isSelected
                               ? 'bg-blue-500/20 border-blue-400/50 ring-2 ring-blue-400/30'
                               : 'bg-white/5 border-white/10 hover:bg-white/10'
                           }`}
                           onClick={() => toggleProduto(produto.id)}
                         >
                           <CardHeader className="pb-4">
                             <div className="flex items-center justify-between">
                               <div className="flex items-center gap-3">
                                 <div className={`p-3 rounded-xl ${
                                   isSelected ? 'bg-blue-500/30' : 'bg-white/10'
                                 }`}>
                                   <ProdutoIcon className={`w-6 h-6 ${
                                     isSelected ? 'text-blue-300' : 'text-white'
                                   }`} />
                                 </div>
                                 <div>
                                   <CardTitle className="text-white text-lg">{produto.nome}</CardTitle>
                                   <CardDescription className="text-blue-100/70">
                                     {produto.descricao}
                                   </CardDescription>
                                 </div>
                               </div>
                               <div className="text-right">
                                 <div className="text-2xl font-bold text-green-400">
                                   R$ {produto.precoBase.toLocaleString()}
                                 </div>
                                 <div className="text-sm text-green-300">investimento inicial</div>
                               </div>
                             </div>
                           </CardHeader>

                           {isSelected && (
                             <CardContent className="pt-0">
                               <div className="space-y-3">
                                 <h5 className="text-sm font-semibold text-white mb-3">Módulos Adicionais</h5>
                                 {produto.modulos.map((modulo) => {
                                   const isModuloSelected = carrinho[produto.id]?.modulos?.[modulo.id] ?? false;

                                   return (
                                     <div
                                       key={modulo.id}
                                       className={`flex items-center justify-between p-3 rounded-lg transition-all cursor-pointer ${
                                         isModuloSelected
                                           ? 'bg-blue-500/20 border border-blue-400/30'
                                           : 'bg-white/5 border border-white/10 hover:bg-white/10'
                                       }`}
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         toggleModulo(produto.id, modulo.id);
                                       }}
                                     >
                                       <div className="flex items-center gap-3">
                                         {modulo.obrigatorio ? (
                                           <Check className="w-4 h-4 text-green-400" />
                                         ) : (
                                           <div className={`w-4 h-4 rounded border-2 ${
                                             isModuloSelected ? 'bg-blue-500 border-blue-500' : 'border-white/30'
                                           }`}>
                                             {isModuloSelected && <Check className="w-3 h-3 text-white m-0.5" />}
                                           </div>
                                         )}
                                         <div>
                                           <div className="text-white font-medium">{modulo.nome}</div>
                                           {modulo.obrigatorio && (
                                             <Badge className="bg-green-500/20 text-green-300 text-xs">
                                               Obrigatório
                                             </Badge>
                                           )}
                                         </div>
                                       </div>
                                       <div className="text-green-400 font-bold">
                                         +R$ {modulo.preco.toLocaleString()}
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                             </CardContent>
                           )}
                         </Card>
                       );
                     })}
                   </div>

                   {/* Resumo do Orçamento */}
                   <div className="space-y-6">
                     <h4 className="text-xl font-bold text-white mb-4">Resumo do Orçamento</h4>

                     {/* Resumo dos Produtos Selecionados */}
                     <Card className="bg-white/5 border-white/10">
                       <CardHeader>
                         <CardTitle className="text-white flex items-center gap-2">
                           <ShoppingCart className="w-5 h-5" />
                           Produtos Selecionados
                         </CardTitle>
                       </CardHeader>
                       <CardContent>
                         {Object.keys(carrinho).filter(id => carrinho[id]?.selecionado).length === 0 ? (
                           <p className="text-blue-100/70 text-center py-4">
                             Nenhum produto selecionado
                           </p>
                         ) : (
                           <div className="space-y-3">
                             {Object.entries(carrinho)
                               .filter(([_, config]) => config.selecionado)
                               .map(([produtoId]) => {
                                 const produto = orcamentoOptions.find(p => p.id === produtoId);
                                 if (!produto) return null;

                                 const modulosSelecionados = produto.modulos.filter(
                                   m => carrinho[produtoId]?.modulos?.[m.id]
                                 );

                                 // Calcular preços baseado no modelo de precificação
                                 const precoBaseAjustado = modeloPrecificacao === 'assinatura'
                                   ? (produto.precoBase * 0.8) / 12
                                   : produto.precoBase;

                                 return (
                                   <div key={produtoId} className="p-3 bg-white/5 rounded-lg">
                                     <div className="flex justify-between items-start mb-2">
                                       <h5 className="text-white font-medium">{produto.nome}</h5>
                                       <div className="text-right">
                                         <span className="text-green-400 font-bold">
                                           R$ {precoBaseAjustado.toLocaleString()}
                                         </span>
                                         {modeloPrecificacao === 'assinatura' && (
                                           <div className="text-xs text-green-300">/mês</div>
                                         )}
                                       </div>
                                     </div>
                                     {modulosSelecionados.length > 0 && (
                                       <div className="text-sm text-blue-100/70 space-y-1">
                                         {modulosSelecionados.map(modulo => {
                                           const precoModuloAjustado = modeloPrecificacao === 'assinatura'
                                             ? (modulo.preco * 0.8) / 12
                                             : modulo.preco;

                                           return (
                                             <div key={modulo.id} className="flex justify-between">
                                               <span>• {modulo.nome}</span>
                                               <div className="text-right">
                                                 <span className="text-green-400">
                                                   +R$ {precoModuloAjustado.toLocaleString()}
                                                 </span>
                                                 {modeloPrecificacao === 'assinatura' && (
                                                   <div className="text-xs text-green-300">/mês</div>
                                                 )}
                                               </div>
                                             </div>
                                           );
                                         })}
                                       </div>
                                     )}
                                   </div>
                                 );
                               })}
                           </div>
                         )}
                       </CardContent>
                     </Card>

                     {/* Cálculo de ROI */}
                     <Card className="bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-400/30">
                       <CardHeader>
                         <CardTitle className="text-white flex items-center gap-2">
                           <Calculator className="w-5 h-5 text-green-400" />
                           Calculadora de ROI Inteligente
                         </CardTitle>
                       </CardHeader>
                                             <CardContent>
                        <div className="space-y-4">
                           <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                             <span className="text-white">
                               {modeloPrecificacao === 'assinatura' ? 'Custo Mensal' : 'Investimento Total'}
                             </span>
                             <div className="text-right">
                               <span className="text-green-400 font-bold text-xl">
                                 R$ {custoTotal.toLocaleString()}
                               </span>
                               {modeloPrecificacao === 'assinatura' && (
                                 <div className="text-xs text-green-300">/mês</div>
                               )}
                             </div>
                           </div>

                           {custoTotal > 0 && (
                             <>
                               <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                 <span className="text-white">Economia Mensal Estimada</span>
                                 <span className="text-blue-400 font-bold">
                                   R$ {roiData.retornoMensal.toLocaleString()}
                                 </span>
                               </div>

                               <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                                 <span className="text-white flex items-center gap-2">
                                   <Timer className="w-4 h-4" />
                                   {modeloPrecificacao === 'assinatura' ? 'Break-even' : 'Payback'}
                                 </span>
                                 <span className="text-purple-400 font-bold">
                                   {roiData.paybackMeses} meses
                                 </span>
                               </div>

                               <div className="p-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg border border-green-400/30">
                                 <div className="text-center">
                                   <div className="text-3xl font-bold text-green-400 mb-1">
                                     {roiData.porcentagem}%
                                   </div>
                                   <div className="text-sm text-green-300">
                                     {modeloPrecificacao === 'assinatura'
                                       ? 'ROI Anual (assinatura)'
                                       : 'ROI Projetado (12 meses)'}
                                   </div>
                                 </div>
                               </div>
                             </>
                           )}

                           <div className="text-xs text-blue-100/60 text-center">
                             {modeloPrecificacao === 'assinatura'
                               ? '* Cálculos baseados em economia de 30% nos custos operacionais (assinatura mensal)'
                               : '* Cálculos baseados em economia de 30% nos custos operacionais (investimento único)'}
                           </div>
                         </div>
                       </CardContent>
                     </Card>

                     {/* Ações do Carrinho */}
                     <div className="space-y-3">
                       <div className="flex gap-3">
                         <Button
                           onClick={() => {
                             setShowOrcamento(false);
                             setCarrinho({}); // Limpa o carrinho ao voltar
                           }}
                           variant="outline"
                           className="flex-1 border-white/20 text-white hover:bg-white/10"
                         >
                           <X className="w-4 h-4 mr-2" />
                           Voltar
                         </Button>
                         <Button
                           onClick={() => setCarrinho({})}
                           variant="outline"
                           className="border-red-400/30 text-red-300 hover:bg-red-500/10"
                           disabled={custoTotal === 0}
                         >
                           Limpar Carrinho
                         </Button>
                       </div>
                       <Button
                         onClick={() => {
                           // Build WhatsApp message with cart summary
                           const selections = Object.entries(carrinho)
                             .filter(([, cfg]) => cfg.selecionado)
                             .map(([id]) => orcamentoOptions.find(p => p.id === id)?.nome || id)
                             .map(nome => `- ${nome}`)
                             .join('%0A');
                           const totalStr = custoTotal.toLocaleString();
                           const msg = `Olá, gostaria de solicitar uma proposta detalhada:%0AInvestimento Total: R$ ${totalStr}%0AProdutos:%0A${selections}`;
                           window.open(`https://wa.me/5511943334229?text=${encodeURIComponent(msg)}`, '_blank');
                           // Track action
                           if (sessionId) {
                             trackCtaClick(sessionId, 'solicitar_proposta', { step: 'Otimizar' });
                           }
                           // Complete the step
                           onComplete();
                         }}
                         className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-3"
                         disabled={custoTotal === 0}
                       >
                         Solicitar Proposta Detalhada
                       </Button>
                     </div>
                   </div>
                 </div>
               </CardContent>
             </Card>
           </div>
         )}

         {/* CTA Final - Futurista e Premium */}
         {!showOrcamento && (
           <div className="max-w-4xl mx-auto text-center">
             <div>
               <h4 className="text-3xl font-bold text-white mb-4">
                 Pronto para Transformar Sua Clínica?
               </h4>
               <p className="text-xl text-blue-100/80 mb-8">
                 Esta não é apenas uma proposta. É o futuro da odontologia sendo construído agora mesmo.
               </p>
             </div>

             <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
               <Button
                 onClick={() => {
                   setShowOrcamento(true);
                   if (sessionId) trackCtaClick(sessionId, "customizar_orcamento", { step: "Otimizar" });
                 }}
                 size="lg"
                 className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-500 hover:scale-105 glow-effect"
                 aria-label="Personalizar orçamento com suas necessidades específicas"
               >
                 <ShoppingCart className="w-6 h-6 mr-3" />
                 Customizar Orçamento
               </Button>


             </div>
           </div>
         )}
      </div>
    </section>
  );
};