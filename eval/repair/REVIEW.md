# Engine 1.1.0 repair evidence review

Review date: 2026-11-14.

## Provenance and scope

This is a separate repair assessment by the model-agent that previously reviewed C-16. The original reviewer context was launched with `fork_turns=none` and the inherited configured model; this repair assessment continued that context rather than starting another fresh agent. No builder conversation, bridge material or memory was supplied or read. No personal browser was used. This is neither human review nor established different-model-family review.

The repair authoring packet has separate provenance recorded in `ENGINE_FREEZE.json`: a fresh model agent received intended behavior and analytic fixture facts, without implementation or builder conversation, and returned a sealed 30-case packet. I verified that the published packet matches the recorded hash. The asserted pre-reveal sequence and lack of builder inspection are recorded provenance, not independently timestamped facts established by this review. The packet supplies model-authored expectations on an authored analytic fixture, not human labels or independent drawing measurements.

I read only the newly authorized repair specification, freeze, packet, fixture, runners, result JSON files, history checker, and relevant engine/application source. Test dependencies and historical files were accessed by the authorized regression/audit commands. I did not edit source, tests or evidence, retune an engine, deploy, or perform a browser check. This review is the only new published file I wrote; the audit created scratch copies, and test result writes were intercepted and compared with their existing bytes.

## Verdict

The targeted C-16 area/count and Wohnen repairs are supported. The supplied analytic and DOM regressions pass, all 311 published changed variants now have the intended reference value and unit in the repair evidence, and the original audit remains reproducible from its historical tag.

The repair still does not meet the protocol's general refusal contract for arithmetic, conflicting targets and unsupported units. I reproduced exportable wrong answers for those cases. Thus the finite reported scores are credible within their named slices, but they must not be presented as complete intent safety or evidence that incorrect answered outputs have been eliminated. Retain the frozen 1.1.0 evidence and these findings; any further repair needs a new version and separately reported evaluation.

## Findings

### P1 — Unresolved request modifiers still produce exportable answers

On the supplied analytic fixture, all of these return `status: answer`, value 20, unit `m²`, intent `area`, and `canExportAnswer: true`:

| Reviewer probe | Failure |
|---|---|
| `What is the area of room 1.01 in sq ft?` | Unsupported requested unit is silently ignored. |
| `What is the area of room 1.01 plus 5 m²?` | Addition is ignored; the result is the unmodified room area. |
| `What is the area of room 1.01 multiplied by 2?` | Multiplication is ignored. |
| `What is the area of room 1.01 and the kitchen?` | The unquoted second target is ignored instead of requesting review. |

`src/engine-v1.1.js:76–95` recognizes only selected negation/arithmetic and unsupported-unit spellings. It misses `plus`, `multiplied`, and `sq ft`. At lines 177–205, target-conflict checks compare numbered rooms and apartments but do not reconcile a numbered target with an unquoted room-category target. The numbered-room branch at lines 223–243 then answers directly. `canExportAnswer` checks internal unit/intent consistency and question equality; it cannot detect that parsing discarded part of the request.

These are reviewer-authored diagnostic probes, outside the sealed 30-case packet and outside the reported accuracy denominators. They demonstrate a remaining defect, not a new representative error rate. In a subsequent version, validate the whole request, including unit expressions, arithmetic and every target, before allowing an answer; unresolved modifiers must request review. The recorded protocol explicitly requires those refusals.

### P2 — Switching modes re-enables a stale export button

I reproduced this in happy-dom: answer room 1.01, edit the question to room 1.02, switch to tracing, then switch back. Editing initially disables export, but the return to DXF enables it because `src/main.js:79–80` checks only answered status. The stale export handler correctly refuses the download, so no wrong JSON was emitted. Use `canExportAnswer(result, currentQuestion)` when restoring DXF mode as well as when calculating/exporting. This is a button-state defect; the export guard itself remains effective for this sequence.

### P2 — The required whole-rephrase invariance result is not reported

`SPEC.md` requests outcome invariance on all 1,341 authored rephrases in addition to numeric scoring. `evaluate.mjs` reports correct/answered/refused totals for that set but does not compare each rephrase with the repaired engine's answer to its corresponding original question. Numeric correctness and invariance are different measures.

From the supplied current historical-regression and rephrase records, I independently compared status, unit, numeric value at the C-16 tolerance, and room IDs: 1,338 unchanged and 3 changed. The three changes are the variants for record 7100: the repaired original question refuses on a supplied-label mismatch, while the variants answer room 2.42 at 16.124990108074005 m². These are not three wrong numeric answers; they are three outcome changes. Repair output records omit entity IDs, so full selected-entity invariance cannot be established from those records. Publish a separately identified invariance result rather than treating 960 correct answers as that result.

## Reproduction and evidence checks

- Every file hash listed in `ENGINE_FREEZE.json` matched, including geometry `c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8`, intent engine `8ba7ff7982d78ffaa13a5e8806c7a43220fa5b779284371d3e365bd233be757a`, and current UI `cd6ee5d7e64a77a6543049fa5eb392afb6314cba48c00d30a75b9abd981c0e75`. The published fresh packet matches its sealed SHA-256.
- The supplied intent regression ran successfully: 19 recorded cases. Its generated JSON matched the existing result byte-for-byte. The exported-answer checks reject mismatched unit/intent, non-finite values and a stale question. Whole-word exclusion handling fixes the tested Wohnen case; quoted labels are masked before control-word parsing. Unresolved `excluding kitchen` on a numbered-room request correctly refused in an additional probe.
- The supplied seven DOM checks ran successfully, with generated JSON matching the existing result byte-for-byte. They establish fixture-based area/count rendering, original computed-question and engine-version export binding, mixed-intent refusal, and the tested stale-edit download guard. They are DOM tests, not real-browser or deployment verification.
- `npm run audit:c16` successfully checked the original evidence/source against `audit-c16-v1` and reproduced the original frozen C-16 audit from that snapshot. The original 311 failures remain historical evidence; the current application imports the separate 1.1.0 module.
- I reran all 30 published fresh wording cases against the fixture. The saved statuses, values, units, exportability and pass flags matched: 28 pass and 2 fail. There are 15 correctly answered cases and 13 correctly refused cases among the passes; 28/30 is a behavior-test result, not 28 correct numeric answers. The two remaining refusals are Italian `stanza` wording and `Count all numbered rooms indoors.` They are explicitly preserved in `remaining-failures.json`.
- I independently recomputed numeric/unit correctness from the published seen and historical result rows. All saved correctness flags agree: 311/311 previously changed variants; 29/29 prior wrong-unit variants; and 960 correct answers with 381 refusals across all 1,341 rephrases. Historical dev has 771 correct answers and 1,001 refusals; historical held-out has 285 correct answers and 301 refusals. These checks validate the published arithmetic, not a fresh replay of all Swiss answers by this reviewer.
- Historical regression also loses 25 previously correct dev answers and 6 previously correct held-out answers. Thirty losses are exclusion refusals and one is the supplied-label mismatch. The summary reports these losses, and raw historical rows preserve them. `remaining-failures.json` covers the seen/fresh slices, not every historical regression loss. A net increase in correct answers must not be described as no regression.

The source preserves the original parser, units, polygon calculations and selected-room safety checks by importing unchanged `src/engine.js`. The repair's runtime/export version is 1.1.0 and its geometry version is 1.0.0. The application labels the displayed original benchmark as historical 1.0.0 evidence; that distinction is appropriate.

## Claims declined

The seen 311-case repair score and original dev/held-out replays are regressions on exposed cases, not new held-out performance. The sealed packet is a small model-authored fixture probe; I decline to infer human annotation, statistically representative language robustness, model-family independence, source-disjoint generalization, unreleased-drawing performance, calibrated confidence or independent overlay accuracy from it. I did not reproduce a production build, deployment or Chief's focused IAB check and cannot attest those actions here. Full end-to-end cost remains unmeasured by this repair evidence.

The published finite-slice statement of zero incorrect answers is supported for those slices only. It does not cover the exportable wrong answers found in this review.
