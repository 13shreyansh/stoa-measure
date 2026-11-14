# Measure

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

Frozen held-out test: **277 correct / 586 questions**, with **277 answered and 309 review requests**, across 16 drawings on held-out sites. The dumb baseline got 100/586. Area questions: 128/180 correct, with 128 answered. These are partial capability results on one semantic DXF source, not 100% drawing understanding. English and translated questions are paired. PDF questions use their matching DXF, which is an input advantage. No human labels or frontier-model inference comparison were collected. The printed-area check shares the source geometry.

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
STOA_DATA=/absolute/path/junction-dataset-preview node eval/run.mjs dev
STOA_DATA=/absolute/path/junction-dataset-preview node eval/run.mjs heldout
STOA_DATA=/absolute/path/junction-dataset-preview node eval/safety.mjs
npm run test:ui
```

The evaluator groups every format and language of a drawing by site before splitting. `eval/results` contains numeric traces and summaries; local `work/` contains the licensed question text for inspection. The runtime has no access to reference answers. A split manifest and engine SHA-256 make runs inspectable. Do not tune on the held-out set.

Deploy from the source directory with the prepared sample using Vercel CLI. The production project is `stoa` in `13shreyanshs-projects`. `.vercelignore` governs upload assets; Git still excludes drawings. No server credentials or model keys are required.

All project code was authored during Junction 2026 for The CS Guy. Code is MIT. Third-party data retains its licenses; see [THIRD_PARTY.md](THIRD_PARTY.md). No drawings are committed.
