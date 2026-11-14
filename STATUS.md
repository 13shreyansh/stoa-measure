# Stoa status

Updated 2026-11-14 17:37 Helsinki. Owner Codex, chat 01a1daa1-c07f-7eb2-afd5-6127a3fbc796.

Build delivered: https://stoa-eta.vercel.app . Public MIT source: https://github.com/13shreyansh/stoa-measure . Verified source/docs checkpoint 8ac69dce5dbf5cc19259bcf05a313c59369d4dc7. Application deployment commit 965653f.

Working flows: real semantic DXF room area with highlighted boundary, physical units, printed-area cross-check and source-hashed JSON proof; PDF/image rendering with human calibration and boundary tracing. Demo script and 5-minute pitch notes are ready in docs/.

Frozen held-out: 277/586 correct, 277 answered, 309 review requests. 128/180 areas. 16 held-out drawings grouped by site; paired DXF advantage explicitly disclosed. Dev 733/1772. Zero LLM calls. No human ground truth, confidence calibration or frontier-model baseline.

Checks: 21 analytic/safety, 13 DOM interactions, real PDF rendered through PDF.js 6.2.108 in Node, HTTP 200 and asset hash matches on production, npm audit clean, drawings and credentials excluded from Git.

C-07 build and delivery verification DONE. Chief IAB checks passed at 2026-11-14 17:36 Helsinki: real room areas and green overlays, ambiguous-door refusal, calibrated 20 m² / 20 m trace, downloaded JSON, actual PDF page rendering and scale reset, restored DXF identity, and 390 px mobile layout without horizontal overflow. Screenshots are local in .impeccable/review/ and are not committed. This UI verification does not expand the frozen evaluation scope. Public video recording and final competition submission remain pending.
