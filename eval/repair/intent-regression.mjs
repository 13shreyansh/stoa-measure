import assert from "node:assert/strict";
import fs from "node:fs";
import { fixture } from "./fixture.mjs";
import {
  answerDrawing,
  canExportAnswer,
  VERSION,
  resolveIntent,
} from "../../src/engine-v1.1.js";
const m = fixture();
const rows = [];
const answer = (q, unit, value, rooms) => {
  const r = answerDrawing(m, q);
  assert.equal(r.status, "answer", q + ": " + r.reason);
  assert.equal(r.unit, unit, q);
  assert.equal(r.value, value, q);
  if (rooms) assert.deepEqual(r.rooms.map((r) => r.roomId).sort(), rooms);
  rows.push({
    question: q,
    status: r.status,
    unit: r.unit,
    value: r.value,
    pass: true,
  });
};
const refuse = (q) => {
  const r = answerDrawing(m, q);
  assert.equal(r.status, "review", q);
  assert.equal(canExportAnswer(r), false);
  rows.push({ question: q, status: r.status, reason: r.reason, pass: true });
};
answer("How many square metres do all rooms named 'Bad' cover?", "m²", 26, [
  "1.01",
  "1.02",
]);
answer("How many rooms are labelled 'Bad'?", "count", 2, ["1.01", "1.02"]);
answer("How many square meters is room 1.01?", "m²", 20, ["1.01"]);
answer("Total rooms named 'Bad'?", "count", 2);
answer("What is the net floor area of room 1.03 ('Wohnen') in m²?", "m²", 24);
answer("Area of rooms labelled 'Wohnen'?", "m²", 24);
answer(
  "What is the total indoor area excluding balconies, loggias, terraces and other outdoor spaces, shafts and voids?",
  "m²",
  50,
);
answer("What is the area of apartment A?", "m²", 50);
for (const q of [
  "Give the area and count of rooms labelled 'Bad'.",
  "Area of room 1.01 and 1.02?",
  "Area of room 1.01 or room 1.03?",
  "Do not calculate the area of room 1.01.",
  "Area of room 1.01 minus room 1.02?",
  "Area of room 1.01 without the bathroom?",
  "What is the total indoor area excluding kitchens?",
  "What is the area of room 1.01 in square feet?",
  "How many doors, including closet doors, are shown?",
  'What is the area of room 1.01 labelled "Wohnen"?',
])
  refuse(q);
const result = answerDrawing(m, "What is the area of room 1.01?");
assert.equal(canExportAnswer(result), true);
assert.equal(canExportAnswer({ ...result, unit: "count" }), false);
assert.equal(canExportAnswer({ ...result, intent: "count" }), false);
assert.equal(canExportAnswer({ ...result, value: Infinity }), false);
assert.equal(
  canExportAnswer(result, "How many rooms are labelled Bad?"),
  false,
);
rows.push({
  test: "Export rejects wrong units, intent, non-finite value and stale question",
  pass: true,
});
assert.equal(
  resolveIntent("What is the area of room 1.03 ('Wohnen')?").intent,
  "area",
);
fs.mkdirSync("eval/repair/results", { recursive: true });
fs.writeFileSync(
  "eval/repair/results/intent-regression.json",
  JSON.stringify(
    {
      engineVersion: VERSION,
      scope:
        "Authored analytic intent/unit regressions; seen during repair development",
      passed: rows.length,
      rows,
    },
    null,
    2,
  ) + "\n",
);
console.log(`${rows.length} intent/unit/export regression cases passed`);
