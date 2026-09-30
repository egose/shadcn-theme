'use client';

import type { Control } from 'react-hook-form';
import { useWatch } from 'react-hook-form';

import { VALUE_LABELS } from '../fixtures';
import type { LaunchRequestValues, RequestStatus } from '../types';

/**
 * User-facing review panel for the launch request.
 *
 * Subscribes only to the fields it displays via scoped `useWatch` calls (one
 * per workflow group) instead of a broad `watch()` over the whole form, and
 * renders readable text — the raw JSON state is available separately behind
 * the labeled debug disclosure on the main surface.
 */
export function ReviewSummary({
  control,
  status,
  savedRevision,
}: {
  control: Control<LaunchRequestValues>;
  status: RequestStatus;
  savedRevision: number;
}) {
  const overview = useWatch({ control, name: ['projectName', 'summary'] });
  const schedule = useWatch({ control, name: ['launchDate', 'rolloutWindow'] });
  const ownership = useWatch({ control, name: ['ownerEmail', 'teams'] });

  const [projectName, summary] = overview;
  const [launchDate, rolloutWindow] = schedule;
  const [ownerEmail, teams] = ownership;
  const statusLabel = status === 'submitted' ? 'Submitted' : status === 'unsaved' ? 'Unsaved changes' : 'Draft';

  return (
    <section aria-label="Launch request review" className="space-y-4 rounded-xl border bg-muted/20 p-4">

      <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-medium">Review</h3>

        <span aria-label={`Request status: ${statusLabel}`} className="text-muted-foreground text-xs">
                    Status: {statusLabel}

        </span>

      </div>

      {status === 'unsaved' && (
        <p className="text-muted-foreground text-xs">
                    Showing current unsaved edits. Submitted revision {savedRevision} is unchanged.
        </p>
      )}

      <div>
                <h4 className="text-muted-foreground text-xs font-medium">Overview</h4>

        <dl className="mt-1 grid gap-1 text-sm">

          <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted-foreground">Project:</dt>
                        <dd>{projectName || '—'}</dd>

          </div>

          <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted-foreground">Summary:</dt>
                        <dd className="min-w-0 break-words">{summary || '—'}</dd>

          </div>

        </dl>

      </div>

      <div>
                <h4 className="text-muted-foreground text-xs font-medium">Schedule</h4>

        <dl className="mt-1 grid gap-1 text-sm">

          <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted-foreground">Launch date:</dt>
                        <dd>{launchDate || '—'}</dd>

          </div>

          <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted-foreground">Rollout window:</dt>
                        <dd>{VALUE_LABELS[rolloutWindow] ?? rolloutWindow}</dd>

          </div>

        </dl>

      </div>

      <div>
                <h4 className="text-muted-foreground text-xs font-medium">Ownership</h4>

        <dl className="mt-1 grid gap-1 text-sm">

          <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted-foreground">Owner:</dt>
                        <dd>{ownerEmail || '—'}</dd>

          </div>

          <div className="flex flex-wrap gap-x-2">
                        <dt className="text-muted-foreground">Teams:</dt>
                        <dd>{teams.length > 0 ? teams.map((team) => VALUE_LABELS[team] ?? team).join(', ') : '—'}</dd>

          </div>

        </dl>

      </div>

    </section>
  );
}
