import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmNativeSelect } from './hlm-native-select';

@Component({
  imports: [ReactiveFormsModule, HlmNativeSelect],
  template: `<form [formGroup]="form">
    <hlm-native-select formControlName="value" [disabled]="disabled()">
      <option value="a">A</option>
      <option value="b">B</option>
    </hlm-native-select>
  </form>`,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('a') });
  readonly disabled = signal(false);
}

describe('HlmNativeSelect', () => {
  let fixture: ComponentFixture<Host>;
  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('keeps reactive-form disabled state after a wrapper input toggle in the same pass', () => {
    const select = () => fixture.nativeElement.querySelector('select') as HTMLSelectElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(select().disabled).toBeTrue();
    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(select().disabled).toBeTrue();
  });
});
