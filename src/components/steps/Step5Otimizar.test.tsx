import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Step5Otimizar } from './Step5Otimizar';
import { vi } from 'vitest';

// Mock do SDK
vi.mock('@/lib/sdk', () => ({
  trackWidgetInteraction: vi.fn(),
  trackCtaClick: vi.fn(),
}));

// Mock do PDF generator
vi.mock('@/utils/pdf-generator', () => ({
  generateJourneyPDF: vi.fn(),
}));

describe('Step5Otimizar', () => {
  const mockOnComplete = vi.fn();
  const mockSessionId = 'test-session-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza widgets e permite interação', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} sessionId={mockSessionId} />);

    // Verifica se os widgets são renderizados
    expect(screen.getByText('Taxa de Ocupação')).toBeInTheDocument();
    expect(screen.getByText('Hóspedes Reativados')).toBeInTheDocument();
    expect(screen.getByText('Receita Mensal')).toBeInTheDocument();

    // Verifica se o botão de simulação está presente
    const simulateButton = screen.getByRole('button', { name: /simular/i });
    expect(simulateButton).toBeInTheDocument();

    // Clica no botão de simulação
    await user.click(simulateButton);
    expect(simulateButton).toHaveTextContent('Simulando...');
  });

  it('permite gerar PDF', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} sessionId={mockSessionId} />);

    const pdfButton = screen.getByRole('button', { name: /baixar resumo completo da jornada em pdf/i });
    expect(pdfButton).toBeInTheDocument();

    await user.click(pdfButton);
    // Verifica se o PDF generator foi chamado
    const { generateJourneyPDF } = await import('@/utils/pdf-generator');
    expect(generateJourneyPDF).toHaveBeenCalledWith(mockSessionId);
  });

  it('chama onComplete ao finalizar jornada', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} sessionId={mockSessionId} />);

    const finishButton = screen.getByRole('button', { name: /agendar conversa estratégica para implementar soluções/i });
    expect(finishButton).toBeInTheDocument();

    await user.click(finishButton);
    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('funciona sem sessionId', async () => {
    const user = userEvent.setup();
    render(<Step5Otimizar onComplete={mockOnComplete} />);

    const simulateButton = screen.getByRole('button', { name: /simular/i });
    await user.click(simulateButton);
    
    // Não deve quebrar sem sessionId
    expect(simulateButton).toHaveTextContent('Simulando...');
  });
});
