# Engine 1.3.0 final candidate review

Review date: 2026-11-14.

## Provenance and scope

This is a model-agent source/evidence review, continuing the reviewer context that assessed C-16 and engine 1.1.0. The original reviewer was launched with `fork_turns=none` and the inherited configured model. This final assessment did not start another fresh reviewer. No builder conversation, bridge material or memory was supplied or read. This is not human review or established different-model-family independence.

The final packet's separate author provenance is recorded in `ENGINE_FREEZE.json`: a fresh model agent received behavior and analytic fixture facts without source or old prompts and returned a sealed 24-case packet. I verified the published packet hash. The claimed pre-reveal sequence is recorded provenance, not independently timestamped proof. Model-authored fixture expectations do not supply human labels, independent drawing measurements or a representative language sample.

I inspected the authorized final source, specification, freeze, tests, evaluator, packet and result records, plus prior rejected-candidate evidence needed for the diagnostic and overlap checks. I ran the final analytic/DOM regressions and the authorized historical audit command. I did not rerun the final packet as unseen, run the full repair evaluator, tune, deploy, or inspect a personal browser. Source and frozen evidence were unchanged. Test output writes were intercepted and compared with existing bytes; the audit used scratch copies. This review is the only new published file I wrote.

## Verdict

The four prior P1 diagnostic prompts now refuse without enabling export. The stale mode-switch button defect is fixed in the tested flow. Full rephrase invariance now includes entity IDs and agrees with the published 1,338 unchanged / 3 changed result. The original audit still reproduces from its historical snapshot.

There remains an exportable wrong-target answer outside the published finite test slices. The packet's claim of zero exact prior test-prompt overlaps is also incomplete. The reported numeric slice totals are supported, but they do not establish general intent safety or unchanged coverage. Preserve this frozen candidate and these findings; any subsequent engine change needs a new version and evidence.

## Findings

### P1 — Indoor-total wording overrides a requested room category

On the supplied analytic fixture:

| Reviewer diagnostic | Actual result |
|---|---|
| `What is the area of bathrooms?` | 26 m², rooms 1.01 and 1.02 |
| `What is the total indoor area of bathrooms?` | 50 m², rooms 1.01, 1.02 and 1.03; exportable |
| `What is the total indoor area of balconies?` | 50 m², indoor rooms 1.01, 1.02 and 1.03; exportable |

The bathroom subset has area 26, not 50. The balcony question should either resolve the requested subset/convention or request review; returning the unrelated indoor total is not justified.

The category-conflict check in `answerDrawing` detects category combinations with numbered, apartment or quoted-label targets, but not a category combined with `indoorSelector`. The later indoor-total branch runs before category selection and silently ignores the category. Whole-request word acceptance does not validate the relationship between accepted words. The internal area/m² binding remains consistent, so `canExportAnswer` allows these results.

In a subsequent version, reconcile indoor scope and category scope before selecting rooms, or refuse that combination. These are reviewer-authored post-freeze diagnostics, not additions to the sealed packet's denominator or a new representative error rate. The four old probes being fixed does not establish that this broader target-scope problem is solved.

### P2 — Exact-overlap reporting misses prompts used directly in tests

`final-wording-01`, `What is the area of room 1.01?`, occurs as a direct `answerDrawing` test call in `intent-regression.mjs` and as a question used by `ui-regression.mjs`. It was also present in the earlier tests. It is therefore previously seen test wording, despite `exactPriorPromptOverlaps: []` and `nonoverlapCases: 24` in the summary.

The evaluator builds the test-prompt set from saved regression `rows`, which omit questions used by direct assertions and DOM setup. Comparing the supplied earlier packets and literal prompts in the earlier/current analytic and DOM test sources finds this one exact overlap. Remove this passing case from the nonoverlap slice: the corrected slice under that comparison is 20/23, with 3 failures. The overall recorded 21/24 behavior result is unchanged. This is an overlap-accounting defect, not evidence that the packet author saw the source or that the engine was retuned after reveal.

### P2 — Material coverage regressions remain

The exposed historical replay loses 184 previously correct dev answers and 50 previously correct held-out answers, all to the new unknown-word/modifier refusal. Gains of 36 dev and 6 held-out answers leave 585 dev correct answers versus the original 733, and 233 historical held-out correct answers versus the original 277. The original first wording packet now passes 18/30, versus its recorded 28/30 result for engine 1.1.0.

These are substantial capability losses even though the recorded replay has no wrong answered outputs. A refusal avoids asserting an unsupported quantity, but does not prove that the source question was ambiguous or impossible. Report the loss and gain counts alongside the successful targeted repairs; do not describe this candidate as a general improvement in coverage or a regression-free repair. Raw historical rows preserve these losses, while `remaining-failures.json` covers only the published-failure and final-packet slices.

## What I reproduced and checked

- All hashes listed in `ENGINE_FREEZE.json` matched, including original geometry `c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8`, intent engine `3c52977140c509285275a52095c25ec8cfa115d139b5d6f19e92dd00e96846ef`, and UI `f1e335dfc0917e3d6d8f4ab61715868155d3b15d6fc29ef1c1cd027ae14267d4`. The final packet matches its sealed SHA-256.
- All 29 supplied analytic regression records passed, with generated JSON matching the existing output byte-for-byte. I separately confirmed that `in sq ft`, `plus 5 m²`, `multiplied by 2`, and `and the kitchen` on room 1.01 now return review with null quantity and export disabled. These are known diagnostic regressions, not unseen performance.
- All eight supplied happy-dom checks passed, again matching the existing output bytes. These verify area versus count rendering, engine 1.3.0 / geometry 1.0.0 / computed-question binding in JSON, stale-edit refusal, mixed intent, Wohnen, and export staying disabled after switching to tracing and back. The tests inspect downloaded JSON but are not real-browser, build or deployment verification. Source exports also retain the input hash and calculation record.
- `npm run audit:c16` successfully compared original evidence/source against `audit-c16-v1` and replayed the original frozen audit from that snapshot. Original benchmark and C-16 outputs remain historical evidence; the current UI imports the separate 1.3.0 module.
- I independently recomputed correctness from the published result rows: all 311 known changed variants are correct in value and unit; the prior wrong-unit slice is 29/29; all 1,341 authored rephrases contain 960 correct answered results and 381 refusals, with no saved correctness-flag discrepancies. This checks result arithmetic; I did not independently rerun all Swiss repair answers.
- I independently compared all 1,341 rephrases with the current engine's recorded original-question outcomes, including status, unit, numeric value at the defined tolerance, sorted room IDs and sorted entity IDs. The result is 1,338 unchanged and 3 changed. All changes are record 7100: the original question refuses on label mismatch, while its three variants answer room 2.42 at 16.124990108074005 m². These are outcome changes, not wrong numeric answers. Stable refusals are not correct quantities.
- I independently aggregated the historical rows: dev 585 correct / 1,772, 1,187 refusals; exposed historical held-out 233 correct / 586, 353 refusals. Saved numeric/unit correctness flags agree. These are regressions on already exposed data, not new held-out scores.
- I inspected, without rerunning, the recorded final packet: 21/24 expected behaviors, consisting of 9 answered results and 12 expected refusals. Its 3 failures are refusals for `How large`, `combined area`, and `room group` wording. They are preserved explicitly. The packet shows zero incorrect answered outputs within those 24 cases; the reviewer diagnostics above are outside that slice.

The evaluator includes the second rejected candidate's packet in its overlap set but does not publish a final-engine behavior replay for that second packet. Thus the specification's plural request to report old wording packets is only partially fulfilled; the final summary reports behavior for the first packet alone. This is a remaining evidence-completeness limit, not an additional accuracy claim.

## Claims declined

This review does not establish general intent safety, language robustness, source-disjoint generalization, performance on unreleased drawings, calibrated confidence, independently graded overlays, human labels, or full end-to-end cost. Neither successful diagnostic refusals nor zero wrong answers within a finite saved slice imply those claims. The original 277/586 held-out result stays attached to engine 1.0.0; 233/586 is a seen replay for this candidate. I did not reproduce the production build, deployment or requested Chief IAB verification and cannot attest those actions here.
