import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EgFormPhoneInput } from '@egose/shadcn-theme-ng/form-phone-input';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmPhoneInput, formatNanpPhoneNumber } from './hlm-phone-input';

@Component({
  imports: [ReactiveFormsModule, HlmPhoneInput, EgFormPhoneInput],
  template: `
    <hlm-phone-input
      inputId="primitive"
      [formControl]="primitive"
      [modelFormat]="modelFormat()"
      [readonly]="readonly()"
      [disabled]="disabled()"
      [formatPhoneNumber]="formatter()"
    />
    <form [formGroup]="form">
      <eg-form-phone-input
        id="wrapper"
        label="Phone"
        controlName="wrapped"
        [modelFormat]="modelFormat()"
        [readonly]="readonly()"
        [disabled]="disabled()"
      />
    </form>
    <textarea id="clipboard">+1 (202) 867-5309</textarea>
  `,
})
class KeyboardHost {
  readonly primitive = new FormControl<string | null>(null);
  readonly wrapped = new FormControl<string | null>(null);
  readonly form = new FormGroup({ wrapped: this.wrapped });
  readonly modelFormat = signal<'digits' | 'formatted'>('digits');
  readonly readonly = signal(false);
  readonly disabled = signal(false);
  readonly formatter = signal(formatNanpPhoneNumber);
}

// Opt-in fixture: normal library runs use the DOM-contract regressions instead.
const probeWindow = window as unknown as {
  __karma__: { config: { args: string[] } };
  phoneKeyboard?: unknown;
};
if (probeWindow.__karma__.config.args.includes('phone-keyboard')) {
  describe('phone input real keyboard fixture', () => {
    it('accepts the external Chrome keyboard probe', async () => {
      configureLibraryTestBed();
      await TestBed.configureTestingModule({ imports: [KeyboardHost] }).compileComponents();
      const fixture = TestBed.createComponent(KeyboardHost);
      const host = fixture.componentInstance;
      const changes: (string | null)[] = [];
      host.primitive.valueChanges.subscribe((value) => changes.push(value));
      host.wrapped.valueChanges.subscribe((value) => changes.push(value));
      fixture.detectChanges();
      const events: {
        type: string;
        inputType: string;
        trusted: boolean;
        cancelable: boolean;
        selection: (number | null)[];
      }[] = [];
      for (const type of ['beforeinput', 'input']) {
        fixture.nativeElement.addEventListener(
          type,
          (event: InputEvent) => {
            const input = event.target as HTMLInputElement;
            if (input.tagName !== 'INPUT') return;
            events.push({
              type,
              inputType: event.inputType,
              trusted: event.isTrusted,
              cancelable: event.cancelable,
              selection: [input.selectionStart, input.selectionEnd],
            });
          },
          true,
        );
      }
      try {
        await new Promise<void>((resolve, reject) => {
          probeWindow.phoneKeyboard = {
            reset: (options: {
              value?: string | null;
              formatted?: boolean;
              readonly?: boolean;
              disabled?: boolean;
              formDisabled?: boolean;
              custom?: boolean;
            }) => {
              host.modelFormat.set(options.formatted ? 'formatted' : 'digits');
              host.readonly.set(options.readonly ?? false);
              host.disabled.set(options.disabled ?? false);
              host.formatter.set(
                options.custom ? (digits) => digits.match(/.{1,3}/g)?.join(' / ') ?? '' : formatNanpPhoneNumber,
              );
              for (const control of [host.primitive, host.wrapped]) {
                control.enable();
                control.reset(options.value === undefined ? '4155552671' : options.value);
                if (options.formDisabled) control.disable();
              }
              fixture.detectChanges();
              changes.length = 0;
              events.length = 0;
            },
            read: (id: 'primitive' | 'wrapper') => {
              fixture.detectChanges();
              const input = fixture.nativeElement.querySelector(`input#${id}`) as HTMLInputElement;
              const control = id === 'primitive' ? host.primitive : host.wrapped;
              return {
                text: input.value,
                model: control.value,
                selection: [input.selectionStart, input.selectionEnd],
                touched: control.touched,
                changes: [...changes],
                events: [...events],
              };
            },
            finish: (error?: string) => (error ? reject(new Error(error)) : resolve()),
          };
        });
      } finally {
        delete probeWindow.phoneKeyboard;
        fixture.destroy();
      }
    }, 120000);
  });
}
