# C-16 audit: stable geometry, brittle question routing

The delivered engine is unchanged. This audit found no site/building/drawing overlap and no output changes from the tested filename or order nuisances. It also found **311 changes in 1,341 authored rephrases**, including **29 area requests returned as counts**. This is a known failure, not a passing language-robustness result.

[Protocol](SPEC.md) · [Machine results](results.json) · [Every failed nuisance case](failures.json) · [Whole-drawing group manifest](group-manifest.json) · [First audit freeze](FREEZE.json)

The audit uses dev cases only. It does not tune or rerun the held-out benchmark. Invariance compares against the original outcome, including refusals; an unchanged refusal is not a correct numeric answer.

## Whole-drawing and source grouping

The original SHA-256 split uses the canonical site identifier. The audit verified 65 whole sites, 65 building/project identifiers and 65 drawings, with no overlap between dev and held-out. The original index manifest matches exactly. All 65 PDF/DXF/PNG triplets stay together. All 1,179 adjacent English/translated question pairs passed the structural same-group check, with no unpaired Swiss records.

| Preview source/family | Question records | Unique question paths | Dev scored | Held-out scored | Status |
|---|---:|---:|---:|---:|---|
| Swiss Dwellings | 2,358 | 65 | 1,772 | 586 | Semantic paired-DXF subset |
| CubiCasa5K | 4,270 | 241 | 0 | 0 | Not evaluated |
| IFC models | 1,049 | 6 | 0 | 0 | Not evaluated |
| IFC-Bench | 249 | 5 | 0 | 0 | Not evaluated |
| Opening Design | 64 | 3 | 0 | 0 | Not evaluated |

Unique paths are an inventory, not an independent-project count for unscored sources. Swiss is the only scored source, so **source-disjoint generalization has not been established**. We do not turn the other 5,632 records into automatic successful refusals or 0% accuracy. No source-family holdout score is claimed.

A separate parse-only probe tried the one non-Swiss DXF in the preview, Opening Design's Site plan. The parser rejected it for lacking supported room geometry. This is an input-rejection observation, not a QA score or evidence of broad source understanding. Existing IFC/PDF relationships outside Swiss are unscored; this audit makes no leakage assertion about a split that was never run for them.

## Frozen nuisance results

| Nuisance family | Comparisons | Unchanged | Changed |
|---|---:|---:|---:|
| Identical bytes, three different filenames | 5,316 | 5,316 | 0 |
| Reverse dev question row order | 1,772 | 1,772 | 0 |
| Reverse / seeded-shuffle complete DXF entities | 3,544 | 3,544 | 0 |
| Numbered-room area rephrases | 288 | 186 | 102 |
| Room-label count rephrases | 906 | 726 | 180 |
| Room-label area-total rephrases | 147 | 118 | 29 |

The original dev trace replay matched all 1,772 records. Nuisance comparisons retain status, unit, selected room/entity identities and numeric value within 1e-8 relative/absolute tolerance. The same drawings and related questions recur in these comparisons, so these counts are not independent samples. Runtime filename changes do not change the canonical group identity used to construct the dataset split.

### Published failure families

- **29 area-to-count misroutes.** Example on dev drawing `site11711_bldg18268_floor48991`, record 5812: the source area request returns about 53.01 m² for rooms labelled Camera da letto. The authored equivalent `How many square metres do all rooms named 'Camera da letto' cover?` returns `4 count` for the same four rooms. The geometry did not change; the question router selected the wrong operation.
- **270 answer-to-refusal changes.** The template `Total rooms named '…'?` loses 180 count answers, and `How many square metres is room …?` loses 90 room-area answers.
- **12 refusal-to-answer changes.** Removing redundant Wohnen or Wohnen/Essen labels from six numbered-room questions produces answers in two templates. The exclusion guard matches `ohne` inside `Wohnen`. These are routing changes, not newly established accuracy claims.

All 311 variants, canonical record indices, before/after values, units and selected identities are in failures.json. Authored nuisance templates are not a human paraphrase corpus. No fix or prompt tuning followed this audit. The delivered engine remains at its original SHA-256.

## Cost per correct answer, scoped

The original frozen held-out run has 586 requests, 277 correct numeric answers and 309 review requests. It makes zero model calls. **Model inference/API charges per correct benchmark answer are $0 / 277 = $0.** This calculation includes refusals in the request count and uses correct answers as the denominator.

Hardware, energy, hosting, storage, network, coding/review-model usage and human tracing costs were not measured. They are not zero by implication. Total cost per correct end-to-end answer is unknown. Cost per correct, independently visually grounded answer is also unknown because no benchmark-wide independent overlay grading was collected. No frontier-model cost comparison was run.

## Integrity and review

FREEZE.json hashes the protocol, audit runner, engine, original summaries, split manifest and audit outputs from the first successful registered audit execution. It is integrity metadata, not a trusted external timestamp or certification. Additional input-content hashes and the final documentation/reviewer freeze are recorded separately; they do not alter the original audit outputs.

The [fresh evidence reviewer](REVIEW.md) reproduced the audit byte-for-byte and independently recomputed the original numeric trace totals. It supports the grouping/nuisance arithmetic and scoped cost claim, flags the disclosed wrong-unit routing as P1 and brittle wording as P2, and refuses source generalization, calibrated confidence, benchmark-wide independent overlay accuracy, human-label and total-cost claims. The P1/P2 engine defects remain unfixed in this frozen audit.

Provenance: a model agent launched with fork_turns=none, inherited configured model, no builder conversation supplied. This is context separation, not human review or established different-model-family independence. The reviewer did not rerun browser workflows or attest historical preregistration or the final builder-assembled documentation freeze. The original chronology is builder-recorded, not externally certified. No external reference is treated as proof that this implementation inherits its accuracy or capabilities.

FINAL_FREEZE.json records the final published documentation, reviewer report, original numeric traces and input-hash inventory after review. It is assembled by the builder and does not change or replace the original audit outputs or their freeze.
