import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button } from '../components/ui/button';

describe('public component behavior', () => {
  it('preserves button semantics and blocks interaction while loading', () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole('button', { name: /Save changes/ });
    const spinner = screen.getByRole('status', { name: 'Loading' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(spinner).toHaveClass('size-4', 'text-primary-foreground');
    expect(spinner).not.toHaveClass('bg-primary');

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes alert content through the alert accessibility role', () => {
    render(
      <Alert>
        <AlertTitle>Connection lost</AlertTitle>
        <AlertDescription>Try again in a moment.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Connection lost');
    expect(screen.getByRole('alert')).toHaveTextContent('Try again in a moment.');
  });
});
