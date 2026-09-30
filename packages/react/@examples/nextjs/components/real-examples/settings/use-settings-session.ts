'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { useClipboard } from '@egose/shadcn-theme/hooks/use-clipboard';

import { INITIAL_BILLING, INITIAL_NOTIFICATIONS, INITIAL_PROFILE, INITIAL_WORKSPACE, WORKSPACE_ID } from './fixtures';
import type { SimulatedOutcome } from '../_shared/async-simulation';
import type { ClipboardBehavior } from './types';
import { useSaveSection } from './components/use-save-section';
import { useWorkspaceDeletion } from './components/use-workspace-deletion';

/**
 * One mounted example is one session. Section navigation and catalog Loading /
 * Error previews may unmount views, but never reset drafts, baselines or requests.
 * A fresh example mount (including reload) starts again from the fixtures.
 */
export function useSettingsSession(outcome: SimulatedOutcome, clipboardBehavior: ClipboardBehavior) {
  const [section, setSection] = useState('profile');
  const deletion = useWorkspaceDeletion(outcome);
  // Profile and editable inbox preferences belong to the account. The security
  // switch in Notifications is workspace-policy reference only, never saved.
  const profile = useSaveSection(INITIAL_PROFILE, outcome);
  const notifications = useSaveSection(INITIAL_NOTIFICATIONS, outcome);
  const workspace = useSaveSection(INITIAL_WORKSPACE, outcome, deletion);
  const billing = useSaveSection(INITIAL_BILLING, outcome, deletion);
  // Only the selected name is acknowledged; no file bytes are stored/uploaded.
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);
  const clipboard = useWorkspaceClipboard(clipboardBehavior);

  return {
    section,
    setSection,
    profile,
    workspace,
    notifications,
    billing,
    deletion,
    avatarFileName,
    setAvatarFileName,
    clipboard,
  };
}

function useWorkspaceClipboard(behavior: ClipboardBehavior) {
  const { copied, copy, error } = useClipboard();
  const [forcedCopyError, setForcedCopyError] = useState<string | null>(null);

  async function copyWorkspaceId() {
    setForcedCopyError(null);
    if (behavior === 'force-failure') {
      setForcedCopyError(
        'Clipboard access was denied (simulated by the catalog tooling). Select the workspace ID and copy it manually instead.',
      );
      toast.error('Could not copy the workspace ID.');
      return;
    }
    await copy(WORKSPACE_ID);
  }

  return { copied, copyWorkspaceId, effectiveCopyError: forcedCopyError ?? error?.message ?? null };
}

export type SettingsSession = ReturnType<typeof useSettingsSession>;
