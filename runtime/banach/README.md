# ouroboros-banach

Banach-contraction primitives in the Ouroboros runtime.

Two named primitives, both 1800 BCE – 3rd c. CE in origin, both proven to be
Banach contractions, both used as lineage hooks for `TH12 ΛGateLID DPO
stability` in `lutar-lean`:

- **`babylonian-iteration.ts`** — `x_{n+1} = (x_n + S/x_n)/2` (R3-G1).
- **`liu-hui-pi.ts`** — polygon-doubling π approximation (R4-C2).

## Citations

- Neugebauer, O. (1957). *The Exact Sciences in Antiquity* (2nd ed.). Dover.
- Friberg, J. (2007). *A Remarkable Collection of Babylonian Mathematical Texts.* Springer.
- Høyrup, J. (2002). *Lengths, Widths, Surfaces.* Springer.
- Yale Babylonian Collection. *YBC 7289*. Yale Peabody Museum.
- Cullen, C. (1996). *Astronomy and Mathematics in Ancient China.* Cambridge UP.
- Martzloff, J.-C. (1997). *A History of Chinese Mathematics.* Springer.
- Banach, S. (1922). *Fund. Math.* 3, 133–181.

## Lean obligations

- `lutar-lean/Lutar/Banach/BabylonianContraction.lean :: babylonian_sqrt_is_banach_contraction`
- `lutar-lean/Lutar/Banach/LiuHuiPi.lean :: liu_hui_pi_converges`

License: Apache-2.0.
