import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StepNavigation } from './StepNavigation';

describe('StepNavigation', () => {
  it('renderiza pontos de progresso e navega', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    render(
      <StepNavigation
        currentStep={1}
        totalSteps={5}
        onPrevious={onPrev}
        onNext={onNext}
        canGoNext
      />
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /avançar/i }));
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});



