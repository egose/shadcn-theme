import { BreakpointObserver, type BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { configureLibraryTestBed } from '../../../../test/setup';
import { EgLayoutSimple } from './layout';

@Component({
  imports: [EgLayoutSimple],
  template: '<eg-layout-simple />',
})
class LayoutHost {}

describe('EgLayoutSimple', () => {
  let fixture: ComponentFixture<LayoutHost> | undefined;

  afterEach(() => fixture?.destroy());

  it('releases its breakpoint subscription on destruction', async () => {
    const breakpoints = new Subject<BreakpointState>();
    configureLibraryTestBed([{ provide: BreakpointObserver, useValue: { observe: () => breakpoints } }]);
    await TestBed.configureTestingModule({ imports: [LayoutHost], providers: [provideRouter([])] }).compileComponents();
    fixture = TestBed.createComponent(LayoutHost);
    fixture.detectChanges();

    expect(breakpoints.observed).toBeTrue();
    fixture.destroy();
    fixture = undefined;
    expect(breakpoints.observed).toBeFalse();
  });
});
