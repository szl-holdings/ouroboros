import { afterEach, describe, expect, it, vi } from 'vitest';
import { runLoop } from './loop-kernel.js';
import {
  buildLoopReceipt,
  emitLoopReceipt,
  resolveSink,
} from './receipt-emitter.js';
import type { LoopTrace } from './types.js';

const sampleTrace: LoopTrace<number> = {
  id: 'loop_test',
  label: 'test.loop',
  steps: [],
  finalState: 0,
  finalOutput: undefined,
  exitReason: 'budgetExhausted',
  stepsRun: 0,
  maxSteps: 8,
  earliestSafeExit: -1,
  totalDurationMs: 0,
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  delete process.env.SZL_RECEIPT_SINK;
});

describe('buildLoopReceipt', () => {
  it('produces an honest, ledger-shaped receipt', () => {
    const r = buildLoopReceipt(sampleTrace);
    expect(r.organ).toBe('ouroboros');
    expect(r.decision).toBe('budgetExhausted');
    expect(r.id).toMatch(/^[0-9a-f]{64}$/);
    // Λ and energy are not measured by the kernel — must be honest, not faked.
    expect(r.governance.lambda).toBeNull();
    expect(r.energy.label).toBe('UNAVAILABLE');
    expect(r.energy.joules).toBeNull();
    expect(typeof r.ts).toBe('string');
  });

  it('is deterministic for the same trace summary', () => {
    expect(buildLoopReceipt(sampleTrace).id).toBe(
      buildLoopReceipt(sampleTrace).id,
    );
  });
});

describe('resolveSink', () => {
  it('prefers SZL_RECEIPT_SINK over config and fallback', () => {
    process.env.SZL_RECEIPT_SINK = 'https://env.example/api';
    expect(resolveSink('https://config.example/api')).toBe(
      'https://env.example/api',
    );
  });

  it('falls back to the config URL when env is unset', () => {
    expect(resolveSink('https://config.example/api')).toBe(
      'https://config.example/api',
    );
  });
});

describe('emitLoopReceipt (fire-and-forget)', () => {
  it('POSTs the receipt to <sink>/receipts', () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true } as unknown as Response);
    vi.stubGlobal('fetch', fetchMock);
    process.env.SZL_RECEIPT_SINK = 'https://sink.example/api';

    emitLoopReceipt(sampleTrace);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://sink.example/api/receipts');
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ method: 'POST' });
  });

  it('never throws when the sink rejects', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    expect(() => emitLoopReceipt(sampleTrace)).not.toThrow();
    // Let the swallowed rejection settle — no unhandled rejection should escape.
    await Promise.resolve();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('runLoop integration', () => {
  it('still returns a valid trace when the sink is unreachable', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('ECONNREFUSED'));
    vi.stubGlobal('fetch', fetchMock);

    const trace = await runLoop<number, number>({
      initialState: 0,
      step: (s) => ({ state: s + 1, output: s + 1 }),
      delta: (a, b) => Math.abs(a - b),
      config: { maxSteps: 3 },
    });

    expect(trace.stepsRun).toBe(3);
    expect(trace.exitReason).toBe('budgetExhausted');
    expect(fetchMock).toHaveBeenCalled();
    await Promise.resolve();
  });
});
