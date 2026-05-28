# ouroboros-precision

Sexagesimal regular-number primitive in the Ouroboros runtime.

- **`sexagesimal-regular.ts`** — `isRegularBase60(n)` and helpers (R3-G2).

A positive integer is "regular base 60" iff its prime factors lie in
{2, 3, 5}. Such numbers have finite sexagesimal reciprocals — the basis of
Old-Babylonian reciprocal tables (Robson 2008).

## Citations

- Robson, E. (2008). *Mathematics in Ancient Iraq: A Social History.*
  Princeton University Press. ISBN 978-0-691-09182-2.

## Lean obligation

- `lutar-lean/Lutar/Precision/SexagesimalRegular.lean :: nine_axis_weight_is_sex_regular`

License: Apache-2.0.
