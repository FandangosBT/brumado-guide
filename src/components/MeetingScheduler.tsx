import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Phone, MessageSquare, CheckCircle, User, MapPin } from "lucide-react";
import { submitLead, trackCtaClick } from "@/lib/sdk";

interface MeetingData {
  name: string;
  email: string;
  phone: string;
  clinicName: string;
  clinicType: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: string;
  goals: string;
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const meetingTypes = [
  { value: "presencial", label: "Presencial", icon: MapPin },
  { value: "video", label: "Videochamada", icon: MessageSquare },
  { value: "phone", label: "Telefone", icon: Phone }
];

interface MeetingSchedulerProps {
  sessionId?: string;
}

export const MeetingScheduler = ({ sessionId }: MeetingSchedulerProps) => {
  const [formData, setFormData] = useState<MeetingData>({
    name: "",
    email: "",
    phone: "",
    clinicName: "",
    clinicType: "",
    preferredDate: "",
    preferredTime: "",
    meetingType: "",
    goals: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof MeetingData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Submit lead via SDK
      if (sessionId) {
        await submitLead({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          context: {
            clinicName: formData.clinicName,
            clinicType: formData.clinicType,
            preferredDate: formData.preferredDate,
            preferredTime: formData.preferredTime,
            meetingType: formData.meetingType,
            goals: formData.goals,
            source: 'meeting_scheduler'
          },
          ts: Date.now(),
          sessionId
        });
        
        // Track CTA click
        trackCtaClick(sessionId, 'meeting_scheduler_submit', {
          meetingType: formData.meetingType,
          clinicType: formData.clinicType
        });
      }
      
      // Simular delay de processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsLoading(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      setIsLoading(false);
      // Em caso de erro, ainda mostra sucesso para não travar UX
      setIsSubmitted(true);
    }
  };

  const isFormValid = () => {
    return formData.name && 
           formData.email && 
           formData.phone && 
           formData.clinicName &&
           formData.preferredDate &&
           formData.preferredTime &&
           formData.meetingType;
  };

  // Get next available dates (next 7 business days)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (dates.length < 7) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        dates.push(new Date(currentDate));
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="step-card step-4 text-center animate-scale-in">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-6 animate-glow-pulse">
              <CheckCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            
            <h3 className="text-2xl font-bold mb-4">
              Reunião Agendada com Sucesso!
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {new Date(formData.preferredDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formData.preferredTime}</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                {meetingTypes.find(type => type.value === formData.meetingType)?.icon && 
                  (() => {
                    const IconComponent = meetingTypes.find(type => type.value === formData.meetingType)!.icon;
                    return <IconComponent className="w-4 h-4" />;
                  })()
                }
                <span>{meetingTypes.find(type => type.value === formData.meetingType)?.label}</span>
              </div>
            </div>

            <div className="p-4 bg-muted/20 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-2">
                <strong>Próximos passos:</strong>
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 text-left">
                <li>• Você receberá um email de confirmação</li>
                <li>• Nossa equipe entrará em contato 1 dia antes</li>
                <li>• Prepare as informações da sua clínica</li>
                <li>• Tenha suas metas de crescimento em mente</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-gradient-hero hover:opacity-90 text-primary-foreground"
                onClick={() => {
                  if (sessionId) {
                    trackCtaClick(sessionId, 'whatsapp_confirmation', { location: 'meeting_success' });
                  }
                  window.open('https://wa.me/5511999999999?text=Olá! Acabei de agendar uma reunião estratégica. Gostaria de confirmar os detalhes.', '_blank');
                }}
                aria-label="Confirmar agendamento via WhatsApp"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Confirmar no WhatsApp
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    clinicName: "",
                    clinicType: "",
                    preferredDate: "",
                    preferredTime: "",
                    meetingType: "",
                    goals: ""
                  });
                }}
                aria-label="Agendar nova reunião"
              >
                Agendar Outra Reunião
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-step-4 rounded-full text-step-4 font-medium mb-4">
          <Calendar className="w-4 h-4" />
          AGENDAR REUNIÃO
        </div>
        <h2 className="text-3xl font-bold mb-4">
          Vamos Conversar Sobre Sua Transformação
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Agende uma conversa estratégica personalizada para sua clínica. 
          Nossa equipe vai apresentar um plano específico para seus objetivos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Dados Pessoais */}
          <Card className="step-card step-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-step-4" />
                Seus Dados
              </CardTitle>
              <CardDescription>
                Informações para contato e personalização da reunião
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo *</Label>
                <Input
                  id="name"
                  placeholder="Seu nome completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <Input
                    id="phone"
                    placeholder="(11) 99999-9999"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clinicName">Nome da Clínica *</Label>
                  <Input
                    id="clinicName"
                    placeholder="Nome da sua clínica"
                    value={formData.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clinicType">Especialidade</Label>
                  <Select value={formData.clinicType} onValueChange={(value) => handleInputChange('clinicType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="odontologia">Odontologia</SelectItem>
                      <SelectItem value="medicina">Medicina Geral</SelectItem>
                      <SelectItem value="fisioterapia">Fisioterapia</SelectItem>
                      <SelectItem value="psicologia">Psicologia</SelectItem>
                      <SelectItem value="dermatologia">Dermatologia</SelectItem>
                      <SelectItem value="veterinaria">Veterinária</SelectItem>
                      <SelectItem value="outros">Others</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agendamento */}
          <Card className="step-card step-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-step-4" />
                Agendamento
              </CardTitle>
              <CardDescription>
                Escolha data, horário e formato da reunião
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preferredDate">Data Preferida *</Label>
                <Select value={formData.preferredDate} onValueChange={(value) => handleInputChange('preferredDate', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma data" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDates().map((date, index) => (
                      <SelectItem key={index} value={date.toISOString().split('T')[0]}>
                        {date.toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredTime">Horário Preferido *</Label>
                <Select value={formData.preferredTime} onValueChange={(value) => handleInputChange('preferredTime', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Formato da Reunião *</Label>
                <div className="grid grid-cols-1 gap-2">
                  {meetingTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <Button
                        key={type.value}
                        type="button"
                        variant={formData.meetingType === type.value ? "default" : "outline"}
                        className={`justify-start h-auto p-3 ${
                          formData.meetingType === type.value 
                            ? 'bg-gradient-hero text-primary-foreground' 
                            : ''
                        }`}
                        onClick={() => handleInputChange('meetingType', type.value)}
                        aria-label={`Selecionar reunião por ${type.label.toLowerCase()}`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {type.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Objetivos */}
        <Card className="step-card step-4">
          <CardHeader>
            <CardTitle>Objetivos da Reunião</CardTitle>
            <CardDescription>
              Conte-nos sobre seus principais desafios e objetivos (opcional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label htmlFor="goals">Objetivos e Desafios</Label>
              <Textarea
                id="goals"
                placeholder="Ex: Quero aumentar a ocupação da agenda, automatizar processos administrativos, melhorar a experiência dos pacientes..."
                className="min-h-[100px]"
                value={formData.goals}
                onChange={(e) => handleInputChange('goals', e.target.value)}
                aria-label="Descreva seus objetivos e desafios principais"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="text-center">
          <Button
            type="submit"
            size="lg"
            disabled={!isFormValid() || isLoading}
            className="bg-gradient-hero hover:opacity-90 text-primary-foreground px-8 py-3 text-lg transition-all duration-300 hover:scale-105"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Agendando...
              </>
            ) : (
              <>
                <Calendar className="w-5 h-5 mr-2" />
                Confirmar Agendamento
              </>
            )}
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            Duração aproximada: 45 minutos • Sem compromisso • Consultoria gratuita
          </p>
        </div>
      </form>
    </div>
  );
};