import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EgGenericAutocomplete } from './search';

/**
 * Regression coverage for the header search popover composition.
 *
 * The search panel is an `hlm-popover-content` projected through the
 * package's `hlmPopoverPortal`, which supplies Spartan's overlay state
 * provider and template registration. Without the portal the content
 * directive throws NG0201 (missing EXPOSES_STATE_TOKEN) at creation, which
 * crashed the example shell and every prerendered route that renders the
 * layout search. This spec intentionally provides no synthetic overlay
 * state: the search must construct from its real imports.
 */
@Component({
  imports: [EgGenericAutocomplete],
  template: `<eg-generic-autocomplete [loaderFn]="load" placeholderText="Search demos" />`,
})
class SearchHost {
  load = async () => [{ label: 'Button', value: 'button' }];
}

describe('EgGenericAutocomplete search popover', () => {
  let fixture: ComponentFixture<SearchHost> | undefined;

  afterEach(() => {
    fixture?.destroy();
    fixture = undefined;
  });

  it('constructs the search popover from its real imports', async () => {
    await TestBed.configureTestingModule({ imports: [SearchHost] }).compileComponents();
    fixture = TestBed.createComponent(SearchHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement as HTMLElement;
    // The trigger renders eagerly; the input lives inside the portal
    // template and is stamped only when the popover opens.
    const trigger = host.querySelector('button[type="button"]');
    expect(trigger).not.toBeNull();
    expect(trigger?.textContent).toContain('Search demos');
  });
});
