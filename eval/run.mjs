import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { performance } from "node:perf_hooks";
import { parseDxf, answerDrawing } from "../src/engine.js";
const root =
  process.env.STOA_DATA ??
  "/Users/shreyansh/Documents/ChatGPT/Junction/stoa-data/junction-dataset-preview";
const stage = process.argv[2] ?? "dev";
if (!["dev", "heldout"].includes(stage)) throw Error("Use dev or heldout");
const qs = fs
  .readFileSync(path.join(root, "questions.jsonl"), "utf8")
  .trim()
  .split("\n")
  .map(JSON.parse);
const hash = (s) => crypto.createHash("sha256").update(s).digest("hex");
const split = (q) =>
  parseInt(
    hash(
      q.path.match(/site\d+/)?.[0] ??
        path.basename(q.path, path.extname(q.path)),
    ).slice(0, 2),
    16,
  ) %
    4 ===
  0
    ? "heldout"
    : "dev";
const cases = qs
  .map((q, i) => ({ ...q, index: i }))
  .filter((q) => q.path.includes("/swiss_dwellings/") && split(q) === stage);
const models = new Map();
const records = [];
let parseMs = 0;
for (const q of cases) {
  const stem = path.basename(q.path, path.extname(q.path));
  if (!models.has(stem)) {
    const t = performance.now();
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
    parseMs += performance.now() - t;
  }
  const m = models.get(stem);
  const t = performance.now();
  const v1 = answerDrawing(m, q.question);
  const elapsed = performance.now() - t;
  const v0 = answerDrawing(m, q.question, { areaMode: "bbox" });
  const b =
    q.type === "count"
      ? 1
      : (m.rooms.find((r) => r.printedArea !== null)?.printedArea ?? null);
  const pass = (v) =>
    typeof v === "number" &&
    (q.type === "count"
      ? v === q.answer
      : q.type === "area"
        ? Math.abs(v - q.answer) <= Math.abs(q.answer) * 0.02
        : false);
  records.push({
    index: q.index,
    site: stem.match(/site\d+/)[0],
    drawing: stem,
    question: q.question,
    expected: q.answer,
    type: q.type,
    language: /^(How|What)/.test(q.question) ? "English" : "translated",
    baseline: b,
    baselinePass: pass(b),
    v0: v0.value,
    v0Pass: pass(v0.value),
    value: v1.value,
    pass: pass(v1.value),
    answered: v1.status === "answer",
    reason: v1.reason,
    method: v1.method,
    rooms: v1.rooms.map((r) => r.roomId),
    elapsedMs: elapsed,
  });
}
const score = (rs) => {
  const answered = rs.filter((r) => r.answered);
  return {
    cases: rs.length,
    answered: answered.length,
    correct: rs.filter((r) => r.pass).length,
    baselineCorrect: rs.filter((r) => r.baselinePass).length,
    bboxCorrect: rs.filter((r) => r.v0Pass).length,
    accuracy: rs.filter((r) => r.pass).length / rs.length,
    coverage: answered.length / rs.length,
    precision: answered.length
      ? answered.filter((r) => r.pass).length / answered.length
      : 0,
  };
};
const timing = records.map((r) => r.elapsedMs).sort((a, b) => a - b);
const summary = {
  stage,
  version: "1.0.0",
  engineSha256: hash(fs.readFileSync("src/engine.js")),
  datasetQuestionsSha256: hash(
    fs.readFileSync(path.join(root, "questions.jsonl")),
  ),
  drawingCount: models.size,
  ...score(records),
  byType: Object.fromEntries(
    [...new Set(records.map((r) => r.type))].map((x) => [
      x,
      score(records.filter((r) => r.type === x)),
    ]),
  ),
  byLanguage: Object.fromEntries(
    ["English", "translated"].map((x) => [
      x,
      score(records.filter((r) => r.language === x)),
    ]),
  ),
  parseTotalMs: parseMs,
  queryMedianMs: timing[Math.floor(timing.length * 0.5)],
  queryP95Ms: timing[Math.floor(timing.length * 0.95)],
  llmCalls: 0,
  inferenceCostUsd: 0,
  fullPreviewQuestions: qs.length,
};
fs.mkdirSync("eval/results", { recursive: true });
fs.writeFileSync(
  `eval/results/${stage}-summary.json`,
  JSON.stringify(summary, null, 2),
);
fs.writeFileSync(`work/${stage}-traces.json`, JSON.stringify(records, null, 2));
// Commit only numeric traces and IDs. Keep licensed question text outside the MIT repository.
fs.writeFileSync(
  `eval/results/${stage}-traces.json`,
  JSON.stringify(
    records.map(({ question, ...r }) => r),
    null,
    2,
  ),
);
console.log(JSON.stringify(summary, null, 2));
