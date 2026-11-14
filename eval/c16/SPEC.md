# C-16 frozen audit protocol

This is an additional audit of the delivered engine, not a retuning run. The engine SHA-256 must remain c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8. Do not overwrite the original dev/held-out summaries or manifests. No new source-generalization, confidence, compliance, frontier-model or human-review claim follows from this audit.

## Grouping and source audit

Recompute the existing split using canonical site identity, independent of Q&A row position. Verify no whole site, building/project or drawing identity crosses dev/held-out. Enumerate all PDF/DXF/PNG versions of each Swiss drawing and keep them in the same group. Check adjacent English/translated question pairs with matching path, reference quantity, type and unit stay together. Report how many pairs this structural check actually covers.

Report every preview source/family separately, with questions, unique paths and actual scored coverage. Swiss Dwellings alone was evaluated. Explicitly mark cross-source holdout/generalization as unestablished; do not assign unrun refusals or accuracy to the other sources. A parse-only probe of every non-Swiss DXF may test input rejection but is not a question-answer benchmark. Do not treat a lack of source diversity as a successful source-disjoint split.

## Nuisance checks, dev only

Use only the existing dev cases and content. Freeze variants before the first run. A stable outcome preserves status, unit, numeric value within 1e-8 relative/absolute tolerance, and selected entity/room identities. Ignore text order, explanatory phrasing and input display name. Invariance does not prove a baseline answer correct.

- Rename identical drawing bytes to untitled.dxf, floor-42.dxf and site999999_bldg999999_floor999999.dxf. All queries should remain stable. The runtime filename changes; canonical dataset group identity does not.
- Reverse all dev question rows. Evaluate using cached parsed models. Results must remain stable by original record index, including refusals.
- Reverse and seeded-shuffle complete DXF model-space entity chunks. Geometry, labels, units and content remain fixed. All dev queries should remain stable.
- For English numbered-room area cases, retain the same ID and ask: `Give me the area of room {id} in m².`, `Room {id} net floor area in m²?`, and `How many square metres is room {id}?`.
- For English quoted room-label counts, retain the exact label and ask: `Count rooms labelled '{label}'.`, `Number of rooms labelled '{label}'?`, and `Total rooms named '{label}'?`.
- For English quoted room-label area totals, retain the exact label and ask: `Sum the area of rooms labelled '{label}'.`, `What is the total area of rooms named '{label}'?`, and `How many square metres do all rooms named '{label}' cover?`.

Publish every failed case by canonical source/drawing/record index and authored nuisance question. Distinguish refusal changes from answer/unit/selection changes. Do not fix the engine after observing the audit. The authored nuisance prompts are not independent human labels or a random natural-language sample.

## Cost per correct answer

Use the existing frozen held-out denominator of 277 correct answers, not just all requests or only answered cases without scope. Report inference/API spend divided by correct answers as $0/277 = $0 for this deterministic run. Also report the 586 requests, 309 refusals and zero model calls. Hardware, energy, hosting, storage, network and human tracing costs were not measured and must not be reported as zero. End-to-end cost per correct, visually grounded answer is unknown; no independent overlay grading was collected.

## Review and freeze

Write machine-readable results, readable source/family and nuisance tables, failures and a content-hashed freeze manifest. Record spec, audit runner, engine, original summaries and dataset question hashes. A fresh reviewer gets only this protocol, the original evaluation spec, implementation source and committed evidence; no builder conversation or bridge logs. The reviewer must decline unsupported claims. Record reviewer type and actual provenance; no human or different-model-family independence may be implied without evidence.
