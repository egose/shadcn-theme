import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmButtonImports } from '@egose/shadcn-theme-ng/button';
import { HlmInput } from '@egose/shadcn-theme-ng/input';
import { HlmStepperImports } from '@egose/shadcn-theme-ng/stepper';
import { DemoHeaderComponent } from '../../../shared/demo-header';
import { DemoSectionComponent } from '../../../shared/demo-section';

@Component({
  selector: 'app-stepper-page',
  imports: [
    DemoHeaderComponent,
    DemoSectionComponent,
    ReactiveFormsModule,
    HlmButtonImports,
    HlmInput,
    HlmStepperImports,
  ],
  template: `
    <app-demo-header title="Stepper" description="Guide people through multi-step flows." />

    <div class="tw:grid tw:gap-6">
      <app-demo-section
        class="tw:min-w-0"
        kicker="Default"
        title="Basic stepper"
        description="Three steps with next and back controls. Scrolls horizontally on narrow screens."
      >
        <div class="tw:min-w-0 tw:overflow-x-auto">
          <hlm-stepper class="tw:w-full tw:max-w-xl tw:min-w-[24rem]">
            <hlm-step label="Account">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">Create your account to get started.</p>
                <div class="tw:flex tw:justify-end">
                  <button hlmBtn type="button" hlmStepperNext>Next</button>
                </div>
              </div>
            </hlm-step>

            <hlm-step label="Profile">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">Tell us a little about yourself.</p>
                <div class="tw:flex tw:justify-between tw:gap-2">
                  <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                  <button hlmBtn type="button" hlmStepperNext>Next</button>
                </div>
              </div>
            </hlm-step>

            <hlm-step label="Review">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">Review your details before finishing.</p>
                <div class="tw:flex tw:justify-between tw:gap-2">
                  <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                  <button hlmBtn type="button">Finish</button>
                </div>
              </div>
            </hlm-step>
          </hlm-stepper>
        </div>
      </app-demo-section>

      <app-demo-section
        class="tw:min-w-0"
        kicker="Orientation"
        title="Vertical stepper"
        description="Headers stay aligned with each content panel."
      >
        <hlm-stepper orientation="vertical" class="tw:w-full tw:max-w-xl">
          <hlm-step label="Campaign">
            <div class="tw:flex tw:flex-col tw:gap-4">
              <p class="tw:text-sm tw:text-muted-foreground">Name your campaign.</p>
              <div class="tw:flex tw:justify-end">
                <button hlmBtn type="button" hlmStepperNext>Next</button>
              </div>
            </div>
          </hlm-step>

          <hlm-step label="Audience">
            <div class="tw:flex tw:flex-col tw:gap-4">
              <p class="tw:text-sm tw:text-muted-foreground">Choose who sees it.</p>
              <div class="tw:flex tw:justify-between tw:gap-2">
                <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                <button hlmBtn type="button" hlmStepperNext>Next</button>
              </div>
            </div>
          </hlm-step>

          <hlm-step label="Publish">
            <div class="tw:flex tw:flex-col tw:gap-4">
              <p class="tw:text-sm tw:text-muted-foreground">Publish when ready.</p>
              <div class="tw:flex tw:justify-between tw:gap-2">
                <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                <button hlmBtn type="button">Publish</button>
              </div>
            </div>
          </hlm-step>
        </hlm-stepper>
      </app-demo-section>

      <app-demo-section
        class="tw:min-w-0"
        kicker="Validation"
        title="Linear stepper"
        description="Each step must be valid before advancing. Scrolls horizontally on narrow screens."
      >
        <div class="tw:min-w-0 tw:overflow-x-auto">
          <hlm-stepper [linear]="true" class="tw:w-full tw:max-w-xl tw:min-w-[24rem]">
            <hlm-step [stepControl]="identityForm" label="Identity">
              <form [formGroup]="identityForm" class="tw:flex tw:flex-col tw:gap-4">
                <label class="tw:flex tw:flex-col tw:gap-1.5 tw:text-sm tw:font-medium" for="stepper-name">
                  Name
                  <input hlmInput id="stepper-name" formControlName="name" placeholder="Required before continuing" />
                </label>
                @if (identityForm.controls.name.touched && identityForm.controls.name.invalid) {
                  <p class="tw:text-sm tw:text-destructive">This field is required.</p>
                }
                <div class="tw:flex tw:justify-end">
                  <button hlmBtn type="button" hlmStepperNext>Next</button>
                </div>
              </form>
            </hlm-step>

            <hlm-step label="Done">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">Hello, {{ identityForm.controls.name.value }}!</p>
                <div class="tw:flex tw:justify-between tw:gap-2">
                  <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                  <button hlmBtn type="button">Complete</button>
                </div>
              </div>
            </hlm-step>
          </hlm-stepper>
        </div>
      </app-demo-section>

      <app-demo-section
        class="tw:min-w-0"
        kicker="Tooltips"
        title="Header tooltips"
        description="Headers show the full label on hover or focus. Override per step with tooltip, or opt out."
      >
        <div class="tw:min-w-0 tw:overflow-x-auto">
          <hlm-stepper class="tw:w-full tw:max-w-xl tw:min-w-[24rem]">
            <hlm-step label="An especially long account setup label that truncates">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">Hover the first header to see the full label.</p>
                <div class="tw:flex tw:justify-end">
                  <button hlmBtn type="button" hlmStepperNext>Next</button>
                </div>
              </div>
            </hlm-step>

            <hlm-step label="Profile" tooltip="Add a photo so teammates recognize you">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">This header shows custom tooltip text.</p>
                <div class="tw:flex tw:justify-between tw:gap-2">
                  <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                  <button hlmBtn type="button" hlmStepperNext>Next</button>
                </div>
              </div>
            </hlm-step>

            <hlm-step label="Review" [tooltipDisabled]="true">
              <div class="tw:flex tw:flex-col tw:gap-4">
                <p class="tw:text-sm tw:text-muted-foreground">This header shows no tooltip.</p>
                <div class="tw:flex tw:justify-between tw:gap-2">
                  <button hlmBtn type="button" variant="outline" hlmStepperPrevious>Back</button>
                  <button hlmBtn type="button">Finish</button>
                </div>
              </div>
            </hlm-step>
          </hlm-stepper>
        </div>
      </app-demo-section>
    </div>
  `,
})
export class StepperPage {
  private readonly _formBuilder = inject(FormBuilder);

  protected readonly identityForm = this._formBuilder.group({
    name: ['', Validators.required],
  });
}
