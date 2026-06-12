# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [6.4.0](https://github.com/szl-holdings/ouroboros/compare/v6.3.0...v6.4.0) (2026-06-12)


### Features

* add ClusterFuzzLite harness for Scorecard Fuzzing check ([#39](https://github.com/szl-holdings/ouroboros/issues/39)) ([7e23e7e](https://github.com/szl-holdings/ouroboros/commit/7e23e7e0b6b969bb80ddb07c5fc2c95fa15767c6))
* **agentic:** a11oy-core orchestrator + MCP server + Cursor/Claude/Replit configs ([#32](https://github.com/szl-holdings/ouroboros/issues/32)) ([169385b](https://github.com/szl-holdings/ouroboros/commit/169385bb12334f2e1354e2deee5265bcab091fdd))
* **badges:** canonical 10-badge Series-A stack ([897be04](https://github.com/szl-holdings/ouroboros/commit/897be045f683ba004d66b177f8927c1811b03b93))
* **badges:** canonical 10-badge Series-A stack ([14e554b](https://github.com/szl-holdings/ouroboros/commit/14e554b92aa01b32d7433ee8c8a763756c58723c))
* **clio:** CLIO projection-sufficiency audit — surrogate bundle Ê_π (Eq.12), enriched exit (Eq.13), extended trace (Eq.14), F10 self-comparison guard + F11 false-arrest probe. Real, strict-tsc clean, 18/18 tests green. Optional high-trust config (off by default). Grounds the response to Flyxion 'Convergence Without Ground' (2026-06-05). ([acd13bd](https://github.com/szl-holdings/ouroboros/commit/acd13bd039b1dc8da9cd1d26fd8d0dd7528ff7ef))
* **devcontainer:** add Codespaces config for one-click dev ([#49](https://github.com/szl-holdings/ouroboros/issues/49)) ([3bca631](https://github.com/szl-holdings/ouroboros/commit/3bca6310765bc7124017a812c8ea52d364dfe0a0))
* **docs:** cross-link README to HF (Hugging Face as public face) ([#77](https://github.com/szl-holdings/ouroboros/issues/77)) ([7145adb](https://github.com/szl-holdings/ouroboros/commit/7145adb72fc2d70d01b5cddc003a50009a0a660f))
* **docs:** re-add HF cross-link section (canonical table format) ([#79](https://github.com/szl-holdings/ouroboros/issues/79)) ([8c17e45](https://github.com/szl-holdings/ouroboros/commit/8c17e45f0bd822577620eb00ee3a85142ecaa779))
* **doctrine:** update doctrine-check GHA in ouroboros ([e777c74](https://github.com/szl-holdings/ouroboros/commit/e777c744182082eae86890242e6955976e0c0a77))
* **formulas:** instill 5 anchor SZL formulas — L2 TS runtimes + L3 parity tests ([3f15b0b](https://github.com/szl-holdings/ouroboros/commit/3f15b0b25abea7b8b4ca2b566b2ed808a6793614))
* **huklla T11:** DOI-title CI gate (postmortem follow-up) ([#28](https://github.com/szl-holdings/ouroboros/issues/28)) ([2da7006](https://github.com/szl-holdings/ouroboros/commit/2da7006b0344472c045b5a0b2fc0cd28a68948ad))
* **runtime:** add OUROBOROS_RUN_ALL.py ([#73](https://github.com/szl-holdings/ouroboros/issues/73)) ([1c4aa81](https://github.com/szl-holdings/ouroboros/commit/1c4aa813d7b5c4f9c0983146376c24df3377e63a))
* **runtime:** TH1–TH7 scaffolds with 105 vitest tests ([#31](https://github.com/szl-holdings/ouroboros/issues/31)) ([20ebfe4](https://github.com/szl-holdings/ouroboros/commit/20ebfe4c8bd3fda4378f1916441e2ae5bf66c84e))
* **security:** OpenSSF Scorecard 10/10 push ([#75](https://github.com/szl-holdings/ouroboros/issues/75)) ([3189d26](https://github.com/szl-holdings/ouroboros/commit/3189d26468b51a5424972c55863943cdd50b04bc))
* **supply-chain:** add SLSA Level 3 provenance generator on release ([#65](https://github.com/szl-holdings/ouroboros/issues/65)) ([f209811](https://github.com/szl-holdings/ouroboros/commit/f2098111402456fbb98b1bc084ee284501d5a76b))


### Bug Fixes

* **audit:** correct README/zenodo claims — DOI badge line, test count, Node version, Doctrine version ([007d260](https://github.com/szl-holdings/ouroboros/commit/007d260067ddf5b9684a91d023bdb8b1f6aa2445))
* **ci:** grant workflow-level contents+PR write permissions for release-please ([#80](https://github.com/szl-holdings/ouroboros/issues/80)) ([55dd0bc](https://github.com/szl-holdings/ouroboros/commit/55dd0bce76cfb3a504df213ebfd764785c82987d))
* **ci:** pass sanitizer=none to ClusterFuzzLite for JavaScript projects ([#45](https://github.com/szl-holdings/ouroboros/issues/45)) ([177c8ef](https://github.com/szl-holdings/ouroboros/commit/177c8ef08e94ce0b2482b16995ec1c774bb49ad1))
* **ci:** pin sbom.yml reusable workflow to valid SHA — resolve SBOM RED ([b0fa588](https://github.com/szl-holdings/ouroboros/commit/b0fa588437aee0c2d40ddcea95d51dffc96400fe))
* **ci:** remove deprecated package-name input from release-please ([f8a0d53](https://github.com/szl-holdings/ouroboros/commit/f8a0d530eb6d3447161479a67ba7ea0a724933ba))
* **claims:** resync HF org counts to verified Agent C audit ([#88](https://github.com/szl-holdings/ouroboros/issues/88)) ([1cc7f56](https://github.com/szl-holdings/ouroboros/commit/1cc7f56839397ae2cffeb852e33df59954769c42))
* **D16:** organization → SZL Holdings (was 'SZL Consulting LTD') ([#33](https://github.com/szl-holdings/ouroboros/issues/33)) ([9cd330a](https://github.com/szl-holdings/ouroboros/commit/9cd330a6f24e6fd222fab9acab8baf7517297ef0))
* **docs:** 22→24 HF datasets, 30→32 GREEN modules in HF showcase ([869ba22](https://github.com/szl-holdings/ouroboros/commit/869ba22f2b179c1c5137f46d2f0c4df12f90ddb9))
* **docs:** Doctrine v6 'What ouroboros Is NOT' section [PhD audit] ([#82](https://github.com/szl-holdings/ouroboros/issues/82)) ([eb69596](https://github.com/szl-holdings/ouroboros/commit/eb6959689149727060d08a24742ef6a65b584147))
* **law:** DCO workflow event trigger (P2-03 hotfix) ([#59](https://github.com/szl-holdings/ouroboros/issues/59)) ([00f1ca8](https://github.com/szl-holdings/ouroboros/commit/00f1ca81086c69cbf7a8e8d3f11130bcb6835295))
* **readme:** 404 audit + Related-Repos footer (2 fixes) ([#55](https://github.com/szl-holdings/ouroboros/issues/55)) ([19599bb](https://github.com/szl-holdings/ouroboros/commit/19599bbb36e8e4d67bcaa86d5c2d444ee24d53e3))
* **readme:** update Doctrine badge URL (DOCTRINE_V11.md not at root; → doctrine/ folder) ([c71bee9](https://github.com/szl-holdings/ouroboros/commit/c71bee9068a1b133cfee34443a570d72cf42e5d9))
* **security:** bump vitest to ^4.1.8 in 5 standalone runtime modules (CVE/GHSA &lt;3.2.6) ([a035aed](https://github.com/szl-holdings/ouroboros/commit/a035aed7ae84c2ae3cb766ce1228612264daac84))
* **slsa:** correct SLSA L3 theater → honest L1 disclosure ([#85](https://github.com/szl-holdings/ouroboros/issues/85)) ([737bb2e](https://github.com/szl-holdings/ouroboros/commit/737bb2e54607fa298dcf046f962c26a8eb97444e))
* **Λ:** unify gate.ts scalar to weighted geometric mean (canonical) ([#41](https://github.com/szl-holdings/ouroboros/issues/41)) ([9d6a388](https://github.com/szl-holdings/ouroboros/commit/9d6a388a88f21065abb8ed1e0463dbefc3d62098))

## [Unreleased]

### Changed (`fix/lambda-unification`)
- `runtime/lambda-gate/src/gate.ts` — `computeLambda(axes)` now returns the weighted geometric mean (canonical Λ per thesis v14 §3.3 Definition 2a and `lutar-lean/Lutar/Invariant.lean`). The prior MIN-fold is exposed separately as `weakestAxis(axes)` and surfaced on `EvalResult` as the diagnostic `weakestAxis` field. The gate verdict semantics (per-axis conjunctive AND with thresholds 0.95 critical / 0.90 standard) are unchanged.
- Verified verdict-preserving over a 10,000-vector random scan; no production behaviour change. See `f2_lambda/regression_check.md`.
- Added `docs/lambda-spec.md` as the single source of truth for the Λ scalar vs gate verdict distinction.

### Added
- Series-A presentation pass: SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, CODEOWNERS
- Apache-2.0 LICENSE
- CITATION.cff for independent citation

## Release index

Releases are tagged on this repository. See [GitHub Releases](../../releases) for the full list.
