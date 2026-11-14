# Stoa status

Updated 2026-11-14 17:30 Helsinki. Owner Codex, chat 01a1daa1-c07f-7eb2-afd5-6127a3fbc796.

Build delivered: https://stoa-eta.vercel.app . Public MIT source: https://github.com/13shreyansh/stoa-measure . Verified source/docs checkpoint 8ac69dce5dbf5cc19259bcf05a313c59369d4dc7. Application deployment commit 965653f.

Working flows: real semantic DXF room area with highlighted boundary, physical units, printed-area cross-check and source-hashed JSON proof; PDF/image rendering with human calibration and boundary tracing. Demo script and 5-minute pitch notes are ready in docs/.

Frozen held-out: 277/586 correct, 277 answered, 309 review requests. 128/180 areas. 16 held-out drawings grouped by site; paired DXF advantage explicitly disclosed. Dev 733/1772. Zero LLM calls. No human ground truth, confidence calibration or frontier-model baseline.

Checks: 21 analytic/safety, 13 DOM interactions, real PDF rendered through PDF.js 6.2.108 in Node, HTTP 200 and asset hash matches on production, npm audit clean, drawings and credentials excluded from Git.

Pending: Chief IAB desktop/mobile/real PDF check, requested via bridge/from-codex.md. This chat lacks IAB and does not use personal browsers. No browser pass or screenshots claimed. Public video recording and competition form submission have not been done. C-07 stays open for this final browser review.
