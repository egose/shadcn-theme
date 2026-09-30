'use client';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Separator } from '@egose/shadcn-theme/components/ui/separator';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@egose/shadcn-theme/components/ui/field';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { INVITE_URL, SAVE_ERROR_HINT, WORKSPACE_CREATED_AT, WORKSPACE_ID } from '../fixtures';
import type { SettingsSession } from '../use-settings-session';
import { SaveBar } from './save-bar';

export function WorkspaceSection({
  state,
  clipboard,
}: {
  state: SettingsSession['workspace'];
  clipboard: SettingsSession['clipboard'];
}) {
  const { draft, update, status, save, discard } = state;
  const { copied, copyWorkspaceId, effectiveCopyError } = clipboard;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Workspace</h3>

        <p className="text-muted-foreground text-sm">Workspace identity and sharing. Created {WORKSPACE_CREATED_AT}.</p>
      </div>

      <form
        aria-label="Workspace settings"
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          void save();
        }}
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="settings-workspace-name">Workspace name</FieldLabel>

            <Input
              id="settings-workspace-name"
              value={draft.name}
              onChange={(event) => update({ name: event.target.value })}
            />
            <FieldDescription>Shown in navigation, emails, and invitations.</FieldDescription>
          </Field>
        </FieldGroup>

        {status === 'error' && (
          <Alert variant="destructive">
            <AlertTitle>Workspace settings could not be saved</AlertTitle>
            <AlertDescription>{SAVE_ERROR_HINT}</AlertDescription>
          </Alert>
        )}

        <SaveBar status={status} onDiscard={discard} saveBlockedReason={state.saveBlockedReason} />
      </form>

      <Separator />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Workspace ID</h4>

        <div className="flex flex-wrap items-center gap-3">
          <code className="bg-muted rounded px-2 py-1 text-sm break-all">{WORKSPACE_ID}</code>

          <Button type="button" variant="secondary" appearance="outline" size="sm" onClick={copyWorkspaceId}>
            Copy workspace ID
          </Button>
        </div>
        {/* Persistent copy feedback — text, never styling-only. */}

        {copied && !effectiveCopyError && (
          <p role="status" className="text-sm">
            Copied the workspace ID to your clipboard.
          </p>
        )}

        {effectiveCopyError && (
          <p role="alert" className="text-destructive text-sm">
            {effectiveCopyError}
          </p>
        )}
        <p className="text-muted-foreground text-xs break-all">Invite link for reference: {INVITE_URL}</p>
      </div>
    </div>
  );
}
