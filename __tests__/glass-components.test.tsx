import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GlassButton } from '@/presentation/components/ui/GlassButton';
import { GlassCard } from '@/presentation/components/ui/GlassCard';

describe('GlassButton Interaction Tests', () => {
  it('renders correctly with primary variant', () => {
    render(<GlassButton variant="primary">Click Me</GlassButton>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('handles click events properly', () => {
    const handleClick = vi.fn();
    render(<GlassButton variant="danger" onClick={handleClick}>Delete</GlassButton>);
    const button = screen.getByRole('button', { name: /delete/i });
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state and prevents clicks', () => {
    const handleClick = vi.fn();
    render(<GlassButton disabled onClick={handleClick}>Submit</GlassButton>);
    const button = screen.getByRole('button', { name: /submit/i });
    
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

describe('GlassCard Rendering Tests', () => {
  it('renders children blocks reliably', () => {
    render(
      <GlassCard data-testid="glass-card">
        <h1>Dashboard</h1>
      </GlassCard>
    );
    const card = screen.getByTestId('glass-card');
    const child = screen.getByRole('heading', { name: /dashboard/i });
    
    expect(card).toContainElement(child);
  });
});
