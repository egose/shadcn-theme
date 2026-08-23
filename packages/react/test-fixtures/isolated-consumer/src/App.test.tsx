import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { App } from './App';

it('exercises public component, form, hook, utility, layout, and dialog paths', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });

  render(<App />);

  expect(screen.getByRole('navigation', { name: 'Primary navigation' })).toHaveTextContent('Home');
  expect(screen.getByRole('textbox', { name: /^Project/ })).toBeRequired();
  expect(document.querySelector('.consumer-content')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
  await waitFor(() => expect(writeText).toHaveBeenCalledWith('consumer'));
  expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Open dialog' }));
  expect(screen.getByRole('dialog', { name: 'Result dialog' })).toHaveTextContent('Installed tarball dialog');
  fireEvent.click(screen.getByRole('button', { name: 'Accept' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
});
