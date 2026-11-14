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
