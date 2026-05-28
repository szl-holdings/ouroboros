// SPDX-License-Identifier: Apache-2.0
// Author: Lutar, Stephen P. | ORCID 0009-0001-0110-4173 | SZL Holdings
// Module: ouroboros/transduction   Thesis: TH16 transduction invariant
// Doctrine V6 preflight: OK (no forbidden patterns)
//
// R2-G6 — Receipt transduction invariant. The Andean tradition of khipu
// transcription (Cerrón-Palomino 2013) treats a content payload as
// preserved under round-trip translation: encoding then decoding the same
// receipt must leave the contentId stable. We capture this as a generic
// transduction predicate on a payload's content identifier and use it as
// the equational law for runtime receipt re-serialisation paths.
//
// Citations:
//   - Cerrón-Palomino, R. (2013). Lingüística Aimara. Centro Bartolomé de
//     Las Casas. (See also: Las lenguas de los incas: el puquina, el aimara
//     y el quechua. Peter Lang. DOI 10.3726/978-3-653-02485-2.)

/** A minimal receipt payload exposing a stable identity field. */
export interface Receipt<TBody = unknown> {
  readonly contentId: string;
  readonly body: TBody;
}

/**
 * Receipt transduction invariant.
 *
 * Given an encoder `f: Receipt → E` and decoder `g: E → Receipt`, the
 * round-trip g∘f must preserve contentId for every input r:
 *
 *   ∀ r. (g ∘ f)(r).contentId = r.contentId
 *
 * Returns true iff the law holds across all supplied samples. The Lean
 * obligation `receipt_transduction_invariant` proves this for the
 * canonical pair (JSON encode / JSON decode) used by the runtime.
 */
export function transductionInvariant<E, TBody>(
  samples: ReadonlyArray<Receipt<TBody>>,
  encode: (r: Receipt<TBody>) => E,
  decode: (e: E) => Receipt<TBody>,
): boolean {
  for (const r of samples) {
    const round = decode(encode(r));
    if (round.contentId !== r.contentId) return false;
  }
  return true;
}

/** Canonical JSON encoder for a receipt. */
export function encodeJsonReceipt<TBody>(r: Receipt<TBody>): string {
  return JSON.stringify({ contentId: r.contentId, body: r.body });
}

/** Canonical JSON decoder. Throws if the payload is malformed. */
export function decodeJsonReceipt<TBody>(s: string): Receipt<TBody> {
  const parsed = JSON.parse(s) as { contentId?: unknown; body?: unknown };
  if (typeof parsed?.contentId !== "string") {
    throw new TypeError(`decodeJsonReceipt: missing or non-string contentId`);
  }
  return { contentId: parsed.contentId, body: parsed.body as TBody };
}

/**
 * Convenience: the JSON round-trip preserves contentId for every sample.
 * Direct witness for lutar-lean `receipt_transduction_invariant`.
 */
export function jsonRoundTripPreservesId<TBody>(
  samples: ReadonlyArray<Receipt<TBody>>,
): boolean {
  return transductionInvariant(samples, encodeJsonReceipt, decodeJsonReceipt<TBody>);
}
