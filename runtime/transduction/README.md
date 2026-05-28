# ouroboros-transduction

Receipt transduction invariant in the Ouroboros runtime.

- **`receipt-transduction.ts`** — generic `transductionInvariant` plus
  canonical JSON encoder/decoder (R2-G6).

The law: for any encoder `f` and decoder `g`, `(g∘f)(r).contentId =
r.contentId` for every receipt `r`. Lineage: Andean khipu transcription
(Cerrón-Palomino 2013) treats content identity as preserved under
round-trip translation.

## Citations

- Cerrón-Palomino, R. (2013). *Las lenguas de los incas: el puquina, el
  aimara y el quechua.* Peter Lang. DOI 10.3726/978-3-653-02485-2.

## Lean obligation

- `lutar-lean/Lutar/Transduction/ReceiptInvariant.lean :: receipt_transduction_invariant`

License: Apache-2.0.
