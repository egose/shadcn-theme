import {
  APP_ID,
  ApplicationRef,
  Component,
  destroyPlatform,
  provideZonelessChangeDetection,
  signal,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { bootstrapApplication, provideClientHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { BrowserTestingModule, platformBrowserTesting } from '@angular/platform-browser/testing';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgFormTextInput } from './form-text-input';
import { provideEgFormTextInputConfig } from './form-text-input.token';

@Component({
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input
        controlName="value"
        label="Name"
        [id]="id()"
        [disabled]="disabled()"
        error="Name is required"
        hint="Enter a name"
        required
      />
    </form>
  `,
})
class Host {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly id = signal<string | undefined>('name-input');
  readonly disabled = signal(false);
}

@Component({
  selector: 'angular-07-hydration-root',
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form">
      <eg-form-text-input controlName="value" label="Hydrated name" hint="Hydration-safe hint" required />
    </form>
  `,
})
class FormTextInputHydrationHost {
  readonly form = new FormGroup({ value: new FormControl('Ada', { nonNullable: true }) });
}

describe('EgFormTextInput', () => {
  let fixture: ComponentFixture<Host>;

  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('aligns explicit and generated input identity with its label and messages', () => {
    const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input().id).toBe('name-input');
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(input().id);
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(input().getAttribute('aria-describedby')).toBe('name-input-error');
    expect(fixture.nativeElement.querySelector('#name-input-error').textContent).toContain('Name is required');
    fixture.componentInstance.form.controls.value.setValue('Ada');
    fixture.detectChanges();
    expect(input().getAttribute('aria-describedby')).toBe('name-input-hint');
    expect(fixture.nativeElement.querySelector('#name-input-hint').textContent).toContain('Enter a name');

    fixture.componentInstance.id.set(undefined);
    fixture.detectChanges();
    expect(input().id).toMatch(/^eg-form-text-input-.+-\d+$/);
    expect(fixture.nativeElement.querySelector('label').htmlFor).toBe(input().id);
    expect(input().getAttribute('aria-describedby')).toBe(`${input().id}-hint`);
  });

  it('disables the input from either wrapper or reactive-form ownership', () => {
    const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    expect(input().disabled).toBeTrue();

    fixture.componentInstance.disabled.set(false);
    fixture.componentInstance.form.controls.value.disable();
    fixture.detectChanges();
    expect(input().disabled).toBeTrue();
  });
  it('server-renders and hydrates generated IDs without replacing or mismatching accessible markup', async () => {
    fixture.destroy();
    TestBed.resetTestEnvironment();
    destroyPlatform();

    const appId = 'angular07';
    const commonProviders = [{ provide: APP_ID, useValue: appId }, provideZonelessChangeDetection()];
    let application: ApplicationRef | undefined;
    let serverBodyNodes: Node[] = [];

    try {
      const response = await fetch('http://127.0.0.1:9877/');
      expect(response.ok).toBeTrue();
      const serverHtml = await response.text();

      const renderedDocument = new DOMParser().parseFromString(serverHtml, 'text/html');
      const serverRoot = renderedDocument.querySelector('angular-07-hydration-root') as HTMLElement;
      const serverInput = serverRoot.querySelector('input') as HTMLInputElement;
      const serverLabel = serverRoot.querySelector('label') as HTMLLabelElement;
      const serverHint = serverRoot.querySelector('hlm-hint') as HTMLElement;

      expect(serverInput.id).toMatch(/^eg-form-text-input-angular07-\d+$/);
      expect(serverRoot.hasAttribute('ngh')).toBeTrue();
      expect(serverLabel.htmlFor).toBe(serverInput.id);
      expect(serverHint.id).toBe(`${serverInput.id}-hint`);
      expect(serverInput.getAttribute('aria-describedby')).toBe(serverHint.id);

      serverBodyNodes = Array.from(renderedDocument.body.childNodes).map((node) => document.importNode(node, true));
      document.body.append(...serverBodyNodes);
      const hydratedRoot = document.querySelector('angular-07-hydration-root') as HTMLElement;
      const hydratedInputBeforeBootstrap = hydratedRoot.querySelector('input') as HTMLInputElement;

      application = await bootstrapApplication(FormTextInputHydrationHost, {
        providers: [...commonProviders, provideClientHydration(withNoHttpTransferCache())],
      });
      await application.whenStable();
      const hydratedInput = hydratedRoot.querySelector('input') as HTMLInputElement;
      const hydratedLabel = hydratedRoot.querySelector('label') as HTMLLabelElement;
      const hydratedHint = hydratedRoot.querySelector('hlm-hint') as HTMLElement;

      expect(application.components[0].location.nativeElement).toBe(hydratedRoot);
      expect(hydratedInput).toBe(hydratedInputBeforeBootstrap);
      expect(hydratedInput.id).toBe(serverInput.id);
      expect(hydratedLabel.htmlFor).toBe(hydratedInput.id);
      expect(hydratedHint.id).toBe(`${hydratedInput.id}-hint`);
      expect(hydratedInput.getAttribute('aria-describedby')).toBe(hydratedHint.id);
    } finally {
      application?.destroy();
      for (const node of serverBodyNodes) node.parentNode?.removeChild(node);
      destroyPlatform();
      TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
    }
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `<form [formGroup]="form">
    <eg-form-text-input controlName="value" label="Name" [labelClass]="labelClass()" [inputClass]="inputClass()" />
  </form>`,
})
class ConfigHost {
  readonly form = new FormGroup({ value: new FormControl('') });
  readonly labelClass = signal('');
  readonly inputClass = signal('');
}

describe('EgFormTextInput global class defaults', () => {
  let fixture: ComponentFixture<ConfigHost>;
  beforeEach(async () => {
    configureLibraryTestBed([provideEgFormTextInputConfig({ labelClass: 'tw:text-xs', inputClass: 'tw:text-xs' })]);
    await TestBed.configureTestingModule({ imports: [ConfigHost] }).compileComponents();
    fixture = TestBed.createComponent(ConfigHost);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('merges global config classes under per-instance classes', () => {
    const label = () => fixture.nativeElement.querySelector('label') as HTMLLabelElement;
    const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(label().className).toContain('tw:text-xs');
    expect(input().className).toContain('tw:text-xs');
    fixture.componentInstance.labelClass.set('tw:text-lg');
    fixture.componentInstance.inputClass.set('tw:text-lg');
    fixture.detectChanges();
    expect(label().className).toContain('tw:text-lg');
    expect(label().className).not.toContain('tw:text-xs');
    expect(input().className).toContain('tw:text-lg');
    expect(input().className).not.toContain('tw:text-xs');
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <eg-form-text-input
        controlName="value"
        label="Name"
        [error]="error()"
        [autoError]="autoError()"
        hint="Enter a name"
      />
      <button type="submit">Submit</button>
    </form>
  `,
})
class AutoErrorHost {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  readonly error = signal<string | undefined>(undefined);
  readonly autoError = signal(true);
  onSubmit() {}
}

describe('EgFormTextInput auto error messages', () => {
  let fixture: ComponentFixture<AutoErrorHost>;

  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [AutoErrorHost] }).compileComponents();
    fixture = TestBed.createComponent(AutoErrorHost);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('auto-resolves the required message once the control is touched', () => {
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    const describedBy = (fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute(
      'aria-describedby',
    );
    expect(describedBy).toMatch(/-error$/);
    expect(
      fixture.nativeElement.querySelector(describedBy ? `#${CSS.escape(describedBy)}` : 'hlm-error').textContent,
    ).toContain('Name is required');
  });

  it('lets an explicit error win over the auto-resolved message', () => {
    fixture.componentInstance.error.set('Custom message');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    const describedBy = (fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute(
      'aria-describedby',
    );
    expect(fixture.nativeElement.querySelector(`#${CSS.escape(describedBy!)}`).textContent).toContain('Custom message');
  });

  it('treats an empty explicit error as unset, falling back to the auto message', () => {
    fixture.componentInstance.error.set('');
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    const describedBy = (fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute(
      'aria-describedby',
    );
    expect(describedBy).toMatch(/-error$/);
    expect(fixture.nativeElement.querySelector(`#${CSS.escape(describedBy!)}`).textContent).toContain(
      'Name is required',
    );
  });

  it('renders no error when autoError is disabled and no explicit error is set', () => {
    fixture.componentInstance.autoError.set(false);
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    const describedBy = (fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute(
      'aria-describedby',
    );
    expect(describedBy).toMatch(/-hint$/);
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
  });

  it('hides the visual error while pristine, then shows it after submit', () => {
    // Invalid from creation, but untouched and unsubmitted -> hint only, no error element.
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute('aria-describedby')).toMatch(
      /-hint$/,
    );

    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('Name is required');
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute('aria-describedby')).toMatch(
      /-error$/,
    );
  });

  it('clears the auto message once the control becomes valid', () => {
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error')).not.toBeNull();

    fixture.componentInstance.form.controls.value.setValue('Ada');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error')).toBeNull();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).getAttribute('aria-describedby')).toMatch(
      /-hint$/,
    );
  });

  it('updates the auto message when the failing validator changes', () => {
    fixture.componentInstance.form.controls.value.markAsTouched();
    fixture.componentInstance.form.controls.value.setValidators([Validators.required, Validators.minLength(3)]);
    fixture.componentInstance.form.controls.value.setValue('a');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('hlm-error').textContent).toContain('at least 3 characters');
  });
});

@Component({
  imports: [ReactiveFormsModule, EgFormTextInput],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <eg-form-text-input controlName="value" label="Name" error="Name is required" hint="Enter a name" />
      <button type="submit">Submit</button>
    </form>
  `,
})
class SubmitHost {
  readonly form = new FormGroup({ value: new FormControl('', { nonNullable: true, validators: Validators.required }) });
  onSubmit() {}
}

describe('EgFormTextInput submit behavior', () => {
  let fixture: ComponentFixture<SubmitHost>;

  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [SubmitHost] }).compileComponents();
    fixture = TestBed.createComponent(SubmitHost);
    fixture.detectChanges();
  });

  afterEach(() => fixture.destroy());

  it('points aria-describedby at the hint until touched/dirty or submitted', () => {
    const input = () => fixture.nativeElement.querySelector('input') as HTMLInputElement;

    // Invalid from creation, but untouched and unsubmitted -> hint.
    expect(input().getAttribute('aria-describedby')).toBe(`${input().id}-hint`);

    // Submitting the parent form flips it to the error without touching the control.
    (fixture.nativeElement.querySelector('button[type="submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();
    fixture.detectChanges();
    expect(input().getAttribute('aria-describedby')).toBe(`${input().id}-error`);
  });
});
