# Engine1.3.1: area/count, request-scope and export repair

This is the current correctness repair. Original geometry, audit-c16-v1, every original benchmark result and the old failures remain immutable. The app uses a small scope guard over frozen engine1.3.0. Intermediate candidates and their shortcomings are retained, not silently erased.

[Protocol](SPEC.md) · [Patch/UI freeze](ENGINE_FREEZE.json) · [Results](results/summary.json) · [Remaining failures and coverage losses](results/remaining-failures.json) · [Invariance](results/rephrase-invariance.json) · [Overlap correction](results/overlap-correction.json)

## What is repaired

Area expressions are resolved before generic how-many counts. Quoted labels are data, exclusions match complete words, and unhandled modifiers, operators, units and competing targets request review. A whole-floor indoor selector cannot silently override a bathroom, label, numbered-room or apartment subset. These are controlled request rules, not general natural-language understanding.

Export binds to the exact computed question, area/count intent, matching unit and finite quantity. Editing a question disables export; switching modes keeps it disabled. The download handler also checks these conditions. JSON records engine1.3.1 and geometry1.0.0 separately, plus the input hash and boundary coordinates.

## Results by exposure and provenance

| Slice | Result | Scope |
|---|---:|---|
| Analytic intent/unit/export development regressions | 34 passed | Seen development and reviewer probes, including unsupported units, arithmetic, target/scope conflicts and export guards |
| Focused DOM checks | 8 passed | Authored fixture; includes stale edit and mode-switch state, not a browser |
| Published C-16 failures | 311/311 numerically correct | Seen regression against supplied reference quantities |
| Prior wrong-unit P1 slice | 29/29 correct m² answers | Seen repair cases |
| Full1,341 C-16 rephrases | 960 correct,381 refused,0 incorrect answered | Seen language/drawings; refusals are not numeric successes |
| Rephrase outcome invariance | 1,338 unchanged/1,341 | Status,unit,value,room IDs and entity IDs; correctness is a different metric |
| Historical dev replay | 585/1,772 correct;1,187 refused | Previously exposed data;184 old correct answers now refuse |
| Historical held-out replay | 233/586 correct;353 refused | Previously exposed data;50 old correct answers now refuse; NOT a new unseen score |
| Original1.3 packet, now replayed | 21/24 behavior checks | Seen for this patch; original nonoverlap result corrected to20/23 |
| Additional sealed patch packet | 7/8 behavior checks | Model-authored analytic packet opened after patch freeze;1 extra refusal,0 incorrect answers |

The original engine1.0 held-out result stays **277/586 correct,277 answered,309 refusals**. The stricter repair loses coverage, especially translated free wording. It does not improve every metric. Room selection and preset questions still produce supported requests. Use explicit area in m² or count and one clear target.

The additional packet's remaining failure is `Give the total area indoors.` It returns review rather than the authored expected50m². The prior packet's three missing phrases and all historical coverage losses are retained in the evidence. Zero incorrect answers in these finite slices is not a reliability probability or proof of universal intent safety.

## Versions, review and overlap correction

- **1.1.0:** repaired the original known cases but review found exportable answers that ignored sq ft, arithmetic or a second target. Not deployed; preserved as repair-v1.1-rejected.
- **1.2.0:** whole-request checking fixed those probes but caused excessive vocabulary/punctuation refusals. Not deployed; preserved as repair-v1.2-rejected.
- **1.3.0:** bounded normalization/vocabulary changes; sealed packet21/24. Review found a remaining indoor-total/category scope override and a missed prompt overlap. Not deployed; preserved as repair-v1.3-reviewed.
- **1.3.1:** small explicit refusal guard for those conflicting scopes. It imports unchanged1.3 routing and the original geometry, and reports its additional packet separately.

The1.3 overlap scanner originally omitted direct prompt literals in test sources. Its old output is retained as erroneous historical evidence. The corrected inventory scans analytic/UI test literals and saved questions, with quotation/case/whitespace normalization. `final-wording-01` was already a test prompt. Thus original1.3's nonoverlap result is20/23, not21/24 unseen wording. No current patch packet string overlapped that recorded inventory. This does not establish independence from all language patterns or training data.

The patch packet was authored by the continuing isolated `/root/final_repair_wording` context, originally fork_turns=none, with behavior/fixture facts and no implementation or builder conversation. It returned only count8 and hash `df77f6a4904cae37e248a751c4237172c2515b7d33704ece7ea9598c099c1620`. The builder froze patch/UI/tests before reveal. It is model-authored analytic behavior evidence, not human labels, a representative language sample, a new source/drawing holdout or established different-model-family independence. No patch change followed the reveal.

Independent reviews retain their actual scope; they are not certificates of intent safety. Source generalization, calibration, independent benchmark-wide overlay accuracy, frontier-model superiority and full end-to-end cost remain unestablished. Model inference uses zero calls; hardware/hosting/reviewer-model/human work were not priced.

## Reproduce

```sh
STOA_DATA=/absolute/path/junction-dataset-preview npm run audit:c16
npm run test:repair
STOA_DATA=/absolute/path/junction-dataset-preview npm run eval:repair
```

The history checker verifies original evidence byte-for-byte and runs the historic audit from its immutable tag in scratch. Current outputs stay in this separate patch directory. Repeating any revealed packet is then regression evidence only.

The [independent patch review](REVIEW.md) reproduced34 analytic and8 DOM checks, confirmed the known scope/unit/arithmetic probes refuse, verified stale export remains blocked, checked freeze/history integrity and the overlap correction, and found no new blocker within that finite patch scope. It is the continuing context-isolated model reviewer, not a human or established different model family. It does not certify general intent safety. Focused Chief IAB area/count/export checks are recorded after deployment and do not supply new benchmark ground truth.
