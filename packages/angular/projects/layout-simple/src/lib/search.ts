import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  signal,
  input,
  output,
  viewChild,
  inject,
  resource,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  HlmAutocompleteImports,
  provideHlmAutocompleteConfig,
  HlmAutocompleteOption,
} from '@egose/shadcn-theme-ng/autocomplete';
import { HlmSpinner } from '@egose/shadcn-theme-ng/spinner';

const transformValueToSearchMap: Record<string, any> = {};

@Component({
  selector: 'eg-generic-autocomplete',
  imports: [HlmSpinner, HlmAutocompleteImports, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="space-y-8">
      <hlm-autocomplete
        [inputId]="controlId()"
        [filteredOptions]="options.value()"
        [optionTemplate]="optionTemplate()"
        [loading]="options.isLoading()"
        [(search)]="search"
        [searchPlaceholderText]="placeholderText()"
        [emptyText]="emptyText()"
        formControlName="option"
        class="tw:bg-white"
      >
        <hlm-spinner loading class="size-6" />
      </hlm-autocomplete>
    </form>
    <ng-template #defaultOption let-option>
      {{ option }}
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [
    provideHlmAutocompleteConfig({
      transformValueToSearch: (params, inputId) => {
        const fn = transformValueToSearchMap[inputId];
        return fn(params);
      },
    }),
  ],
})
export class EgGenericAutocomplete<TItem, TParams extends object = { search: string }> {
  defaultOptionTemplate = viewChild<TemplateRef<HlmAutocompleteOption<TItem>>>('defaultOption');
  controlId = input<string>(crypto.randomUUID());
  placeholderText = input<string>('Select an option');
  emptyText = input<string>('No options found');

  optionTemplate = input<TemplateRef<HlmAutocompleteOption<TItem>> | undefined>(this.defaultOptionTemplate as any);
  loaderFn = input<((params: TParams) => Promise<TItem[]>) | undefined>(async () => []);
  transformValueToSearch = input<((value: TItem) => string) | undefined>((value: TItem) => String(value));

  public readonly optionChange = output<TItem>();
  private readonly _formBuilder = inject(FormBuilder);
  public form = this._formBuilder.group({
    option: [null, Validators.required],
  });

  public readonly search = signal<string>('');

  public options = resource<TItem[], TParams>({
    defaultValue: [] as TItem[],
    params: () => ({ search: this.search(), negajjang: '1111' }) as TParams,
    loader: async ({ params }) => {
      const fn = this.loaderFn();
      if (!fn) {
        return [];
      }

      return fn(params);
    },
  });

  ngOnInit() {
    transformValueToSearchMap[this.controlId()] = this.transformValueToSearch();

    this.form.controls['option'].valueChanges.subscribe((value) => {
      if (value !== null) {
        this.optionChange.emit(value);
      }
    });
  }

  ngOnDestroy() {
    delete transformValueToSearchMap[this.controlId()];
  }
}
