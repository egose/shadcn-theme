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

@Component({
  selector: 'app-table-page',
  imports: [HlmTable, HlmTableContainer, HlmTHead, HlmTBody, HlmTFoot, HlmTr, HlmTh, HlmTd, HlmCaption],
  template: `
    <h3 class="tw:text-2xl tw:font-bold tw:mb-2">Table</h3>
    <p class="tw:text-gray-500 tw:mb-4">A data table.</p>
    <div hlmTableContainer>
      <table hlmTable>
        <caption hlmCaption>
          A list of recent invoices.
        </caption>
        <thead hlmTHead>
          <tr hlmTr>
            <th hlmTh>Invoice</th>
            <th hlmTh>Status</th>
            <th hlmTh>Method</th>
            <th hlmTh class="tw:text-right">Amount</th>
          </tr>
        </thead>
        <tbody hlmTBody>
          <tr hlmTr>
            <td hlmTd>INV001</td>
            <td hlmTd>Paid</td>
            <td hlmTd>Credit Card</td>
            <td hlmTd class="tw:text-right">$250.00</td>
          </tr>
          <tr hlmTr>
            <td hlmTd>INV002</td>
            <td hlmTd>Pending</td>
            <td hlmTd>PayPal</td>
            <td hlmTd class="tw:text-right">$150.00</td>
          </tr>
        </tbody>
        <tfoot hlmTFoot>
          <tr hlmTr>
            <th hlmTh colspan="3">Total</th>
            <th hlmTh class="tw:text-right">$400.00</th>
          </tr>
        </tfoot>
      </table>
    </div>
  `,
})
export class TablePage {}
