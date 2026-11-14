# Intent repair protocol, engine 1.1.0

Authorized correctness repair after C-16. Retain audit-c16-v1 and every original evaluation result/failure byte-for-byte. Keep the original geometry/parser module src/engine.js unchanged; build a new intent module and wire the app to version 1.1.0. Do not describe seen regression results as unseen performance.

## Behavior

Recognize area expressions, including square metres/meters, before generic how-many counting. Explicit requests for both count and area, multiple conflicting targets, negation, arithmetic, unsupported requested units and unresolved exclusions request review. Quoted labels are target data, not control words. Exclusion words match complete words, so Wohnen does not trigger ohne. Preserve metre-unit deterministic polygon calculations and existing boundary/scale/label checks.

An answered area request must carry m²; a count request must carry count. Export must verify this unit/intent binding, use the actual computed question and engine version, and refuse stale or unresolved results. New intent support is a small rules-based vocabulary, not general natural-language understanding.

## Evidence layers

1. Meaningful unit/intent regressions on an original analytic fixture. Cover how-many area versus count, Wohnen/exclusion, multi-target/multi-operation ambiguity, requested unsupported units, quoted control words, and export unit/stale-query guards.
2. Seen-case regression on all 311 published C-16 changed rephrases. Score repair against the intended reference numeric type/value, not against an old refusal, and also report outcome invariance on the whole 1,341 authored rephrase set. These cases are known. Preserve remaining failures and distinguish numeric correctness from retention of a refusal.
3. Original dev/held-out QA replay, if run, is a regression on previously exposed data, never new held-out performance. Write separate outputs only.
4. A separate fresh agent receives only intended behavior and analytic fixture facts, without implementation, prior prompts or builder conversation. It authors a sealed 24–32-case wording packet in work/. Builder does not inspect it before freezing engine 1.1.0 and tests. Record packet/engine hashes and honest model-authored provenance. Reveal once, report successes and remaining failures without modifying this frozen engine in response. This is not a human paraphrase corpus or a statistically representative unseen dataset.

## Analytic fixture

Metre-unit original rectangles: Bad room 1.01 area20, Bad room1.02 area6, Wohnen room1.03 area24, outdoor Balkon room1.04 area6. Apartment A contains all. Indoor total50. Bad group area26/count2. Printed area agrees by construction; this is not independent human ground truth.

## Freeze and delivery

Keep original audit evidence unchanged, with the historic tag as the reproducible source snapshot. Distinguish new engine, geometry module and current UI hashes. Freeze before revealing the fresh wording packet. Publish both repair and remaining-failure records and preserve the old P1/P2 report. Run appropriate DOM/export checks and build. Deploy the new version, then ask the Chief's IAB for a focused area/count/export/stale-input check. No final competition submission or Discord action.
