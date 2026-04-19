import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlassButton } from '@/presentation/components/ui/GlassButton';
import { GlassCard } from '@/presentation/components/ui/GlassCard';
import { StatusBadge } from '@/presentation/components/ui/StatusBadge';

describe('Accessibility — WCAG 2.1 AA Compliance', () => {
  describe('GlassButton Accessibility', () => {
    it('should have role="button" for screen readers', () => {
      render(<GlassButton>Click Me</GlassButton>);
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
    });

    it('should set aria-disabled when disabled', () => {
      render(<GlassButton disabled>Disabled</GlassButton>);
      const button = screen.getByRole('button', { name: /disabled/i });
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should accept custom aria-label', () => {
      render(<GlassButton aria-label="Navigate to scan page">Scan</GlassButton>);
      const button = screen.getByLabelText('Navigate to scan page');
      expect(button).toBeInTheDocument();
    });

    it('should be focusable with keyboard', () => {
      render(<GlassButton>Focus Me</GlassButton>);
      const button = screen.getByRole('button', { name: /focus me/i });
      expect(button.tabIndex).toBeGreaterThanOrEqual(0);
    });
  });

  describe('GlassCard Accessibility', () => {
    it('should render semantic HTML structure', () => {
      render(
        <GlassCard data-testid="card">
          <h2>Section Title</h2>
          <p>Description text</p>
        </GlassCard>
      );
      const card = screen.getByTestId('card');
      expect(card).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Section Title');
    });
  });

  describe('StatusBadge Accessibility', () => {
    it('should render RED status with visible text', () => {
      render(<StatusBadge status="RED" label="Overdue" />);
      expect(screen.getByText('Overdue')).toBeInTheDocument();
    });

    it('should render GREEN status with visible text', () => {
      render(<StatusBadge status="GREEN" label="On Track" />);
      expect(screen.getByText('On Track')).toBeInTheDocument();
    });

    it('should render YELLOW status with visible text', () => {
      render(<StatusBadge status="YELLOW" label="Due Soon" />);
      expect(screen.getByText('Due Soon')).toBeInTheDocument();
    });
  });
});
