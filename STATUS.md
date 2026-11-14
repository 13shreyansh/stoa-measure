# Stoa status

Current runtime: engine1.3.1, geometry1.0.0, application commit61ba07f, deployed at https://stoa-eta.vercel.app. Original C-07 delivery and C-16 audit remain DONE. The separate correctness repair has passed source/model/DOM/build checks and has passed focused Chief IAB verification; the bounded correctness repair is DONE. Original frozen benchmark paragraphs below describe engine1.0 only; current replays are seen regressions. Lead with human-calibrated scans, not a raster-automation claim.

Updated 2026-11-14 18:50 Helsinki. Owner Codex, chat 01a1daa1-c07f-7eb2-afd5-6127a3fbc796.

Build delivered: https://stoa-eta.vercel.app . Public MIT source: https://github.com/13shreyansh/stoa-measure . Verified source/docs checkpoint 8ac69dce5dbf5cc19259bcf05a313c59369d4dc7. Application deployment commit 965653f.

Working flows: real semantic DXF room area with highlighted boundary, physical units, printed-area cross-check and source-hashed JSON proof; PDF/image rendering with human calibration and boundary tracing. Demo script and 5-minute pitch notes are ready in docs/.

Frozen held-out: 277/586 correct, 277 answered, 309 review requests. 128/180 areas. 16 held-out drawings grouped by site; paired DXF advantage explicitly disclosed. Dev 733/1772. Zero LLM calls. No human ground truth, confidence calibration or frontier-model baseline.

Checks: 21 analytic/safety, 13 DOM interactions, real PDF rendered through PDF.js 6.2.108 in Node, HTTP 200 and asset hash matches on production, npm audit clean, drawings and credentials excluded from Git.

C-07 build and delivery verification DONE. Chief IAB checks passed at 2026-11-14 17:36 Helsinki: real room areas and green overlays, ambiguous-door refusal, calibrated 20 m² / 20 m trace, downloaded JSON, actual PDF page rendering and scale reset, restored DXF identity, and 390 px mobile layout without horizontal overflow. Screenshots are local in .impeccable/review/ and are not committed. This UI verification does not expand the frozen evaluation scope. Public video recording and final competition submission remain pending.

## C-16 scoped audit

C-07 remains DONE. The C-16 follow-up adds a criterion/evidence index, grouped/source-family audit, dev-only nuisance checks, scoped cost per correct answer and a context-isolated evidence review. The geometry engine and original held-out results remain frozen.

Observed: 10,632 filename/row/entity-order outcomes unchanged. Authored rephrases changed 311/1,341 outcomes, including 29 area questions answered as counts. These failures are published, not fixed by retuning. Only Swiss Dwellings was question-scored; cross-source generalization is unestablished. Inference/API charges per correct held-out answer are $0/277; hardware, hosting, human and total costs remain unknown.

Current C-16 evidence is in eval/c16/. A context-isolated model reviewer reproduced it byte-for-byte and supported scoped claims, while flagging published P1/P2 routing defects and refusing unsupported generalization/confidence/visual-accuracy/total-cost claims. C-16 Stoa follow-up is DONE: evidence published, fresh model review recorded, and the copy-only application update deployed from 35f75a9. Final publication retained under audit-c16-v1. Known P1/P2 routing failures remain disclosed and unfixed; no engine retuning occurred. No final submission or Discord action is authorized by this task.

## Repair1.3.1 closure

Chief IAB gate PASSED for exact area/count exports, unsupported modifiers and conflicting scopes, stale edit/mode guarding, fixture upload and390px layout. Build owner parsed actual downloads and matched their source hashes. Runtime61ba07f is live. Read eval/repair-v1.3.1/README.md and IAB_VERIFICATION.md for34 analytic/8 DOM checks,311 known-case repairs, extra packet7/8 and remaining coverage losses. No new unseen drawing benchmark. Original audit immutable. Human-calibrated scan tracing leads current documentation; automatic DXF evidence stays separate. Video/final submission pending.
