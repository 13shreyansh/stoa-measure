# Engine 1.3.1 scope-patch review

Review date: 2026-11-14.

## Provenance and scope

This is a model-agent review continuing the context that reviewed C-16 and earlier repair candidates. That reviewer context was originally launched with `fork_turns=none` and the inherited configured model; it was not restarted for this patch. No builder conversation, bridge material or memory was supplied or read. This is not human review or established different-model-family independence.

The eight-case author provenance is recorded honestly in `ENGINE_FREEZE.json`: the same isolated author context that produced the prior 24 cases continued with behavior/fixture facts, without implementation or builder conversation. It is not a newly independent author context. I verified the published packet hash; the claimed pre-reveal sequence is recorded provenance rather than independently timestamped proof. The expectations are model-authored on an analytic fixture, not human area labels or independent drawing measurements.

I inspected the authorized patch source, UI, specification, freeze, tests, evaluator, packet and result files. Earlier test/packet evidence and tagged result files were used for overlap and preservation checks. I did not tune, deploy, run a browser, rerun the fresh packet as unseen, or execute the full repair evaluator. Source and frozen evidence were unchanged. Analytic/DOM output writes were intercepted and compared with existing bytes; the historical audit used scratch copies. This review is the only new published file I wrote.

## Verdict

The specific indoor-total/category defect identified in the 1.3 review is fixed by refusal in the tested cases. Indoor total combined with a category, quoted label, numbered room or apartment scope returns review with no exportable quantity. Ordinary bathroom-group, whole-floor indoor and apartment-area requests still answer correctly on the supplied fixture. Prior unit/arithmetic/mixed-target probes and stale mode-switch export checks pass.

The overlap correction is now supported and kept separate from the unchanged 1.3 results. I found no new correctness blocker in the specific wrapper and export flows examined. This is a finite repair assessment, not a claim of general intent safety. The inherited language/coverage regressions and an additional safely refused wording remain material limits.

## Reproduced behavior

All 34 supplied analytic regression records and all eight happy-dom checks passed. Each test's generated result JSON matched its published file byte-for-byte without overwriting it.

I separately checked these fixture outcomes:

| Request scope | Outcome |
|---|---|
| Total indoor area of bathrooms or balconies | Review; null quantity; not exportable |
| Total indoor area of rooms labelled `Bad` | Review; null quantity; not exportable |
| Total indoor area of room 1.01 | Review; null quantity; not exportable |
| Total indoor area of apartment A | Review; null quantity; not exportable |
| Area of bathrooms | 26 m²; rooms 1.01 and 1.02 |
| Total indoor area | 50 m²; rooms 1.01, 1.02 and 1.03 |
| Area of apartment A | 50 m²; rooms 1.01, 1.02 and 1.03 |

These refusals implement the patch's deliberately narrow scope policy; they do not establish that every combined-scope question is intrinsically unanswerable. Some understandable apartment/subset wording now requires a separate simpler request.

The regressions include the four earlier exportable-error probes: `in sq ft`, `plus 5 m²`, `multiplied by 2`, and a numbered room `and the kitchen`. All now refuse. They also verify m² versus count, Wohnen, conflicting operations, wrong-unit/non-finite/stale-result guards, engine 1.3.1 / geometry 1.0.0 and original computed-question binding in downloaded JSON. Editing the question and switching to tracing and back keeps export disabled; directly invoking the stale handler creates no download. These are authored fixture/DOM checks, not real-browser or production verification.

The wrapper reuses the unchanged 1.3 router and original geometry, replaces the runtime result version with 1.3.1, and adds the indoor-plus-subset refusal. All listed freeze hashes matched, including the original geometry, frozen base router, new wrapper, current UI and tests. The published eight-case packet matches its sealed SHA-256.

## Evidence accounting and preservation

- `npm run audit:c16` successfully verified and replayed the original frozen audit from `audit-c16-v1`. Its 311 failures remain historical evidence rather than being overwritten by repair outputs.
- I compared all tagged earlier result files by SHA-256 with their current bytes: nine files against `repair-v1.1-rejected`, eight against `repair-v1.2-rejected`, and ten against `repair-v1.3-reviewed`. All 27 matched.
- I independently reproduced the overlap inventory using earlier packets and literal questions from analytic/DOM test sources, normalizing case, quotes and whitespace. The prior 24-case packet has one known test overlap, `final-wording-01`. Its corrected original-1.3 nonoverlap result is 20/23. The new eight-case packet has no exact overlap in that inventory. Literal nonoverlap is not semantic novelty, statistical independence or proof of generalization.
- The prior 24-case replay is correctly marked seen: 21/24 under this patch. The first 30-case packet is also seen and now passes 17/30. The original 1.3 result files retain their historical values; the correction is published separately.
- I independently recomputed numeric/unit correctness from the saved rows: 311/311 known changed variants, including 29/29 prior wrong-unit variants; and 960 correct answered results with 381 refusals among all 1,341 authored rephrases. Saved correctness flags agree. This is arithmetic validation of recorded outputs, not an independent rerun of all Swiss repair answers.
- Full rephrase invariance includes status, unit, value at the specified tolerance, room IDs and entity IDs. My independent comparison of the saved records gives 1,338 unchanged and 3 changed, all at record 7100. The three variants answer room 2.42, while the current original-question outcome refuses on label mismatch. Invariance is distinct from numeric correctness, and unchanged refusals are not correct quantities.
- The recorded historical replay remains 585/1,772 dev and 233/586 exposed historical held-out, with 1,187 and 353 refusals respectively. I independently verified the numeric/unit flags and loss/gain counts: 184 previously correct dev answers lost with 36 gained; 50 previously correct held-out answers lost with 6 gained. These are seen regressions. The original 277/586 held-out result remains attached to engine 1.0.0.

## Remaining limitations

**P2 — Narrow wording coverage and historical losses remain.** The scope patch does not restore the substantial coverage losses inherited from 1.3. The first packet also loses one additional supported behavior, moving from 18/30 for 1.3 to 17/30 here. Neither successful refusals nor zero wrong answers within the saved slices justify describing this as a coverage improvement or a regression-free repair.

I inspected the saved eight-case packet outcomes without rerunning it as unseen: 7/8 expected behaviors, comprising three answered quantities and four expected refusals. `Give the total area indoors.` is the one failed expected answer; it safely refuses and is preserved in `remaining-failures.json`. Thus 7/8 is a behavior-test result, not seven correct numeric answers. The finite packet's zero incorrect answered outputs does not establish absence of other wrong-target answers.

The results do not include a final-engine behavior replay of the second rejected candidate's packet. Its wording participates in the overlap inventory, but I cannot attest patch performance on that packet from the supplied results.

## Claims declined

This evidence does not establish universal intent safety, representative language robustness, new real-drawing accuracy, source-disjoint generalization, unreleased-drawing performance, calibrated confidence, independently graded overlays, human labels, human review, model-family independence or full end-to-end cost. I did not reproduce a production build, deployment or Chief IAB verification and do not attest those actions. The supported conclusion is that the specified scope patch and tested export guards work on the reviewed finite cases, with the stated coverage limits preserved.
