import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Index from '../pages/Index';
import { AuthProvider } from '@/hooks/use-auth';

// Mock do SDK
vi.mock('@/lib/sdk', () => ({
  startSession: vi.fn().mockResolvedValue({ ok: true }),
  endSession: vi.fn().mockResolvedValue({ ok: true }),
  trackEvent: vi.fn().mockResolvedValue({ ok: true }),
  trackExpand: vi.fn().mockResolvedValue({ ok: true }),
  trackCollapse: vi.fn().mockResolvedValue({ ok: true }),
  trackSelect: vi.fn().mockResolvedValue({ ok: true }),
  trackStepComplete: vi.fn().mockResolvedValue({ ok: true }),
  trackHover: vi.fn().mockResolvedValue({ ok: true }),
  trackClick: vi.fn().mockResolvedValue({ ok: true }),
  trackDwell: vi.fn().mockResolvedValue({ ok: true }),
  trackTooltipShown: vi.fn().mockResolvedValue({ ok: true }),
  trackFlip: vi.fn().mockResolvedValue({ ok: true }),
  trackFavorite: vi.fn().mockResolvedValue({ ok: true }),
  trackTagToggle: vi.fn().mockResolvedValue({ ok: true }),
  trackPilotSelect: vi.fn().mockResolvedValue({ ok: true }),
  trackPilotRecommendedSeen: vi.fn().mockResolvedValue({ ok: true }),
  trackWidgetInteraction: vi.fn().mockResolvedValue({ ok: true }),
  trackCtaClick: vi.fn().mockResolvedValue({ ok: true }),
  submitLead: vi.fn().mockResolvedValue({ ok: true }),
  getSolutions: vi.fn().mockResolvedValue({
    ok: true,
    data: [
      { id: 'sol-1', title: 'Solução 1', category: 'Test', tags: ['test'] },
    ],
  }),
  getPilots: vi.fn().mockResolvedValue({
    ok: true,
    data: [
      { id: 'pil-1', title: 'Piloto 1', focus: 'Test', durationWeeks: 4, recommended: true },
    ],
  }),
  getKpis: vi.fn().mockResolvedValue({
    ok: true,
    data: { demo: true, widgets: [] },
  }),
}));

// Mock do PDF generator
vi.mock('@/utils/pdf-generator', () => ({
  generateJourneyPDF: vi.fn().mockResolvedValue(undefined),
}));

// Mock do router
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
}));

describe('Journey Flow Integration', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('completa fluxo 1→5 com tracking', async () => {
    render(
      <AuthProvider>
        <Index />
      </AuthProvider>
    );

    // Step 1: ESCUTAR
    await waitFor(() => {
      expect(screen.getByText('ESCUTAR')).toBeInTheDocument();
    });

    // Expande um item do accordion
    const accordionItem = screen.getByText('1. Contexto Geral');
    await user.click(accordionItem);

    // Avança para próxima etapa
    const nextButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(nextButton);

    // Step 2: PROCESSAR
    await waitFor(() => {
      expect(screen.getByText('PROCESSAR')).toBeInTheDocument();
    });

    // Interage com o heatmap
    const heatmapPoints = screen.getAllByRole('button');
    if (heatmapPoints.length > 0) {
      await user.hover(heatmapPoints[0]);
    }

    // Avança para próxima etapa
    const processButton = screen.getByRole('button', { name: /identificar as soluções/i });
    await user.click(processButton);

    // Step 3: IDENTIFICAR
    await waitFor(() => {
      expect(screen.getByText('IDENTIFICAR')).toBeInTheDocument();
    });

    // Interage com soluções
    const solutionCards = screen.getAllByText(/Solução/);
    if (solutionCards.length > 0) {
      await user.click(solutionCards[0]);
    }

    // Avança para próxima etapa
    const identifyButton = screen.getByRole('button', { name: /avançar para criação do plano/i });
    await user.click(identifyButton);

    // Step 4: CRIAR
    await waitFor(() => {
      expect(screen.getByText('CRIAR')).toBeInTheDocument();
    });

    // Interage com pilotos
    const pilotCards = screen.getAllByText(/Piloto/);
    if (pilotCards.length > 0) {
      await user.click(pilotCards[0]);
    }

    // Avança para próxima etapa
    const createButton = screen.getByRole('button', { name: /ver o futuro completo/i });
    await user.click(createButton);

    // Step 5: OTIMIZAR
    await waitFor(() => {
      expect(screen.getByText('OTIMIZAR')).toBeInTheDocument();
    });

    // Interage com widgets
    const simulateButton = screen.getByRole('button', { name: /simular/i });
    await user.click(simulateButton);

    // Finaliza jornada
    const finishButton = screen.getByRole('button', { name: /agendar conversa estratégica para implementar soluções/i });
    await user.click(finishButton);

    // Verifica se chegou na tela de conclusão
    await waitFor(() => {
      expect(screen.getByText('Jornada Concluída!')).toBeInTheDocument();
    });
  });

  it('gera PDF ao final da jornada', async () => {
    render(
      <AuthProvider>
        <Index />
      </AuthProvider>
    );

    // Navega até Step 5
    for (let i = 0; i < 4; i++) {
      const nextButton = screen.getByRole('button', { name: /avançar|continuar|identificar as soluções|avançar para criação do plano|ver o futuro completo/i });
      await user.click(nextButton);
      await waitFor(() => {
        expect(screen.getByText(/OTIMIZAR|PROCESSAR|IDENTIFICAR|CRIAR/)).toBeInTheDocument();
      });
    }

    // Clica no botão de PDF
    const pdfButton = screen.getByRole('button', { name: /baixar resumo completo da jornada em pdf/i });
    await user.click(pdfButton);

    // Verifica se PDF foi gerado
    const { generateJourneyPDF } = await import('@/utils/pdf-generator');
    expect(generateJourneyPDF).toHaveBeenCalled();
  });

  it('mantém estado entre etapas', async () => {
    render(
      <AuthProvider>
        <Index />
      </AuthProvider>
    );

    // Step 1: Seleciona problemas
    await waitFor(() => {
      expect(screen.getByText('ESCUTAR')).toBeInTheDocument();
    });

    const accordionItem = screen.getByText('1. Contexto Geral');
    await user.click(accordionItem);

    // Avança e volta
    const nextButton = screen.getByRole('button', { name: /continuar/i });
    await user.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('PROCESSAR')).toBeInTheDocument();
    });

    const backButton = screen.getByRole('button', { name: /voltar/i });
    await user.click(backButton);

    // Verifica se voltou para Step 1
    await waitFor(() => {
      expect(screen.getByText('ESCUTAR')).toBeInTheDocument();
    });
  });
});
