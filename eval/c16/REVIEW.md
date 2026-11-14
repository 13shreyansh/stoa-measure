# C-16 independent evidence review

Review date: 2026-11-14.

## Provenance and scope

This is a fresh model-agent review context launched with `fork_turns=none`, using the inherited configured model. It is not a human review, and different-model-family independence has not been established. No builder conversation was supplied. I did not read bridge files, handoffs, conversation logs or memory, and did not access personal browsers.

I reviewed only the supplied evaluation specifications, C-16 runner/verifier and evidence, original ledger/summaries/split manifest/numeric traces, engine/application source, verification report, README and third-party notice. The authorized reproduction command accessed the local dataset and copied its required dependencies into scratch space. I did not change the engine, runners, test sets or published evidence. This review is an evidence and source-code assessment; it is not a new browser, deployment, licensing or human-ground-truth audit.

## Verdict

The C-16 grouping counts, nuisance totals, failure breakdown and narrowly scoped inference-cost calculation are supported by the supplied evidence and successful reproduction. The documentation prominently discloses the language-routing failures and limits the benchmark to Swiss paired-DXF inputs. It does not justify general language robustness, source-disjoint generalization or end-to-end visual accuracy.

The findings below are material delivered-engine limitations already disclosed by the audit, not unexplained discrepancies in the published C-16 totals. No engine change should be made inside this frozen audit. Any repair needs a new version and separately reported evaluation.

## Findings

### P1 — Area questions can return an answered count

All 29 `rephrase_label_area/template_3` failures change an answered `m²` result to an answered `count` result. For record 5812 on `site11711_bldg18268_floor48991`, the authored question `How many square metres do all rooms named 'Camera da letto' cover?` returns 4 count instead of the baseline 53.00923156737272 m², with the same four room and entity identities. This is an operation/unit error, not a geometry-order difference.

`src/engine.js:56–63` treats `how many` as count intent, does not recognize `square metres` as area intent, and assigns `count=countQ` for quoted labels. `src/main.js` displays and enables export for any `status: answer`, so the wrong operation is not confined to a diagnostic trace. In a subsequent engine version, recognize dimensional area wording before count wording and refuse ambiguous intent; preserve these failures as regression examples. The README correctly warns about this defect.

### P2 — Supported intent is brittle to equivalent wording and label substrings

The failure file contains 270 answer-to-review changes: 180 for `Total rooms named '…'?` and 90 for `How many square metres is room …?`. Another 12 changes are review-to-answer outcomes for six numbered-room records in two templates. The latter are consistent with the unbounded `ohne` match in `src/engine.js:53`, which also matches inside `Wohnen`; the numeric traces record the original exclusion refusal for these records.

In a subsequent version, recognize the tested area/count phrases and restrict exclusion matching to words or parsed intent. The 12 newly answered variants must not be counted as newly validated correct answers merely because they differ from a refusal. The C-16 README makes that distinction correctly.

## Supported claims and their boundaries

- **Grouping:** the replay recomputes the SHA-256 split from site identifiers extracted from canonical drawing stems, matches both original record-index manifests, and yields 49 dev and 16 held-out drawings. The group manifest contains 65 distinct site IDs, building IDs and drawing IDs, with no cross-split overlap. All 65 same-stem PDF/DXF/PNG triplets exist and stay with their drawing group. This establishes separation under the supplied identifier convention, not independent verification that differently named files could never describe the same real project.
- **Translation pairing:** all 1,179 adjacent pairs satisfy the runner's structural checks: same path, reference quantity, type and unit, English-prefix versus non-English-prefix classification, and same split. There are no unpaired Swiss records. This is not a linguistic assessment of translation equivalence or 2,358 independent examples.
- **Source scope:** source/family inventories total 7,990 records. Swiss accounts for 2,358 scored records; the other 5,632 records have no QA score. Unique paths for unscored sources are not independent-project counts. The single non-Swiss DXF probe is an observed parse rejection only. Both scored splits use the same Swiss family.
- **Nuisance invariance:** 5,316 filename comparisons, 1,772 reversed-question comparisons and 3,544 entity-order comparisons were unchanged: 10,632 comparisons in total. The comparisons include refusals and are correlated repeated uses of the same dev drawings. They establish only the tested invariances, not correctness. Entity order uses one reverse and one fixed seeded shuffle, not exhaustive permutations.
- **Language failures:** 1,341 authored rephrases yield 311 changes: 29 answered area-to-count changes, 270 answer-to-review changes and 12 review-to-answer changes. Every failed variant includes source, canonical drawing, record index, authored question, values, units and selected identities. These authored templates are not a random language sample or human paraphrase corpus.
- **Original benchmark arithmetic:** the numeric trace files contain 1,772 dev records with 733 answered/passing results and 586 held-out records with 277 answered/passing results and 309 refusals. I independently recomputed numeric correctness using exact counts and 2% area tolerance; all pass flags agree. The held-out summary's 128/180 area and 149/406 count results, and its overall 277/586 result, are consistent. The paired DXF input advantage and shared-source printed-area check are disclosed.
- **Cost:** `$0 / 277 = $0` is justified for model inference/API charges per correct numeric benchmark answer in the frozen deterministic held-out run. The 586 requests, 309 refusals and zero model calls are stated. This does not price coding/reviewer-model use, hardware, energy, hosting, storage, network or human tracing. The audit runner hardcodes this cost record; its denominator is independently supported by the frozen summary and numeric traces rather than newly measured in C-16.
- **README/application claims:** the supplied source implements coordinate-based polygon measurement, selected-entity overlays, local input hashing and JSON export, plus calibrated manual tracing. It contains no model inference path. The principal benchmark and C-16 claims are appropriately scoped. The provided verification report records example browser checks; I did not independently reproduce those checks or treat that report as benchmark-wide overlay grading. External references and attribution do not establish this implementation's capabilities.

## What I reproduced

`npm run audit:c16` completed successfully. The verifier checked all files listed in `FREEZE.json`, regenerated `results.json`, `failures.json` and `group-manifest.json` in a scratch copy, and found byte-identical SHA-256 hashes for all three outputs. It also verified all 195 Swiss drawing-format input hashes. The engine hash remains `c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8`.

I separately aggregated all 311 failures, checked drawing/split counts, and recomputed numeric pass totals from both original trace files. I did not rerun held-out answers, run additional nuisance variants, or tune anything.

The reported original dev replay matches answered/refused status, numeric value and room IDs for all 1,772 records. The original numeric traces do not contain output-unit or selected-entity fields, so that particular historical replay cannot verify those fields against the original run. The fresh-baseline nuisance comparisons do include status, value, unit, entity IDs and room IDs. `FREEZE.json` hashes summaries and audit outputs but not the original numeric trace files; the successful reproduction is not a historical attestation of every trace field.

## Claims declined or not independently judgeable

- **Source-disjoint or unreleased-drawing generalization:** not established; no other family was question-scored.
- **Calibrated confidence or a production correctness probability:** no calibration evidence. Perfect numeric precision among the answered held-out records is a correlated sample result.
- **Independent overlay accuracy or fully visually grounded benchmark correctness:** no independent benchmark-wide grading. Selection-identity invariance and a reported example workflow are insufficient.
- **Human labels, independent room-area ground truth or human review:** none supplied; agent inspection and this model-agent review do not supply them.
- **Full end-to-end cost per correct answer, or per independently visually grounded answer:** unknown; relevant costs and visual-correctness labels were not measured.
- **Frontier-model superiority, cost advantage against a measured model baseline, compliance or broad drawing understanding:** no supporting experiment or certification.
- **Historical preregistration, first-run timing, absence of all past tuning, or externally trusted freeze timing:** current hashes and successful reproduction establish current consistency, not that chronology. The freeze is correctly described as integrity metadata rather than an external timestamp. The separately mentioned final documentation/reviewer freeze was not part of my supplied review inputs and is not attested here.

No additional accuracy, human-independence or certification claim should be inferred from this review.
