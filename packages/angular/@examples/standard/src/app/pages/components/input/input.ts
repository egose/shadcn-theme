import { Component, signal } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmButton } from '@egose/shadcn-theme-ng/button';

@Component({
  selector: 'app-input-page',
  imports: [DemoHeaderComponent, DemoSectionComponent, HlmInput, HlmButton],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Input"
        description="Text, email, password, and disabled inputs shown inside an account form and a compact filter panel."
      />

      <div class="tw:grid tw:gap-6 xl:tw:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
          kicker="Profile form"
          title="Account details"
        >
          <div class="tw:grid tw:gap-4 sm:tw:grid-cols-2">
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">First name</span>
              <input
                hlmInput
                placeholder="Jane"
                [value]="firstName()"
                (input)="firstName.set($any($event.target).value)"
              />
            </label>
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Last name</span>
              <input
                hlmInput
                placeholder="Hahn"
                [value]="lastName()"
                (input)="lastName.set($any($event.target).value)"
              />
            </label>
            <label class="tw:grid tw:gap-2 sm:tw:col-span-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Email address</span>
              <input
                hlmInput
                type="email"
                placeholder="jane@egose.dev"
                [value]="email()"
                (input)="email.set($any($event.target).value)"
              />
            </label>
            <label class="tw:grid tw:gap-2 sm:tw:col-span-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Password</span>
              <input hlmInput type="password" aria-label="Password" value="password" />
            </label>
          </div>

          <div class="tw:mt-5 tw:flex tw:justify-end tw:gap-2">
            <button hlmButton variant="secondary" appearance="outline" type="button" (click)="discard()">Cancel</button>
            <button hlmButton type="button" (click)="save()">Save changes</button>
          </div>

          @if (accountMessage()) {
            <p role="status" class="tw:mt-4 tw:text-sm tw:text-slate-600">{{ accountMessage() }}</p>
          }
        </app-demo-section>

        <app-demo-section
          class="tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
          kicker="Filters"
          title="Search and disabled states"
        >
          <div class="tw:grid tw:gap-4">
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Filter components</span>
              <input hlmInput placeholder="Search by component name" value="alert" />
            </label>
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Invite code</span>
              <input hlmInput placeholder="Invite code" value="STD-2026-QA" />
            </label>
            <label class="tw:grid tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Release status</span>
              <input hlmInput placeholder="Disabled input" disabled value="Coming soon" />
            </label>
          </div>

          <div class="tw:mt-5 tw:rounded-2xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:p-4">
            <p class="tw:text-sm tw:leading-7 tw:text-slate-600">
              Inputs appear in both full forms and compact filters, showing spacing, placeholder tone, and disabled
              styling side by side.
            </p>
          </div>
        </app-demo-section>
      </div>
    </section>
  `,
})
export class InputPage {
  readonly firstName = signal('Jane');
  readonly lastName = signal('Hahn');
  readonly email = signal('jane@egose.dev');
  readonly accountMessage = signal<string | null>(null);

  save() {
    this.accountMessage.set(`Account details saved for ${this.firstName()} ${this.lastName()} (${this.email()}).`);
  }

  discard() {
    this.firstName.set('Jane');
    this.lastName.set('Hahn');
    this.email.set('jane@egose.dev');
    this.accountMessage.set('Edits discarded; the account form was reset to its saved values.');
  }
}
