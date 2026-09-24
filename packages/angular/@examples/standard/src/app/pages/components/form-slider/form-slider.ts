import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormSlider } from '@egose/shadcn-theme-ng/form-slider';
import { DemoHeaderComponent } from '../../../shared/demo-header';

@Component({
  selector: 'app-form-slider-page',
  imports: [DemoHeaderComponent, ReactiveFormsModule, EgFormSlider],
  template: `
    <app-demo-header
      title="Form Slider"
      description="Reactive-form slider wrapper that renders label, hint, and validation error."
    />

    <form class="tw:w-full tw:min-w-0 tw:max-w-full sm:tw:max-w-sm" [formGroup]="form">
      <eg-form-slider label="Volume" hint="Drag the thumb" controlName="volume" [min]="0" [max]="100" [step]="5" />
      <p class="tw:text-sm">Volume is {{ form.value.volume?.[0] }}.</p>
    </form>
  `,
})
export class FormSliderPage {
  readonly form = new FormGroup({
    volume: new FormControl<number[]>([20]),
  });
}
