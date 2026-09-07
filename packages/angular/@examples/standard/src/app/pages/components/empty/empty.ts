import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { HlmEmptyImports } from '@egose/shadcn-theme-ng/empty';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-empty-page',
  imports: [DemoHeaderComponent, HlmEmptyImports, HlmButton, RouterLink],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Empty"
        description="Empty states look best when they explain what happened and suggest the next move. Showing a few real contexts makes the component feel much more solid than a single centered icon."
      />

      <div class="tw:grid tw:gap-6 lg:tw:grid-cols-2 xl:tw:grid-cols-3">
        <article class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
          <div hlmEmpty class="tw:min-h-[320px] tw:border-slate-200 tw:bg-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">🔎</div>
              <h3 hlmEmptyTitle>No matching invoices</h3>
              <p hlmEmptyDescription>The current filters hide every result in this workspace.</p>
            </div>
            <div hlmEmptyContent>
              <button
                hlmButton
                variant="secondary"
                appearance="outline"
                type="button"
                (click)="note('Invoice filters cleared: showing all workspaces.')"
              >
                Clear filters
              </button>
            </div>
          </div>
        </article>

        <article class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-4">
          <div hlmEmpty class="tw:min-h-[320px] tw:border-slate-200 tw:bg-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon">👥</div>
              <h3 hlmEmptyTitle>Your team is empty</h3>
              <p hlmEmptyDescription>Invite collaborators to start sharing reviews, approvals, and releases.</p>
            </div>
            <div hlmEmptyContent class="tw:items-center">
              <div class="tw:flex tw:flex-wrap tw:justify-center tw:gap-2">
                <button
                  hlmButton
                  type="button"
                  (click)="note('Invite request recorded: 3 seats remaining on this workspace.')"
                >
                  Invite teammates
                </button>
                <button
                  hlmButton
                  variant="secondary"
                  appearance="outline"
                  type="button"
                  (click)="note('Invite link copied: egose.dev/invite/angular-standard.')"
                >
                  Copy invite link
                </button>
              </div>
            </div>
          </div>
        </article>

        <article
          class="tw:rounded-3xl tw:border tw:border-slate-200 tw:bg-slate-950 tw:p-4 lg:tw:col-span-2 xl:tw:col-span-1"
        >
          <div hlmEmpty class="tw:min-h-[320px] tw:border-slate-700 tw:bg-slate-900 tw:text-white">
            <div hlmEmptyHeader>
              <div hlmEmptyMedia variant="icon" class="tw:bg-slate-800 tw:text-slate-100">🛒</div>
              <h3 hlmEmptyTitle class="tw:text-white">Nothing in your cart</h3>
              <p hlmEmptyDescription class="tw:text-slate-300">
                Save components to compare pricing, variants, and implementation details before checkout.
              </p>
            </div>
            <div hlmEmptyContent>
              <a hlmButton variant="light" routerLink="/components">Browse components</a>
            </div>
          </div>
        </article>
      </div>

      @if (emptyMessage()) {
        <p role="status" class="tw:text-sm tw:text-slate-600">{{ emptyMessage() }}</p>
      }
    </section>
  `,
})
export class EmptyPage {
  readonly emptyMessage = signal<string | null>(null);

  note(message: string) {
    this.emptyMessage.set(message);
  }
}
