import { Component } from '@angular/core';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmSelectImports } from '@egose/shadcn-theme-ng/select';

@Component({
  selector: 'app-select-page',
  imports: [DemoHeaderComponent, BrnSelectImports, HlmSelectImports],
  template: `
    <section class="tw:space-y-8">
      <app-demo-header
        title="Select"
        description="Selects are more useful to evaluate when paired with labels and grouped into simple settings or filtering flows."
      />

      <div class="tw:grid tw:min-w-0 tw:grid-cols-1 tw:gap-6 xl:tw:grid-cols-2">
        <article
          class="tw:min-w-0 tw:max-w-full tw:overflow-hidden tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-white tw:p-6 tw:shadow-sm"
        >
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Settings</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Workspace preferences</h3>
          </div>

          <div class="tw:mt-5 tw:grid tw:min-w-0 tw:gap-4 sm:tw:grid-cols-2">
            <label class="tw:grid tw:min-w-0 tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Priority</span>
              <hlm-select [itemToString]="priorityToString" class="tw:inline-flex tw:min-w-0 tw:max-w-full">
                <hlm-select-trigger class="tw:w-full tw:min-w-0 tw:max-w-full">
                  <hlm-select-value placeholder="Choose priority" />
                </hlm-select-trigger>
                <hlm-select-content *hlmSelectPortal>
                  @for (option of priorities; track option.value) {
                    <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
            </label>

            <label class="tw:grid tw:min-w-0 tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Owner</span>
              <hlm-select [itemToString]="ownerToString" class="tw:inline-flex tw:min-w-0 tw:max-w-full">
                <hlm-select-trigger class="tw:w-full tw:min-w-0 tw:max-w-full">
                  <hlm-select-value placeholder="Assign owner" />
                </hlm-select-trigger>
                <hlm-select-content *hlmSelectPortal>
                  @for (option of owners; track option.value) {
                    <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
            </label>
          </div>
        </article>

        <article
          class="tw:min-w-0 tw:max-w-full tw:overflow-hidden tw:rounded-[28px] tw:border tw:border-slate-200 tw:bg-slate-50 tw:p-6"
        >
          <div>
            <p class="tw:text-xs tw:font-semibold tw:uppercase tw:tracking-[0.2em] tw:text-slate-500">Simple example</p>
            <h3 class="tw:mt-2 tw:text-lg tw:font-semibold tw:text-slate-900">Basic option list</h3>
          </div>

          <div class="tw:mt-5 tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-xs">
            <label class="tw:grid tw:min-w-0 tw:gap-2">
              <span class="tw:text-sm tw:font-medium tw:text-slate-700">Fruit</span>
              <hlm-select [itemToString]="fruitToString" class="tw:inline-flex tw:min-w-0 tw:max-w-full">
                <hlm-select-trigger class="tw:w-full tw:min-w-0 tw:max-w-full">
                  <hlm-select-value placeholder="Select a fruit" />
                </hlm-select-trigger>
                <hlm-select-content *hlmSelectPortal>
                  @for (option of fruits; track option.value) {
                    <hlm-select-item [value]="option.value">{{ option.label }}</hlm-select-item>
                  }
                </hlm-select-content>
              </hlm-select>
            </label>
          </div>
        </article>
      </div>
    </section>
  `,
})
export class SelectPage {
  readonly priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];
  readonly owners = [
    { value: 'jahn', label: 'J. Hahn' },
    { value: 'chen', label: 'N. Chen' },
    { value: 'patel', label: 'A. Patel' },
  ];
  readonly fruits = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'cherry', label: 'Cherry' },
  ];

  // The trigger renders `itemToString(value)` — without it the raw value
  // (e.g. `jahn`) would show instead of the label (e.g. `J. Hahn`).
  readonly priorityToString = (value: string) =>
    this.priorities.find((option) => option.value === value)?.label ?? value;
  readonly ownerToString = (value: string) => this.owners.find((option) => option.value === value)?.label ?? value;
  readonly fruitToString = (value: string) => this.fruits.find((option) => option.value === value)?.label ?? value;
}
