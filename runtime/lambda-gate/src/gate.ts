// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/lambda-gate  Thesis: TH1 (Λ-Gate)
// Doctrine V6 preflight: ✓ (no forbidden patterns)

import { createHash } from "node:crypto";
import { parseReceipt, type Receipt, type Axes } from "@szl/ouroboros-types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const LAMBDA_THRESHOLD   = 0.90 as const;
export const CRITICAL_THRESHOLD = 0.95 as const;
export const CRITICAL_AXES: ReadonlyArray<keyof Axes> = [
  "moralGrounding",
  "measurabilityHonesty",
] as const;

// ---------------------------------------------------------------------------
// Λ evaluation
// ---------------------------------------------------------------------------

export interface EvalResult {
  lambda:  number;
  pass:    boolean;
  axes:    Axes;
  reasons: string[];
}

/** Compute composite Λ as the conjunctive MIN across all 9 axes.
 *  Doctrine V6: Λ is the WEAKEST axis — not the mean. A single failing axis
 *  must collapse Λ. Mean-based composites mask bottom-axis violations. */
export function computeLambda(axes: Axes): number {
  const values = Object.values(axes) as number[];
  return Math.min(...values);
}

/**
 * Conjunctive AND gate:
 *  1. Every axis ≥ LAMBDA_THRESHOLD
 *  2. Critical axes (moralGrounding, measurabilityHonesty) ≥ CRITICAL_THRESHOLD
 *  3. Composite Λ ≥ LAMBDA_THRESHOLD
 */
export function evaluateAxes(axes: Axes): EvalResult {
  const reasons: string[] = [];
  const lambda = computeLambda(axes);

  for (const [key, val] of Object.entries(axes) as [keyof Axes, number][]) {
    if (val < LAMBDA_THRESHOLD) {
      reasons.push(`axis ${key}=${val.toFixed(3)} < ${LAMBDA_THRESHOLD}`);
    }
  }
  for (const key of CRITICAL_AXES) {
    if (axes[key] < CRITICAL_THRESHOLD) {
      reasons.push(
        `critical axis ${key}=${axes[key].toFixed(3)} < ${CRITICAL_THRESHOLD}`,
      );
    }
  }
  if (lambda < LAMBDA_THRESHOLD) {
    reasons.push(`composite Λ=${lambda.toFixed(4)} < ${LAMBDA_THRESHOLD}`);
  }

  return { lambda, pass: reasons.length === 0, axes, reasons };
}

// ---------------------------------------------------------------------------
// Receipt store (in-memory; production: replace with persistent adapter)
// ---------------------------------------------------------------------------

const store = new Map<string, Receipt>();

export function storeReceipt(r: Receipt): void {
  store.set(r.hash, r);
}

export function getReceipt(hash: string): Receipt | undefined {
  return store.get(hash);
}

export function allReceipts(): Receipt[] {
  return Array.from(store.values());
}

// ---------------------------------------------------------------------------
// Hash helper
// ---------------------------------------------------------------------------

export function hashPayload(payload: unknown): string {
  return createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

// ---------------------------------------------------------------------------
// Gate transit — main entry point
// ---------------------------------------------------------------------------

export interface GateTransitResult {
  receipt: Receipt;
  eval:    EvalResult;
  stored:  boolean;
}

/**
 * Evaluate a raw receipt candidate through the Λ-gate.
 * Stores it only when pass=true.
 */
export function gateTransit(raw: unknown): GateTransitResult {
  const receipt = parseReceipt(raw);
  const evalResult = evaluateAxes(receipt.axes);
  const stored = evalResult.pass;
  if (stored) storeReceipt(receipt);
  return { receipt, eval: evalResult, stored };
}

// ---------------------------------------------------------------------------
// Replay verification
// ---------------------------------------------------------------------------

export interface VerifyResult {
  found:  boolean;
  pass:   boolean;
  lambda: number;
  reasons: string[];
}

/** Retrieve a stored receipt by hash and re-run the gate evaluation. */
export function verifyReceipt(hash: string): VerifyResult {
  const r = getReceipt(hash);
  if (!r) return { found: false, pass: false, lambda: 0, reasons: ["not found"] };
  const { eval: ev } = gateTransit(r);
  return { found: true, pass: ev.pass, lambda: ev.lambda, reasons: ev.reasons };
}
