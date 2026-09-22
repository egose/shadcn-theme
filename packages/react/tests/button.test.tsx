import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { Button, buttonVariants } from '../components/ui/button';
import { cn } from '../utils/ui';

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
    expect(spinner).toHaveClass('size-4', 'text-current');
    expect(spinner).not.toHaveClass('bg-primary');

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it.each(['outline', 'outline-filled', 'ghost', 'link'] as const)(
    'lets consumer classes override %s colors, including the loading text color',
    (appearance) => {
      render(
        <Button variant="action" appearance={appearance} className="text-info border-info hover:bg-info" loading>
          Save changes
        </Button>,
      );

      const button = screen.getByRole('button', { name: /Save changes/ });
      expect(button).toHaveClass('text-info', 'border-info', 'hover:bg-info');
      expect(button).not.toHaveClass('text-action', 'border-action', 'hover:bg-action', 'hover:bg-action/10');
      expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass('text-current');
    },
  );

  it.each(['ghost', 'link'] as const)('supports a semantic action tone with the %s appearance', (appearance) => {
    render(
      <Button variant="action" appearance={appearance}>
        Publish
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Publish' });
    expect(button).toHaveClass('text-action', 'bg-transparent', 'border-0', 'shadow-none');
    expect(button).not.toHaveClass('bg-action', 'text-action-foreground', 'shadow-sm');
    expect(button).toHaveClass(appearance === 'ghost' ? 'hover:bg-action/10' : 'hover:bg-transparent');
    if (appearance === 'link') expect(button).toHaveClass('hover:underline');
  });

  it.each([
    ['secondary', 'text-secondary-foreground'],
    ['light', 'text-foreground'],
  ] as const)('preserves readable neutral outline styling for %s', (variant, textClass) => {
    render(
      <Button variant={variant} appearance="outline" loading>
        Save changes
      </Button>,
    );

    expect(screen.getByRole('button', { name: /Save changes/ })).toHaveClass(
      'bg-background',
      'border-border',
      textClass,
    );
    expect(screen.getByRole('status', { name: 'Loading' })).toHaveClass('text-current');
  });

  it('provides complete outline-filled styling to consumers of the public resolver', () => {
    render(
      <a href="/publish" className={cn(buttonVariants({ variant: 'action', appearance: 'outline-filled' }))}>
        Publish
      </a>,
    );

    const link = screen.getByRole('link', { name: 'Publish' });
    expect(link).toHaveClass(
      'bg-background',
      'border-action',
      'text-action',
      'hover:bg-action',
      'hover:text-action-foreground',
    );
    expect(link).not.toHaveClass('bg-action', 'text-action-foreground', 'hover:bg-action/80', 'hover:bg-action/10');
  });

  it.each(['link', 'ghost'] as const)('keeps the legacy %s variant available', (variant) => {
    render(<Button variant={variant}>Legacy action</Button>);

    const button = screen.getByRole('button', { name: 'Legacy action' });
    expect(button).toHaveClass(variant === 'link' ? 'hover:underline' : 'hover:bg-light');
    expect(button).not.toHaveClass('bg-primary', 'border-primary');
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
