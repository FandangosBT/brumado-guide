import { describe, it, expect } from 'vitest';
import { EventPayloadSchema, LeadPayloadSchema } from './schemas';

describe('schemas', () => {
  it('valida EventPayloadSchema com dados mínimos', () => {
    const data = {
      sessionId: '00000000-0000-4000-8000-000000000000',
      step: 'Geral',
      action: 'click',
      metadata: {},
      ts: Date.now(),
    };
    const parsed = EventPayloadSchema.safeParse(data);
    expect(parsed.success).toBe(true);
  });

  it('rejeita LeadPayloadSchema com email inválido', () => {
    const data = {
      name: 'John Doe',
      email: 'invalid',
      ts: Date.now(),
    };
    const parsed = LeadPayloadSchema.safeParse(data as any);
    expect(parsed.success).toBe(false);
  });
});



