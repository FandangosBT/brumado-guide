import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, DollarSign, Users, Clock } from "lucide-react";

interface ROIData {
  clinicType: string;
  monthlyRevenue: number;
  patientsPerMonth: number;
  averageTicket: number;
  manualHours: number;
  employeeCost: number;
}

export const ROICalculator = () => {
  const [formData, setFormData] = useState<ROIData>({
    clinicType: "",
    monthlyRevenue: 0,
    patientsPerMonth: 0,
    averageTicket: 0,
    manualHours: 0,
    employeeCost: 0
  });

  const [showResults, setShowResults] = useState(false);

  const calculateROI = () => {
    const { monthlyRevenue, patientsPerMonth, manualHours, employeeCost } = formData;
    
    // Cálculos baseados nos dados inseridos
    const currentAnnualRevenue = monthlyRevenue * 12;
    const automationSavings = manualHours * employeeCost * 12 * 0.8; // 80% redução
    const reactivatedPatients = patientsPerMonth * 0.4; // 40% de reativação
    const additionalRevenue = reactivatedPatients * formData.averageTicket * 12;
    const efficiencyGains = currentAnnualRevenue * 0.15; // 15% de ganho de eficiência
    
    const totalProjectedGains = automationSavings + additionalRevenue + efficiencyGains;
    const investmentCost = 18500; // Custo fixo do TimeOS
    const roi = ((totalProjectedGains - investmentCost) / investmentCost) * 100;
    const paybackMonths = Math.ceil(investmentCost / (totalProjectedGains / 12));

    return {
      currentAnnualRevenue,
      automationSavings,
      additionalRevenue,
      efficiencyGains,
      totalProjectedGains,
      investmentCost,
      roi,
      paybackMonths,
      reactivatedPatients: Math.floor(reactivatedPatients)
    };
  };

  const handleCalculate = () => {
    if (formData.clinicType && formData.monthlyRevenue > 0) {
      setShowResults(true);
    }
  };

  const results = showResults ? calculateROI() : null;

  const handleInputChange = (field: keyof ROIData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? value : Number(value)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-3 rounded-full text-step-3 font-medium mb-4">
          <Calculator className="w-4 h-4" />
          CALCULADORA ROI
        </div>
        <h2 className="text-3xl font-bold mb-4">
          Calcule o ROI Específico da Sua Clínica
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Insira os dados da sua clínica para ver o impacto real do TimeOS no seu negócio
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário */}
        <Card className="step-card step-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-step-3" />
              Dados da Sua Clínica
            </CardTitle>
            <CardDescription>
              Preencha as informações para um cálculo personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clinicType">Tipo de Clínica</Label>
              <Select value={formData.clinicType} onValueChange={(value) => handleInputChange('clinicType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="odontologia">Odontologia</SelectItem>
                  <SelectItem value="medicina">Medicina Geral</SelectItem>
                  <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                  <SelectItem value="psicologia">Psicologia</SelectItem>
                  <SelectItem value="dermatologia">Dermatologia</SelectItem>
                  <SelectItem value="veterinaria">Veterinária</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue">Receita Mensal (R$)</Label>
                <Input
                  id="monthlyRevenue"
                  type="number"
                  placeholder="Ex: 50000"
                  value={formData.monthlyRevenue || ''}
                  onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="patientsPerMonth">Pacientes/Mês</Label>
                <Input
                  id="patientsPerMonth"
                  type="number"
                  placeholder="Ex: 300"
                  value={formData.patientsPerMonth || ''}
                  onChange={(e) => handleInputChange('patientsPerMonth', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="averageTicket">Ticket Médio (R$)</Label>
                <Input
                  id="averageTicket"
                  type="number"
                  placeholder="Ex: 150"
                  value={formData.averageTicket || ''}
                  onChange={(e) => handleInputChange('averageTicket', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manualHours">Horas Manuais/Mês</Label>
                <Input
                  id="manualHours"
                  type="number"
                  placeholder="Ex: 80"
                  value={formData.manualHours || ''}
                  onChange={(e) => handleInputChange('manualHours', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCost">Custo Funcionário/Hora (R$)</Label>
              <Input
                id="employeeCost"
                type="number"
                placeholder="Ex: 25"
                value={formData.employeeCost || ''}
                onChange={(e) => handleInputChange('employeeCost', e.target.value)}
              />
            </div>

            <Button 
              onClick={handleCalculate}
              className="w-full bg-gradient-hero hover:opacity-90 text-primary-foreground"
              disabled={!formData.clinicType || formData.monthlyRevenue <= 0}
            >
              <Calculator className="w-4 h-4 mr-2" />
              Calcular ROI Personalizado
            </Button>
          </CardContent>
        </Card>

        {/* Resultados */}
        <div className="space-y-6">
          {!showResults ? (
            <Card className="step-card step-3 h-full flex items-center justify-center">
              <CardContent className="text-center">
                <Calculator className="w-16 h-16 text-step-3 mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Preencha os dados para ver seu ROI personalizado
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4 animate-fade-in">
              {/* ROI Principal */}
              <Card className="step-card step-3 text-center">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <TrendingUp className="w-6 h-6 text-step-3" />
                    <span className="text-sm font-medium text-step-3">SEU ROI PERSONALIZADO</span>
                  </div>
                  <div className="text-4xl font-bold text-step-3 mb-2">
                    {results!.roi.toFixed(0)}%
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Payback em {results!.paybackMonths} meses
                  </p>
                </CardContent>
              </Card>

              {/* Detalhamento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="step-card step-3">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-step-3" />
                      <span className="text-sm font-medium">Investimento</span>
                    </div>
                    <div className="text-xl font-bold">
                      R$ {results!.investmentCost.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>

                <Card className="step-card step-3">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-step-3" />
                      <span className="text-sm font-medium">Ganho Anual</span>
                    </div>
                    <div className="text-xl font-bold text-step-3">
                      R$ {results!.totalProjectedGains.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Breakdown dos Ganhos */}
              <Card className="step-card step-3">
                <CardHeader>
                  <CardTitle className="text-lg">Breakdown dos Ganhos Anuais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Economia em Automação</span>
                    </div>
                    <Badge variant="secondary">
                      R$ {results!.automationSavings.toLocaleString('pt-BR')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Receita de Reativação</span>
                    </div>
                    <Badge variant="secondary">
                      R$ {results!.additionalRevenue.toLocaleString('pt-BR')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">Ganhos de Eficiência</span>
                    </div>
                    <Badge variant="secondary">
                      R$ {results!.efficiencyGains.toLocaleString('pt-BR')}
                    </Badge>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Pacientes Reativados Projetados
                      </p>
                      <div className="text-2xl font-bold text-step-3">
                        +{results!.reactivatedPatients} pacientes/ano
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};