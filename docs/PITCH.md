# Five-minute peer-review notes

## 0:00–0:40 · The real job

A site engineer needs a quantity from a difficult plan. Stoa clarified that the hardest final questions focus on scanned PDF/PNG drawings and that an interactive interface is acceptable. That supports an honest assisted workflow; it does not establish how every intervention is graded.

Lead with **Calibrate & trace**. A person identifies a known dimension and wall boundary. The app computes from those points and keeps the proof. This is not automatic scan interpretation.

## 0:40–1:45 · Follow the scan measurement

Use the clearly labelled authored practice L-shape. Reference6m, area20m², perimeter20m. Show the calibrated line, six corners, formula and export. The fixture proves arithmetic, not real-world raster accuracy. A real PDF/image can be loaded client-side; page1 only for PDF. Perspective distortion, revision selection and inside-wall conventions still need review.

## 1:45–2:30 · The separate automatic path

Load the real semantic Swiss DXF. Ask room5.11 area, about13.62m², then room5.03, about10.15m². Show green boundaries, physical units, coordinates and input-hashed JSON. Printed-area agreement shares the source geometry and is not independent ground truth.

## 2:30–3:20 · Correctness repair

Engine1.3.1 recognizes area before generic how-many counts, refuses unsupported modifiers/scopes, and binds export to question, operation and units. Show a wrong-unit/arithmetic refusal and stale-question export disabling. Earlier candidates were rejected by review and preserved. All311 published old failure cases now match references as seen regressions.

The patch has34 analytic and8 DOM regression checks. An additional sealed model-authored packet passed7/8 behaviors, with one extra refusal. These are finite analytic checks, not human labels or a representative language score. The parser is intentionally narrow and loses wording coverage.

## 3:20–4:15 · What the numbers mean

Historical engine1.0:277/586 correct on16 held-out Swiss drawings,277 answered,309 refused. PDF questions were paired with DXFs. The current replay uses exposed data and is not new held-out evidence; it loses50 previously correct answers to refusals. Show the README's separate versioned tables. No measured real-scan accuracy, independent human room measurements, calibrated confidence, frontier-model comparison or unreleased-drawing result exists.

Inference uses no model calls. Hardware, hosting, reviewer-model and human tracing work were not priced. A zero inference-cost numerator is not zero total cost.

## 4:15–5:00 · Where this goes

Better extraction can propose boundaries and labels later. The same deterministic calculation and portable proof can verify them. Today the human-calibrated path is working and the automatic DXF path is explicitly narrower. No claim of piping/multi-sheet grading support or raster automation.

Live: https://stoa-eta.vercel.app
Source/evidence: https://github.com/13shreyansh/stoa-measure

Public video recording and final competition submission have not been performed by this build chat.
