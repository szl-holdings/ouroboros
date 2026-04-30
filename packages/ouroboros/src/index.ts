export type {
  ConsistencyFn,
  DeltaFn,
  ExitReason,
  LoopConfig,
  LoopStep,
  LoopTrace,
  StepFn,
  StepResult,
} from './types.js';

export { runLoop } from './loop-kernel.js';
export type { RunLoopArgs } from './loop-kernel.js';

export {
  numericConsistency,
  setConsistency,
  stringConsistency,
  vectorConsistency,
} from './consistency.js';

export { allocateDepth } from './depth-allocator.js';
export type { AllocatorInput, AllocatorOutput } from './depth-allocator.js';

// ─── Operational contract modules (ouroboros-runtime-contract.v2) ────────────
// These three modules close the "missing pieces" identified in the v2 payload:
//   - proof_route_resolver       → ./proof-route.js
//   - risk_tier_escalation_gate  → ./risk-tier.js
//   - almanac_cycle_advancer     → ./almanac.js
// They are pure, deterministic, and replayable.
export {
  PROOF_ROUTES,
  resolveProofRoute,
  validateProofArtifacts,
} from './proof-route.js';
export type {
  ClaimOrAction,
  ProofArtifactKind,
  ProofRoute,
  ProofRouteId,
} from './proof-route.js';

export { evaluateRiskTier, RISK_TIERS } from './risk-tier.js';
export type {
  RiskTier,
  RiskTierContext,
  RiskTierDecision,
  RiskTierPolicy,
} from './risk-tier.js';

export {
  advanceAlmanac,
  DEFAULT_CYCLES,
  INITIAL_ALMANAC_STATE,
  rebuildAlmanac,
  V3_CYCLES,
} from './almanac.js';
export type {
  AlmanacAdvanceResult,
  AlmanacState,
  CycleConfig,
  CycleEvent,
  CycleId,
} from './almanac.js';

// ─── v3 ecosystem-master contract modules ────────────────────────────────────
// Closes the v3 "needs_code" pieces from ouroboros-runtime-contract.v3.json:
//   - domain_pack_dispatcher    → ./domain-pack.js
//   - operator_approval_gate    → ./operator-approval.js
//   - evidence_pack_contract    → ./evidence-pack.js
//   - operational_modes         → ./operational-modes.js
// Plus extends proof-route.ts with PRF_CLAIM_BOUND_RESEARCH and
// PRF_OPERATIONAL_ACTION, and almanac.ts with the review_cycle.
export { ROUTE_ID_V2_ALIASES } from './proof-route.js';

export {
  dispatchDomainPack,
  DOMAIN_PACKS,
  TASK_TO_PACK,
} from './domain-pack.js';
export type {
  DomainPack,
  DomainPackId,
  RoutingDecision,
  RoutingInput,
  RoutingTaskType,
} from './domain-pack.js';

export {
  DEFAULT_DENY_PROVIDER,
  makeAutoGrantProvider,
  requestApproval,
} from './operator-approval.js';
export type {
  ApprovalDecision,
  ApprovalProvider,
  ApprovalRecord,
  ApprovalRequest,
} from './operator-approval.js';

export { buildEvidencePack, validateEvidencePack } from './evidence-pack.js';
export type {
  EvidencePack,
  EvidencePackInput,
  EvidencePackValidationError,
} from './evidence-pack.js';

export {
  isAutoExecutionAllowed,
  OPERATIONAL_MODES,
} from './operational-modes.js';
export type {
  OperationalMode,
  OperationalModePolicy,
} from './operational-modes.js';
