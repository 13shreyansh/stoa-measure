# Measure

Current engine **1.1.0** repairs the area/count routing and stale-export defect. [Repair evidence and remaining failures](eval/repair/README.md): all 311 published failure cases now match their numeric references, as **seen regressions**; a fresh model-authored analytic packet passed 28/30, with two refusals. No new unseen drawing benchmark is claimed.

## Judge quick path

| Criterion | Actual proof | Scope and limit |
|---|---|---|
| Accuracy, 25% | [Frozen benchmark](eval/LEDGER.md#frozen-held-out-run), [numeric traces](eval/results/heldout-traces.json), [grouping/source audit](eval/c16/README.md#whole-drawing-and-source-grouping) | Historical engine1.0.0: 277/586 correct, 277 answered, 309 review requests; 16 held-out sites in one semantic DXF source. No cross-source result. |
| Visual reasoning, 25% | [Live room overlay](https://stoa-eta.vercel.app), [completed IAB workflow checks](docs/VERIFICATION.md#completed-iab-check), [demo 0:15–0:45](docs/DEMO.md) | Actual room overlays and exported coordinates checked in IAB; no benchmark-wide independently graded overlay score. Demo script timing is a plan, not a recorded video timestamp. |
| Creativity, 25% | [Deterministic geometry implementation](src/engine.js), [calibrated tracing workflow](docs/VERIFICATION.md#completed-iab-check) | Inspectable computation, boundary record and human-assisted fallback. No measured novelty or benchmark-win claim. |
| Low inference cost, 25% | [Scoped cost per correct answer](eval/c16/README.md#cost-per-correct-answer-scoped), [raw cost fields](eval/c16/results.json) | $0 model inference/API charges / 277 correct benchmark answers; hardware, hosting and human costs unmeasured. |

**Historical engine1.0.0 audit failure:** 29 authored area-total rephrases returned a room count instead of m². Engine1.1.0 repairs these 29 seen cases; the original failures remain immutable. [All 311 changed rephrases and source limitations are published](eval/c16/README.md). The historical engine is frozen at audit-c16-v1; neither that audit nor the repair establishes general language robustness.

[Open the live workbench](https://stoa-eta.vercel.app) · [Evaluation ledger](eval/LEDGER.md) · [2-minute demo](docs/DEMO.md)

A site engineer asks for a room area. Measure computes the polygon area from an ASCII DXF, highlights the exact boundary, shows the drawing units and printed-area cross-check, and exports the calculation with coordinates and an input hash. No LLM is involved.

For a PDF or image, set a known reference length and trace a room. The app computes area and boundary length from those human-supplied points. Uploads stay in your browser. A sample L-shaped practice drawing has a known 20 m² area.

## Try it

1. Open the real drawing. Ask `What is the area of room 5.11?` The answer is about 13.62 m², computed from coordinates.
2. Click a room or inspect its coordinates. Download the calculation and boundary as JSON.
3. Ask for a door count or a piping takeoff. The app requests review because the evidence is insufficient.
4. Choose **Calibrate & trace**, open the practice plan, set reference endpoints `150,100` and `750,100` to 6 m, and trace the six corners. Expected area 20 m², boundary length 20 m.

Automatic input currently requires DXF `ROOM_OUTLINE`, `ROOM_TEXT` and physical `$INSUNITS`. Generic DWG, IFC, PDF-only extraction, automatic scan segmentation, piping interpretation and calibrated confidence are not implemented. PDF tracing loads page 1 only. Perspective photographs need rectification before measurement. Boundaries may represent different measurement conventions; verify them before ordering.

## Results

Historical engine1.0.0 frozen held-out test: **277 correct / 586 questions**, with **277 answered and 309 review requests**, across 16 drawings on held-out sites. The dumb baseline got 100/586. Area questions: 128/180 correct, with 128 answered. These are partial capability results on one semantic DXF source, not 100% drawing understanding. English and translated questions are paired. PDF questions use their matching DXF, which is an input advantage. No human labels or frontier-model inference comparison were collected. The printed-area check shares the source geometry.

See the ledger for dev iterations, scope, error analysis, latency measurement and the exact engine hash. All 7,990 preview questions were not evaluated as supported tasks. Across dev and held-out, the parser answered 1,010 of 7,990 preview records; the other source formats remain outside the automated path.

## Run locally

Requires Node.js 22.12+.

```sh
npm ci
# Optional: copy a licensed sample from your extracted official dataset.
STOA_DATA=/absolute/path/junction-dataset-preview node scripts/prepare-sample.mjs
npm run dev
npm run build
```

The app also works with your own supported DXF or uploaded PDF/image. Without the optional sample, the example button reports that the file is absent. Drawings are intentionally gitignored.

## Reproduce evaluation

```sh
# Verify hashes and reproduce the C-16 audit in scratch, retaining known failures.
STOA_DATA=/absolute/path/junction-dataset-preview npm run audit:c16
# Current repair tests and explicitly seen historical regressions.
npm run test:repair
STOA_DATA=/absolute/path/junction-dataset-preview npm run eval:repair
STOA_DATA=/absolute/path/junction-dataset-preview npm run test:safety
npm run test:ui
```

The frozen publication is retained under Git tag `audit-c16-v1`. The original benchmark runner remains available as `node eval/run.mjs dev` or `heldout`, but it writes output files and new timing values. Use a separate checkout for a new benchmark run rather than overwrite the frozen evidence. The audit command above uses scratch space and preserves the publication.

The evaluator groups every format and language of a drawing by site before splitting. `eval/results` contains numeric traces and summaries; local `work/` contains the licensed question text for inspection. The runtime has no access to reference answers. A split manifest and engine SHA-256 make runs inspectable. Do not tune on the held-out set.

Deploy from the source directory with the prepared sample using Vercel CLI. The production project is `stoa` in `13shreyanshs-projects`. `.vercelignore` governs upload assets; Git still excludes drawings. No server credentials or model keys are required.

All project code was authored during Junction 2026 for The CS Guy. Code is MIT. Third-party data retains its licenses; see [THIRD_PARTY.md](THIRD_PARTY.md). No drawings are committed.
