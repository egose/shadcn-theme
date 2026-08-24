import { provideZonelessChangeDetection, type Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { AbstractControl } from '@angular/forms';

export function configureLibraryTestBed(providers: Provider[] = []): void {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection(), ...providers],
  });
}

export function assertInputMatchesControl(input: HTMLInputElement, control: AbstractControl): void {
  if (input.value !== control.value) {
    throw new Error(
      `Expected input value ${JSON.stringify(input.value)} to match control value ${JSON.stringify(control.value)}`,
    );
  }
}

export function assertResourcesReleased(resources: { observers: number; timers: number }): void {
  if (resources.observers !== 0 || resources.timers !== 0) {
    throw new Error(`Leaked resources: ${resources.observers} observer(s), ${resources.timers} timer(s)`);
  }
}

export function assertHydrationAttributesMatch(
  serverElement: Element,
  clientElement: Element,
  attributes = ['id', 'for', 'aria-controls', 'aria-describedby'],
): void {
  for (const attribute of attributes) {
    const serverValue = serverElement.getAttribute(attribute);
    const clientValue = clientElement.getAttribute(attribute);
    if (serverValue !== clientValue) {
      throw new Error(
        `Hydration attribute ${attribute} differs: server=${JSON.stringify(serverValue)}, client=${JSON.stringify(clientValue)}`,
      );
    }
  }
}

export async function settleDom(): Promise<void> {
  await Promise.resolve();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}
