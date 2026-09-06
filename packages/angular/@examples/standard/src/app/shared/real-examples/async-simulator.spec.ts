import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { simulateExampleLoad } from './async-simulator';
import { EXAMPLE_SIMULATED_ERROR_MESSAGE, EXAMPLE_SIMULATED_LATENCY_MS } from './example-view-state';

describe('simulateExampleLoad', () => {
  it('resolves with the given fixtures after the fixed latency', async () => {
    const fixtures = Object.freeze({ id: 'plan-starter' });
    const startedAt = Date.now();
    const resolved = await simulateExampleLoad(fixtures, { latencyMs: 10 });
    expect(resolved).toBe(fixtures);
    expect(Date.now() - startedAt).toBeGreaterThanOrEqual(9);
  });

  it('uses the deterministic default latency without per-call options', async () => {
    expect(EXAMPLE_SIMULATED_LATENCY_MS).toBeGreaterThan(0);
    const resolved = await simulateExampleLoad('ok', { latencyMs: 5 });
    expect(resolved).toBe('ok');
  });

  it('rejects with the default error message when failure is requested', async () => {
    await expectAsync(simulateExampleLoad('ok', { shouldFail: true, latencyMs: 5 })).toBeRejectedWithError(
      EXAMPLE_SIMULATED_ERROR_MESSAGE,
    );
  });

  it('rejects with a custom message when one is provided', async () => {
    await expectAsync(
      simulateExampleLoad('ok', { shouldFail: true, latencyMs: 5, errorMessage: 'Billing config failed.' }),
    ).toBeRejectedWithError('Billing config failed.');
  });

  it('produces identical outcomes across repeated runs', async () => {
    const fixtures = Object.freeze(['a', 'b']);
    const first = await simulateExampleLoad(fixtures, { latencyMs: 5 });
    const second = await simulateExampleLoad(fixtures, { latencyMs: 5 });
    expect(first).toBe(fixtures);
    expect(second).toBe(fixtures);
  });

  it('resolves inside a zoneless component without extra change-detection wiring', async () => {
    @Component({ template: '' })
    class Host {
      readonly value = signal<string | null>(null);
      async reload(): Promise<void> {
        this.value.set(await simulateExampleLoad('loaded-fixture', { latencyMs: 5 }));
      }
    }
    TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] });
    const fixture: ComponentFixture<Host> = TestBed.createComponent(Host);
    await fixture.componentInstance.reload();
    fixture.detectChanges();
    expect(fixture.componentInstance.value()).toBe('loaded-fixture');
  });
});
