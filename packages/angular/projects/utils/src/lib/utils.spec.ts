import { DOCUMENT } from '@angular/common';
import {
  PLATFORM_ID,
  Component,
  Directive,
  ElementRef,
  EnvironmentInjector,
  createEnvironmentInjector,
  inject,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { assertResourcesReleased, configureLibraryTestBed, settleDom } from '../../../../test/setup';
import { classes } from './utils';

@Directive({ selector: '[testManagedClasses]' })
class ManagedClasses {
  constructor() {
    classes(() => 'managed');
  }
}

@Component({
  imports: [ManagedClasses],
  template: '<div testManagedClasses class="base"></div>',
})
class ClassesHost {}

@Directive({ selector: '[testServerClasses]' })
class ServerClasses {
  constructor() {
    classes(() => 'server-safe', { elementRef: inject(ElementRef) });
  }
}

@Component({
  imports: [ServerClasses],
  template: '<div testServerClasses></div>',
})
class ServerClassesHost {}

function instrumentMutationObservers(view: Window & typeof globalThis) {
  const OriginalMutationObserver = view.MutationObserver;
  const stats = { callbacks: 0, disconnects: 0, instances: 0 };

  class InstrumentedMutationObserver extends OriginalMutationObserver {
    constructor(callback: MutationCallback) {
      super((mutations, observer) => {
        stats.callbacks++;
        callback(mutations, observer);
      });
      stats.instances++;
    }

    override disconnect(): void {
      stats.disconnects++;
      super.disconnect();
    }
  }

  Object.defineProperty(view, 'MutationObserver', {
    configurable: true,
    value: InstrumentedMutationObserver,
  });

  return {
    stats,
    restore: () =>
      Object.defineProperty(view, 'MutationObserver', { configurable: true, value: OriginalMutationObserver }),
  };
}

describe('classes', () => {
  let fixture: ComponentFixture<ClassesHost> | undefined;

  afterEach(() => fixture?.destroy());

  it('reconciles managed mutations and disconnects observation on teardown', async () => {
    const disconnect = spyOn(MutationObserver.prototype, 'disconnect').and.callThrough();
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [ClassesHost] }).compileComponents();
    fixture = TestBed.createComponent(ClassesHost);
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('div') as HTMLDivElement;
    expect(element.classList).toContain('managed');
    expect(element.classList).toContain('base');

    element.className = 'external';
    await settleDom();
    expect(element.classList).toContain('external');
    expect(element.classList).toContain('managed');

    fixture.destroy();
    fixture = undefined;
    expect(disconnect).toHaveBeenCalled();
  });

  it('cancels pending animation frames on teardown', async () => {
    const cancelAnimationFrame = spyOn(window, 'cancelAnimationFrame').and.callThrough();
    configureLibraryTestBed();
    await TestBed.configureTestingModule({ imports: [ClassesHost] }).compileComponents();
    fixture = TestBed.createComponent(ClassesHost);
    fixture.detectChanges();

    fixture.destroy();
    fixture = undefined;
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it('does not reconcile unrelated class mutations and reduces observer callbacks', async () => {
    const OriginalMutationObserver = window.MutationObserver;
    const instrumentation = instrumentMutationObservers(window);
    let baselineCallbacks = 0;
    const documentWideObserver = new OriginalMutationObserver(() => baselineCallbacks++);
    documentWideObserver.observe(document, { attributes: true, attributeFilter: ['class'], subtree: true });

    try {
      configureLibraryTestBed();
      await TestBed.configureTestingModule({ imports: [ClassesHost] }).compileComponents();
      fixture = TestBed.createComponent(ClassesHost);
      fixture.detectChanges();
      await settleDom();
      instrumentation.stats.callbacks = 0;
      baselineCallbacks = 0;

      const unrelated = document.createElement('section');
      unrelated.innerHTML = Array.from({ length: 100 }, (_, index) => `<div class="fixture-${index}"></div>`).join('');
      document.body.append(unrelated);
      for (const element of Array.from(unrelated.children)) element.classList.add('changed');
      await settleDom();

      expect(baselineCallbacks).toBeGreaterThan(0);
      expect(instrumentation.stats.callbacks).toBe(0);
      unrelated.remove();
    } finally {
      documentWideObserver.disconnect();
      instrumentation.restore();
    }
  });

  it('keeps observer state isolated between documents', async () => {
    configureLibraryTestBed();
    const parentInjector = TestBed.inject(EnvironmentInjector);
    const frames = [document.createElement('iframe'), document.createElement('iframe')];
    frames.forEach((frame) => document.body.append(frame));
    const documents = frames.map((frame) => frame.contentDocument!);
    const instrumentation = frames.map((frame) =>
      instrumentMutationObservers(frame.contentWindow as Window & typeof globalThis),
    );
    const injectors = documents.map((managedDocument) =>
      createEnvironmentInjector(
        [
          { provide: DOCUMENT, useValue: managedDocument },
          { provide: PLATFORM_ID, useValue: 'browser' },
        ],
        parentInjector,
      ),
    );

    try {
      documents.forEach((managedDocument, index) => {
        const element = managedDocument.createElement('div');
        managedDocument.body.append(element);
        classes(() => 'managed', { elementRef: new ElementRef(element), injector: injectors[index] });
      });
      await settleDom();

      expect(instrumentation[0].stats.instances).toBe(1);
      expect(instrumentation[1].stats.instances).toBe(1);
    } finally {
      injectors.forEach((injector) => injector.destroy());
      expect(instrumentation[0].stats.disconnects).toBe(1);
      expect(instrumentation[1].stats.disconnects).toBe(1);
      instrumentation.forEach(({ restore }) => restore());
      frames.forEach((frame) => frame.remove());
    }
  });

  it('does not create a browser mutation observer on the server platform', async () => {
    const observer = spyOn(window, 'MutationObserver');
    configureLibraryTestBed([{ provide: PLATFORM_ID, useValue: 'server' }]);
    await TestBed.configureTestingModule({ imports: [ServerClassesHost] }).compileComponents();
    const serverFixture = TestBed.createComponent(ServerClassesHost);
    serverFixture.detectChanges();

    expect(observer).not.toHaveBeenCalled();
    serverFixture.destroy();
  });

  it('detects a deliberately broken teardown fixture', () => {
    expect(() => assertResourcesReleased({ observers: 1, timers: 1 })).toThrowError(/Leaked resources/);
    expect(() => assertResourcesReleased({ observers: 0, timers: 0 })).not.toThrow();
  });
});
