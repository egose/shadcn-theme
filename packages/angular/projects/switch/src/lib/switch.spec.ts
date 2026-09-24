import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmSwitch } from './switch';

@Component({
  imports: [ReactiveFormsModule, HlmSwitch],
  template: `<form [formGroup]="form">
    <hlm-switch formControlName="value" [disabled]="disabled()" />
  </form>`,
})
class TmpHost {
  readonly form = new FormGroup({ value: new FormControl(false) });
  readonly disabled = signal(false);
}

describe('HlmSwitch', () => {
  let fixture: ComponentFixture<TmpHost>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [TmpHost] }).compileComponents();
    fixture = TestBed.createComponent(TmpHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('keeps reactive-form disabled state after a wrapper input toggle in the same pass', () => {
    const btn = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(btn().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(btn().disabled).toBeTrue();
  });
});
