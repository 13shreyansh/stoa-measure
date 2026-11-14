import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import {
  answerDrawing,
  canExportAnswer,
  VERSION,
} from "../../src/engine-v1.3.js";
import { parseDxf } from "../../src/engine.js";
import { fixture } from "../repair/fixture.mjs";
const hash = (x) => crypto.createHash("sha256").update(x).digest("hex");
const freeze = JSON.parse(
  fs.readFileSync("eval/repair-v1.3/ENGINE_FREEZE.json"),
);
for (const [file, h] of Object.entries(freeze.files))
  assert.equal(
    hash(fs.readFileSync(file)),
    h,
    `Frozen repair changed: ${file}`,
  );
const root = process.env.STOA_DATA ?? "../stoa-data/junction-dataset-preview";
const qs = fs
  .readFileSync(path.join(root, "questions.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse);
const models = new Map();
const model = (q) => {
  const stem = path.basename(q.path, path.extname(q.path));
  if (!models.has(stem))
    models.set(
      stem,
      parseDxf(
        fs.readFileSync(
          path.join(root, "data/swiss_dwellings", stem + ".dxf"),
          "utf8",
        ),
        stem,
      ),
    );
  return models.get(stem);
};
const compact = (r) => ({
  status: r.status,
  value: r.value,
  unit: r.unit,
  intent: r.intent,
  rooms: r.rooms.map((r) => r.roomId).sort(),
  entityIds: [...(r.entityIds ?? r.rooms.map((r) => r.id))].sort(),
  reason: r.reason,
  exportable: canExportAnswer(r),
});
const correct = (r, q) =>
  r.status === "answer" &&
  r.unit === (q.type === "area" ? "m²" : "count") &&
  (q.type === "count"
    ? r.value === q.answer
    : Math.abs(r.value - q.answer) <= Math.abs(q.answer) * 0.02);
const published = JSON.parse(fs.readFileSync("eval/c16/failures.json"));
const seen = published.map((x) => {
  const q = qs[x.recordIndex],
    r = answerDrawing(model(q), x.authoredQuestion);
  return {
    recordIndex: x.recordIndex,
    family: x.family,
    variant: x.variant,
    question: x.authoredQuestion,
    expected: q.answer,
    expectedUnit: q.type === "area" ? "m²" : "count",
    ...compact(r),
    correct: correct(r, q),
  };
});
const allRephrases = [];
const devIds = new Set(
  JSON.parse(fs.readFileSync("eval/split-manifest.json")).dev.recordIndices,
);
for (let i = 0; i < qs.length; i++) {
  const q = qs[i];
  if (!devIds.has(i) || !/^(How|What)/.test(q.question)) continue;
  const id = q.question.match(/room\s+(-?\d+\.\d{2})/)?.[1];
  const label = q.question.match(/'([^']+)'/)?.[1];
  let family, variants;
  if (id && q.type === "area") {
    family = "rephrase_numbered_room_area";
    variants = [
      `Give me the area of room ${id} in m².`,
      `Room ${id} net floor area in m²?`,
      `How many square metres is room ${id}?`,
    ];
  } else if (label && q.type === "count") {
    family = "rephrase_label_count";
    variants = [
      `Count rooms labelled '${label}'.`,
      `Number of rooms labelled '${label}'?`,
      `Total rooms named '${label}'?`,
    ];
  } else if (label && q.type === "area" && /total/.test(q.question)) {
    family = "rephrase_label_area";
    variants = [
      `Sum the area of rooms labelled '${label}'.`,
      `What is the total area of rooms named '${label}'?`,
      `How many square metres do all rooms named '${label}' cover?`,
    ];
  } else continue;
  for (const question of variants) {
    const r = answerDrawing(model(q), question);
    allRephrases.push({
      recordIndex: i,
      family,
      question,
      expected: q.answer,
      expectedUnit: q.type === "area" ? "m²" : "count",
      ...compact(r),
      correct: correct(r, q),
    });
  }
}
// This replay is explicitly previously exposed data. It does not create a new holdout.
const historical = {};
for (const stage of ["dev", "heldout"]) {
  const records = JSON.parse(
    fs.readFileSync(`eval/results/${stage}-traces.json`),
  );
  historical[stage] = records.map((old) => {
    const q = qs[old.index],
      r = answerDrawing(model(q), q.question);
    return {
      recordIndex: old.index,
      expected: q.answer,
      expectedUnit: q.type === "area" ? "m²" : "count",
      oldAnswered: old.answered,
      oldCorrect: old.pass,
      ...compact(r),
      correct: correct(r, q),
    };
  });
}
const packet = fs.readFileSync("work/repair-final-wording.json");
assert.equal(hash(packet), freeze.sealedWordingPacketSha256);
fs.writeFileSync("eval/repair-v1.3/fresh-wording.json", packet);
const fresh = JSON.parse(packet).map((c) => {
  const r = answerDrawing(fixture(), c.question),
    expected = c.expected;
  const pass =
    r.status === expected.status &&
    (expected.status === "review" ||
      (r.unit === expected.unit &&
        Math.abs(r.value - expected.value) < 1e-8 &&
        JSON.stringify(r.rooms.map((r) => r.roomId).sort()) ===
          JSON.stringify([...expected.rooms].sort())));
  return { ...c, observed: compact(r), pass };
});
const tally = (rows) => ({
  cases: rows.length,
  correct: rows.filter((r) => r.correct).length,
  answered: rows.filter((r) => r.status === "answer").length,
  refused: rows.filter((r) => r.status === "review").length,
  incorrectAnswered: rows.filter((r) => r.status === "answer" && !r.correct)
    .length,
  wrongUnitAnswered: rows.filter(
    (r) => r.status === "answer" && r.unit !== r.expectedUnit,
  ).length,
});
const originals = new Map(
  Object.values(historical)
    .flat()
    .map((r) => [r.recordIndex, r]),
);
const invariantFailures = allRephrases.filter((r) => {
  const b = originals.get(r.recordIndex);
  const sameValue =
    r.value === b.value ||
    (typeof r.value === "number" &&
      typeof b.value === "number" &&
      Math.abs(r.value - b.value) <=
        1e-8 * Math.max(1, Math.abs(r.value), Math.abs(b.value)));
  return !(
    r.status === b.status &&
    r.unit === b.unit &&
    sameValue &&
    JSON.stringify(r.rooms) === JSON.stringify(b.rooms) &&
    JSON.stringify(r.entityIds) === JSON.stringify(b.entityIds)
  );
});
const firstPacket = JSON.parse(
  fs.readFileSync("eval/repair/fresh-wording.json"),
).map((c) => {
  const r = answerDrawing(fixture(), c.question),
    e = c.expected;
  return {
    ...c,
    observed: compact(r),
    pass:
      r.status === e.status &&
      (e.status === "review" ||
        (r.unit === e.unit &&
          Math.abs(r.value - e.value) < 1e-8 &&
          JSON.stringify(r.rooms.map((r) => r.roomId).sort()) ===
            JSON.stringify([...e.rooms].sort()))),
  };
});
const earlierPackets = [
  "eval/repair/fresh-wording.json",
  "eval/repair-v1.2/fresh-wording.json",
].flatMap((p) => JSON.parse(fs.readFileSync(p)));
const previousPromptSet = new Set(
  [
    ...earlierPackets,
    ...JSON.parse(fs.readFileSync("eval/repair/results/intent-regression.json"))
      .rows,
    ...JSON.parse(
      fs.readFileSync("eval/repair-v1.2/results/intent-regression.json"),
    ).rows,
    ...JSON.parse(
      fs.readFileSync("eval/repair-v1.3/results/intent-regression.json"),
    ).rows,
  ]
    .filter((r) => r.question)
    .map((r) => r.question.toLowerCase().replace(/\s+/g, " ").trim()),
);
const overlaps = fresh.filter((r) =>
  previousPromptSet.has(r.question.toLowerCase().replace(/\s+/g, " ").trim()),
);
const novel = fresh.filter(
  (r) =>
    !previousPromptSet.has(
      r.question.toLowerCase().replace(/\s+/g, " ").trim(),
    ),
);
fs.writeFileSync(
  "eval/repair-v1.3/results/rephrase-invariance.json",
  JSON.stringify(
    {
      comparisons: allRephrases.length,
      unchanged: allRephrases.length - invariantFailures.length,
      changed: invariantFailures.length,
      fields: "status/unit/value/room IDs/entity IDs",
      changes: invariantFailures,
    },
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  "eval/repair-v1.3/results/seen-first-packet.json",
  JSON.stringify(firstPacket, null, 2) + "\n",
);
const summary = {
  version: VERSION,
  seenFirstPacket: {
    cases: firstPacket.length,
    passed: firstPacket.filter((r) => r.pass).length,
    failed: firstPacket.filter((r) => !r.pass).length,
    note: "First1.1 wording packet is now seen regression data",
  },
  seenRephraseInvariance: {
    comparisons: allRephrases.length,
    unchanged: allRephrases.length - invariantFailures.length,
    changed: invariantFailures.length,
    fields: "status, unit, value, room IDs and entity IDs",
  },
  geometryModuleSha256: hash(fs.readFileSync("src/engine.js")),
  engineSha256: hash(fs.readFileSync("src/engine-v1.3.js")),
  seenPublishedFailures: tally(seen),
  seenPublishedWrongUnitSlice: tally(
    seen.filter((r) => r.family === "rephrase_label_area"),
  ),
  seenAllAuthoredRephrases: tally(allRephrases),
  historicalRegression: Object.fromEntries(
    Object.entries(historical).map(([k, v]) => [
      k,
      {
        ...tally(v),
        lostPreviouslyCorrect: v.filter((r) => r.oldCorrect && !r.correct)
          .length,
        note: "Previously exposed historical split; regression only, not new unseen data",
      },
    ]),
  ),
  freshWording: {
    exactPriorPromptOverlaps: overlaps.map((r) => r.id),
    nonoverlapCases: novel.length,
    nonoverlapPassed: novel.filter((r) => r.pass).length,
    nonoverlapFailed: novel.filter((r) => !r.pass).length,
    cases: fresh.length,
    passed: fresh.filter((r) => r.pass).length,
    failed: fresh.filter((r) => !r.pass).length,
    incorrectAnswers: fresh.filter(
      (r) => !r.pass && r.observed.status === "answer",
    ).length,
    packetSha256: hash(packet),
    scope:
      "Fresh model-authored analytic wording probes sealed before engine freeze, not human labels or an independent drawing/source benchmark",
  },
};
fs.writeFileSync(
  "eval/repair-v1.3/results/summary.json",
  JSON.stringify(summary, null, 2) + "\n",
);
for (const [name, value] of Object.entries({
  "seen-published-failures": seen,
  "seen-all-rephrases": allRephrases,
  "historical-regression": historical,
  "fresh-wording-results": fresh,
  "remaining-failures": {
    seenPublished: seen.filter((r) => !r.correct),
    fresh: fresh.filter((r) => !r.pass),
  },
}))
  fs.writeFileSync(
    `eval/repair-v1.3/results/${name}.json`,
    JSON.stringify(value, null, 2) + "\n",
  );
console.log(JSON.stringify(summary, null, 2));
console.log(
  "Fresh remaining failures:",
  JSON.stringify(
    fresh.filter((r) => !r.pass),
    null,
    2,
  ),
);
