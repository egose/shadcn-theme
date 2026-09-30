import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
  HlmDatePickerImports,
  HlmDatePicker,
  HlmDatePickerMulti,
  HlmDateRangePicker,
  provideHlmDatePickerConfig,
  provideHlmDatePickerMultiConfig,
  provideHlmDateRangePickerConfig,
} from '../public-api';
import { BrnJalaliDateAdapter, JalaliDate, provideDateAdapter } from '@spartan-ng/brain/date-time';
import { configureLibraryTestBed } from '../../../../test/setup';

type Kind = 'single' | 'range' | 'multi';
const day = (n: number, hour = 0) => new Date(2026, 8, n, hour);

@Component({
  imports: [ReactiveFormsModule, ...HlmDatePickerImports],
  template: `
    @switch (kind) {
      @case ('single') {
        <hlm-date-picker [formControl]="control" [min]="min" [max]="max" (dateChange)="changes.push($event)">
          <hlm-date-picker-input
            ariaLabel="Date"
            [readonly]="readonly"
            [forceInvalid]="forceInvalid"
            [inputValue]="draft()"
          />
        </hlm-date-picker>
      }
      @case ('range') {
        <hlm-date-range-picker [formControl]="control" [min]="min" [max]="max" (dateChange)="changes.push($event)">
          <hlm-date-range-input
            ariaLabel="Range"
            [readonly]="readonly"
            [forceInvalid]="forceInvalid"
            [inputValue]="draft()"
          />
        </hlm-date-range-picker>
      }
      @case ('multi') {
        <hlm-date-picker-multi
          [formControl]="control"
          [min]="min"
          [max]="max"
          [minSelection]="minSelection"
          [maxSelection]="maxSelection"
          (dateChange)="changes.push($event)"
        >
          <hlm-date-multi-input
            ariaLabel="Dates"
            [readonly]="readonly"
            [forceInvalid]="forceInvalid"
            [inputValue]="draft()"
          />
        </hlm-date-picker-multi>
      }
    }
  `,
})
class Host<T = Date> {
  kind: Kind = 'single';
  min = day(10, 12) as T;
  max = day(20, 12) as T;
  minSelection = 2;
  maxSelection = 3;
  readonly = false;
  forceInvalid = false;
  draft = signal('');
  control = new FormControl<T | T[] | null>(null);
  changes: unknown[] = [];
}

function input<T>(fixture: ComponentFixture<T>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input');
}

function commit<T>(fixture: ComponentFixture<T>, text: string, via: 'blur' | 'Enter') {
  const element = input(fixture);
  element.dispatchEvent(new FocusEvent('focus'));
  element.value = text;
  element.dispatchEvent(new Event('input', { bubbles: true }));
  fixture.detectChanges();
  element.dispatchEvent(
    via === 'blur' ? new FocusEvent('blur') : new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
  );
  fixture.detectChanges();
}

function textFor(kind: Kind, ...days: number[]): string {
  return kind === 'multi'
    ? days.map((n) => `${n}/09/2026`).join(', ')
    : days.map((n) => `September ${n}, 2026 00:00:00`).join(' - ');
}

function picker(
  fixture: ComponentFixture<Host>,
): HlmDatePicker<Date> | HlmDatePickerMulti<Date> | HlmDateRangePicker<Date> {
  return fixture.debugElement.query(By.css('hlm-date-picker, hlm-date-range-picker, hlm-date-picker-multi'))
    .componentInstance;
}

async function calendar(fixture: ComponentFixture<Host>) {
  picker(fixture).open();
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
  const element = document.querySelector('hlm-calendar, hlm-calendar-range, hlm-calendar-multi')!;
  expect(element).withContext('calendar overlay is rendered').not.toBeNull();
  return element;
}

function cell(calendar: Element, n: number): HTMLButtonElement {
  return Array.from(calendar.querySelectorAll<HTMLButtonElement>('button[brnCalendarCellButton]')).find(
    (button) => button.textContent?.trim() === `${n}`,
  )!;
}

for (const kind of ['single', 'range', 'multi'] as const) {
  describe(`date-picker ${kind} user commits`, () => {
    let fixture: ComponentFixture<Host>;
    let initial: Date | Date[];
    let transform: (value: Date | Date[]) => Date | Date[];
    beforeEach(async () => {
      transform = (value) => value;
      configureLibraryTestBed([
        provideHlmDatePickerConfig<Date>({ transformDate: (value) => transform(value) as Date }),
        provideHlmDateRangePickerConfig<Date>({ transformDates: (value) => transform(value) as [Date, Date] }),
        provideHlmDatePickerMultiConfig<Date>({ transformDates: (value) => transform(value) as Date[] }),
      ]);
      await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
      fixture = TestBed.createComponent<Host<Date>>(Host);
      fixture.componentInstance.kind = kind;
      initial = kind === 'single' ? day(15) : [day(14), day(15)];
      fixture.componentInstance.control.setValue(initial);
      fixture.detectChanges();
    });
    afterEach(() => fixture.destroy());

    for (const via of ['blur', 'Enter'] as const) {
      it(`rejects below-min text on ${via}, preserving the form value and editable invalid text`, () => {
        const text =
          kind === 'single' ? '2026-09-09' : kind === 'range' ? '2026-09-09 - 2026-09-15' : '09/09/2026, 15/09/2026';
        const values: unknown[] = [];
        fixture.componentInstance.control.valueChanges.subscribe((value) => values.push(value));
        commit(fixture, text, via);
        expect(fixture.componentInstance.control.value).toEqual(initial);
        expect(fixture.componentInstance.changes).toEqual([]);
        expect(values).toEqual([]);
        expect(input(fixture).value).toBe(text);
        expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
        expect(input(fixture).getAttribute('data-matches-spartan-invalid')).toBe('true');
        expect(fixture.componentInstance.control.touched).toBeTrue();
      });

      it(`rejects above-max and unparsable text on ${via}, then recovers and clears`, () => {
        for (const text of [textFor(kind, ...(kind === 'single' ? [21] : [15, 21])), 'not a date']) {
          commit(fixture, text, via);
          expect(fixture.componentInstance.control.value).toEqual(initial);
          expect(fixture.componentInstance.changes).toEqual([]);
          expect(input(fixture).value).toBe(text);
          input(fixture).dispatchEvent(new FocusEvent('focus'));
          fixture.detectChanges();
          expect(input(fixture).value).toBe(text);
          expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
        }
        const expected = kind === 'single' ? day(16) : [day(16), day(17)];
        commit(fixture, textFor(kind, ...(kind === 'single' ? [16] : [16, 17])), via);
        expect(fixture.componentInstance.control.value).toEqual(expected);
        expect(fixture.componentInstance.changes).toEqual([expected]);
        expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
        commit(fixture, '', via);
        expect(fixture.componentInstance.control.value).toEqual(kind === 'multi' ? [] : null);
        expect(fixture.componentInstance.changes).toEqual([expected, kind === 'multi' ? [] : null]);
        expect(input(fixture).value).toBe('');
      });

      it(`accepts inclusive whole-day bounds on ${via}`, () => {
        const dates = kind === 'single' ? [10] : [10, 20];
        commit(fixture, textFor(kind, ...dates), via);
        expect(fixture.componentInstance.control.value).toEqual(kind === 'single' ? day(10) : [day(10), day(20)]);
        // max's entire day, not just midnight or its configured noon, is selectable.
        if (kind !== 'multi') {
          const late = 'September 20, 2026 23:00:00';
          commit(fixture, kind === 'single' ? late : `${textFor('single', 10)} - ${late}`, via);
          expect(fixture.componentInstance.control.value).toEqual(
            kind === 'single' ? day(20, 23) : [day(10), day(20, 23)],
          );
        }
        expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
      });

      it(`rejects out-of-bounds or invalid transform results on ${via}`, () => {
        for (const bad of [day(21), new Date(NaN)]) {
          transform = () => (kind === 'single' ? bad : [day(15), bad]);
          commit(fixture, textFor(kind, ...(kind === 'single' ? [16] : [16, 17])), via);
          expect(fixture.componentInstance.control.value).toEqual(initial);
          expect(fixture.componentInstance.changes).toEqual([]);
          expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
        }
      });

      it(`rejects the raw bounds even if a transform would move them in bounds on ${via}`, () => {
        const normalize = jasmine.createSpy('normalize').and.returnValue(initial);
        transform = normalize;
        commit(fixture, textFor(kind, ...(kind === 'single' ? [21] : [15, 21])), via);
        expect(normalize).not.toHaveBeenCalled();
        expect(fixture.componentInstance.changes).toEqual([]);
        expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
      });
    }

    it('clears rejected text with the clear button and allows subsequent recovery', () => {
      commit(fixture, 'bad date', 'blur');
      (fixture.nativeElement.querySelector('button[aria-label="Clear date"]') as HTMLButtonElement).click();
      fixture.detectChanges();
      expect(input(fixture).value).toBe('');
      expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
      expect(fixture.componentInstance.changes).toEqual([kind === 'multi' ? [] : null]);
      commit(fixture, textFor(kind, ...(kind === 'single' ? [16] : [16, 17])), 'Enter');
      expect(fixture.componentInstance.changes.length).toBe(2);
    });

    it('keeps programmatic writes distinct, including same-value writes, null reset and configured transforms', () => {
      commit(fixture, 'invalid', 'Enter');
      fixture.componentInstance.control.setValue(initial);
      fixture.detectChanges();
      expect(input(fixture).value).toBe(picker(fixture).formattedDate()!);
      expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
      const external =
        kind === 'single' ? day(25) : [day(25), day(26), ...(kind === 'multi' ? [day(27), day(28)] : [])];
      transform = () => external;
      fixture.componentInstance.control.setValue(initial);
      fixture.detectChanges();
      expect(picker(fixture).value()).toEqual(external);
      expect(fixture.componentInstance.control.value).toEqual(initial);
      expect(fixture.componentInstance.changes).toEqual([]);
      commit(fixture, 'invalid', 'blur');
      fixture.componentInstance.control.reset();
      fixture.detectChanges();
      expect(input(fixture).value).toBe('');
      expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
      // Repeated null write must clear rejected text even when the model was already empty.
      commit(fixture, 'invalid', 'blur');
      fixture.componentInstance.control.reset();
      fixture.detectChanges();
      expect(input(fixture).value).toBe('');
      expect(fixture.componentInstance.changes).toEqual([]);
    });

    it('respects forceInvalid after recovery and disabled/readonly interaction guards', () => {
      fixture.componentInstance.forceInvalid = true;
      fixture.detectChanges();
      commit(fixture, textFor(kind, ...(kind === 'single' ? [16] : [16, 17])), 'blur');
      expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
      fixture.componentInstance.changes = [];
      const current = fixture.componentInstance.control.value;
      fixture.componentInstance.readonly = true;
      fixture.detectChanges();
      commit(fixture, '', 'Enter');
      expect(fixture.componentInstance.control.value).toEqual(current);
      fixture.componentInstance.readonly = false;
      fixture.componentInstance.control.disable();
      fixture.detectChanges();
      commit(fixture, '', 'blur');
      expect(fixture.componentInstance.control.value).toEqual(current);
      expect(fixture.componentInstance.changes).toEqual([]);
    });

    it('preserves external inputValue edits without committing and replaces them on a value write', () => {
      commit(fixture, 'invalid', 'blur');
      fixture.componentInstance.draft.set('new draft');
      fixture.detectChanges();
      const trigger = fixture.debugElement.query(
        By.css('hlm-date-picker-input, hlm-date-range-input, hlm-date-multi-input'),
      ).componentInstance as { inputValue: () => string };
      expect(trigger.inputValue()).toBe('new draft');
      expect(input(fixture).value).toBe('new draft');
      expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
      expect(fixture.componentInstance.control.value).toEqual(initial);
      expect(fixture.componentInstance.changes).toEqual([]);
      fixture.componentInstance.control.setValue(initial);
      fixture.detectChanges();
      expect(input(fixture).value).toBe(picker(fixture).formattedDate()!);
    });

    it('uses the same bounds and transformed-value policy for rendered calendar selections', async () => {
      const element = await calendar(fixture);
      expect(cell(element, 9).getAttribute('aria-disabled')).toBe('true');
      expect(cell(element, 21).getAttribute('aria-disabled')).toBe('true');
      expect(cell(element, 10).getAttribute('aria-disabled')).not.toBe('true');
      expect(cell(element, 20).getAttribute('aria-disabled')).not.toBe('true');
      cell(element, 9).click();
      fixture.detectChanges();
      expect(fixture.componentInstance.changes).toEqual([]);
      transform = () => (kind === 'single' ? day(21) : [day(16), day(21)]);
      cell(element, 16).click();
      fixture.detectChanges();
      if (kind === 'range') {
        cell(element, 17).click();
        fixture.detectChanges();
      }
      expect(fixture.componentInstance.control.value).toEqual(initial);
      expect(fixture.componentInstance.changes).toEqual([]);
      transform = (value) => value;
      // A new valid calendar selection recovers from the rejected transformed selection.
      cell(element, 18).click();
      fixture.detectChanges();
      if (kind === 'range') {
        cell(element, 19).click();
        fixture.detectChanges();
      }
      expect(fixture.componentInstance.changes.length).toBeGreaterThan(0);
      expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
    });

    if (kind === 'range') {
      it('retains single-date parsing as a same-day range and rejects malformed/reversed transform results', () => {
        commit(fixture, textFor('single', 16), 'blur');
        expect(fixture.componentInstance.control.value).toEqual([day(16), day(16)]);
        fixture.componentInstance.changes = [];
        for (const bad of [[day(18), day(17)], [day(17)]]) {
          transform = () => bad;
          commit(fixture, textFor('range', 16, 17), 'Enter');
          expect(fixture.componentInstance.control.value).toEqual([day(16), day(16)]);
          expect(fixture.componentInstance.changes).toEqual([]);
          expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
        }
      });
      for (const via of ['blur', 'Enter'] as const) {
        it(`rejects an invalid endpoint/reversed range on ${via}, while allowing custom order normalization`, () => {
          for (const text of [`${textFor('single', 15)} - nonsense`, textFor('range', 17, 16)]) {
            commit(fixture, text, via);
            expect(fixture.componentInstance.control.value).toEqual(initial);
            expect(fixture.componentInstance.changes).toEqual([]);
            expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
          }
          transform = (dates) => [...(dates as Date[])].sort((a, b) => a.getTime() - b.getTime());
          commit(fixture, textFor('range', 17, 16), via);
          expect(fixture.componentInstance.control.value).toEqual([day(16), day(17)]);
          expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
        });
      }
    }

    if (kind === 'multi') {
      for (const via of ['blur', 'Enter'] as const) {
        it(`enforces raw/transformed selection limits on ${via}, allowing growth and explicit clear`, () => {
          for (const days of [[16], [16, 17, 18, 19]]) {
            commit(fixture, textFor(kind, ...days), via);
            expect(fixture.componentInstance.control.value).toEqual(initial);
            expect(fixture.componentInstance.changes).toEqual([]);
            expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
          }
          for (const dates of [[day(16)], [day(16), day(17), day(18), day(19)]]) {
            transform = () => dates;
            commit(fixture, textFor(kind, 16, 17), via);
            expect(fixture.componentInstance.control.value).toEqual(initial);
            expect(fixture.componentInstance.changes).toEqual([]);
          }
          transform = (value) => value;
          commit(fixture, textFor(kind, 16, 17, 18), via);
          expect(fixture.componentInstance.control.value).toEqual([day(16), day(17), day(18)]);
          commit(fixture, '', via);
          commit(fixture, textFor(kind, 16), via);
          expect(fixture.componentInstance.control.value).toEqual([day(16)]);
          commit(fixture, textFor(kind, 16, 17), via);
          expect(fixture.componentInstance.control.value).toEqual([day(16), day(17)]);
        });
      }

      it('preserves calendar gradual selection and deselection-floor behavior', async () => {
        fixture.componentInstance.control.reset();
        fixture.detectChanges();
        const element = await calendar(fixture);
        for (const n of [16, 17]) {
          cell(element, n).click();
          fixture.detectChanges();
        }
        expect(fixture.componentInstance.control.value).toEqual([day(16), day(17)]);
        fixture.componentInstance.changes = [];
        cell(element, 16).click();
        fixture.detectChanges();
        expect(fixture.componentInstance.changes).toEqual([]);
        cell(element, 18).click();
        fixture.detectChanges();
        expect(fixture.componentInstance.control.value).toEqual([day(16), day(17), day(18)]);
        fixture.componentInstance.changes = [];
        cell(element, 19).click();
        fixture.detectChanges();
        expect(fixture.componentInstance.control.value).toEqual([day(16), day(17), day(18)]);
        expect(fixture.componentInstance.changes).toEqual([]);
      });
    }
  });
}

for (const kind of ['single', 'range', 'multi'] as const) {
  describe(`date-picker ${kind} non-native adapter and config`, () => {
    let fixture: ComponentFixture<Host<JalaliDate>>;
    const date = (day: number) => new JalaliDate(1405, 6, day);
    const parse = (text: string) =>
      text === 'invalid-object' ? date(NaN) : /^\d+$/.test(text) ? date(Number(text)) : null;
    const parseDates = (text: string) => {
      const dates = text.split(',').map(parse);
      return dates.every((date) => date !== null) ? (dates as JalaliDate[]) : null;
    };
    let transform: (value: JalaliDate) => JalaliDate;
    beforeEach(async () => {
      transform = (value) => value;
      configureLibraryTestBed([
        provideDateAdapter(BrnJalaliDateAdapter),
        provideHlmDatePickerConfig<JalaliDate>({
          parseDate: parse,
          formatDate: (d) => `display:${d.day}`,
          formatInputDate: (d) => `${d.day}`,
          transformDate: (d) => transform(d),
        }),
        provideHlmDateRangePickerConfig<JalaliDate>({
          parseDate: (text) => {
            const dates = parseDates(text);
            return dates?.length === 2 ? (dates as [JalaliDate, JalaliDate]) : null;
          },
          formatDates: (dates) => `display:${dates.map((d) => d?.day).join(',')}`,
          formatInputDates: (dates) => dates.map((d) => d?.day).join(','),
          transformDates: (dates) => dates.map(transform) as [JalaliDate, JalaliDate],
        }),
        provideHlmDatePickerMultiConfig<JalaliDate>({
          parseDate: parseDates,
          formatDates: (dates) => `display:${dates.map((d) => d.day).join(',')}`,
          formatInputDates: (dates) => dates.map((d) => d.day).join(','),
          transformDates: (dates) => dates.map(transform),
        }),
      ]);
      await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
      fixture = TestBed.createComponent<Host<JalaliDate>>(Host);
      fixture.componentInstance.kind = kind;
      fixture.componentInstance.min = date(10);
      fixture.componentInstance.max = date(20);
      fixture.detectChanges();
    });
    afterEach(() => fixture.destroy());

    for (const via of ['blur', 'Enter'] as const) {
      it(`uses adapter bounds, custom parse/edit/display formats and transformed values on ${via}`, () => {
        const valid = kind === 'single' ? '10' : '10,20';
        const expected = kind === 'single' ? date(10) : [date(10), date(20)];
        commit(fixture, valid, via);
        expect(fixture.componentInstance.control.value).toEqual(expected);
        expect(input(fixture).value).toBe(via === 'Enter' ? valid : `display:${valid}`);
        if (via === 'Enter') {
          input(fixture).dispatchEvent(new FocusEvent('blur'));
          fixture.detectChanges();
          expect(fixture.componentInstance.control.value).toEqual(expected);
          expect(input(fixture).value).toBe(`display:${valid}`);
        }
        fixture.componentInstance.changes = [];
        for (const text of [
          kind === 'single' ? '9' : '9,15',
          kind === 'single' ? '21' : '15,21',
          'invalid',
          kind === 'single' ? 'invalid-object' : '15,invalid-object',
        ]) {
          commit(fixture, text, via);
          expect(fixture.componentInstance.control.value).toEqual(expected);
          expect(fixture.componentInstance.changes).toEqual([]);
          expect(input(fixture).value).toBe(text);
          expect(input(fixture).getAttribute('aria-invalid')).toBe('true');
        }
        transform = () => date(21);
        commit(fixture, valid, via);
        expect(fixture.componentInstance.control.value).toEqual(expected);
        expect(fixture.componentInstance.changes).toEqual([]);
        transform = (d) => date(d.day + 1);
        commit(fixture, kind === 'single' ? '15' : '15,16', via);
        expect(fixture.componentInstance.control.value).toEqual(kind === 'single' ? date(16) : [date(16), date(17)]);
        expect(input(fixture).getAttribute('aria-invalid')).toBeNull();
      });
    }
  });
}
