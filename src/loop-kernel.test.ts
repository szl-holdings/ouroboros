import { afterEach, describe, expect, it, vi } from 'vitest';
import { runLoop } from './loop-kernel.js';

// The kernel emits a fire-and-forget governance receipt via fetch. Keep it off
// the network so these boundedness tests stay hermetic and fast.
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function stubReceiptSink(): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: true } as unknown as Response),
  );
}

// A step that never converges — the loop can only terminate on its budget.
const neverConverges = {
  step: (s: number) => ({ state: s + 1, output: s + 1 }),
  delta: (a: number, b: number) => Math.abs(a - b),
};

describe('runLoop boundedness hardening (maxSteps sanitization)', () => {
  it('fails closed to the default bound when maxSteps is Infinity', async () => {
    stubReceiptSink();
    // Before the guard, an Infinity budget on a non-converging step would loop
    // forever. The bounded primitive must instead cap at the default (8).
    const trace = await runLoop<number, number>({
      initialState: 0,
      ...neverConverges,
      config: { maxSteps: Number.POSITIVE_INFINITY },
    });
    expect(trace.exitReason).toBe('budgetExhausted');
    expect(trace.maxSteps).toBe(8);
    expect(trace.stepsRun).toBe(8);
  });

  it('fails closed to the default bound when maxSteps is NaN', async () => {
    stubReceiptSink();
    const trace = await runLoop<number, number>({
      initialState: 0,
      ...neverConverges,
      config: { maxSteps: Number.NaN },
    });
    expect(trace.exitReason).toBe('budgetExhausted');
    expect(trace.maxSteps).toBe(8);
    expect(trace.stepsRun).toBe(8);
  });

  it('floors a fractional maxSteps so the reported ceiling never lies', async () => {
    stubReceiptSink();
    const trace = await runLoop<number, number>({
      initialState: 0,
      ...neverConverges,
      config: { maxSteps: 3.9 },
    });
    expect(trace.maxSteps).toBe(3);
    expect(trace.stepsRun).toBe(3);
    expect(trace.exitReason).toBe('budgetExhausted');
  });

  it('clamps a negative maxSteps to 0 (runs nothing, reports 0 not a negative)', async () => {
    stubReceiptSink();
    const trace = await runLoop<number, number>({
      initialState: 0,
      ...neverConverges,
      config: { maxSteps: -5 },
    });
    expect(trace.maxSteps).toBe(0);
    expect(trace.stepsRun).toBe(0);
    expect(trace.exitReason).toBe('budgetExhausted');
  });

  it('leaves a normal finite budget untouched', async () => {
    stubReceiptSink();
    const trace = await runLoop<number, number>({
      initialState: 0,
      ...neverConverges,
      config: { maxSteps: 5 },
    });
    expect(trace.maxSteps).toBe(5);
    expect(trace.stepsRun).toBe(5);
    expect(trace.exitReason).toBe('budgetExhausted');
  });
});
