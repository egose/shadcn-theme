'use client';

import { useId, useRef, useState, type MouseEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@egose/shadcn-theme/components/ui/alert-dialog';
import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Button } from '@egose/shadcn-theme/components/ui/button';
import { HookFormCheckbox } from '@egose/shadcn-theme/components/form/hook-checkbox';
import { FormError } from '@egose/shadcn-theme/components/form/error';
import { HookFormMultiSelect } from '@egose/shadcn-theme/components/form/hook-multi-select';
import { HookFormNativeSelect } from '@egose/shadcn-theme/components/form/hook-native-select';
import { FormTextarea } from '@egose/shadcn-theme/components/form/textarea';
import { FormTextInput } from '@egose/shadcn-theme/components/form/text-input';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { simulate, type SimulatedOutcome } from '../_shared/async-simulation';
import { ExampleStateToolbar, type ExampleState } from '../_shared/example-state-toolbar';
import { OutcomePicker } from '../_shared/outcome-picker';

import { DebugStatePanel } from './components/debug-state-panel';
import { LaunchDateField } from './components/launch-date-field';
import { ReviewSummary } from './components/review-summary';
import { DEFAULT_LAUNCH_REQUEST, ROLLOUT_WINDOW_OPTIONS, TEAM_OPTIONS } from './fixtures';
import type { LaunchRequestValues, RequestStatus } from './types';

/** Tab order of fields, used to move focus to the first invalid field on submit. */
const FIELD_ORDER: (keyof LaunchRequestValues)[] = [
  'projectName',
  'summary',
  'launchDate',
  'rolloutWindow',
  'ownerEmail',
  'teams',
  'confirmed',
];

export default function LaunchRequestExample() {
  const [viewState, setViewState] = useState<ExampleState>('loaded');
  const [saving, setSaving] = useState(false);
  const saveInFlight = useRef(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedRevision, setSavedRevision] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const discardOpenerRef = useRef<HTMLButtonElement>(null);
  const discardContentRef = useRef<HTMLDivElement>(null);
  const discardFocusOwner = useRef<HTMLFormElement | null>(null);
  const discardConfirmed = useRef(false);
  // Catalog control: which deterministic outcome the simulated save returns.
  const [simulatedOutcome, setSimulatedOutcome] = useState<SimulatedOutcome>('success');

  const methods = useForm<LaunchRequestValues>({ defaultValues: DEFAULT_LAUNCH_REQUEST });
  const fieldId = useId();
  const { errors } = methods.formState;
  const isDirty = methods.formState.isDirty;
  const status: RequestStatus = savedRevision === 0 ? 'draft' : isDirty ? 'unsaved' : 'submitted';

  async function onSubmit(data: LaunchRequestValues) {
    // Validation can settle multiple submissions before React renders the loading state.
    if (saveInFlight.current) return;
    saveInFlight.current = true;
    setSaving(true);
    setSaveError(null);
    try {
      const snapshot = structuredClone(data);
      await simulate(snapshot, {
        outcome: simulatedOutcome,
        failureMessage: 'The launch request could not be saved.',
      });
      // Commit only the submitted snapshot. Keep edits made during the request,
      // recomputing isDirty against the new defaults (even when an edit returned
      // to an OLD default). keepDirtyValues would retain stale dirty flags.
      methods.reset(snapshot, { keepValues: true });
      setSavedRevision((revision) => revision + 1);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'The launch request could not be saved.');
    } finally {
      saveInFlight.current = false;
      setSaving(false);
    }
  }

  function onInvalid() {
    const firstInvalid = FIELD_ORDER.find((field) => methods.getFieldState(field, methods.formState).invalid);
    if (firstInvalid) methods.setFocus(firstInvalid);
  }

  function confirmDiscard(event: MouseEvent<HTMLButtonElement>) {
    if (saveInFlight.current) {
      // AlertDialogAction otherwise closes itself even when reset is rejected.
      event.preventDefault();
      return;
    }
    discardConfirmed.current = true;
    methods.reset();
    setSaveError(null);
    setDiscardOpen(false);
  }

  function restoreDiscardFocus(event: Event) {
    // The external opener is not a Radix Trigger; own restoration explicitly.
    event.preventDefault();
    const owner = discardFocusOwner.current;
    discardFocusOwner.current = null;
    if (!owner?.isConnected || owner !== formRef.current) return;
    const active = owner.ownerDocument.activeElement;
    // Respect navigation/focus moved elsewhere during the closing animation.
    if (active && active !== owner.ownerDocument.body && !discardContentRef.current?.contains(active)) return;
    const opener = discardOpenerRef.current;
    if (!discardConfirmed.current && opener?.isConnected && !opener.disabled) {
      opener.focus();
    } else {
      // SX-02 registers the actual enabled input; wait until Radix close/reset settles.
      methods.setFocus('projectName');
    }
  }

  return (
    <ExamplePage
      title="Launch Request"
      description="A framed product preview: the launch request form below is the example; the surrounding catalog sidebar and header are not part of it. Fields are grouped by workflow (overview, schedule, ownership, approval) — it deliberately uses only the hook-form fields a launch request needs."
    >
      <ExampleStateToolbar
        value={viewState}
        onValueChange={(next) => {
          if (next !== 'loaded') {
            // Leaving the view cancels only the dialog, never the retained draft.
            discardFocusOwner.current = null;
            setDiscardOpen(false);
          }
          setViewState(next);
        }}
        states={['loading', 'error', 'loaded']}
      />
      {/* Catalog tooling: lets a reviewer pick the deterministic save outcome. */}

      <OutcomePicker label="Simulated save outcome" value={simulatedOutcome} onValueChange={setSimulatedOutcome} />
      {viewState === 'loading' && <p role="status">Loading launch request…</p>}

      {viewState === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>The launch request could not be loaded</AlertTitle>

          <AlertDescription>
            <p>Something went wrong while loading the request. Retry to load it again.</p>

            <Button type="button" variant="secondary" size="sm" className="mt-2" onClick={() => setViewState('loaded')}>
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {viewState === 'loaded' && (
        <FormProvider {...methods}>
          <form
            ref={formRef}
            noValidate
            onSubmit={(event) => void methods.handleSubmit(onSubmit, onInvalid)(event)}
            className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]"
          >
            <div className="space-y-6">
              {/* Persistent, visible save outcome (not toast-only). */}

              <div aria-live="polite">
                {saveError && (
                  <Alert variant="destructive">
                    <AlertTitle>Save failed</AlertTitle>

                    <AlertDescription>{saveError} Your edits were kept and you can try again.</AlertDescription>
                  </Alert>
                )}

                {!saveError && savedRevision > 0 && (
                  <p role="status" className="text-sm font-medium">
                    Launch request submitted (revision {savedRevision}).
                  </p>
                )}
              </div>

              {methods.formState.submitCount > 0 && !methods.formState.isValid && (
                <div role="alert" className="rounded-md border border-destructive/50 bg-destructive/5 p-3">
                  <p className="text-destructive text-sm font-medium">The request could not be submitted yet:</p>

                  <ul className="text-destructive mt-1 list-inside list-disc space-y-0.5 text-sm">
                    {FIELD_ORDER.filter((field) => methods.getFieldState(field, methods.formState).invalid).map(
                      (field) => (
                        <li key={field}>{String(methods.getFieldState(field, methods.formState).error?.message)}</li>
                      ),
                    )}
                  </ul>
                </div>
              )}

              <ExampleSection title="Overview" description="What is launching and why.">
                <div className="grid gap-4">
                  <div>
                    <FormTextInput
                      id={`${fieldId}-project`}
                      name="projectName"
                      label="Project name"
                      required
                      aria-invalid={!!errors.projectName}
                      aria-describedby={errors.projectName ? `${fieldId}-project-error` : undefined}
                      inputProps={methods.register('projectName', {
                        required: 'Project name is required.',
                        validate: (value) => value.trim().length > 0 || 'Project name is required.',
                      })}
                    />

                    {errors.projectName && (
                      <div id={`${fieldId}-project-error`}>
                        <FormError field="projectName" className="mt-1" />
                      </div>
                    )}
                  </div>

                  <div>
                    <FormTextarea
                      id={`${fieldId}-summary`}
                      name="summary"
                      label="Launch summary"
                      rows={4}
                      required
                      aria-invalid={!!errors.summary}
                      aria-describedby={errors.summary ? `${fieldId}-summary-error` : undefined}
                      inputProps={methods.register('summary', {
                        required: 'Launch summary is required.',
                        validate: (value) => value.trim().length > 0 || 'Launch summary is required.',
                      })}
                    />

                    {errors.summary && (
                      <div id={`${fieldId}-summary-error`}>
                        <FormError field="summary" className="mt-1" />
                      </div>
                    )}
                  </div>
                </div>
              </ExampleSection>

              <ExampleSection title="Schedule" description="When the launch rolls out.">
                <div className="grid gap-4 md:grid-cols-2">
                  <LaunchDateField control={methods.control} />

                  <HookFormNativeSelect
                    name="rolloutWindow"
                    label="Rollout window"
                    data={ROLLOUT_WINDOW_OPTIONS}
                    rules={{ required: 'Rollout window is required.' }}
                  />
                </div>
              </ExampleSection>

              <ExampleSection title="Ownership" description="Who is accountable for the launch.">
                <div className="grid gap-4">
                  <div>
                    <FormTextInput
                      id={`${fieldId}-owner`}
                      name="ownerEmail"
                      label="Owner email"
                      required
                      aria-invalid={!!errors.ownerEmail}
                      aria-describedby={errors.ownerEmail ? `${fieldId}-owner-error` : undefined}
                      inputProps={methods.register('ownerEmail', {
                        required: 'Owner email is required.',
                        pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email address.' },
                      })}
                    />

                    {errors.ownerEmail && (
                      <div id={`${fieldId}-owner-error`}>
                        <FormError field="ownerEmail" className="mt-1" />
                      </div>
                    )}
                  </div>

                  <HookFormMultiSelect
                    name="teams"
                    label="Owning teams"
                    data={TEAM_OPTIONS}
                    placeholder="Add a team"
                    rules={{ validate: (value: string[]) => value.length > 0 || 'Select at least one team.' }}
                  />
                </div>
              </ExampleSection>

              <ExampleSection title="Approval" description="Confirmation required before submission.">
                <HookFormCheckbox
                  name="confirmed"
                  label="I confirm the rollout checklist has been reviewed with stakeholders"
                  rules={{ validate: (value: boolean) => value || 'Approval is required before submitting.' }}
                />
              </ExampleSection>

              <div className="flex flex-wrap items-center gap-3">
                <Button type="submit" loading={saving} disabled={saving}>
                  Submit launch request
                </Button>

                <Button
                  ref={discardOpenerRef}
                  type="button"
                  variant="secondary"
                  disabled={!isDirty || saving}
                  onClick={() => {
                    if (saveInFlight.current || !isDirty) return;
                    discardConfirmed.current = false;
                    discardFocusOwner.current = formRef.current;
                    setDiscardOpen(true);
                  }}
                >
                  Discard changes
                </Button>

                <p role="status" className="text-muted-foreground text-sm">
                  {saving
                    ? 'Saving…'
                    : isDirty
                      ? 'You have unsaved changes.'
                      : 'All changes are reflected in the saved request.'}
                </p>
              </div>

              {saving && (
                <p className="text-muted-foreground text-sm">
                  Saving the submitted snapshot. You can keep editing; newer changes will remain unsaved.
                </p>
              )}
            </div>

            <div className="space-y-4">
              <ReviewSummary control={methods.control} status={status} savedRevision={savedRevision} />

              <DebugStatePanel control={methods.control} />
            </div>
          </form>
          {/* Confirmation before discarding dirty changes. */}

          <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
            <AlertDialogContent ref={discardContentRef} onCloseAutoFocus={restoreDiscardFocus}>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>

                <AlertDialogDescription>
                  This resets every field back to the last saved launch request. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>

                <AlertDialogAction variant="danger" disabled={saving} onClick={confirmDiscard}>
                  Discard changes
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </FormProvider>
      )}
    </ExamplePage>
  );
}
