import { APP_ID, Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HlmFormIdGenerator {
  private readonly appId = inject(APP_ID);
  private nextId = 0;

  generate(prefix: string): string {
    return `${prefix}-${this.appId}-${this.nextId++}`;
  }
}
