# Engine 1.1.0: rejected intermediate repair

This is a new engine version. The deterministic geometry module and [audit-c16-v1](https://github.com/13shreyansh/stoa-measure/tree/audit-c16-v1) remain unchanged. Original summaries, traces, 311 failures and the P1/P2 review are preserved byte-for-byte. These results do not replace or relabel the old held-out benchmark.

[Repair protocol](SPEC.md) · [Engine freeze](ENGINE_FREEZE.json) · [Results](results/summary.json) · [All seen-case repairs](results/seen-published-failures.json) · [Remaining failures](results/remaining-failures.json) · [Fresh wording packet](fresh-wording.json)

**Do not deploy this candidate.** The [independent repair review](REVIEW.md) found additional P1 exportable answers for unsupported units, arithmetic and mixed targets. Version1.2.0 is developed separately in eval/repair-v1.2/. All1.1 results and its sealed-packet history remain intact.

## What changed

Engine 1.1.0 lives in `src/engine-v1.1.js` and imports the original parser and geometry from `src/engine.js`. Area expressions such as square metres are resolved before generic how-many counting. Quoted labels are separated from intent words, exclusion words must match whole words, and explicit mixed operations or conflicting targets request review.

An answered area carries m² and an answered count carries count. Export checks the requested operation, output unit, finite quantity and exact question used for the calculation. Editing the question disables export until recalculation. The handler also rejects stale/unresolved exports if called directly. JSON records engine1.1.0 and geometry1.0.0 separately.

This remains a small rules-based vocabulary, not general language understanding. Unfamiliar syntax and conservative exclusions can still cause refusals.

## Repair results, kept separate by provenance

| Evidence slice | Result | What it means |
|---|---:|---|
| Analytic intent/unit/export regression cases | 19 passed | Authored during development, including one row with several invalid-export assertions |
| Focused DOM area/count/export regressions | 7 passed | Authored fixture; not browser rendering |
| Published C-16 failure cases | 311/311 numerically correct | Seen-case regression against supplied numeric references, not new unseen accuracy |
| Previously wrong-unit C-16 slice | 29/29 correct m² answers | Seen P1 repair cases, no count-valued area answers |
| All C-16 authored rephrases | 960/1,341 correct; 381 refused; 0 incorrect answers | Seen wording; correctness differs from the old audit's invariance metric |
| Historical dev replay | 771/1,772 correct; 1,001 refused | Previously exposed data; 25 old correct answers now refuse |
| Historical held-out replay | 285/586 correct; 301 refused | Previously exposed data; 6 old correct answers now refuse; NOT a new held-out score |
| Freshly authored wording probes | 28/30 passed; 2 refused; 0 incorrect answers | Model-authored analytic packet sealed before this engine's freeze; not human labels or a new drawing benchmark |

The old engine's original held-out result stays 277/586 with 277 answered. It was unseen at that original run. The repair replay above uses that now-exposed set and makes no new generalization claim. The historical replay had no incorrect answered cases under the supplied exact-count/2%-area rule, but that does not establish production reliability.

## Remaining failures and regressions

Fresh probe `unseen-10`, `Quanti metri quadrati misura la stanza 1.01?`, recognizes area but refuses because the Italian room selector stanza is unsupported. Fresh probe `unseen-15`, `Count all numbered rooms indoors.`, recognizes count but refuses because that indoor-count selector is unsupported. The expected values are authored fixture facts, not human annotations.

Compared with the original benchmark, 31 previously correct answers now refuse: 30 French questions with exclusion wording are outside the conservative exclusion grammar, and one numbered room's supplied label does not match the extracted label. All records remain in `results/historical-regression.json`. We did not adjust the frozen engine after observing these results.

For the full seen rephrase set, 381 requests remain unresolved due to drawing/identity/scope checks. Refusal is not counted as numeric success. We do not claim the new router handles arbitrary modifiers, every ambiguous sentence or every language.

## Fresh-packet provenance

A fresh agent, `/root/repair_unseen_wording`, received only intended behavior and the analytic fixture facts. It did not inspect implementation, prior tests, old audit prompts or builder conversation. It wrote 30 cases and returned only count and SHA-256. The builder froze the engine and analytic tests before reading/running the packet. The packet hash was `c930ac5c6bcd0ebfcb47ebd84312349e85c9f6231593a586f761f6c3eb580fe0` before reveal.

This establishes a recorded separation of authoring and implementation context. It is not a human, different-model-family, random-language or real-drawing benchmark claim. The packet was revealed once. No engine change followed the reveal. Hashes are integrity records, not external timestamp certification.

## Reproduce without overwriting history

```sh
STOA_DATA=/absolute/path/junction-dataset-preview npm run audit:c16
npm run test:repair
STOA_DATA=/absolute/path/junction-dataset-preview npm run eval:repair
```

`audit:c16` verifies that the original evidence and geometry are byte-identical to the historical tag, extracts that tag to scratch and replays its old audit there. Current app/UI changes do not rewrite that snapshot. `eval:repair` writes only the new repair directory and checks frozen repair input hashes. Repeating the revealed packet is then a regression, not another unseen test.

Cost/source limits remain: deterministic QA uses zero model calls, but hardware, hosting, review-model and human costs were not measured. No new source-family holdout, independent overlay grade, human room measurements, calibrated confidence or frontier-model comparison was collected.

## Review and deployment

The [repair review](REVIEW.md) reproduced the finite scores but rejected the broader intent-safety contract: sq ft, plus5m², multiplied-by2 and a second kitchen target could still return/export unmodified area. The candidate was not deployed. The mode-switch stale button re-enabled, although the download handler blocked it. The required rephrase invariance was supplied after review in results/rephrase-invariance-supplement.json:1338 unchanged/3 changed on status/unit/value/room IDs, not full entity-ID invariance. No code changed after the1.1 freeze.
