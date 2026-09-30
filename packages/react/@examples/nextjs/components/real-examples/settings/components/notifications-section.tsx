'use client';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@egose/shadcn-theme/components/ui/field';
import { RadioGroup, RadioGroupItem } from '@egose/shadcn-theme/components/ui/radio-group';
import { Switch } from '@egose/shadcn-theme/components/ui/switch';

import { CURRENT_ROLE, SAVE_ERROR_HINT } from '../fixtures';
import type { DigestFrequency } from '../types';
import type { SettingsSession } from '../use-settings-session';
import { SaveBar } from './save-bar';

/**
 * Merges registerable switches into the persisted draft, while the
 * permission-disabled "Security alerts" switch stays fixed (not editable
 * for this role) and is described programmatically.
 */
export function NotificationsSection({ state }: { state: SettingsSession['notifications'] }) {
  const { draft, update, status, save, discard } = state;

  return (
    <form
      aria-label="Notification settings"
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
    >
      <div className="space-y-1">
        <h3 className="text-lg font-medium">Notifications</h3>

        <p className="text-muted-foreground text-sm">
          Account inbox preferences apply across your workspaces and remain available after a workspace is deleted.
          Saving updates mentions, product updates, and digest frequency only.
        </p>
      </div>

      <FieldGroup>
        <Field orientation="horizontal">
          <Switch
            id="settings-notify-mentions"
            checked={draft.mentions}
            onCheckedChange={(checked) => update({ mentions: checked })}
            aria-labelledby="settings-notify-mentions-label"
          />

          <div className="flex flex-col gap-1">
            <FieldLabel id="settings-notify-mentions-label" htmlFor="settings-notify-mentions">
              Mentions
            </FieldLabel>

            <FieldDescription>
              Notify me when someone @-mentions me in a comment in any of my workspaces.
            </FieldDescription>
          </div>
        </Field>

        <Field orientation="horizontal">
          <Switch
            id="settings-notify-product"
            checked={draft.productUpdates}
            onCheckedChange={(checked) => update({ productUpdates: checked })}
            aria-labelledby="settings-notify-product-label"
          />

          <div className="flex flex-col gap-1">
            <FieldLabel id="settings-notify-product-label" htmlFor="settings-notify-product">
              Product updates
            </FieldLabel>
            <FieldDescription>Occasional release notes and roadmap updates.</FieldDescription>
          </div>
        </Field>

        {/* Permission-disabled control: the reason is real text referenced by
            aria-describedby, not styling alone. */}

        <Field orientation="horizontal" data-disabled="true">
          <Switch
            id="settings-notify-security"
            checked
            disabled
            aria-labelledby="settings-notify-security-label"
            aria-describedby="settings-notify-security-reason"
          />

          <div className="flex flex-col gap-1">
            <FieldLabel id="settings-notify-security-label" htmlFor="settings-notify-security">
              Security alerts
            </FieldLabel>

            <FieldDescription id="settings-notify-security-reason">
              Workspace policy reference, not saved with these account preferences: security alerts are mandatory while
              you are a member of an existing workspace. Only an owner can change that workspace policy — your example
              role is {CURRENT_ROLE}.
            </FieldDescription>
          </div>
        </Field>

        <FieldSet>
          <FieldLegend>Digest frequency</FieldLegend>
          <FieldDescription>How often we bundle lower-priority notifications.</FieldDescription>

          <RadioGroup
            aria-label="Digest frequency"
            value={draft.digestFrequency}
            onValueChange={(value) => update({ digestFrequency: value as DigestFrequency })}
            className="gap-3"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="off" id="settings-digest-off" />

              <FieldLabel htmlFor="settings-digest-off" className="font-normal">
                Off
              </FieldLabel>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="daily" id="settings-digest-daily" />

              <FieldLabel htmlFor="settings-digest-daily" className="font-normal">
                Daily
              </FieldLabel>
            </div>

            <div className="flex items-center gap-2">
              <RadioGroupItem value="weekly" id="settings-digest-weekly" />

              <FieldLabel htmlFor="settings-digest-weekly" className="font-normal">
                Weekly
              </FieldLabel>
            </div>
          </RadioGroup>
        </FieldSet>
      </FieldGroup>

      {status === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>Notification settings could not be saved</AlertTitle>
          <AlertDescription>{SAVE_ERROR_HINT}</AlertDescription>
        </Alert>
      )}

      <SaveBar status={status} onDiscard={discard} />
    </form>
  );
}
