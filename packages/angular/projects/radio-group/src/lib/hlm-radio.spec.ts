import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureLibraryTestBed, settleDom } from '../../../../test/setup';
import { HlmRadio } from './hlm-radio';
import { HlmRadioGroup } from './hlm-radio-group';

@Component({
  imports: [HlmRadio, HlmRadioGroup],
  template: `
    <div hlmRadioGroup>
      <label [attr.for]="radioId">Managed label</label>
      <label for="other">Unrelated label</label>
      <hlm-radio [inputId]="radioId" value="choice" disabled />
    </div>
  `,
})
class RadioHost {
  readonly radioId = 'radio"] [for="other';
}

describe('HlmRadio label relationship', () => {
  let fixture: ComponentFixture<RadioHost> | undefined;

  afterEach(() => fixture?.destroy());

  it('handles special-character IDs without selecting an unrelated label', async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [RadioHost] }).compileComponents();

    expect(() => {
      fixture = TestBed.createComponent(RadioHost);
      fixture.detectChanges();
    }).not.toThrow();
    await settleDom();

    const labels = fixture!.nativeElement.querySelectorAll('label') as NodeListOf<HTMLLabelElement>;
    expect(labels[0].getAttribute('data-disabled')).toBe('true');
    expect(labels[1].hasAttribute('data-disabled')).toBeFalse();
  });
});
