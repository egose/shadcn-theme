'use client';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Avatar, AvatarFallback } from '@egose/shadcn-theme/components/ui/avatar';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@egose/shadcn-theme/components/ui/field';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Textarea } from '@egose/shadcn-theme/components/ui/textarea';

import { avatarFallbackFor } from '../../_shared/fixtures';
import { SAVE_ERROR_HINT } from '../fixtures';
import type { SettingsSession } from '../use-settings-session';
import { SaveBar } from './save-bar';

export function ProfileSection({
  state,
  avatarFileName,
  onAvatarChange,
}: {
  state: SettingsSession['profile'];
  avatarFileName: string | null;
  onAvatarChange: (name: string | null) => void;
}) {
  const { draft, update, status, save, discard } = state;

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
              onChange={(event) => onAvatarChange(event.target.files?.[0]?.name ?? null)}
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
