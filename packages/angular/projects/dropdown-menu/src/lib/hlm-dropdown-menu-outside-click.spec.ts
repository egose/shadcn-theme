import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HlmButton } from '@egose/shadcn-theme-ng/button';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmDropdownMenuImports } from '../public-api';

@Component({
  imports: [HlmDropdownMenuImports, HlmButton],
  // NOTE: the trigger must NOT be nested inside another `hlmDropdownMenu`
  // element. The outer div would act as a parent CdkMenu, turning the trigger
  // into a submenu trigger that ignores menu-stack close events (including
  // outside clicks). Keep root triggers as siblings of their `ng-template`.
  template: `
    <button hlmButton [hlmDropdownMenuTrigger]="menu" type="button">Open</button>
    <ng-template #menu>
      <div hlmDropdownMenu>
        <button hlmDropdownMenuCheckbox [checked]="checked" (triggered)="checked = !checked">Toggle me</button>
      </div>
    </ng-template>
    <button type="button" id="outside">outside</button>
  `,
})
class OutsideClickHost {
  checked = false;
}

function overlayMenu(): HTMLElement | null {
  return document.querySelector('.cdk-overlay-container [data-slot="dropdown-menu"]');
}

describe('dropdown menu outside click', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('closes an open checkbox menu when clicking outside', async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [OutsideClickHost] }).compileComponents();
    const fixture = TestBed.createComponent(OutsideClickHost);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(overlayMenu()).withContext('menu should open').not.toBeNull();

    const outside = document.getElementById('outside') as HTMLElement;
    outside.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    outside.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(overlayMenu()).withContext('menu should close on outside click').toBeNull();
    fixture.destroy();
  });

  it('keeps a checkbox menu open when toggling an item', async () => {
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [OutsideClickHost] }).compileComponents();
    const fixture = TestBed.createComponent(OutsideClickHost);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('button')).nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(overlayMenu()).withContext('menu should open').not.toBeNull();

    const item = overlayMenu()?.querySelector('button');
    expect(item).withContext('checkbox item should render').not.toBeNull();
    item?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.checked).toBeTrue();
    expect(overlayMenu()).withContext('checkbox menu should stay open after toggle').not.toBeNull();
    fixture.destroy();
  });
});
