import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { configureLibraryTestBed, settleDom } from '../../../../test/setup';
import { EgSearchableMultiselect, SelectOption } from './searchable-multiselect';

describe('EgSearchableMultiselect value ownership', () => {
  let fixture: ComponentFixture<EgSearchableMultiselect>;
  let changes: jasmine.Spy;
  let onChange: jasmine.Spy;
  let onTouched: jasmine.Spy;

  const chipLabels = () =>
    Array.from(
      fixture.nativeElement.querySelectorAll('button:not([hlmpopovertrigger])') as NodeListOf<HTMLButtonElement>,
    ).map((button) => button.parentElement!.textContent!.replace('✕', '').trim());
  const trigger = () => fixture.nativeElement.querySelector('button[hlmpopovertrigger]') as HTMLButtonElement;
  const removeChip = (index: number) =>
    (fixture.nativeElement.querySelectorAll('button:not([hlmpopovertrigger])')[index] as HTMLButtonElement).click();
  const openOptions = async () => {
    trigger().click();
    await fixture.whenStable();
    return Array.from(
      TestBed.inject(OverlayContainer).getContainerElement().querySelectorAll<HTMLElement>('[role="checkbox"]'),
    );
  };
  const overlay = () => TestBed.inject(OverlayContainer).getContainerElement();
  const searchInput = () => overlay().querySelector<HTMLInputElement>('input[type="search"]')!;
  const visibleOptions = () => Array.from(overlay().querySelectorAll<HTMLButtonElement>('[role="checkbox"]'));
  const searchFor = async (query: string) => {
    searchInput().value = query;
    searchInput().dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  };

  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [EgSearchableMultiselect] }).compileComponents();
    fixture = TestBed.createComponent(EgSearchableMultiselect);
    changes = jasmine.createSpy('valueChange');
    onChange = jasmine.createSpy('onChange');
    onTouched = jasmine.createSpy('onTouched');
    fixture.componentInstance.valueChange.subscribe(changes);
    fixture.componentInstance.registerOnChange(onChange);
    fixture.componentInstance.registerOnTouched(onTouched);
  });
  afterEach(() => fixture.destroy());

  it('names each option from its own unique nested label across filtering and relabeling', async () => {
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ]);
    fixture.detectChanges();
    await openOptions();
    const assertNames = (names: string[]) => {
      const buttons = visibleOptions();
      expect(new Set(buttons.map((button) => button.id)).size).toBe(names.length);
      const labelIds = buttons.map((button) => button.getAttribute('aria-labelledby')!);
      expect(new Set(labelIds).size).toBe(names.length);
      buttons.forEach((button, index) => {
        expect(button.id).not.toBe('');
        const label = document.getElementById(labelIds[index]);
        expect(label).toBe(button.closest('label'));
        expect(label?.textContent?.trim()).toBe(names[index]);
        expect(document.querySelectorAll(`[id="${labelIds[index]}"]`).length).toBe(1);
      });
    };
    assertNames(['Alpha', 'Beta']);
    await searchFor('beta');
    assertNames(['Beta']);
    await searchFor('');
    assertNames(['Alpha', 'Beta']);
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'Renamed Alpha' },
      { value: 'b', label: 'Beta' },
    ]);
    await fixture.whenStable();
    assertNames(['Renamed Alpha', 'Beta']);
  });

  it('filters option labels case-insensitively, announces no matches and restores choices when cleared', async () => {
    fixture.componentRef.setInput('options', [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta' },
    ]);
    fixture.detectChanges();
    await openOptions();
    const overlay = TestBed.inject(OverlayContainer).getContainerElement();
    const search = overlay.querySelector<HTMLInputElement>('input[type="search"]');
    expect(search).withContext('the picker needs a native search field').not.toBeNull();
    if (!search) return;
    expect(search.labels?.[0].textContent).toContain('Search options');
    const labels = () =>
      Array.from(overlay.querySelectorAll('[role="checkbox"]')).map((el) => el.closest('label')!.textContent!.trim());
    const type = async (value: string) => {
      search.value = value;
      search.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
    };
    await type('  ALp  ');
    expect(labels()).toEqual(['Alpha']);
    const status = overlay.querySelector('[role="status"]')!;
    expect(status.getAttribute('aria-live')).toBe('polite');
    expect(status.textContent?.trim()).toBe('');
    await type('unmatched');
    expect(labels()).toEqual([]);
    expect(status.textContent).toContain('No matching options');
    await type('');
    expect(labels()).toEqual(['Alpha', 'Beta']);
    expect(status.textContent?.trim()).toBe('');
    expect(changes).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('names chip remove actions using resolved labels and unresolved IDs', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Alpha' }]);
    fixture.componentRef.setInput('value', ['a', 'missing']);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button:not([hlmpopovertrigger])');
    expect(buttons[0].getAttribute('aria-label')).toBe('Remove Alpha');
    expect(buttons[1].getAttribute('aria-label')).toBe('Remove missing');
  });

  for (const mode of ['standalone', 'CVA']) {
    it(`preserves hidden and unresolved ${mode} selections across filters without mutating caller options`, async () => {
      const options = Object.freeze([
        Object.freeze({ value: 'a', label: 'Alpha' }),
        Object.freeze({ value: 'b', label: 'Beta' }),
      ]) as unknown as SelectOption[];
      const values = Object.freeze(['missing']) as unknown as string[];
      fixture.componentRef.setInput('options', options);
      if (mode === 'CVA') fixture.componentInstance.writeValue(values);
      else fixture.componentRef.setInput('value', values);
      fixture.detectChanges();
      await openOptions();
      await searchFor('alp');
      visibleOptions()[0].click();
      await fixture.whenStable();
      await searchFor('BETA');
      expect(chipLabels()).toEqual(['missing', 'Alpha']);
      visibleOptions()[0].click();
      await fixture.whenStable();
      expect(chipLabels()).toEqual(['missing', 'Alpha', 'Beta']);
      await searchFor('');
      expect(visibleOptions().map((el) => el.getAttribute('aria-checked'))).toEqual(['true', 'true']);
      await searchFor('alpha');
      visibleOptions()[0].click();
      await fixture.whenStable();
      expect(chipLabels()).toEqual(['missing', 'Beta']);
      expect(changes.calls.allArgs()).toEqual([[['missing', 'a']], [['missing', 'a', 'b']], [['missing', 'b']]]);
      expect(onChange.calls.allArgs()).toEqual(changes.calls.allArgs());
      expect(onTouched).toHaveBeenCalledTimes(3);
      expect(options).toEqual([
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ]);
      expect(values).toEqual(['missing']);
    });

    it(`reacts to async labels and external ${mode} writes while a filter is active without feedback`, async () => {
      const write = (values: string[]) => {
        if (mode === 'CVA') fixture.componentInstance.writeValue(values);
        else fixture.componentRef.setInput('value', values);
      };
      write(['a', 'missing']);
      fixture.detectChanges();
      await openOptions();
      await searchFor('alpha');
      expect(visibleOptions()).toEqual([]);
      fixture.componentRef.setInput('options', [{ value: 'a', label: 'Alpha' }]);
      await fixture.whenStable();
      expect(visibleOptions()[0].getAttribute('aria-checked')).toBe('true');
      expect(chipLabels()).toEqual(['Alpha', 'missing']);
      fixture.componentRef.setInput('options', [{ value: 'a', label: 'Renamed' }]);
      await fixture.whenStable();
      expect(visibleOptions()).toEqual([]);
      expect(chipLabels()).toEqual(['Renamed', 'missing']);
      expect(fixture.nativeElement.querySelector('button[aria-label="Remove Renamed"]')).not.toBeNull();
      write(['a']);
      await fixture.whenStable();
      expect(chipLabels()).toEqual(['Renamed']);
      write([]);
      await fixture.whenStable();
      expect(chipLabels()).toEqual([]);
      fixture.componentRef.setInput('options', []);
      await searchFor('');
      expect(visibleOptions()).toEqual([]);
      expect(overlay().querySelector('[role="status"]')!.textContent).toContain('No matching options');
      expect(changes).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onTouched).not.toHaveBeenCalled();
    });
  }

  it('supports localized search, empty feedback and remove names with reactive copy updates', async () => {
    fixture.componentRef.setInput('searchLabel', 'Rechercher des tags');
    fixture.componentRef.setInput('searchPlaceholder', 'Saisir un nom…');
    fixture.componentRef.setInput('emptyMessage', 'Aucun résultat');
    fixture.componentRef.setInput('removeLabel', (option: SelectOption) => `Retirer ${option.label}`);
    fixture.componentRef.setInput('value', ['missing']);
    fixture.detectChanges();
    await openOptions();
    expect(searchInput().labels![0].textContent).toContain('Rechercher des tags');
    expect(searchInput().placeholder).toBe('Saisir un nom…');
    expect(overlay().querySelector('[role="status"]')!.textContent).toContain('Aucun résultat');
    expect(fixture.nativeElement.querySelector('button[aria-label="Retirer missing"]')).not.toBeNull();
    fixture.componentRef.setInput('emptyMessage', 'Liste vide');
    await fixture.whenStable();
    expect(overlay().querySelector('[role="status"]')!.textContent).toContain('Liste vide');
  });

  it('focuses the native search, prevents Enter submission and closes on Escape with trigger focus restored', async () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Alpha' }]);
    fixture.detectChanges();
    trigger().focus();
    await openOptions();
    await settleDom();
    expect(document.activeElement).toBe(searchInput());
    expect(searchInput().tabIndex).toBe(0);
    await searchFor('alpha');
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    searchInput().dispatchEvent(enter);
    expect(enter.defaultPrevented).toBeTrue();
    const checkbox = visibleOptions()[0];
    expect(checkbox.tagName).toBe('BUTTON');
    expect(checkbox.type).toBe('button');
    expect(checkbox.tabIndex).toBe(0);
    checkbox.focus();
    expect(document.activeElement).toBe(checkbox);
    searchInput().focus();
    searchInput().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    await fixture.whenStable();
    await settleDom();
    expect(overlay().querySelector('input')).toBeNull();
    expect(document.activeElement).toBe(trigger());
    await openOptions();
    expect(searchInput().value).toBe('alpha');
    expect(changes).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('renders initial, updated and cleared standalone values without user notifications', () => {
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Alpha' }]);
    fixture.componentRef.setInput('value', ['a']);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['Alpha']);
    fixture.componentRef.setInput('value', ['missing']);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['missing']);
    fixture.componentRef.setInput('value', []);
    fixture.detectChanges();
    expect(chipLabels()).toEqual([]);
    expect(changes).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  it('retains CVA values before options and reacts to option arrivals, relabels and removal', () => {
    fixture.componentInstance.writeValue(['a', 'missing']);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['a', 'missing']);
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Alpha' }]);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['Alpha', 'missing']);
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Renamed' }]);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['Renamed', 'missing']);
    fixture.componentRef.setInput('options', []);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['a', 'missing']);
    expect(changes).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });

  for (const mode of ['standalone', 'CVA']) {
    it(`preserves unresolved ${mode} IDs through checkbox add/remove and explicit chip removal`, async () => {
      const values = Object.freeze(['missing', 'a']) as unknown as string[];
      const options = Object.freeze([
        Object.freeze({ value: 'b', label: 'Beta' }),
        Object.freeze({ value: 'a', label: 'Alpha' }),
      ]) as unknown as SelectOption[];
      if (mode === 'CVA') fixture.componentInstance.writeValue(values);
      else fixture.componentRef.setInput('value', values);
      fixture.componentRef.setInput('options', options);
      fixture.detectChanges();
      expect(chipLabels()).toEqual(['missing', 'Alpha']);
      expect(trigger().textContent).toContain('2 selected');
      const checkboxes = await openOptions();
      expect(checkboxes.length).toBe(2);
      expect(checkboxes[0].getAttribute('aria-checked')).toBe('false');
      expect(checkboxes[1].getAttribute('aria-checked')).toBe('true');
      expect(onTouched).not.toHaveBeenCalled();
      checkboxes[0].click();
      fixture.detectChanges();
      expect(chipLabels()).toEqual(['missing', 'Alpha', 'Beta']);
      expect(changes.calls.mostRecent().args[0]).toEqual(['missing', 'a', 'b']);
      checkboxes[1].click();
      fixture.detectChanges();
      expect(chipLabels()).toEqual(['missing', 'Beta']);
      expect(onChange.calls.mostRecent().args[0]).toEqual(['missing', 'b']);
      removeChip(0);
      fixture.detectChanges();
      expect(chipLabels()).toEqual(['Beta']);
      expect(changes.calls.allArgs()).toEqual([[['missing', 'a', 'b']], [['missing', 'b']], [['b']]]);
      expect(onChange.calls.allArgs()).toEqual(changes.calls.allArgs());
      expect(onTouched).toHaveBeenCalledTimes(3);
      expect(values).toEqual(['missing', 'a']);
      expect(options.map((option) => option.value)).toEqual(['b', 'a']);
    });
  }

  it('replaces standalone local edits with subsequent input updates including clearing', () => {
    fixture.componentRef.setInput('value', ['a', 'missing']);
    fixture.detectChanges();
    removeChip(0);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['missing']);
    fixture.componentRef.setInput('value', ['b']);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['b']);
    fixture.componentRef.setInput('value', []);
    fixture.detectChanges();
    expect(chipLabels()).toEqual([]);
    expect(changes).toHaveBeenCalledOnceWith(['missing']);
    expect(onChange).toHaveBeenCalledOnceWith(['missing']);
    expect(onTouched).toHaveBeenCalledTimes(1);
  });

  it('gives CVA writes ownership over value input updates and accepts repeated writes, [] and null', () => {
    fixture.componentRef.setInput('value', ['standalone']);
    fixture.detectChanges();
    const values = Object.freeze(['a', 'missing']) as unknown as string[];
    fixture.componentInstance.writeValue(values);
    fixture.detectChanges();
    removeChip(0);
    fixture.detectChanges();
    fixture.componentRef.setInput('value', ['ignored']);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['missing']);
    fixture.componentInstance.writeValue(values);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['a', 'missing']);
    fixture.componentInstance.writeValue([]);
    fixture.detectChanges();
    expect(chipLabels()).toEqual([]);
    fixture.componentInstance.writeValue(values);
    fixture.componentInstance.writeValue(null);
    fixture.componentRef.setInput('value', ['still-ignored']);
    fixture.detectChanges();
    expect(chipLabels()).toEqual([]);
    expect(values).toEqual(['a', 'missing']);
    expect(changes).toHaveBeenCalledOnceWith(['missing']);
    expect(onChange).toHaveBeenCalledOnceWith(['missing']);
    expect(onTouched).toHaveBeenCalledTimes(1);
  });

  it('isolates internal selection and CVA payloads from output listener mutations', () => {
    fixture.componentRef.setInput('value', ['a', 'missing']);
    fixture.componentInstance.valueChange.subscribe((values) => values.push('output-mutation'));
    onChange.and.callFake((values: string[]) => values.push('form-mutation'));
    fixture.detectChanges();
    removeChip(0);
    fixture.detectChanges();
    expect(chipLabels()).toEqual(['missing']);
    expect(changes.calls.mostRecent().args[0]).toEqual(['missing', 'output-mutation']);
    expect(onChange.calls.mostRecent().args[0]).toEqual(['missing', 'form-mutation']);
  });

  for (const source of ['disabled', 'wrapperDisabled', 'form']) {
    it(`blocks chip, checkbox and handler edits while ${source} disabled, then allows edits after enabling`, async () => {
      fixture.componentRef.setInput('value', ['a']);
      fixture.componentRef.setInput('options', [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta' },
      ]);
      fixture.detectChanges();
      const checkboxes = await openOptions();
      const setDisabled = (disabled: boolean) => {
        if (source === 'form') fixture.componentInstance.setDisabledState(disabled);
        else fixture.componentRef.setInput(source, disabled);
        fixture.detectChanges();
      };
      setDisabled(true);
      expect(searchInput().disabled).toBeTrue();
      await searchFor('no-match');
      expect(visibleOptions().length).toBe(2);
      expect(trigger().disabled).toBeTrue();
      expect(fixture.nativeElement.querySelector('button:not([hlmpopovertrigger])').disabled).toBeTrue();
      expect(checkboxes.every((checkbox) => (checkbox as HTMLButtonElement).disabled)).toBeTrue();
      removeChip(0);
      checkboxes[1].click();
      // Also guard queued events/direct handler entry after a lock changes.
      fixture.componentInstance['toggle']('b', true);
      fixture.componentInstance['addItem']('b');
      fixture.componentInstance['removeItem']('a');
      fixture.detectChanges();
      expect(chipLabels()).toEqual(['Alpha']);
      expect(changes).not.toHaveBeenCalled();
      expect(onChange).not.toHaveBeenCalled();
      expect(onTouched).not.toHaveBeenCalled();
      setDisabled(false);
      expect(searchInput().disabled).toBeFalse();
      await searchFor('Beta');
      expect(visibleOptions().length).toBe(1);
      checkboxes[1].click();
      fixture.detectChanges();
      expect(chipLabels()).toEqual(['Alpha', 'Beta']);
      expect(onChange).toHaveBeenCalledOnceWith(['a', 'b']);
      expect(onTouched).toHaveBeenCalledTimes(1);
    });
  }

  it('does not emit or touch for duplicate adds, unknown adds or absent removals', () => {
    fixture.componentRef.setInput('value', ['a']);
    fixture.componentRef.setInput('options', [{ value: 'a', label: 'Alpha' }]);
    fixture.detectChanges();
    fixture.componentInstance['toggle']('a', true);
    fixture.componentInstance['toggle']('missing', true);
    fixture.componentInstance['toggle']('missing', false);
    expect(changes).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
    expect(onTouched).not.toHaveBeenCalled();
  });
});

@Component({
  imports: [EgSearchableMultiselect, ReactiveFormsModule],
  template: `<eg-searchable-multiselect
    [formControl]="control"
    [value]="ignored()"
    [options]="options()"
    (valueChange)="changes($event)"
  />`,
})
class ReactiveHost {
  readonly control = new FormControl<string[]>(['missing', 'a']);
  readonly ignored = signal(['ignored']);
  readonly options = signal<SelectOption[]>([]);
  readonly changes = jasmine.createSpy('valueChange');
}

@Component({
  imports: [EgSearchableMultiselect, FormsModule],
  template: `<eg-searchable-multiselect [(ngModel)]="value" [options]="options()" (valueChange)="changes($event)" />`,
})
class NgModelHost {
  readonly value = signal<string[]>(['missing', 'a']);
  readonly options = signal<SelectOption[]>([]);
  readonly changes = jasmine.createSpy('valueChange');
}

@Component({
  imports: [EgSearchableMultiselect],
  template: `<eg-searchable-multiselect [value]="value()" (valueChange)="update($event)" [options]="options()" />`,
})
class StandaloneHost {
  readonly value = signal(['missing', 'a']);
  readonly options = signal<SelectOption[]>([]);
  readonly update = jasmine.createSpy('update').and.callFake((values: string[]) => this.value.set([...values]));
}

describe('EgSearchableMultiselect form and standalone bindings', () => {
  beforeEach(() => configureLibraryTestBed());

  it('integrates CVA writes, reset, touch, disable and user changes without feedback loops', async () => {
    const fixture = TestBed.createComponent(ReactiveHost);
    const host = fixture.componentInstance;
    const formChanges = jasmine.createSpy('formChanges');
    host.control.valueChanges.subscribe(formChanges);
    fixture.detectChanges();
    const component = fixture.debugElement.query(By.directive(EgSearchableMultiselect))
      .componentInstance as EgSearchableMultiselect;
    expect(fixture.nativeElement.textContent).toContain('2 selected');
    expect(host.control.untouched).toBeTrue();
    host.options.set([{ value: 'a', label: 'Alpha' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Alpha');
    host.control.setValue(['a', 'other']);
    host.ignored.set(['ignored-again']);
    await fixture.whenStable();
    expect(host.changes).not.toHaveBeenCalled();
    expect(formChanges).toHaveBeenCalledOnceWith(['a', 'other']);
    expect(host.control.untouched).toBeTrue();
    component['removeItem']('a');
    await fixture.whenStable();
    expect(host.control.value).toEqual(['other']);
    expect(host.control.touched).toBeTrue();
    expect(host.control.dirty).toBeTrue();
    expect(formChanges.calls.count()).toBe(2);
    expect(host.changes).toHaveBeenCalledOnceWith(['other']);
    host.control.disable();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('button[hlmpopovertrigger]').disabled).toBeTrue();
    host.control.setValue(['a']);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Alpha');
    host.control.enable();
    host.control.reset();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('0 selected');
    expect(host.control.untouched).toBeTrue();
    expect(host.control.pristine).toBeTrue();
    expect(host.changes).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });

  it('supports ngModel values before options, user changes and external clearing', async () => {
    const fixture = TestBed.createComponent(NgModelHost);
    fixture.detectChanges();
    // NgModel schedules model-to-view writes in a microtask outside the initial render.
    await settleDom();
    await fixture.whenStable();
    const host = fixture.componentInstance;
    expect(fixture.nativeElement.textContent).toContain('2 selected');
    host.options.set([{ value: 'a', label: 'Alpha' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Alpha');
    expect(host.changes).not.toHaveBeenCalled();
    (fixture.nativeElement.querySelector('button:not([hlmpopovertrigger])') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(host.value()).toEqual(['a']);
    expect(host.changes).toHaveBeenCalledOnceWith(['a']);
    host.value.set([]);
    await settleDom();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('0 selected');
    expect(host.changes).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });

  it('accepts copy-array standalone output handlers without repeated notifications or losing local edits', async () => {
    const fixture = TestBed.createComponent(StandaloneHost);
    fixture.detectChanges();
    const host = fixture.componentInstance;
    (fixture.nativeElement.querySelector('button:not([hlmpopovertrigger])') as HTMLButtonElement).click();
    await fixture.whenStable();
    expect(host.value()).toEqual(['a']);
    expect(host.update).toHaveBeenCalledOnceWith(['a']);
    host.options.set([{ value: 'a', label: 'Alpha' }]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Alpha');
    host.value.set([]);
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('0 selected');
    expect(host.update).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });
});
