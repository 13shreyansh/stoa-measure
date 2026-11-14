# Handoff updates after the C-16 freeze

This supplement records later context. It does not modify the frozen `audit-c16-v1` evidence, geometry engine or evaluation results. Read it alongside HANDOFF.md.

## 14 November 2026, 18:14 Helsinki: closet doors in one sample

The Chief relayed a Stoa clarification from Pyry in #stoa, responding to a participant questioning a ground-truth door count of 5:

> Note that some of those doors are closet doors

[Specific Discord reply](https://discord.com/channels/1268184974784336004/1564622781994508369/1571196726826639371).

This identifies a possible counting distinction in that sample. It does not explicitly define every valid door, establish that all closet doors count, or change the general judging rubric. This build chat has not independently inspected the drawing or reply in IAB.

The delivered engine already requests review for door counts. Keep that behavior and the frozen audit unchanged. A future door-counting version should record the sample's annotation convention and distinguish entrance, interior and closet doors, as well as door leaves and swing arcs, before claiming agreement. Do not infer a universal counting rule from this reply or retroactively reinterpret the existing benchmark results.

## Engine 1.1.0 correctness repair

A separate authorized repair addresses area/count intent, complete-word exclusions and stale/unit-mismatched exports. The new engine is src/engine-v1.1.js; original geometry and audit evidence remain unchanged. Read eval/repair/README.md before describing its results. Seen regression successes and freshly authored model wording probes are separate; the old held-out set is not unseen for this replay. Fresh probes passed28/30, with two refusals. Historical replay also lost31 previously correct answers to conservative refusal. Do not erase these limitations or claim complete natural-language support.

## Final engine1.3.0 candidate

Version1.1 was rejected for additional P1 request-modifier errors. Version1.2 was rejected for coverage/punctuation regressions. Their source, packets and results are preserved under separate rejected tags. Current source uses engine-v1.3.js with whole-request checks and stale-mode export guarding. Read eval/repair-v1.3/README.md:311/311 seen failures repaired,29 analytic/8 DOM checks, final sealed packet21/24 with3 safe refusals, historical replay coverage losses disclosed. No old held-out replay is called unseen. Geometry and original C-16 artifacts remain unchanged. Focused Chief IAB verification follows deployment.

## Final patch1.3.1

An independent review caught1.3's indoor-total/category scope override. Patch1.3.1 explicitly refuses an indoor-total selector combined with a label/category/room/apartment subset; ordinary bathroom area remains26m² on the fixture. The prior packet overlap report is corrected separately: one test literal was already known, so1.3 nonoverlap is20/23. An additional8-case packet was sealed before patch freeze and passed7/8, with one safe refusal. All prior packets are seen for current replays. Read eval/repair-v1.3.1/README.md. Original audit evidence/geometry remain immutable. Current34 analytic and8 DOM checks pass; focused Chief IAB review follows deployment.

## 14 November2026,18:43–18:45 Helsinki: hardest questions focus on scans

Chief IAB relayed Eino's18:43 reply: "Mix, but the most challenging part has been scanned images (pdf or png) - the hardest questions will be focusing on those". Source https://discord.com/channels/1268184974784336004/1564622781994508369/1571203993668034652 . At18:45 he said an interactive interface is acceptable and accuracy is judged against the specific blueprint: https://discord.com/channels/1268184974784336004/1564622781994508369/1571204530547466330 . This build chat did not independently inspect those replies.

Lead the README/demo with human-calibrated PDF/image tracing, with a person supplying known scale and wall boundary. Do not call it automatic raster understanding or use the DXF benchmark as scan evidence. The authored20m² practice plan proves arithmetic only. The single-page PDF limitation remains. The clarification does not establish every human-intervention scoring rule or an explicit multi-sheet/piping grading answer. No speculative parser expansion is authorized by this update.
