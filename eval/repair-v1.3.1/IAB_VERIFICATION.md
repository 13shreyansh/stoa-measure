# Chief IAB verification, engine1.3.1

Chief verified the live site using only Codex IAB on14November2026, approximately18:48–18:50 Helsinki. Application commit61ba07f; public https://stoa-eta.vercel.app. The report is retained in the shared bridge at stoa-repair-iab-results.md. This is a focused workflow gate, not new benchmark ground truth.

- Real room5.11 square-metre request returned13.62m² with its boundary. Actual downloaded JSON records engine1.3.1, geometry1.0.0, area intent, unitm² and value13.617073235712025.
- Real apartment count returned2count and actual downloaded JSON records count intent/unit/value2.
- The build owner separately parsed both Chief-downloaded files. Their input hashes match the deployed original example and the exact computed questions match the nested results. Only non-geometric metadata is published in browser-proof-metadata.json; no drawing/vertices are committed.
- Unsupported sq ft, arithmetic plus5m², a second kitchen target and the conflicting whole-floor/bathroom scope returned review with export disabled.
- Editing room5.11 to5.03 without calculation disabled export. Switching to tracing and back kept it disabled.
- Real chooser upload of the authored fixture worked: bathrooms26m², indoor/bathroom conflict refused, indoor total50m². This is an authored analytic fixture, not a real-drawing area label.
- Real Stanza group requests and single-room count requests refused. They remain coverage limitations, not passing count cases.
- At390×844, no page horizontal overflow was observed; current/geometry/historical version disclosure was readable. Viewport override was cleared.

Desktop and mobile captures remain local at bridge/proof/stoa-repair-desktop.jpg and stoa-repair-mobile.jpg. The desktop image shows the authored50m² fixture, not a Swiss benchmark quantity. No screenshot, drawing or complete geometry export is committed.

Original geometry, audit-c16-v1 and old results/failures remain unchanged. Current233/586 historical replay is exposed regression data with50 lost old correct answers, not new unseen evidence. The IAB gate supplies no human area labels, source-generalization, calibrated confidence or independent benchmark-wide overlay accuracy. No video or competition submission was performed.
