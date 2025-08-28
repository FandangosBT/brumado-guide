# Plano de Adequação à Identidade Visual (Spec Q7 OPS)

Este plano detalha as tarefas para implementar todas as diretrizes do `spec.md` (Identidade Visual Q7 OPS) no app, incluindo CSS tokens, Tailwind, componentes, acessibilidade e performance.

## 1. Tokens Q7 OPS
- [ ] Inserir variáveis CSS `--q7-*` em `src/index.css`:
  - Mapear cores (bg, fg, muted, border, primary, step-1…step-5).  
  - Alias de tipografia (`--q7-font-sans`, `--q7-font-mono`).  
  - Alias de espaçamentos e raios (`--q7-radius-sm/md/lg`).  
  - Alias de sombras (`--q7-shadow-elev-1/2`).  
  - Alias de motion (`--q7-ease-*`, `--q7-dur-*`).

## 2. Configuração do Tailwind
- [ ] Atualizar `tailwind.config.ts`:
  - Expor tokens em `theme.extend.colors`: `bg`, `fg`, `step-{1..5}`, `primary`, etc.  
  - Definir `fontFamily`, `borderRadius`, `boxShadow`, `transitionTimingFunction` e `transitionDuration` usando os tokens `--q7-*`.

## 3. StepNavigation (Barra de Progresso)
- [x] Aplicar `aria-current="step"` no dot ativo.  
- [x] Ampliar área de clique com pseudo-elemento (`before:-inset-4`) para ≥ 40×40px.  
- [x] Usar `motion-safe:animate-glow-pulse` e respeitar `prefers-reduced-motion`.  
- [x] Garantir foco visível (WCAG AA) em botões de navegação.

## 4. StepCard
- [x] Refatorar `.step-card` para usar gradientes de etapa via `--q7-step-N` e sombras via `--q7-shadow-elev-*`.  
- [x] Badges e TagPill herdam cor da etapa (mix 10–15% + dot indicador).  
- [x] Ajustar tipografia e espaçamentos conforme tokens `--q7-text-*` e `--q7-space-*`.

## 5. CTAButton
- [x] Validar contraste mínimo (4.5:1 ou 3:1 para texto grande).  
- [x] Estados `hover` e `focus` respeitam tokens de cor sem quebrar contraste.  
- [x] Foco visível com `outline`/`ring` conforme padrões do spec.

## 6. TagPill (Pills Informativas)
- [x] Background em `color-mix(var(--q7-step-N) 12%, transparent)`.  
- [x] Indicador (dot) com `var(--q7-step-N)`.  
- [x] Animação `fade-in` via token `--q7-dur-base` e `--q7-ease-standard`, desligável com `reduced-motion`.

## 7. Microinterações e Motion
- [x] Substituir transições e durações hardcoded por tokens CSS (`--transition-*`, `--q7-dur-*`).  
- [x] Consolidar utilitários Framer Motion (fadeIn, scaleIn, slideUp, glowPulse) com config de easing/duração.  
- [x] Garantir redução de movimento (`prefers-reduced-motion`) em loops.

## 8. Acessibilidade (WCAG AA+)
- [x] Verificar contraste de texto/UI em todas as telas (Lighthouse A11y ≥ 90).  
- [x] Foco visível em todos os componentes interativos.  
- [x] `aria-label` e `aria-current` definidos corretamente.  
- [x] Tamanho do touch target ≥ 40×40px.

## 9. Performance
- [ ] Usar animações em `transform`/`opacity` em vez de `box-shadow`/`filter`.  
- [ ] Consolidar sombras em tokens e evitar múltiplos loops simultâneos.  
- [ ] Avaliar code-splitting dinâmico para chunks grandes.

## 10. QA e Entrega
- [ ] Escrever testes unitários para StepNavigation, StepCard, CTAButton e TagPill.  
- [ ] Criar testes de integração e E2E cobrindo fluxo completo, acessibilidade e responsividade.  
- [ ] Documentar componentes no Storybook com estados (default, hover, focus, disabled).  
- [ ] Validar checklist final (Lighthouse, accessibility, performance).