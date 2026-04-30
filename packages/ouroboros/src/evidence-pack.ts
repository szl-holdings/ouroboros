/**
 * Evidence pack — standardized provenance bundle for high-consequence
 * outputs and replay-ready decisions. Mirrors `evidence_pack_contract`
 * from `docs/research/ouroboros-runtime-contract.v3.json`.
 *
 * An evidence pack is the minimum surface that downstream auditors,
 * regulators, or replay tooling need in order to verify a decision
 * receipt without re-running the loop.
 */

import type { ProofRouteId } from './proof-route.js';
import type { RiskTier } from './risk-tier.js';

export interface EvidencePack {
  readonly evidencePackId: string;
  readonly sourceIds: readonly string[];
  readonly locators: readonly string[];
  readonly proofRouteId: ProofRouteId;
  readonly receiptId: string;
  readonly traceId: string;
  readonly riskTier: RiskTier;
}

export interface EvidencePackInput {
  evidencePackId: string;
  sourceIds: readonly string[];
  locators: readonly string[];
  proofRouteId: ProofRouteId;
  receiptId: string;
  traceId: string;
  riskTier: RiskTier;
}

/**
 * Build a frozen evidence pack from raw inputs. Deeply freezes the result
 * so downstream consumers cannot tamper with provenance after the fact.
 */
export function buildEvidencePack(input: EvidencePackInput): EvidencePack {
  return Object.freeze({
    evidencePackId: input.evidencePackId,
    sourceIds: Object.freeze([...input.sourceIds]),
    locators: Object.freeze([...input.locators]),
    proofRouteId: input.proofRouteId,
    receiptId: input.receiptId,
    traceId: input.traceId,
    riskTier: input.riskTier,
  });
}

export type EvidencePackValidationError =
  | 'missing_evidence_pack_id'
  | 'missing_sources'
  | 'missing_locators'
  | 'missing_receipt_id'
  | 'missing_trace_id';

/**
 * Validate that an evidence pack carries the minimum required provenance.
 * Returns the list of missing-field error codes; an empty list means the
 * pack is acceptable for high-consequence routing.
 *
 * Covers every required field in `evidence_pack_contract` from
 * `docs/research/ouroboros-runtime-contract.v3.json`.
 */
export function validateEvidencePack(
  pack: EvidencePack,
): EvidencePackValidationError[] {
  const errors: EvidencePackValidationError[] = [];
  if (!pack.evidencePackId) errors.push('missing_evidence_pack_id');
  if (pack.sourceIds.length === 0) errors.push('missing_sources');
  if (pack.locators.length === 0) errors.push('missing_locators');
  if (!pack.receiptId) errors.push('missing_receipt_id');
  if (!pack.traceId) errors.push('missing_trace_id');
  return errors;
}
