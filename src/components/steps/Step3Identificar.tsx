import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Package, Megaphone, RotateCcw } from "lucide-react";

const solucoes = [
  {
    id: "opsunit-agenda",
    nome: "OpsUnit Agenda",
    categoria: "Gestão de Agenda",
    icon: Calendar,
    cores: { primary: "step-3", secondary: "step-4" },
    resumo: "Automatização completa de agendamentos",
    impacto: "Alto Impacto",
    descricao: "Sistema inteligente que elimina conflitos de horário, envia lembretes automáticos e otimiza a ocupação da agenda. Integração com WhatsApp e confirmação automática.",
    beneficios: [
      "Reduz conflitos em 95%",
      "Automatiza confirmações",
      "Otimiza ocupação",
      "Integra comunicação"
    ]
  },
  {
    id: "opsunit-crm",
    nome: "OpsUnit CRM",
    categoria: "Relacionamento",
    icon: Users,
    cores: { primary: "step-3", secondary: "step-4" },
    resumo: "Gestão inteligente de pacientes",
    impacto: "Alto Impacto",
    descricao: "CRM especializado para clínicas com follow-up automático, segmentação de pacientes e campanhas personalizadas para reativação e fidelização.",
    beneficios: [
      "Reativa 40% dos inativos",
      "Automatiza follow-up",
      "Segmenta pacientes",
      "Personaliza comunicação"
    ]
  },
  {
    id: "opsunit-estoque",
    nome: "OpsUnit Estoque",
    categoria: "Controle de Estoque",
    icon: Package,
    cores: { primary: "step-3", secondary: "step-4" },
    resumo: "Controle inteligente de medicamentos",
    impacto: "Médio Impacto",
    descricao: "Sistema de controle de estoque com alertas de vencimento, gestão de fornecedores e relatórios de consumo para otimizar compras.",
    beneficios: [
      "Elimina vencimentos",
      "Otimiza compras",
      "Controla fornecedores",
      "Gera relatórios"
    ]
  },
  {
    id: "brandforge-content",
    nome: "BrandForge Content",
    categoria: "Marketing de Conteúdo",
    icon: Megaphone,
    cores: { primary: "step-3", secondary: "step-5" },
    resumo: "Criação automatizada de conteúdo",
    impacto: "Médio Impacto",
    descricao: "Plataforma que gera conteúdo educativo personalizado para redes sociais, campanhas de email e materiais informativos para pacientes.",
    beneficios: [
      "Conteúdo personalizado",
      "Automatiza postagens",
      "Educa pacientes",
      "Fortalece marca"
    ]
  }
];

interface Step3IdentificarProps {
  onNext: () => void;
}

export const Step3Identificar = ({ onNext }: Step3IdentificarProps) => {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleCard = (id: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(id)) {
      newFlipped.delete(id);
    } else {
      newFlipped.add(id);
    }
    setFlippedCards(newFlipped);
  };

  return (
    <section className="min-h-screen flex flex-col justify-center py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-3 rounded-full text-step-3 font-medium mb-6">
            🟡 ETAPA 3
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-step-3 to-step-4 bg-clip-text text-transparent">
            IDENTIFICAR
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            O que já existe que pode resolver? Apresentamos soluções potenciais com nome e branding.
          </p>
        </header>

        {/* Cards Flipáveis */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solucoes.map((solucao, index) => {
              const Icon = solucao.icon;
              const isFlipped = flippedCards.has(solucao.id);
              
              return (
                <div
                  key={solucao.id}
                  className={`flip-card ${isFlipped ? 'flipped' : ''} animate-scale-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => toggleCard(solucao.id)}
                >
                  <div className="flip-card-inner">
                    {/* Frente do Card */}
                    <div className={`flip-card-front step-card step-3 flex flex-col items-center justify-center text-center p-8`}>
                      <div className="p-4 bg-step-3/20 rounded-2xl mb-6">
                        <Icon className="w-12 h-12 text-step-3" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{solucao.nome}</h3>
                      <p className="text-muted-foreground mb-4">{solucao.resumo}</p>
                      <Badge 
                        variant="secondary" 
                        className={`${
                          solucao.impacto === "Alto Impacto" 
                            ? "bg-step-3/20 text-step-3" 
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {solucao.impacto}
                      </Badge>
                      <div className="mt-6 text-sm text-muted-foreground flex items-center gap-2">
                        <RotateCcw className="w-4 h-4" />
                        Clique para detalhes
                      </div>
                    </div>

                    {/* Verso do Card */}
                    <div className={`flip-card-back step-card step-3 p-8`}>
                      <div className="h-full flex flex-col">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-step-3/20 rounded-lg">
                            <Icon className="w-6 h-6 text-step-3" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold">{solucao.nome}</h3>
                            <div className="text-sm text-step-3">{solucao.categoria}</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                          {solucao.descricao}
                        </p>

                        <div className="flex-1">
                          <h4 className="font-medium mb-3 text-step-3">Benefícios Principais:</h4>
                          <ul className="space-y-2">
                            {solucao.beneficios.map((beneficio, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-step-3" />
                                {beneficio}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-6 text-xs text-muted-foreground flex items-center gap-2">
                          <RotateCcw className="w-3 h-3" />
                          Clique novamente para voltar
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resumo das Categorias */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-step-3 rounded-xl">
              <div className="text-2xl font-bold text-step-3 mb-1">2</div>
              <div className="text-xs text-step-3">Alto Impacto</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-bold text-muted-foreground mb-1">2</div>
              <div className="text-xs text-muted-foreground">Médio Impacto</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-bold text-muted-foreground mb-1">4</div>
              <div className="text-xs text-muted-foreground">Soluções</div>
            </div>
            <div className="text-center p-4 bg-muted/20 rounded-xl">
              <div className="text-2xl font-bold text-muted-foreground mb-1">100%</div>
              <div className="text-xs text-muted-foreground">Cobertura</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center animate-slide-up">
          <p className="text-muted-foreground mb-6">
            Essas soluções podem transformar sua operação. Vamos ver como começar?
          </p>
          <Button 
            onClick={onNext}
            size="lg"
            className="bg-step-3 hover:bg-step-3/90 text-primary-foreground font-semibold px-8 py-3 text-lg glow-effect"
          >
            Vamos criar os pilotos
          </Button>
        </div>
      </div>
    </section>
  );
};