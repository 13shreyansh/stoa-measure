# Stoa build handoff

Owner: Codex. Task C-07, team The CS Guy. Chat 01a1daa1-c07f-7eb2-afd5-6127a3fbc796.
Workspace: /Users/shreyansh/Documents/ChatGPT/Junction/stoa/
Live project: https://stoa-eta.vercel.app
Public repo: https://github.com/13shreyansh/stoa-measure
Vercel team/project: 13shreyanshs-projects/stoa.

## Current implementation

Browser-only JavaScript. Semantic ASCII DXF room geometry, units, labels, deterministic area, cross-checks, green boundary overlays and source-hashed JSON proof export. PDF/image calibration and manual polygon tracing. Page 1 only for PDF. Authored practice L-shape has area 20 m² and perimeter 20 m.

## Frozen evaluation

Engine SHA-256 c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8. Do not silently change the engine and keep its old claim.
Dev: 733/1772 correct, 733 answered. Held-out: 277/586 correct, 277 answered and 309 review requests. Held-out areas 128/180. Baseline 100/586, bbox ablation 195/586. Zero model calls. Semantic Swiss DXF subset only. No human ground truth, inference comparison, calibration or measured overlay correctness. See eval/LEDGER.md and numeric traces.

21 analytic/safety checks and 13 DOM interaction checks passed. DOM checks are not browser verification. Production build passed. Browser visual and mobile verification requested from the Chief IAB chat in bridge/from-codex.md. IAB in this chat returned unavailable.

## Required follow-through

Source pushed and final application deployed at commit 965653f. Live HTTP assets and PDF worker hashes verified, PDF.js updated, audit clean. See docs/VERIFICATION.md. Incorporate Chief IAB findings when bridge/stoa-iab-results.md appears. Video recording remains Shreyansh's task; scripts are in docs/DEMO.md and docs/PITCH.md. Do not submit any competition form without explicit approval.

## Browser and account rules

Use only Codex's inbuilt browser, browser id iab. Never attach to personal Chrome/Safari/Edge or launch an external browser. When IAB is unavailable, continue local tools and use authorized signed-in connectors or secret-safe CLI operations as necessary. For a UI-only task, write the exact URL, action and expected result to bridge/from-codex.md for the Chief's working IAB.

GitHub git credential helper works. The old gh keychain credential returned 401; do not reuse it or expose credentials. Vercel CLI existing auth works. No credentials are stored in this repo or bridge.

## Data and deployment

Drawings are excluded from Git. `public/samples/example.dxf` is a CC BY 4.0 drawing copied from the official local preview for deployment, with credit in the UI and THIRD_PARTY.md. `.vercelignore` allows the licensed example in deployment; `.gitignore` excludes it from source control. Do not commit drawings. Other preview licenses may include NC/SA/ND.

Use node scripts/prepare-sample.mjs with STOA_DATA pointing to the extracted preview. Then npm ci, npm run build and Vercel CLI deploy. The main runtime does not read answer keys or evaluation reference answers.

Do not edit other challenge projects or board rows. Append progress to bridge/from-codex.md. C-11/C-12 belong to the Chief; Spread belongs to its dispatcher chat.
