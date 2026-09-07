import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import DialogPage from '../app/components/dialog/page';

describe('dialog example page', () => {
  it('opens the edit-profile dialog from its trigger and closes it via Cancel', async () => {
    const user = userEvent.setup();
    render(<DialogPage />);

    expect(screen.queryByRole('dialog')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Edit profile' }));
    // Asserts presence and accessible name in one accessible-role query.
    expect(await screen.findByRole('dialog', { name: 'Edit profile' })).toBeTruthy();

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
