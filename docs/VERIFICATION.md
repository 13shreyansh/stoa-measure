# Delivery verification

Checked 2026-11-14 17:30 Helsinki.

Application commit deployed: 965653f. Vercel production deployment stoa-bz65xxm8v-13shreyanshs-projects.vercel.app, aliased to https://stoa-eta.vercel.app. Vercel reported ready.

- Public repository https://github.com/13shreyansh/stoa-measure verified with GitHub API using the existing credential helper. Git push succeeded.
- Production HTML, JS, CSS, example DXF, evaluation JSON, PDF.js lazy chunk and PDF worker returned HTTP 200. Application asset hashes match the local build; the example matches the local licensed source.
- Runtime engine SHA-256 still matches the frozen held-out run.
- 21 analytic/safety checks passed.
- 13 DOM interaction checks passed: real example loading, room selection, green SVG boundary attributes, 13.62 and 10.15 m² calculations, refusal state, JSON export, calibrated 20 m² trace, correct source identity after switching modes, and stale-result prevention after invalid tracing. These run in happy-dom, not a browser.
- PDF.js 6.2.108 rendered the real PDF in Node using its legacy canvas adapter: one page, 1190.55 × 841.89 drawing points. The Chief subsequently verified the browser PDF upload and page rendering in IAB.
- Production build passed. npm audit reported zero vulnerabilities after updating PDF.js.
- Mechanical design detector reported no findings. This does not replace visual inspection.
- No drawings or credentials are tracked in Git. The deployed CC BY 4.0 example is gitignored, separately attributed and intentionally uploaded as a build asset.

## Completed IAB check

The Chief verified the live site in Codex's inbuilt browser at 2026-11-14 17:36 Helsinki. The report is in the shared bridge at stoa-iab-results.md. No personal browser was used for these checks.

- Real room 5.11 computed 13.62 m²; room 5.03 computed 10.15 m². Both matched the printed value, and the selected green boundaries were visually confirmed.
- Door counting returned a review request and disabled export.
- The authored six-corner practice trace with a 6 m reference yielded 20.00 m² and 20.00 m boundary length.
- Downloaded JSON was parsed and contained area 20, perimeter 20, six vertices, source SHA-256 and limitations.
- The actual real PDF rendered page 1 of 1. Scale reset to required, prior boundary/result cleared and export disabled. Reference endpoint text remained from the practice input, but no old scale was applied or quantity invented.
- Switching back restored DXF source identity, 21 numbered boundaries and the room 5.03 result.
- At 390 × 844 px, the layout stacked correctly with no horizontal overflow. Labels were readable and upload keyboard focus was visible. The browser viewport was restored afterward.

No blocking defect was found. Desktop, mobile and PDF screenshots are kept locally in .impeccable/review/desktop.jpg, mobile.jpg and pdf.jpg. They are not committed because they contain the separately licensed drawing. C-07 build and delivery verification is complete. These workflow observations do not add human area labels, a benchmark overlay correctness score, calibrated confidence or results on unreleased drawings.

Recording the public two-minute video and final competition submission remain outside this build's completed actions. The demo and peer-review scripts are ready in docs/DEMO.md and docs/PITCH.md.

## C-16 publication verification

Checked 2026-11-14 18:12 Helsinki. Copy-only application update deployed from commit 35f75a9 to stoa-9pl6nmi7j-13shreyanshs-projects.vercel.app and aliased to https://stoa-eta.vercel.app. Deterministic geometry and the original held-out results are unchanged.

- The README criterion/evidence index, source-family audit, every failed nuisance case and fresh model-review report are public in eval/c16/.
- npm run audit:c16 reproduced the original audit outputs byte-for-byte in scratch. All 195 Swiss input-format hashes were checked. It retains 311 known rephrase changes, including 29 area-to-count errors; reproduction success is not a pass for these nuisance cases.
- The separate reviewer recomputed original numeric pass totals and reproduced the audit. It declined unsupported source-generalization, confidence, independent-overlay, human-label and full-cost claims. This was a fresh model context, not a human or established different-model-family review.
- The 21 safety and 13 DOM interaction checks passed after the scoped changes. Production build passed; the mechanical detector found no issues.
- Live HTML, JS, CSS and frozen evaluation JSON returned HTTP 200. Application asset hashes match the local build, and the live JS includes the new wrong-operation warning and audit link. The public pinned audit document returned HTTP 200.
- No new C-16 browser workflow pass is claimed. The prior Chief IAB verification concerns the C-07 delivery. C-16 changes the evidence copy and documentation, not geometry or interaction behavior.
- The final builder-assembled freeze and tag audit-c16-v1 retain the publication; they are integrity metadata, not external certification or independent historical attestation.

## Reviewed repair1.3.1 delivery

Runtime61ba07f deployed READY at https://stoa-c3ocb7rbi-13shreyanshs-projects.vercel.app and aliased to https://stoa-eta.vercel.app. Live assets match the local build. Geometry and historical C-16 remain unchanged.

The separate repair directory eval/repair-v1.3.1 records34 analytic/8 DOM checks,311/311 seen repairs, all coverage regressions and honest packet/review provenance. The independent model reviewer found no new blocker within the patch's finite scope. Chief IAB then passed the real area/count/export/modifier/scope/stale-mode/fixture/mobile gate. Actual downloaded area/count JSON was parsed separately and input hashes matched. See eval/repair-v1.3.1/IAB_VERIFICATION.md and browser-proof-metadata.json.

The original277/586 score belongs to1.0.0. Current233/586 replay is seen, not new unseen evidence, and loses50 old correct answers. Additional patch packet7/8 means three numeric answers/four intended refusals/one extra refusal, not seven correct quantities. Prior packet nonoverlap was corrected20/23. No universal intent-safety, real-scan accuracy or generalization claim follows.

The README/handoff/demo now lead with human-calibrated scan tracing following Chief-reported sponsor clarifications. This is not raster automation. Video recording and final submission remain separate.
