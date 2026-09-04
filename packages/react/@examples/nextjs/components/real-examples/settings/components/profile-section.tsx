'use client';

import { useState } from 'react';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Avatar, AvatarFallback } from '@egose/shadcn-theme/components/ui/avatar';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@egose/shadcn-theme/components/ui/field';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Textarea } from '@egose/shadcn-theme/components/ui/textarea';

import { avatarFallbackFor } from '../../_shared/fixtures';
import { INITIAL_PROFILE, SAVE_ERROR_HINT } from '../fixtures';
import type { SimulatedOutcomeChoice } from '../types';
import { SaveBar } from './save-bar';
import { useSaveSection } from './use-save-section';

export function ProfileSection({ saveOutcome }: { saveOutcome: SimulatedOutcomeChoice }) {
  const { draft, update, status, save, discard } = useSaveSection(INITIAL_PROFILE, saveOutcome);
  // Avatar "upload" is simulated locally: we never read file bytes, we only
  // acknowledge the chosen file name so the flow stays offline and portable.
  const [avatarFileName, setAvatarFileName] = useState<string | null>(null);

  return (
    <form
      aria-label="Profile settings"
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-muted-foreground text-sm">How you appear to other workspace members.</p>
      </div>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="settings-display-name">Display name</FieldLabel>
          <Input
            id="settings-display-name"
            value={draft.displayName}
            onChange={(event) => update({ displayName: event.target.value })}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-bio">Bio</FieldLabel>
          <Textarea id="settings-bio" value={draft.bio} onChange={(event) => update({ bio: event.target.value })} />
        </Field>
        <Field>
          <FieldLabel htmlFor="settings-avatar">Avatar photo</FieldLabel>
          <div className="flex items-center gap-3">
            <Avatar aria-label={`Avatar preview for ${draft.displayName}`}>
              <AvatarFallback>{avatarFallbackFor(draft.displayName)}</AvatarFallback>
            </Avatar>
            <Input
              id="settings-avatar"
              type="file"
              accept="image/*"
              onChange={(event) => setAvatarFileName(event.target.files?.[0]?.name ?? null)}
            />
          </div>
          <FieldDescription>
            {avatarFileName
              ? `Selected “${avatarFileName}” — the upload itself is simulated by this example.`
              : 'The preview shows your initials; no image is stored until you pick a file.'}
          </FieldDescription>
        </Field>
      </FieldGroup>

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Profile could not be saved</AlertTitle>
          <AlertDescription>{SAVE_ERROR_HINT}</AlertDescription>
        </Alert>
      )}

      <SaveBar status={status} onDiscard={discard} />
    </form>
  );
}
