/**
 * receipt-emitter — fire-and-forget governance receipt emission for runLoop.
 *
 * The kernel itself stays runtime-agnostic; this module holds the Node-only
 * bits (node:crypto, fetch) so the loop kernel never depends on them directly.
 *
 * Contract: emission MUST NEVER block the loop and MUST NEVER throw. Every
 * failure path (no network, bad URL, timeout, malformed sink) is swallowed.
 *
 * Honesty: the loop kernel does not compute a Λ score or measure energy, so
 * `governance.lambda` is emitted as null and `energy.label` as "UNAVAILABLE".
 * We never fabricate values we did not measure.
 */

import { createHash } from 'node:crypto';
import type { LoopTrace } from './types.js';

/** Documented fallback only — real deployments set SZL_RECEIPT_SINK. */
export const DEFAULT_RECEIPT_SINK = 'https://szlholdings-a11oy.hf.space/api/lake/v1';

const POST_TIMEOUT_MS = 2000;

export interface LoopReceipt {
  /** sha256 hex of the canonical trace summary. */
  id: string;
  /** ISO-8601 emission timestamp. */
  ts: string;
  organ: 'ouroboros';
  /** The loop exit reason. */
  decision: string;
  /** Λ is not computed by the kernel → honest null, never fabricated. */
  governance: { lambda: number | null };
  /** No energy meter in the kernel → label "UNAVAILABLE", joules null. */
  energy: { label: string; joules: number | null };
  meta?: Record<string, unknown>;
}

/** Prefer SZL_RECEIPT_SINK, then an explicit config URL, then the fallback. */
export function resolveSink(configUrl?: string): string {
  const fromEnv =
    typeof process !== 'undefined' ? process.env?.SZL_RECEIPT_SINK : undefined;
  return fromEnv || configUrl || DEFAULT_RECEIPT_SINK;
}

export function buildLoopReceipt<S, O>(trace: LoopTrace<S, O>): LoopReceipt {
  const canonical = JSON.stringify({
    id: trace.id,
    label: trace.label,
    exitReason: trace.exitReason,
    stepsRun: trace.stepsRun,
    maxSteps: trace.maxSteps,
  });
  const id = createHash('sha256').update(canonical).digest('hex');
  return {
    id,
    ts: new Date().toISOString(),
    organ: 'ouroboros',
    decision: trace.exitReason,
    governance: { lambda: null },
    energy: { label: 'UNAVAILABLE', joules: null },
    meta: {
      loopId: trace.id,
      label: trace.label,
      stepsRun: trace.stepsRun,
      maxSteps: trace.maxSteps,
      earliestSafeExit: trace.earliestSafeExit,
    },
  };
}

async function postReceipt(receipt: LoopReceipt, sink: string): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);
  try {
    await fetch(`${sink}/receipts`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(receipt),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Build a receipt from the trace and POST it to the ledger, fire-and-forget.
 * Returns immediately; any error (sync or async) is swallowed so a sink hiccup
 * can never block or break the loop.
 */
export function emitLoopReceipt<S, O>(
  trace: LoopTrace<S, O>,
  configUrl?: string,
): void {
  try {
    const receipt = buildLoopReceipt(trace);
    const sink = resolveSink(configUrl);
    void postReceipt(receipt, sink).catch(() => {
      /* swallow — emission must never affect the loop */
    });
  } catch {
    /* swallow — emission must never affect the loop */
  }
}
