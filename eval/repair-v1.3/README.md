# Engine1.3.0: published intent/export correctness repair

The current application uses `src/engine-v1.3.js`. The original geometry module, every original benchmark/C-16 result and all 311 old failures remain unchanged. [audit-c16-v1](https://github.com/13shreyansh/stoa-measure/tree/audit-c16-v1) is immutable. Intermediate candidates1.1 and1.2 were rejected and preserved separately, not silently overwritten or deployed.

[Protocol](SPEC.md) · [Engine/UI freeze](ENGINE_FREEZE.json) · [Results](results/summary.json) · [Every remaining failure/regression](results/remaining-failures.json) · [Fresh wording packet](fresh-wording.json) · [Rephrase invariance](results/rephrase-invariance.json)

## Behavior and evidence

The intent layer recognizes area expressions before generic how-many counting, separates quoted labels from control words, constrains exclusions to complete words, rejects unhandled request words/operators/units and conflicting targets, and keeps the original geometry and room checks. This is a controlled request vocabulary. Use explicit area in m² or count and one room number, quoted label or apartment. It is not general language understanding.

Exports bind to the exact computed question, operation, output unit and finite result. Editing the question disables export. Switching to tracing and back preserves that disabled state. The download handler independently blocks unresolved, stale or unit-mismatched results. JSON separates engine1.3.0 from geometry1.0.0 and retains the input hash and vertices.

| Evidence slice | Result | Provenance |
|---|---:|---|
| Intent/unit/export development regressions | 29 passed | Authored and seen during repair development; includes the reviewer's arithmetic/unit/mixed-target probes |
| Focused DOM export/UI regressions | 8 passed | Authored fixture, includes stale mode switching; not browser evidence |
| Published C-16 changed rephrases | 311/311 numerically correct | Known cases; exact counts / 2% areas and requested units checked |
| Prior area-to-count P1 slice | 29/29 correct m² answers | Seen repair regressions, not new unseen accuracy |
| Entire C-16 rephrase set | 960/1,341 correct; 381 refused; 0 incorrect answered | Seen wording and drawings |
| Rephrase outcome invariance | 1,338 unchanged / 1,341 | Status, unit, value, room IDs and entity IDs; three changes are not three wrong numeric answers |
| Historical dev replay | 585/1,772 correct; 1,187 refused | Previously exposed data; 184 old correct answers now refuse |
| Historical held-out replay | 233/586 correct; 353 refused | Previously exposed data; 50 old correct answers now refuse; NOT new held-out performance |
| First intermediate wording packet | 18/30 pass | Now a seen regression, not fresh evidence for1.3 |
| Final sealed wording packet | 21/24 pass: 9 numeric answers and 12 intended refusals | Fresh model-authored analytic packet; three extra refusals, no wrong answers in this finite packet |

The old engine's original held-out result stays **277/586 correct, 277 answered, 309 review requests**. It was unseen at that original run. The current replay must not inherit the unseen label or imply no regressions. The stricter parser loses coverage, especially translated free wording; the primary room-selection/preset workflow still generates supported requests.

## Published limits and remaining failures

The final packet's three expected-answer phrases returned review: `How large is room 1.03?`, `What is the combined area of rooms labeled "Bad"?`, and `Give the area of the "Wohnen" room group.` The expected answers are model-authored fixture facts, not human labels. No engine change followed this reveal.

All 381 unresolved seen rephrases and all historical lost-correct cases are retained in `results/remaining-failures.json` and the full historical replay. Correctness and invariance are separate: the three changed rephrase outcomes share record7100, where the original request refuses a supplied-label mismatch while the paraphrases omit that label and answer the correct area.

Zero wrong answers in these finite slices is not a production probability or a proof of complete intent safety. No broad language/source generalization, unreleased-drawing performance, calibrated confidence, independent overlay score or frontier-model comparison follows. Geometry/printed-area agreement shares its source. Inference uses zero model calls, but hardware, hosting, reviewer-model and human costs are unmeasured.

## Candidate and packet provenance

- Version1.1.0 fixed the known wrong-unit cases but its [independent review](../repair/REVIEW.md) found additional exportable wrong answers for sq ft, arithmetic and a second target. It was not deployed. Its source, first packet28/30 outcome and findings remain under `repair-v1.1-rejected`.
- Version1.2.0 added whole-request validation and fixed those diagnostic cases, but rejected ordinary terminal punctuation and too much supported wording. It was not deployed. Its second packet21/24 result and severe coverage losses remain under `repair-v1.2-rejected`.
- Version1.3.0 makes bounded fixes from those now-seen diagnostics. The final agent `/root/final_repair_wording` received only intended behavior and fixture facts, with `fork_turns=none`, no implementation, old cases or builder conversation. It returned only count24 and SHA-256. The builder froze the final engine/UI/tests before revealing the packet.

The final packet SHA-256 is `1de7d6a15a3f9be28ca553a648018c54188db3c9099bf2c40b8e7604c5d747bb`. No exact prompt overlaps were found against recorded prior packets and analytic test strings after lowercase/whitespace normalization. This does not establish independence from broader language patterns, training data or all source questions. Repeating the revealed packet is regression evidence only. Hashes record integrity, not externally certified chronology. All reviewers/authors are model agents, not humans or established different-model families.

## Reproduce and inspect

```sh
STOA_DATA=/absolute/path/junction-dataset-preview npm run audit:c16
npm run test:repair
STOA_DATA=/absolute/path/junction-dataset-preview npm run eval:repair
```

The history checker verifies old evidence byte-for-byte against its tag and replays it in scratch. Repair outputs stay in this separate version directory. The original module SHA-256 remains `c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8`.

The final source/evidence review and focused Chief IAB area/count/export check are recorded when complete. They are workflow/review evidence, not new numeric ground truth.
