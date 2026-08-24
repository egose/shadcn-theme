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
