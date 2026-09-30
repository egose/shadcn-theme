'use client';

import { Alert, AlertDescription, AlertTitle } from '@egose/shadcn-theme/components/ui/alert';
import { Button } from '@egose/shadcn-theme/components/ui/button';

import { ExamplePage } from '@/components/showcase-shell';
import { ExampleStateToolbar } from '../_shared/example-state-toolbar';
import { OutcomePicker } from '../_shared/outcome-picker';
import { CustomerArchiveDialog } from './components/customer-archive-dialog';
import { CustomerListView } from './components/customer-list-view';
import { CustomerNameDialog } from './components/customer-name-dialog';
import { useCustomersController } from './use-customers-controller';

export default function CustomersExample() {
  const {
    viewState,
    changeViewState,
    mutation,
    submitting,
    notice,
    simulatedOutcome,
    setSimulatedOutcome,
    resultRef,
    searchRef,
    list,
    cancelMutation,
    submitName,
    confirmArchive,
    restoreFocus,
  } = useCustomersController();

  // Move the same catalog control into a retained name dialog so failure →
  // success retries remain reachable without dismissing the customer's draft.
  const outcomeControl = (
    <OutcomePicker label="Simulated mutation outcome" value={simulatedOutcome} onValueChange={setSimulatedOutcome} />
  );

  return (
    <ExamplePage
      title="Customer Resource Management"
      description="The product area below is the example: search, filters, pagination, and row mutations over one customer list. The surrounding catalog chrome is not part of it."
    >

      <ExampleStateToolbar value={viewState} onValueChange={changeViewState} />

      <p className="text-muted-foreground text-xs">
                Empty starts a new empty customer dataset. Reload to restore the fixtures.
      </p>
            {(!mutation || mutation.kind === 'archive') && outcomeControl}

      <div ref={resultRef} tabIndex={-1} role="region" aria-label="Customer update result" aria-live="polite">

        {notice?.kind === 'success' && (
          <p role="status" className="text-sm font-medium">
            {notice.text}
          </p>
        )}

        {notice?.kind === 'failure' && !mutation && (
          <Alert variant="destructive">
                        <AlertTitle>Customer update failed</AlertTitle>
                        <AlertDescription>{notice.text}</AlertDescription>

          </Alert>
        )}

      </div>
            {viewState === 'loading' && <p role="status">Loading customers…</p>}

      {viewState === 'error' && (
        <Alert variant="destructive">
                    <AlertTitle>Customers could not be loaded</AlertTitle>

          <AlertDescription>
                        <p>Something went wrong while loading the customer list. Retry to load it again.</p>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="mt-2"
              onClick={() => changeViewState('loaded')}
            >
                            Retry
            </Button>

          </AlertDescription>

        </Alert>
      )}

      {(viewState === 'loaded' || viewState === 'empty') && <CustomerListView model={list} searchRef={searchRef} />}

      {mutation !== null && mutation.kind !== 'archive' && (
        <CustomerNameDialog
          mode={mutation.kind}
          initialName={mutation.kind === 'rename' ? mutation.customer.name : ''}
          submitting={submitting}
          failure={notice?.kind === 'failure' ? notice.text : null}
          catalogControl={outcomeControl}
          onCancel={cancelMutation}
          onSubmit={submitName}
          onRestoreFocus={restoreFocus}
        />
      )}

      {mutation?.kind === 'archive' && (
        <CustomerArchiveDialog
          customerName={mutation.customer.name}
          submitting={submitting}
          onCancel={cancelMutation}
          onConfirm={confirmArchive}
          onRestoreFocus={restoreFocus}
        />
      )}

    </ExamplePage>
  );
}
