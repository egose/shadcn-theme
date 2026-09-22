import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgLayoutFlyoutNavbar } from './flyout-navbar';
import type { FlyoutMenuGroup } from './navigation';

@Component({ template: '' })
class Destination {}

describe('layout fly-out navbar', () => {
  let fixture: ComponentFixture<EgLayoutFlyoutNavbar>;
  let element: HTMLElement;
  let action: jasmine.Spy;
  let groups: FlyoutMenuGroup[];
  const trigger = (index = 0) => element.querySelectorAll<HTMLButtonElement>('nav > button')[index];
  const panel = () => element.querySelector<HTMLElement>('[data-slot="flyout-panel"]');
  function key(target: HTMLElement, value: string): void {
    target.dispatchEvent(new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }
  function open(index = 0): void {
    trigger(index).focus();
    trigger(index).click();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({
      imports: [EgLayoutFlyoutNavbar],
      providers: [provideRouter([{ path: '**', component: Destination }])],
    }).compileComponents();
    fixture = TestBed.createComponent(EgLayoutFlyoutNavbar);
    action = jasmine.createSpy('action');
    groups = [
      {
        label: 'Components',
        description: 'Build an interface',
        items: [
          { label: 'Button', description: 'Accessible actions', link: '/components/button' },
          { label: 'Unavailable', action, disabled: true },
          { label: 'Run action', action },
        ],
      },
      { label: 'Empty', items: [] },
      { label: 'Examples', items: [{ label: 'Pricing', link: '/examples/pricing' }] },
    ];
    fixture.componentRef.setInput('groups', groups);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });
  afterEach(() => fixture.destroy());

  it('opens one labelled card panel at a time and toggles it closed', () => {
    expect(panel()).toBeNull();
    open();
    expect(trigger().getAttribute('aria-expanded')).toBe('true');
    expect(panel()?.id).toBe(trigger().getAttribute('aria-controls')!);
    expect(panel()?.getAttribute('aria-labelledby')).toBe(trigger().id);
    expect(panel()?.textContent).toContain('Build an interface');
    expect(panel()?.textContent).toContain('Accessible actions');
    open(2);
    expect(trigger().getAttribute('aria-expanded')).toBe('false');
    expect(element.querySelectorAll('[data-slot="flyout-panel"]').length).toBe(1);
    expect(panel()?.textContent).toContain('Pricing');
    open(2);
    expect(panel()).toBeNull();
  });

  it('supports arrow-key entry and Escape with focus restoration', async () => {
    trigger().focus();
    key(trigger(), 'ArrowDown');
    await fixture.whenStable();
    expect(document.activeElement).toBe(panel()!.querySelector('a'));
    key(document.activeElement as HTMLElement, 'Escape');
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
    key(trigger(), 'ArrowUp');
    await fixture.whenStable();
    expect(document.activeElement?.textContent).toContain('Run action');
  });

  it('moves across triggers while skipping empty groups', () => {
    expect(trigger(1).disabled).toBeTrue();
    trigger().focus();
    key(trigger(), 'ArrowRight');
    expect(document.activeElement).toBe(trigger(2));
    key(trigger(2), 'Home');
    expect(document.activeElement).toBe(trigger());
    key(trigger(), 'End');
    expect(document.activeElement).toBe(trigger(2));
  });

  it('dismisses on outside pointer interaction or when focus leaves', () => {
    open();
    document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    fixture.detectChanges();
    expect(panel()).toBeNull();
    open();
    trigger().dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
    fixture.detectChanges();
    expect(panel()).toBeNull();
  });

  it('does not dismiss while focus moves from trigger to a card', () => {
    open();
    panel()!.querySelector<HTMLAnchorElement>('a')!.focus();
    fixture.detectChanges();
    expect(panel()).not.toBeNull();
  });

  it('supports action cards and disables unavailable destinations', () => {
    open();
    panel()!.querySelector<HTMLButtonElement>('eg-layout-navigation-item button:disabled')!.click();
    expect(action).not.toHaveBeenCalled();
    panel()!.querySelector<HTMLButtonElement>('eg-layout-navigation-item button:not(:disabled)')!.click();
    fixture.detectChanges();
    expect(action).toHaveBeenCalledTimes(1);
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it('closes after routing and marks the current category and destination', async () => {
    open();
    await TestBed.inject(Router).navigateByUrl('/components/button?tab=api');
    fixture.detectChanges();
    expect(panel()).toBeNull();
    expect(trigger().hasAttribute('data-active')).toBeTrue();
    open();
    await fixture.whenStable();
    expect(panel()?.querySelector('a')?.getAttribute('aria-current')).toBe('page');
  });

  it('closes a stale panel when route-aware group data changes', () => {
    open();
    fixture.componentRef.setInput('groups', [groups[2]]);
    fixture.detectChanges();
    expect(panel()).toBeNull();
    expect(trigger().textContent).toContain('Examples');
  });
});
