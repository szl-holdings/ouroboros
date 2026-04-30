import { describe, expect, it } from 'vitest';

import {
  CYCLE_ID_V4_ALIASES,
  INGESTION_CONTRACTS,
  INNOVATION_ENGINE_DEFAULT,
  INNOVATION_LOOPS,
  OUTPUT_PATHS,
  resolveOutputPath,
  summarizeValidators,
  V4_CYCLES,
  VALIDATOR_REGISTRY,
  validateIngestion,
  validateInnovationEngine,
  type InnovationEngineState,
  type RequiredOutput,
  type ValidatorId,
} from './index.js';

describe('v4 validator registry', () => {
  it('exposes all 9 validator IDs from replit_innovate_full_payload', () => {
    const expected: ValidatorId[] = [
      'VAL_BUDGET_ENFORCER',
      'VAL_NO_SILENT_MUTATION',
      'VAL_PROOF_REQUIRED',
      'VAL_RISK_ESCALATION',
      'VAL_APPROVAL_FOR_CRITICAL_ACTION',
      'VAL_SECURITY_PROOF_REQUIRED',
      'VAL_SOURCE_PRIORITY_REQUIRED',
      'VAL_MERGE_SAFETY',
      'VAL_CONSISTENCY_BEFORE_COMMIT',
    ];
    for (const id of expected) {
      expect(VALIDATOR_REGISTRY[id]).toBeDefined();
      expect(VALIDATOR_REGISTRY[id].validatorId).toBe(id);
      expect(VALIDATOR_REGISTRY[id].severity).toBe('error');
      expect(VALIDATOR_REGISTRY[id].rule.length).toBeGreaterThan(0);
    }
  });

  it('summarizes results: any failed error-severity validator halts', () => {
    const summary = summarizeValidators([
      { validatorId: 'VAL_BUDGET_ENFORCER', passed: true },
      { validatorId: 'VAL_PROOF_REQUIRED', passed: false, note: 'missing proof' },
      { validatorId: 'VAL_RISK_ESCALATION', passed: true },
    ]);
    expect(summary.total).toBe(3);
    expect(summary.passed).toBe(2);
    expect(summary.failed).toHaveLength(1);
    expect(summary.failed[0].validatorId).toBe('VAL_PROOF_REQUIRED');
    expect(summary.halt).toBe(true);
  });

  it('all-passing summary does not halt', () => {
    const summary = summarizeValidators([
      { validatorId: 'VAL_BUDGET_ENFORCER', passed: true },
      { validatorId: 'VAL_NO_SILENT_MUTATION', passed: true },
    ]);
    expect(summary.halt).toBe(false);
    expect(summary.failed).toHaveLength(0);
  });
});

describe('v4 ingestion contracts (Sentra / Amaru)', () => {
  it('declares Sentra contract with security validators and outputs', () => {
    const c = INGESTION_CONTRACTS.Sentra;
    expect(c.target).toBe('Sentra');
    expect(c.poweredBy).toBe('A11oy_core');
    expect(c.loopProfile).toBe('security_recursive_review');
    expect(c.requiredValidators).toEqual([
      'VAL_RISK_ESCALATION',
      'VAL_SECURITY_PROOF_REQUIRED',
      'VAL_APPROVAL_FOR_CRITICAL_ACTION',
    ]);
    expect(c.requiredOutputs).toContain('evidence_pack');
    expect(c.requiredOutputs).toContain('risk_summary');
    expect(c.ingestTypes).toContain('threat_hypotheses');
  });

  it('declares Amaru contract with convergence validators and outputs', () => {
    const c = INGESTION_CONTRACTS.Amaru;
    expect(c.target).toBe('Amaru');
    expect(c.loopProfile).toBe('convergent_data_runtime');
    expect(c.requiredValidators).toEqual([
      'VAL_SOURCE_PRIORITY_REQUIRED',
      'VAL_MERGE_SAFETY',
      'VAL_CONSISTENCY_BEFORE_COMMIT',
    ]);
    expect(c.requiredOutputs).toContain('consistency_report');
    expect(c.requiredOutputs).toContain('delta_log');
    expect(c.ingestTypes).toContain('merge_candidates');
  });

  it('rejects unknown targets', () => {
    const errs = validateIngestion({
      target: 'Helios',
      ingestType: 'whatever',
      presentOutputs: new Set(),
      passedValidators: new Set(),
    });
    expect(errs).toContain('unknown_target');
  });

  it('passes when all validators and outputs are present', () => {
    const outputs = new Set<RequiredOutput>([
      'trace',
      'decision_receipt',
      'risk_summary',
      'evidence_pack',
    ]);
    const validators = new Set<ValidatorId>([
      'VAL_RISK_ESCALATION',
      'VAL_SECURITY_PROOF_REQUIRED',
      'VAL_APPROVAL_FOR_CRITICAL_ACTION',
    ]);
    const errs = validateIngestion({
      target: 'Sentra',
      ingestType: 'alerts',
      presentOutputs: outputs,
      passedValidators: validators,
    });
    expect(errs).toEqual([]);
  });

  it('flags missing required outputs and validators for Amaru', () => {
    const errs = validateIngestion({
      target: 'Amaru',
      ingestType: 'records',
      presentOutputs: new Set<RequiredOutput>(['trace']),
      passedValidators: new Set<ValidatorId>([]),
    });
    expect(errs).toContain('missing_required_output');
    expect(errs).toContain('missing_required_validator');
  });

  it('rejects unsupported ingest types', () => {
    const errs = validateIngestion({
      target: 'Sentra',
      ingestType: 'records', // Amaru type, not Sentra
      presentOutputs: new Set<RequiredOutput>([
        'trace',
        'decision_receipt',
        'risk_summary',
        'evidence_pack',
      ]),
      passedValidators: new Set<ValidatorId>([
        'VAL_RISK_ESCALATION',
        'VAL_SECURITY_PROOF_REQUIRED',
        'VAL_APPROVAL_FOR_CRITICAL_ACTION',
      ]),
    });
    expect(errs).toContain('unsupported_ingest_type');
  });
});

describe('v4 innovation engine', () => {
  it('exposes all 6 feedback loops', () => {
    expect(Object.keys(INNOVATION_LOOPS)).toHaveLength(6);
    for (const id of [
      'runtime_feedback_loop',
      'golden_run_regression_loop',
      'receipt_quality_loop',
      'security_review_improvement_loop',
      'data_convergence_improvement_loop',
      'economic_efficiency_loop',
    ] as const) {
      expect(INNOVATION_LOOPS[id]).toBeDefined();
      expect(INNOVATION_LOOPS[id].source).toBeDefined();
      expect(INNOVATION_LOOPS[id].output).toBeDefined();
    }
  });

  it('default state is enabled with operator feedback binding and trace distillation', () => {
    expect(INNOVATION_ENGINE_DEFAULT.enabled).toBe(true);
    expect(INNOVATION_ENGINE_DEFAULT.operatorFeedbackBinding).toBe(true);
    expect(INNOVATION_ENGINE_DEFAULT.traceDistillationReady).toBe(true);
    expect(INNOVATION_ENGINE_DEFAULT.loops).toHaveLength(6);
  });

  it('validateInnovationEngine returns missing loop ids', () => {
    const partial: InnovationEngineState = {
      enabled: true,
      operatorFeedbackBinding: true,
      traceDistillationReady: true,
      loops: [INNOVATION_LOOPS.runtime_feedback_loop],
    };
    const missing = validateInnovationEngine(partial);
    expect(missing).toContain('golden_run_regression_loop');
    expect(missing).toContain('economic_efficiency_loop');
    expect(missing).not.toContain('runtime_feedback_loop');
  });

  it('validateInnovationEngine on default state returns no missing loops', () => {
    expect(validateInnovationEngine(INNOVATION_ENGINE_DEFAULT)).toEqual([]);
  });
});

describe('v4 output paths', () => {
  it('exposes all canonical artifact paths', () => {
    expect(OUTPUT_PATHS.traceJsonl).toBe('output/trace.jsonl');
    expect(OUTPUT_PATHS.decisionReceipt).toBe('output/decision_receipt.json');
    expect(OUTPUT_PATHS.proofLedgerJsonl).toBe('output/proof_ledger.jsonl');
    expect(OUTPUT_PATHS.finalStateJson).toBe('output/final_state.json');
    expect(OUTPUT_PATHS.runSummaryJson).toBe('output/run_summary.json');
    expect(OUTPUT_PATHS.goldenRunReportJson).toBe('output/golden_run_report.json');
    expect(OUTPUT_PATHS.sentraRiskSummaryJson).toBe('output/sentra_risk_summary.json');
    expect(OUTPUT_PATHS.amaruConsistencyReportJson).toBe(
      'output/amaru_consistency_report.json',
    );
  });

  it('resolveOutputPath returns canonical path for known key', () => {
    expect(resolveOutputPath('traceJsonl')).toBe('output/trace.jsonl');
  });
});

describe('v4 paris_cadence_cycle alias', () => {
  it('V4_CYCLES is V3_CYCLES (set unchanged, only label renamed)', () => {
    expect(V4_CYCLES).toHaveLength(4);
    const ids = V4_CYCLES.map((c) => c.cycleId).sort();
    expect(ids).toEqual([
      'grolier_schedule_cycle',
      'madrid_almanac_cycle',
      'paris_long_cycle',
      'review_cycle',
    ]);
  });

  it('paris_cadence_cycle alias maps to paris_long_cycle', () => {
    expect(CYCLE_ID_V4_ALIASES['paris_cadence_cycle']).toBe('paris_long_cycle');
    expect(CYCLE_ID_V4_ALIASES['paris_long_cycle']).toBe('paris_long_cycle');
  });

  it('all v4 cycle aliases resolve to known cycle ids', () => {
    for (const [_, target] of Object.entries(CYCLE_ID_V4_ALIASES)) {
      expect(V4_CYCLES.some((c) => c.cycleId === target)).toBe(true);
    }
  });
});
