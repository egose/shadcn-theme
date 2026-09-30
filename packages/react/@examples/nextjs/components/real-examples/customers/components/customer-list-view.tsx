import type { Ref } from 'react';

import { Button } from '@egose/shadcn-theme/components/ui/button';
import { Input } from '@egose/shadcn-theme/components/ui/input';
import { Label } from '@egose/shadcn-theme/components/ui/label';
import { NativeSelect, NativeSelectOption } from '@egose/shadcn-theme/components/ui/native-select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@egose/shadcn-theme/components/ui/pagination';
import { PageHeader } from '@egose/shadcn-theme/components/widgets/page-header';

import type { CustomersController, PlanFilter, StatusFilter } from '../use-customers-controller';
import { CustomerCards } from './customer-cards';
import { CustomerTable } from './customer-table';

type CustomerListViewProps = {
  model: CustomersController['list'];
  searchRef: Ref<HTMLInputElement>;
};

export function CustomerListView({ model, searchRef }: CustomerListViewProps) {
  const searchLabelId = 'customer-search-label';
  const statusLabelId = 'customer-status-filter-label';
  const planLabelId = 'customer-plan-filter-label';

  return (
    <div className="space-y-4">

      <PageHeader
        title="Customers"
        description="Search, filter, and manage customer records."
        actions={
          <Button type="button" onClick={(event) => model.onAdd(event.currentTarget)}>
            Add customer
          </Button>
        }
      />
            {model.customerCount === 0 && <p role="status">No customers yet. Add the first customer to get started.</p>}

      <div className="flex flex-wrap items-end gap-3">

        <div className="space-y-1">

          <Label id={searchLabelId} htmlFor="customer-search">
            Search customers
          </Label>

          <Input
            ref={searchRef}
            id="customer-search"
            type="search"
            aria-labelledby={searchLabelId}
            placeholder="Name or email"
            value={model.query}
            onChange={(event) => model.onQueryChange(event.target.value)}
          />

        </div>

        <div className="space-y-1">
                    <Label id={statusLabelId}>Filter by status</Label>

          <NativeSelect
            aria-labelledby={statusLabelId}
            value={model.statusFilter}
            onChange={(event) => model.onStatusChange(event.target.value as StatusFilter)}
          >
                        <NativeSelectOption value="all">All statuses</NativeSelectOption>
                        <NativeSelectOption value="active">Active</NativeSelectOption>
                        <NativeSelectOption value="invited">Invited</NativeSelectOption>
                        <NativeSelectOption value="archived">Archived</NativeSelectOption>

          </NativeSelect>

        </div>

        <div className="space-y-1">
                    <Label id={planLabelId}>Filter by plan</Label>

          <NativeSelect
            aria-labelledby={planLabelId}
            value={model.planFilter}
            onChange={(event) => model.onPlanChange(event.target.value as PlanFilter)}
          >
                        <NativeSelectOption value="all">All plans</NativeSelectOption>
                        <NativeSelectOption value="free">Free</NativeSelectOption>
                        <NativeSelectOption value="pro">Pro</NativeSelectOption>
                        <NativeSelectOption value="team">Team</NativeSelectOption>

          </NativeSelect>

        </div>

        <Button type="button" variant="secondary" appearance="outline" onClick={model.onResetFilters}>
                    Reset filters
        </Button>

      </div>

      <p role="status" aria-live="polite" className="text-muted-foreground text-sm">
                {model.filteredCount === 1 ? '1 customer' : `${model.filteredCount} customers`}
                {model.filteredCount > 0 && ` — showing ${model.rangeStart}\u2013${model.rangeEnd}`}

      </p>

      {model.customerCount > 0 && model.filteredCount === 0 && (
        <p role="status">No customers match the current filters.</p>
      )}

      {model.filteredCount > 0 && (
        <>

          <CustomerTable {...model.records} />

          <CustomerCards {...model.records} />

          {model.pageCount > 1 && (
            <Pagination aria-label="Customer pages">

              <PaginationContent>

                <PaginationItem>

                  <PaginationPrevious
                    href="#customers"
                    aria-disabled={model.page === 1}
                    className={model.page === 1 ? 'pointer-events-none opacity-50' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (model.page > 1) model.onPageChange(model.page - 1);
                    }}
                  />

                </PaginationItem>

                {Array.from({ length: model.pageCount }, (_, index) => index + 1).map((pageNumber) => (
                  <PaginationItem key={pageNumber}>

                    <PaginationLink
                      href="#customers"
                      isActive={pageNumber === model.page}
                      onClick={(event) => {
                        event.preventDefault();
                        model.onPageChange(pageNumber);
                      }}
                    >
                                            {pageNumber}

                    </PaginationLink>

                  </PaginationItem>
                ))}

                <PaginationItem>

                  <PaginationNext
                    href="#customers"
                    aria-disabled={model.page === model.pageCount}
                    className={model.page === model.pageCount ? 'pointer-events-none opacity-50' : undefined}
                    onClick={(event) => {
                      event.preventDefault();
                      if (model.page < model.pageCount) model.onPageChange(model.page + 1);
                    }}
                  />

                </PaginationItem>

              </PaginationContent>

            </Pagination>
          )}

        </>
      )}

    </div>
  );
}
