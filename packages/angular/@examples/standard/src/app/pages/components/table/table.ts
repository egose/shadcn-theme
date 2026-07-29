import { Component } from '@angular/core';
import {
  HlmTable,
  HlmTBody,
  HlmTd,
  HlmTFoot,
  HlmTh,
  HlmTHead,
  HlmTr,
  HlmTableContainer,
  HlmCaption,
} from '@egose/shadcn-theme-ng/table';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-table-page',
  imports: [HlmTable, HlmTableContainer, HlmTHead, HlmTBody, HlmTFoot, HlmTr, HlmTh, HlmTd, HlmCaption, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <div class="tw:max-w-3xl tw:space-y-3">
        <h3 class="tw:text-2xl tw:font-bold tw:text-slate-950">Table</h3>
        <p class="tw:text-sm tw:leading-7 tw:text-slate-600 sm:tw:text-base">
          A table reads better when it sits inside a small dashboard context with summary metrics and row-level meaning.
          This makes spacing, density, and alignment easier to evaluate.
        </p>
      </div>

      <div class="tw:space-y-6">
        <div class="tw:grid tw:gap-4 sm:tw:grid-cols-3">
          <div class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
            <p class="tw:text-xs tw:font-medium tw:text-slate-500">Invoices this week</p>
            <p class="tw:mt-2 tw:text-3xl tw:font-semibold tw:text-slate-950">24</p>
          </div>
          <div class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
            <p class="tw:text-xs tw:font-medium tw:text-slate-500">Collected revenue</p>
            <p class="tw:mt-2 tw:text-3xl tw:font-semibold tw:text-slate-950">$12.8k</p>
          </div>
          <div class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-5">
            <p class="tw:text-xs tw:font-medium tw:text-slate-500">At risk</p>
            <p class="tw:mt-2 tw:text-3xl tw:font-semibold tw:text-slate-950">3</p>
          </div>
        </div>

        <article class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:shadow-sm sm:tw:p-6">
          <div class="tw:mb-6 tw:flex tw:flex-col tw:gap-4 sm:tw:flex-row sm:tw:items-end sm:tw:justify-between">
            <div>
              <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.24em] tw:text-slate-500">Collections</p>
              <h4 class="tw:mt-2 tw:text-xl tw:font-semibold tw:text-slate-950">Recent invoices</h4>
              <p class="tw:mt-1 tw:text-sm tw:text-slate-500">
                A denser example with status, owner, payment method, and totals.
              </p>
            </div>

            <div class="tw:flex tw:gap-2">
              <button hlmButton variant="secondary" appearance="outline" type="button">Export</button>
              <button hlmButton type="button">Create invoice</button>
            </div>
          </div>

          <div hlmTableContainer>
            <table hlmTable>
              <caption hlmCaption>
                Last six invoices synced from the billing dashboard.
              </caption>
              <thead hlmTHead>
                <tr hlmTr>
                  <th hlmTh>Invoice</th>
                  <th hlmTh>Customer</th>
                  <th hlmTh>Status</th>
                  <th hlmTh>Method</th>
                  <th hlmTh>Owner</th>
                  <th hlmTh class="tw:text-right">Amount</th>
                </tr>
              </thead>
              <tbody hlmTBody>
                @for (invoice of invoices; track invoice.code) {
                  <tr hlmTr>
                    <td hlmTd class="tw:font-medium tw:text-slate-900">{{ invoice.code }}</td>
                    <td hlmTd>{{ invoice.customer }}</td>
                    <td hlmTd>
                      <span
                        class="tw:inline-flex tw:rounded-full tw:px-2.5 tw:py-1 tw:text-xs tw:font-medium"
                        [class]="invoice.statusClass"
                      >
                        {{ invoice.status }}
                      </span>
                    </td>
                    <td hlmTd>{{ invoice.method }}</td>
                    <td hlmTd>{{ invoice.owner }}</td>
                    <td hlmTd class="tw:text-right tw:font-medium tw:text-slate-900">{{ invoice.amount }}</td>
                  </tr>
                }
              </tbody>
              <tfoot hlmTFoot>
                <tr hlmTr>
                  <th hlmTh colspan="5">Total collected</th>
                  <th hlmTh class="tw:text-right">$12,820.00</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class TablePage {
  readonly invoices = [
    {
      code: 'INV-2401',
      customer: 'Northwind Labs',
      status: 'Paid',
      statusClass: 'tw:bg-emerald-100 tw:text-emerald-700',
      method: 'Credit Card',
      owner: 'J. Hahn',
      amount: '$2,450.00',
    },
    {
      code: 'INV-2402',
      customer: 'Orbit Health',
      status: 'Pending',
      statusClass: 'tw:bg-amber-100 tw:text-amber-700',
      method: 'ACH',
      owner: 'A. Patel',
      amount: '$1,180.00',
    },
    {
      code: 'INV-2403',
      customer: 'Beacon Retail',
      status: 'Paid',
      statusClass: 'tw:bg-emerald-100 tw:text-emerald-700',
      method: 'PayPal',
      owner: 'J. Hahn',
      amount: '$3,920.00',
    },
    {
      code: 'INV-2404',
      customer: 'Acme Studio',
      status: 'Overdue',
      statusClass: 'tw:bg-rose-100 tw:text-rose-700',
      method: 'Wire',
      owner: 'N. Chen',
      amount: '$940.00',
    },
    {
      code: 'INV-2405',
      customer: 'Pioneer Cloud',
      status: 'Paid',
      statusClass: 'tw:bg-emerald-100 tw:text-emerald-700',
      method: 'Credit Card',
      owner: 'N. Chen',
      amount: '$2,760.00',
    },
    {
      code: 'INV-2406',
      customer: 'Field Notes Co.',
      status: 'Pending',
      statusClass: 'tw:bg-amber-100 tw:text-amber-700',
      method: 'ACH',
      owner: 'A. Patel',
      amount: '$1,570.00',
    },
  ];
}
