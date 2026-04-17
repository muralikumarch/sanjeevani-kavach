import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBadge } from '@/presentation/components/ui/StatusBadge';

describe('UI Components', () => {
  it('StatusBadge renders correctly with RED status', () => {
    render(<StatusBadge status="RED" label="Critical Phase" />);
    const badge = screen.getByText('Critical Phase');
    expect(badge).toBeInTheDocument();
  });
});
