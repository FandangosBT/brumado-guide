import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Settings
} from "lucide-react";

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

interface Step5OtimizarProps {
  onComplete: () => void;
}

export const Step5Otimizar = ({ onComplete }: Step5OtimizarProps) => {
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = () => {
    setIsSimulating(!isSimulating);
  };

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
                <div className="text-2xl font-bold">R$ 18.500</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Retorno Projetado</div>
                <div className="text-2xl font-bold text-step-5">R$ 165.000</div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-step-5/10 rounded-lg">
              <div className="text-lg font-bold text-step-5">ROI: 892%</div>
              <div className="text-sm text-muted-foreground">Payback em 3 meses</div>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center animate-slide-up">
          <p className="text-xl text-muted-foreground mb-8">
            Este é o futuro da sua clínica. Totalmente integrado, eficiente e focado nos resultados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onComplete}
              size="lg"
              className="bg-gradient-hero hover:opacity-90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect"
            >
              Agendar Conversa Estratégica
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-step-5 text-step-5 hover:bg-step-5/10 px-8 py-3 text-lg"
            >
              Baixar Resumo PDF
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};