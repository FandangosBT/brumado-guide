import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { trackEvent } from '@/lib/sdk';

export interface JorneyData {
  step1: {
    problems: string[];
    impacts: string[];
  };
  step2: {
    bottlenecks: string[];
    losses: string;
  };
  step3: {
    solutions: string[];
    benefits: string[];
  };
  step4: {
    integrations: string[];
    features: string[];
  };
  step5: {
    roi: string;
    projections: {
      revenue: string;
      efficiency: string;
      patients: string;
    };
  };
}

export const generateJourneyPDF = async (sessionId?: string): Promise<void> => {
  const startTs = Date.now();
  const sectionsIncluded = ['Escutar', 'Processar', 'Identificar', 'Criar', 'Otimizar'];
  if (sessionId) {
    try {
      await trackEvent({ sessionId, step: 'Otimizar', action: 'pdf_generate_start', metadata: { sections: sectionsIncluded }, ts: startTs } as any);
    } catch {}
  }

  try {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setTextColor(139, 92, 246); // Purple color
    pdf.text('Jornada de Transformação Digital', margin, 30);
    
    pdf.setFontSize(14);
    pdf.setTextColor(100, 100, 100);
    pdf.text('Análise Consultiva TimeOS', margin, 40);

    // Current date
    pdf.setFontSize(10);
    pdf.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, margin, 50);

    let yPosition = 70;

    // Step 1: Escutar
    pdf.setFontSize(16);
    pdf.setTextColor(139, 92, 246);
    pdf.text('1. ESCUTAR - Situação Atual', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const step1Content = [
      '• Identificação de gargalos operacionais',
      '• Mapeamento de processos ineficientes',
      '• Análise da experiência do paciente',
      '• Avaliação da gestão de recursos'
    ];
    
    step1Content.forEach(item => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Step 2: Processar
    pdf.setFontSize(16);
    pdf.setTextColor(59, 130, 246);
    pdf.text('2. PROCESSAR - Diagnóstico', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const step2Content = [
      '• 40 horas mensais perdidas em retrabalho',
      '• R$ 8.500 de potencial não realizado',
      '• 65% de ineficiência operacional',
      '• Falta de integração entre sistemas'
    ];
    
    step2Content.forEach(item => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Step 3: Identificar
    pdf.setFontSize(16);
    pdf.setTextColor(234, 179, 8);
    pdf.text('3. IDENTIFICAR - Soluções', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const step3Content = [
      '• Automação de agendamento inteligente',
      '• CRM integrado para relacionamento',
      '• Gestão automatizada de estoque',
      '• Comunicação proativa com pacientes'
    ];
    
    step3Content.forEach(item => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Step 4: Criar
    pdf.setFontSize(16);
    pdf.setTextColor(249, 115, 22);
    pdf.text('4. CRIAR - Implementação', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const step4Content = [
      '• TimeOS: Plataforma unificada',
      '• Integração com sistemas existentes',
      '• Automação de workflows',
      '• Dashboard de métricas em tempo real'
    ];
    
    step4Content.forEach(item => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += 8;
    });

    yPosition += 10;

    // Check if we need a new page
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 30;
    }

    // Step 5: Otimizar
    pdf.setFontSize(16);
    pdf.setTextColor(239, 68, 68);
    pdf.text('5. OTIMIZAR - Resultados Esperados', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    const step5Content = [
      '• +65% aumento na receita em 12 meses',
      '• -80% redução em tarefas manuais',
      '• +450% pacientes reativados',
      '• ROI: 892% - Payback em 3 meses'
    ];
    
    step5Content.forEach(item => {
      pdf.text(item, margin + 5, yPosition);
      yPosition += 8;
    });

    yPosition += 20;

    // Investment Summary
    pdf.setFillColor(239, 68, 68, 0.1);
    pdf.rect(margin, yPosition - 5, pageWidth - (margin * 2), 40, 'F');
    
    pdf.setFontSize(14);
    pdf.setTextColor(239, 68, 68);
    pdf.text('Resumo do Investimento', margin + 5, yPosition + 10);
    
    pdf.setFontSize(11);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Investimento Total (12 meses): R$ 18.500', margin + 5, yPosition + 20);
    pdf.text('Retorno Projetado: R$ 165.000', margin + 5, yPosition + 28);

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('TimeOS - Transformação Digital para Clínicas', margin, pageHeight - 15);
    pdf.text('Entre em contato: (11) 99999-9999', pageWidth - margin - 60, pageHeight - 15);

    // Save the PDF
    pdf.save('jornada-transformacao-digital.pdf');

    const endTs = Date.now();
    const pages = (pdf as any)?.getNumberOfPages ? (pdf as any).getNumberOfPages() : 1;
    if (sessionId) {
      try {
        await trackEvent({ sessionId, step: 'Otimizar', action: 'pdf_generate_success', metadata: { durationMs: endTs - startTs, pages, sections: sectionsIncluded }, ts: endTs } as any);
      } catch {}
    }
  } catch (error) {
    const endTs = Date.now();
    if (sessionId) {
      try {
        await trackEvent({ sessionId, step: 'Otimizar', action: 'pdf_generate_error', metadata: { message: (error as Error)?.message, sections: sectionsIncluded }, ts: endTs } as any);
      } catch {}
    }
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar o arquivo PDF');
  }
};

export const generateScreenshotPDF = async (elementId: string, sessionId?: string): Promise<void> => {
  const startTs = Date.now();
  if (sessionId) {
    try {
      await trackEvent({ sessionId, step: 'Otimizar', action: 'pdf_screenshot_start', metadata: { selector: elementId }, ts: startTs } as any);
    } catch {}
  }

  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Elemento não encontrado');
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      allowTaint: true,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('resumo-cockpit.pdf');

    const endTs = Date.now();
    const pages = (pdf as any)?.getNumberOfPages ? (pdf as any).getNumberOfPages() : 1;
    if (sessionId) {
      try {
        await trackEvent({ sessionId, step: 'Otimizar', action: 'pdf_screenshot_success', metadata: { durationMs: endTs - startTs, selector: elementId, pages }, ts: endTs } as any);
      } catch {}
    }
  } catch (error) {
    const endTs = Date.now();
    if (sessionId) {
      try {
        await trackEvent({ sessionId, step: 'Otimizar', action: 'pdf_screenshot_error', metadata: { message: (error as Error)?.message, selector: elementId }, ts: endTs } as any);
      } catch {}
    }
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao gerar o arquivo PDF');
  }
};