'use client';

import { useState } from 'react';
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
import { ToggleGroup, ToggleGroupItem } from '@egose/shadcn-theme/components/ui/toggle-group';
import { HookFormCheckbox } from '@egose/shadcn-theme/components/form/hook-checkbox';
import { HookFormDatePicker } from '@egose/shadcn-theme/components/form/hook-date-picker';
import { HookFormMultiSelect } from '@egose/shadcn-theme/components/form/hook-multi-select';
import { HookFormNativeSelect } from '@egose/shadcn-theme/components/form/hook-native-select';
import { HookFormTextarea } from '@egose/shadcn-theme/components/form/hook-textarea';
import { HookFormTextInput } from '@egose/shadcn-theme/components/form/hook-text-input';

import { ExamplePage, ExampleSection } from '@/components/showcase-shell';
import { simulate } from '../_shared/async-simulation';
import { ExampleStateToolbar, type ExampleState } from '../_shared/example-state-toolbar';

import { DebugStatePanel } from './components/debug-state-panel';
import { ReviewSummary } from './components/review-summary';
import { DEFAULT_LAUNCH_REQUEST, ROLLOUT_WINDOW_OPTIONS, TEAM_OPTIONS } from './fixtures';
import type { LaunchRequestValues, RequestStatus, SimulatedOutcomeChoice } from './types';

/** Fixed delay for the simulated save request (keeps pending states observable). */
const SAVE_DELAY_MS = 400;

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
  const [status, setStatus] = useState<RequestStatus>('draft');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedRevision, setSavedRevision] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);
  // Catalog control: which deterministic outcome the simulated save returns.
  const [simulatedOutcome, setSimulatedOutcome] = useState<SimulatedOutcomeChoice>('success');

  const methods = useForm<LaunchRequestValues>({ defaultValues: DEFAULT_LAUNCH_REQUEST });
  const isDirty = methods.formState.isDirty;

  async function onSubmit(data: LaunchRequestValues) {
    if (saving) return; // duplicate-submit prevention
    setSaving(true);
    setSaveError(null);
    try {
      await simulate(data, {
        outcome: simulatedOutcome,
        delayMs: SAVE_DELAY_MS,
        failureMessage: 'The launch request could not be saved.',
      });
      setStatus('submitted');
      setSavedRevision((revision) => revision + 1);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'The launch request could not be saved.');
    } finally {
      setSaving(false);
    }
  }

  function onInvalid() {
    const firstInvalid = FIELD_ORDER.find((field) => methods.getFieldState(field, methods.formState).invalid);
    if (firstInvalid) methods.setFocus(firstInvalid);
  }

  function confirmDiscard() {
    methods.reset();
    setSaveError(null);
    setDiscardOpen(false);
  }

  return (
    <ExamplePage
      title="Launch Request"
      description="A framed product preview: the launch request form below is the example; the surrounding catalog sidebar and header are not part of it. Fields are grouped by workflow (overview, schedule, ownership, approval) — it deliberately uses only the hook-form fields a launch request needs."
    >
      <ExampleStateToolbar value={viewState} onValueChange={setViewState} states={['loading', 'error', 'loaded']} />

      {/* Catalog tooling: lets a reviewer pick the deterministic save outcome. */}
      <div
        role="group"
        aria-label="Simulated save outcome (catalog control, not part of the product surface)"
        className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2 text-sm"
      >
        <span className="text-muted-foreground text-xs">Simulated save outcome:</span>
        <ToggleGroup
          type="single"
          value={simulatedOutcome}
          onValueChange={(value) => value && setSimulatedOutcome(value as SimulatedOutcomeChoice)}
        >
          <ToggleGroupItem value="success" aria-label="Simulate success">
            Success
          </ToggleGroupItem>
          <ToggleGroupItem value="failure" aria-label="Simulate failure">
            Failure
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

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
            noValidate
            onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
            className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,1fr)]"
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
                  <HookFormTextInput
                    name="projectName"
                    label="Project name"
                    rules={{ required: 'Project name is required.' }}
                  />
                  <HookFormTextarea
                    name="summary"
                    label="Launch summary"
                    rows={4}
                    rules={{ required: 'Launch summary is required.' }}
                  />
                </div>
              </ExampleSection>

              <ExampleSection title="Schedule" description="When the launch rolls out.">
                <div className="grid gap-4 md:grid-cols-2">
                  <HookFormDatePicker
                    name="launchDate"
                    label="Launch date"
                    rules={{ required: 'Launch date is required.' }}
                  />
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
                  <HookFormTextInput
                    name="ownerEmail"
                    label="Owner email"
                    rules={{
                      required: 'Owner email is required.',
                      pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Enter a valid email address.' },
                    }}
                  />
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
                  type="button"
                  variant="secondary"
                  disabled={!isDirty || saving}
                  onClick={() => setDiscardOpen(true)}
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
            </div>

            <div className="space-y-4">
              <ReviewSummary control={methods.control} status={status} />
              <DebugStatePanel control={methods.control} />
            </div>
          </form>

          {/* Confirmation before discarding dirty changes. */}
          <AlertDialog open={discardOpen} onOpenChange={setDiscardOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  This resets every field back to the last saved launch request. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep editing</AlertDialogCancel>
                <AlertDialogAction variant="danger" onClick={confirmDiscard}>
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
