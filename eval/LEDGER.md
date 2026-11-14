# Evaluation ledger

All timestamps use Helsinki time. Results are from deterministic local code runs, not human labels or model judging.

## Protocol

The spec was written before engine evaluation. Split by SHA-256 of the site id: first byte modulo 4 equals zero is held-out. All formats and translated questions stay on the same side. See split-manifest.json. Dev uses 49 drawings / 1,772 questions. Held-out uses 16 drawings / 586 questions. All are Swiss Dwellings. The other 5,632 preview records are outside the automated parser scope.

Questions name PDF files; this evaluation supplies their paired DXF. This materially easier input is explicit. The runtime never reads questions.jsonl or reference answers. Counts require exact equality; areas allow the supplied ±2% tolerance. English/translated pairs are not independent examples.

## Iterations

| Version | Dev correct / all | Answered | Correct / answered | Decision |
|---|---:|---:|---:|---|
| First polygon engine | 1104/1772 | 1190 | 1104/1190 | Reject overbroad symbol counts and query routing |
| Frozen 1.0.0 | 733/1772 | 733 | 733/733 | Keep narrower scope; request review on ambiguity |

The first engine made 86 wrong answered outputs. The agent inspected at least the first 40 wrong traces. This was agent error analysis, not annotation by a person. Repeated failures were door double-leaf symbols counted as doors, bathtub words confused with bathroom rooms, fragmented apartment outlines, missing room labels, duplicate room numbers and incomplete group totals. The change deliberately traded coverage for fewer wrong quantities. No reference quantities were hardcoded.

A bounding-box ablation uses the same router and safety rules as the frozen engine, replacing only polygon area with the axis-aligned box area. It got 511/1,772 dev questions right versus 733/1,772 for polygon area. The deliberately dumb baseline always returns 1 for counts and the first printed area for area questions; it got 232/1,772. The baseline is not a frontier model.

## Frozen held-out run

Engine SHA-256: `c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8`.
Question file SHA-256: `03b857a7ff91c63c81288081b526548ff4cfdf116e84f335f298906613168a70`.

| Metric | Held-out result |
|---|---:|
| Correct / all questions | 277/586 = 47.27% |
| Answered / all questions | 277/586 = 47.27% |
| Correct / answered | 277/277 |
| Review requests | 309 |
| Area correct / all area questions | 128/180 |
| Exact counts correct / all count questions | 149/406 |
| Dumb baseline correct / all | 100/586 |
| Bounding-box ablation correct / all | 195/586 |
| Local query median / p95 | 0.0065 / 0.0457 ms |
| Total parsing time for 16 drawings | 62.93 ms |
| Model calls / inference cost | 0 / $0 |

The engine was frozen before this first held-out run. It was not changed in response to those results. These timings use Node performance.now locally, with parsed models cached. They exclude browser rendering, loading, networking, PDF rendering and human tracing. Inference cost excludes hosting and human work. No measured comparison with a frontier model was run. No calibration, independent room-area measurement or overlay correctness score was collected.

## Final dev refusal taxonomy

These are code-observed first refusal reasons, counted over the final dev run. A refusal is not automatically proof that a question was impossible.

- 248: Some numbered spaces have no room label. A complete group or indoor total cannot be verified.
- 180: This takeoff needs evidence this parser does not extract. Use calibrated tracing for area or boundary length; account for openings separately.
- 130: Supported questions: room 1.01 area, total indoor area, area/count of rooms labelled '…', apartment A area, and door count. This question needs another method.
- 98: Door swing arcs can represent double leaves and duplicated symbols. Exact door counts need review.
- 98: Window strokes need symbol grouping. I will not treat every line as a separate window.
- 70: That apartment boundary could not be located.
- 56: No matching room label was found. Zero cannot be verified from a missing label.
- 54: Room numbers are duplicated on this sheet. A complete group cannot be verified.
- 48: This exclusion is not supported. Select the exact rooms in the drawing.
- 45: Apartment outlines are fragmented or unlabelled. Count needs review.
- 8: Several boundaries share a room number. This may be a multipart room; review it before summing.
- 2: Some matching labels cannot be linked to a unique boundary. A complete total needs review.
- 2: No eligible room boundaries found.

## Analytic and safety fixtures

21 checks passed. The original L-shaped practice plan is 6 × 4 m minus a 2 × 2 m corner: 20 m² area and 20 m perimeter. Tests cover clockwise orientation, coordinate translation, scale changes, invalid boundaries, absent scale, ambiguous unsupported tasks and scale/printed-area disagreement. These do not replace real scan validation.

## Remaining risks

The apparent perfect precision among 277 answered held-out records is a small correlated sample from one generated drawing family. It is not a probability of correctness or a production guarantee. Unknown conventions, text positions, nested polygons and holes can break geometry assumptions. Geometry and printed areas can agree and both be wrong because they share a source. A source with missing labels can omit rooms. Query routing is rules-based with a small English/German/French/Italian vocabulary; unseen wording can fail. Exact fixture, window and door counts, piping and IFC remain unsupported. Scans require a person to calibrate and trace. Perspective distortion, thick walls and ambiguous wall faces are unresolved.

No reviewer should use these numbers to justify an unattended purchase. The sponsor evaluates unreleased drawings, which have not been tested.

## Delivery verification

Production build passed. UI interaction checks and live HTTP asset checks are recorded separately in docs/VERIFICATION.md. The Chief completed the separate IAB desktop/mobile/PDF workflow check on 2026-11-14 at 17:36 Helsinki. All requested workflows passed, with no blocking defect. This UI check is not a benchmark-wide overlay correctness measurement, independent area ground truth or evidence on unreleased drawings. The frozen engine and evaluation results are unchanged.
