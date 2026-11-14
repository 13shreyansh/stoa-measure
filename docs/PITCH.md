# Five-minute peer-review notes

## 0:00–0:40 · The job

A site engineer has to order materials. A number without a boundary is hard to trust. Ask the audience which they can verify faster: a chat answer or the room highlighted on the actual plan.

Open the workbench, load the real Swiss Dwellings example and ask for room 5.11. Explain that the input is an existing semantic DXF, not an automatically interpreted photograph.

## 0:40–1:40 · Follow the evidence

Room 5.11 measures about 13.62 m². Show the boundary, metre units, computed area, printed area and coordinates. Select room 5.03 to prove the question recomputes the selection. Download a calculation JSON with source SHA-256 and vertices.

The algorithm uses the shoelace formula. It reads the DXF's physical units and matches a room number to a closed polygon. Printed area agreement is useful but shares the underlying geometry. It is not independent ground truth.

## 1:40–2:30 · Show the deliberate limit

Ask for a door count. The first implementation counted swing arcs and got double-leaf doors wrong. We removed the claim. Totals with incomplete room identity also request review. The lesson is that a drawing convention is evidence only within its scope.

If a judge asks for all bathrooms, ask using the exact label on the drawing. A missing-label warning may block the total. Show that failure honestly. The engineer can inspect rooms individually or use calibrated tracing.

## 2:30–3:20 · What the evaluation means

49 dev drawings, 16 held-out drawings, grouped by site. Same drawing formats and translated questions stay together. Historical frozen engine1.0 got277/586 held-out questions correct, answering 277 and refusing 309. For areas, 128/180 passed. The dumb baseline got 100/586 across all questions. A bounding-box ablation got 195/586; polygon geometry got 277/586 with the same router.

Important limits: one semantic source; PDF questions paired with their DXFs; translated questions correlated; no independent human room measurements; no frontier-model comparison; no measured overlay correctness; no calibrated statistical confidence; no sponsor unreleased drawings tested.

## 3:20–4:15 · A path for difficult sheets

Open the authored practice plan in Calibrate & trace. Use a known six-metre line and trace the L shape, expected 20 m² and 20 m boundary length. A real PDF or image can be uploaded without leaving the browser. Only PDF page 1 is rendered.

This is human-assisted measurement. Scale error is squared in area. Perspective-distorted photos need rectification first. Door deductions for baseboards, holes and wall-face conventions still require a person.

## 4:15–5:00 · Why this lasts

A stronger vision model can propose better boundaries or labels. The measurement and verification path remains the same: explicit geometry, known units, checks and a portable record. We can replace the extraction step without asking a model to invent area arithmetic.

Next work: automatic vector PDF extraction, tiled scan OCR and boundary proposals, hole/multipart handling, and independent human measurement labels. Keep these as future work, not shipped features.

Repository: https://github.com/13shreyansh/stoa-measure
Live: https://stoa-eta.vercel.app

Current engine1.3.1 repairs intent/export defects; current replay numbers are seen regressions. See eval/repair-v1.3.1/README.md for coverage losses and fresh model-authored packet results. No final submission or public video has been uploaded by this build chat.
