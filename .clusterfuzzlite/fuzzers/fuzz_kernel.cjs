// SPDX-License-Identifier: Apache-2.0
// Jazzer.js fuzz harness — ouroboros core loop primitives (root package).
//
// Targets the pure, deterministic "operational contract" gate functions that
// govern every bounded loop: the risk-tier escalation gate, the cross-step
// consistency scorers, the adaptive depth allocator, and the proof-route
// resolver/validator. These run on untrusted / agent-derived inputs in
// production, so they must never throw on malformed data and must uphold their
// documented invariants (range, identity, symmetry, determinism, bounds).
//
// Run locally:
//   pnpm install
//   pnpm exec tsc -p tsconfig.fuzz.json
//   printf '{"type":"commonjs"}' > dist-fuzz/package.json
//   npx -p @jazzer.js/core@2 jazzer .clusterfuzzlite/fuzzers/fuzz_kernel.cjs --sync -- -max_total_time=30

"use strict";

const path = require("path");

// Resolve the compiled CommonJS bundle robustly (workflow cwd, or staged $OUT).
function loadOuroboros() {
  const candidates = [
    path.join(__dirname, "..", "..", "dist-fuzz", "index.js"),
    path.join(__dirname, "dist-fuzz", "index.js"),
    path.join(process.cwd(), "dist-fuzz", "index.js"),
  ];
  for (const c of candidates) {
    try { return require(c); } catch (_) { /* try next */ }
  }
  throw new Error(
    "fuzz_kernel: compiled target not found. Build it first: " +
    "pnpm exec tsc -p tsconfig.fuzz.json"
  );
}

const O = loadOuroboros();

const TIERS = ["R1_low", "R2_moderate", "R3_high", "R4_critical"];
const MODES = ["advisory", "semi_autonomous", "approval_gated", "replay_audit", undefined];
const VALID_GATES = ["continue", "await_approval", "force_escalate"];
const VALID_TRAJ = ["shrinking", "flat", "oscillating", "growing", "unknown"];
const CATEGORIES = [
  "system_design", "informational", "security",
  "threat_response", "data_merge", "data_sync",
];
const CATEGORY_ROUTE = {
  system_design: "PRF_SYSTEM_CLAIMS",
  informational: "PRF_SYSTEM_CLAIMS",
  security: "PRF_SECURITY_ACTIONS",
  threat_response: "PRF_SECURITY_ACTIONS",
  data_merge: "PRF_DATA_SYNC",
  data_sync: "PRF_DATA_SYNC",
};

function inRange01(x) {
  return typeof x === "number" && Number.isFinite(x) && x >= 0 && x <= 1;
}

module.exports.fuzz = function fuzz(data) {
  if (!data || data.length === 0) return;
  let p = 0;
  const u8 = () => data[p++ % data.length];
  const sflt = () => (u8() - 128) / 16; // signed float ~[-8, 8]
  const bool = () => (u8() & 1) === 1;

  // 1. Risk-tier escalation gate -------------------------------------------
  {
    const tier = TIERS[u8() % TIERS.length];
    const operatorMode = MODES[u8() % MODES.length];
    const approvalGranted = bool();
    const ctx = { tier, approvalGranted, operatorMode };

    const d1 = O.evaluateRiskTier(ctx);
    const d2 = O.evaluateRiskTier({ tier, approvalGranted, operatorMode });

    if (!d1 || !VALID_GATES.includes(d1.gate)) {
      throw new Error("risk-tier: invalid gate: " + JSON.stringify(d1));
    }
    if (d1.tier !== tier) {
      throw new Error("risk-tier: echoed wrong tier: " + JSON.stringify(d1));
    }
    if (d1.gate !== d2.gate) {
      throw new Error("risk-tier: non-deterministic for " + JSON.stringify(ctx));
    }
    if (tier === "R4_critical" && d1.gate !== "force_escalate") {
      throw new Error("risk-tier: R4_critical must force_escalate, got " + d1.gate);
    }
    if (tier !== "R4_critical" &&
        (operatorMode === "replay_audit" || operatorMode === "advisory") &&
        d1.gate !== "continue") {
      throw new Error("risk-tier: " + operatorMode + " must continue, got " + d1.gate);
    }
    if (tier === "R3_high" &&
        operatorMode !== "replay_audit" && operatorMode !== "advisory" &&
        approvalGranted !== true &&
        d1.gate !== "await_approval") {
      throw new Error("risk-tier: R3 without approval must await_approval, got " + d1.gate);
    }
    if ((tier === "R1_low" || tier === "R2_moderate") && d1.gate !== "continue") {
      throw new Error("risk-tier: " + tier + " must continue, got " + d1.gate);
    }
  }

  // 2. Consistency scorers: range + identity + symmetry --------------------
  {
    const a = sflt(), b = sflt();
    const nc = O.numericConsistency(a, b);
    if (!inRange01(nc)) throw new Error("numericConsistency out of range: " + nc);
    if (O.numericConsistency(a, b) !== O.numericConsistency(b, a)) {
      throw new Error("numericConsistency not symmetric");
    }
    if (O.numericConsistency(a, a) !== 1) {
      throw new Error("numericConsistency identity != 1");
    }

    const len = u8() % 6;
    const va = [], vb = [];
    for (let i = 0; i < len; i++) { va.push(sflt()); vb.push(sflt()); }
    const vc = O.vectorConsistency(va, vb);
    if (!inRange01(vc)) throw new Error("vectorConsistency out of range: " + vc);
    if (O.vectorConsistency(va, vb) !== O.vectorConsistency(vb, va)) {
      throw new Error("vectorConsistency not symmetric");
    }

    const slen = u8() % 12;
    let sa = "", sb = "";
    for (let i = 0; i < slen; i++) {
      sa += String.fromCharCode(97 + (u8() % 26));
      sb += String.fromCharCode(97 + (u8() % 26));
    }
    const sc = O.stringConsistency(sa, sb);
    if (!inRange01(sc)) throw new Error("stringConsistency out of range: " + sc);
    if (O.stringConsistency(sa, sa) !== 1) {
      throw new Error("stringConsistency identity != 1");
    }
    if (O.stringConsistency(sa, sb) !== O.stringConsistency(sb, sa)) {
      throw new Error("stringConsistency not symmetric");
    }

    const setA = [], setB = [];
    const sn = u8() % 6;
    for (let i = 0; i < sn; i++) { setA.push(u8() % 10); setB.push(u8() % 10); }
    const setc = O.setConsistency(setA, setB);
    if (!inRange01(setc)) throw new Error("setConsistency out of range: " + setc);
    if (O.setConsistency(setA, setB) !== O.setConsistency(setB, setA)) {
      throw new Error("setConsistency not symmetric");
    }
  }

  // 3. Depth allocator: integer recommendation within [minSteps, maxSteps] --
  {
    const maxSteps = 1 + (u8() % 64);
    const minSteps = 1 + (u8() % maxSteps);
    const nd = u8() % 4;
    const recentDeltas = [];
    for (let i = 0; i < nd; i++) recentDeltas.push(Math.abs(sflt()));
    const stakes = 0.5 + (u8() / 255) * 3.5;
    const out = O.allocateDepth({ recentDeltas, maxSteps, minSteps, stakes });
    if (!out || !VALID_TRAJ.includes(out.trajectory)) {
      throw new Error("allocateDepth: invalid trajectory: " + JSON.stringify(out));
    }
    const r = out.recommendedSteps;
    if (!Number.isInteger(r) || r < minSteps || r > maxSteps) {
      throw new Error(
        "allocateDepth: recommendedSteps " + r +
        " outside [" + minSteps + ", " + maxSteps + "]"
      );
    }
  }

  // 4. Proof-route resolver + artifact validator ---------------------------
  {
    const useValid = (u8() % 4) !== 0;
    const category = useValid
      ? CATEGORIES[u8() % CATEGORIES.length]
      : ("unknown_" + (u8() % 7));
    const input = { kind: bool() ? "claim" : "action", category };
    const route = O.resolveProofRoute(input);
    if (useValid) {
      if (!route || route.routeId !== CATEGORY_ROUTE[category]) {
        throw new Error("resolveProofRoute: wrong route for " + category + ": " + JSON.stringify(route));
      }
      const required = route.requiredArtifacts;
      const present = new Set();
      for (const k of required) { if (bool()) present.add(k); }
      const missing = O.validateProofArtifacts(route, present);
      const expected = required.filter((k) => !present.has(k));
      if (missing.length !== expected.length || !missing.every((m) => expected.includes(m))) {
        throw new Error("validateProofArtifacts mismatch: got " +
          JSON.stringify(missing) + " expected " + JSON.stringify(expected));
      }
      const full = new Set(required);
      if (O.validateProofArtifacts(route, full).length !== 0) {
        throw new Error("validateProofArtifacts: full set still reports missing artifacts");
      }
    } else if (route !== null) {
      throw new Error("resolveProofRoute: unknown category must resolve to null, got " + JSON.stringify(route));
    }
  }
};
