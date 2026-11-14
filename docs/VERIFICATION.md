# Delivery verification

Checked 2026-11-14 17:30 Helsinki.

Application commit deployed: 965653f. Vercel production deployment stoa-bz65xxm8v-13shreyanshs-projects.vercel.app, aliased to https://stoa-eta.vercel.app. Vercel reported ready.

- Public repository https://github.com/13shreyansh/stoa-measure verified with GitHub API using the existing credential helper. Git push succeeded.
- Production HTML, JS, CSS, example DXF, evaluation JSON, PDF.js lazy chunk and PDF worker returned HTTP 200. Application asset hashes match the local build; the example matches the local licensed source.
- Runtime engine SHA-256 still matches the frozen held-out run.
- 21 analytic/safety checks passed.
- 13 DOM interaction checks passed: real example loading, room selection, green SVG boundary attributes, 13.62 and 10.15 m² calculations, refusal state, JSON export, calibrated 20 m² trace, correct source identity after switching modes, and stale-result prevention after invalid tracing. These run in happy-dom, not a browser.
- PDF.js 6.2.108 rendered the real PDF in Node using its legacy canvas adapter: one page, 1190.55 × 841.89 drawing points. Browser worker execution remains unverified in this chat.
- Production build passed. npm audit reported zero vulnerabilities after updating PDF.js.
- Mechanical design detector reported no findings. This does not replace visual inspection.
- No drawings or credentials are tracked in Git. The deployed CC BY 4.0 example is gitignored, separately attributed and intentionally uploaded as a build asset.

## Pending IAB check

This chat's in-app browser returned unavailable. Per Shreyansh's instruction, personal browsers and external browser automation are not used as fallbacks. The Chief chat has a request in bridge/from-codex.md for desktop/mobile screenshots, real drawing interaction, calibrated tracing and PDF upload through its working IAB. No browser screenshots or end-to-end browser pass are claimed here.

Recording the public two-minute video and final competition submission remain outside this build's completed actions. The demo and peer-review scripts are ready in docs/DEMO.md and docs/PITCH.md.
