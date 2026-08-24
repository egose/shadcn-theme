import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureLibraryTestBed } from '../../../../test/setup';
import { HlmDropdownMenu } from './hlm-dropdown-menu';
import { HlmDropdownMenuSub } from './hlm-dropdown-menu-sub';

@Component({
  imports: [HlmDropdownMenu, HlmDropdownMenuSub],
  template: '<div hlmDropdownMenu></div><div hlmDropdownMenuSub></div>',
})
class DropdownHost {}

describe('dropdown menu lifecycle', () => {
  let fixture: ComponentFixture<DropdownHost> | undefined;

  afterEach(() => fixture?.destroy());

  it('cancels deferred side detection on destruction', async () => {
    const setTimeoutSpy = spyOn(window, 'setTimeout').and.callThrough();
    const clearTimeoutSpy = spyOn(window, 'clearTimeout').and.callThrough();
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [DropdownHost] }).compileComponents();
    fixture = TestBed.createComponent(DropdownHost);
    fixture.detectChanges();
    const timers = setTimeoutSpy.calls.all().map((call) => call.returnValue);

    fixture.destroy();
    fixture = undefined;

    expect(timers.length).toBeGreaterThanOrEqual(2);
    expect(timers.every((timer) => clearTimeoutSpy.calls.allArgs().some(([cleared]) => cleared === timer))).toBeTrue();
  });
});
