import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateJourneyPDF, generateScreenshotPDF } from './pdf-generator';

// Mock jsPDF com implementação mais robusta
vi.mock('jspdf', () => {
  const mockJsPDF = vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn().mockReturnThis(),
    setTextColor: vi.fn().mockReturnThis(),
    text: vi.fn().mockReturnThis(),
    addPage: vi.fn().mockReturnThis(),
    save: vi.fn().mockReturnThis(),
    internal: {
      pageSize: {
        getWidth: () => 210,
        getHeight: () => 297,
      },
    },
    setFillColor: vi.fn().mockReturnThis(),
    rect: vi.fn().mockReturnThis(),
  }));
  
  return {
    default: mockJsPDF,
  };
});

// Mock html2canvas com implementação mais robusta
vi.mock('html2canvas', () => {
  const mockHtml2Canvas = vi.fn().mockResolvedValue({
    toDataURL: () => 'data:image/png;base64,test',
    width: 800,
    height: 600,
  });
  
  return {
    default: mockHtml2Canvas,
  };
});

// Mock SDK
vi.mock('@/lib/sdk', () => ({
  trackEvent: vi.fn().mockResolvedValue({ ok: true }),
}));

describe('pdf-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateJourneyPDF', () => {
    it('gera PDF sem sessionId', async () => {
      await expect(generateJourneyPDF()).resolves.not.toThrow();
    });

    it('gera PDF com sessionId', async () => {
      const sessionId = 'test-session-id';
      await expect(generateJourneyPDF(sessionId)).resolves.not.toThrow();
    });

    it('trata erros graciosamente', async () => {
      // Mock jsPDF para lançar erro
      const { default: jsPDF } = await import('jspdf');
      vi.mocked(jsPDF).mockImplementationOnce(() => {
        throw new Error('PDF generation failed');
      });

      await expect(generateJourneyPDF('test-session')).rejects.toThrow('Falha ao gerar o arquivo PDF');
    });
  });

  describe('generateScreenshotPDF', () => {
    it('gera screenshot PDF sem sessionId', async () => {
      // Mock document.getElementById
      const mockElement = document.createElement('div');
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      await expect(generateScreenshotPDF('test-element')).resolves.not.toThrow();
    });

    it('gera screenshot PDF com sessionId', async () => {
      const sessionId = 'test-session-id';
      const mockElement = document.createElement('div');
      vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

      await expect(generateScreenshotPDF('test-element', sessionId)).resolves.not.toThrow();
    });

    it('lança erro quando elemento não encontrado', async () => {
      vi.spyOn(document, 'getElementById').mockReturnValue(null);

      await expect(generateScreenshotPDF('non-existent')).rejects.toThrow('Elemento não encontrado');
    });
  });
});
