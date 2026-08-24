import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  DestroyRef,
  effect,
  ElementRef,
  HostAttributeToken,
  inject,
  Injector,
  PLATFORM_ID,
  runInInjectionContext,
} from '@angular/core';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function hlm(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const documentClassStates = new WeakMap<Document, DocumentClassState>();

interface DocumentClassState {
  document: Document;
  managers: Map<HTMLElement, ElementClassManager>;
  observer: MutationObserver | null;
}

interface ElementClassManager {
  element: HTMLElement;
  sources: Map<number, { classes: Set<string>; order: number }>;
  baseClasses: Set<string>;
  isUpdating: boolean;
  nextOrder: number;
  hasInitialized: boolean;
  restoreRafId: number | null;
  transitionsSuppressed: boolean;
  previousTransition: string;
  previousTransitionPriority: string;
  state: DocumentClassState;
  view: Window | null;
}

let sourceCounter = 0;

export function classes(computed: () => ClassValue[] | string, options: ClassesOptions = {}) {
  runInInjectionContext(options.injector ?? inject(Injector), () => {
    const elementRef = options.elementRef ?? inject(ElementRef);
    const platformId = inject(PLATFORM_ID);
    const document = inject(DOCUMENT);
    const destroyRef = inject(DestroyRef);
    const baseClasses = inject(new HostAttributeToken('class'), { optional: true });

    const element = elementRef.nativeElement;
    const sourceId = sourceCounter++;
    const state = getDocumentState(document);
    let manager = state.managers.get(element);

    if (!manager) {
      const initialBaseClasses = new Set<string>();

      if (baseClasses) {
        toClassList(baseClasses).forEach((cls) => initialBaseClasses.add(cls));
      }

      manager = {
        element,
        sources: new Map(),
        baseClasses: initialBaseClasses,
        isUpdating: false,
        nextOrder: 0,
        hasInitialized: false,
        restoreRafId: null,
        transitionsSuppressed: false,
        previousTransition: '',
        previousTransitionPriority: '',
        state,
        view: document.defaultView,
      };
      state.managers.set(element, manager);

      observeManagedElement(state, element, platformId, document);

      if (isPlatformBrowser(platformId) && manager.view) {
        manager.previousTransition = element.style.getPropertyValue('transition');
        manager.previousTransitionPriority = element.style.getPropertyPriority('transition');
        element.style.setProperty('transition', 'none', 'important');
        manager.transitionsSuppressed = true;
      }
    }

    const sourceOrder = manager.nextOrder++;

    function updateClasses(): void {
      const newClasses = toClassList(computed());

      manager!.sources.set(sourceId, {
        classes: new Set(newClasses),
        order: sourceOrder,
      });

      updateElement(manager!);

      if (manager!.transitionsSuppressed) {
        manager!.transitionsSuppressed = false;
        manager!.restoreRafId = manager!.view!.requestAnimationFrame(() => {
          manager!.restoreRafId = null;
          restoreTransitionSuppression(manager!);
        });
      }
    }

    destroyRef.onDestroy(() => {
      if (manager!.restoreRafId !== null) {
        manager!.view?.cancelAnimationFrame(manager!.restoreRafId);
        manager!.restoreRafId = null;
      }

      if (manager!.transitionsSuppressed) {
        manager!.transitionsSuppressed = false;
        restoreTransitionSuppression(manager!);
      }

      manager!.sources.delete(sourceId);

      if (manager!.sources.size === 0) {
        cleanupManager(manager!);
      } else {
        updateElement(manager!);
      }
    });

    effect(updateClasses);
  });
}

function restoreTransitionSuppression(manager: ElementClassManager): void {
  const prev = manager.previousTransition;
  if (prev) {
    manager.element.style.setProperty('transition', prev, manager.previousTransitionPriority || undefined);
  } else {
    manager.element.style.removeProperty('transition');
  }
}

function getDocumentState(document: Document): DocumentClassState {
  let state = documentClassStates.get(document);
  if (!state) {
    state = { document, managers: new Map(), observer: null };
    documentClassStates.set(document, state);
  }
  return state;
}

function observeManagedElement(
  state: DocumentClassState,
  element: HTMLElement,
  platformId: object,
  document: Document,
): void {
  const MutationObserver = (document.defaultView as (Window & typeof globalThis) | null)?.MutationObserver;
  if (isPlatformBrowser(platformId) && MutationObserver) {
    if (!state.observer) {
      state.observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            const element = mutation.target as HTMLElement;
            const manager = state.managers.get(element);

            if (manager) {
              if (manager.isUpdating) continue;

              const currentClasses = toClassList(element.className);
              const allSourceClasses = new Set<string>();

              for (const source of manager.sources.values()) {
                for (const className of source.classes) {
                  allSourceClasses.add(className);
                }
              }

              manager.baseClasses.clear();

              for (const className of currentClasses) {
                if (!allSourceClasses.has(className)) {
                  manager.baseClasses.add(className);
                }
              }

              updateElement(manager);
            }
          }
        }
      });
    }

    state.observer.observe(element, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
}

function updateElement(manager: ElementClassManager): void {
  if (manager.isUpdating) return;

  manager.isUpdating = true;

  if (!manager.hasInitialized && manager.sources.size > 0) {
    const currentClasses = toClassList(manager.element.className);
    const allSourceClasses = new Set<string>();

    for (const source of manager.sources.values()) {
      source.classes.forEach((className) => allSourceClasses.add(className));
    }

    currentClasses.forEach((className) => {
      if (!allSourceClasses.has(className)) {
        manager.baseClasses.add(className);
      }
    });

    manager.hasInitialized = true;
  }

  const sortedSources = Array.from(manager.sources.entries()).sort(([, a], [, b]) => a.order - b.order);
  const allSourceClasses: string[] = [];

  for (const [, source] of sortedSources) {
    allSourceClasses.push(...source.classes);
  }

  const classesToApply =
    allSourceClasses.length > 0 || manager.baseClasses.size > 0
      ? hlm([...allSourceClasses, ...manager.baseClasses])
      : '';

  if (manager.element.className !== classesToApply) {
    manager.element.className = classesToApply;
  }

  manager.isUpdating = false;
}

function cleanupManager(manager: ElementClassManager): void {
  const { element, state } = manager;
  state.managers.delete(element);

  if (state.observer) {
    state.observer.disconnect();
    if (state.managers.size === 0) {
      state.observer = null;
    } else {
      for (const managedElement of state.managers.keys()) {
        state.observer.observe(managedElement, {
          attributes: true,
          attributeFilter: ['class'],
        });
      }
    }
  }

  if (state.managers.size === 0) {
    documentClassStates.delete(state.document);
  }
}

interface ClassesOptions {
  elementRef?: ElementRef<HTMLElement>;
  injector?: Injector;
}

const classListCache = new Map<string, string[]>();

function toClassList(className: string | ClassValue[]): string[] {
  if (typeof className === 'string' && classListCache.has(className)) {
    return classListCache.get(className)!;
  }

  const result = clsx(className)
    .split(' ')
    .filter((cls) => cls.length > 0);

  if (typeof className === 'string' && classListCache.size < 1000) {
    classListCache.set(className, result);
  }

  return result;
}
