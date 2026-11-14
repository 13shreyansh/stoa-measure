// Reproduce the frozen audit in a scratch copy, never overwrite published evidence.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import assert from "node:assert/strict";
const hash = (x) => crypto.createHash("sha256").update(x).digest("hex");
const freeze = JSON.parse(fs.readFileSync("eval/c16/FREEZE.json"));
for (const [file, expected] of Object.entries(freeze.files))
  assert.equal(
    hash(fs.readFileSync(file)),
    expected,
    `Frozen file changed: ${file}`,
  );
const root = path.resolve(
  process.env.STOA_DATA ?? "../stoa-data/junction-dataset-preview",
);
fs.mkdirSync("work", { recursive: true });
const tmp = fs.mkdtempSync(path.resolve("work/c16-replay-"));
for (const file of [
  "package.json",
  "src/engine.js",
  "eval/c16/audit.mjs",
  "eval/c16/SPEC.md",
  "eval/run.mjs",
  "eval/split-manifest.json",
  "eval/results/dev-summary.json",
  "eval/results/heldout-summary.json",
  "eval/results/dev-traces.json",
  "eval/results/heldout-traces.json",
]) {
  const dest = path.join(tmp, file);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
}
const run = spawnSync(process.execPath, ["eval/c16/audit.mjs"], {
  cwd: tmp,
  env: { ...process.env, STOA_DATA: root },
  encoding: "utf8",
});
assert.equal(run.status, 0, run.stderr || "Scratch audit failed");
for (const file of [
  "eval/c16/results.json",
  "eval/c16/failures.json",
  "eval/c16/group-manifest.json",
])
  assert.equal(
    hash(fs.readFileSync(path.join(tmp, file))),
    hash(fs.readFileSync(file)),
    `Replay mismatch: ${file}`,
  );
if (fs.existsSync("eval/c16/drawing-input-hashes.json"))
  for (const [file, expected] of Object.entries(
    JSON.parse(fs.readFileSync("eval/c16/drawing-input-hashes.json")).files,
  ))
    assert.equal(
      hash(fs.readFileSync(path.join(root, file))),
      expected,
      `Drawing input changed: ${file}`,
    );
if (fs.existsSync("eval/c16/FINAL_FREEZE.json")) {
  const final = JSON.parse(fs.readFileSync("eval/c16/FINAL_FREEZE.json"));
  for (const [file, expected] of Object.entries(final.files))
    assert.equal(
      hash(fs.readFileSync(file)),
      expected,
      `Final publication changed: ${file}`,
    );
}
const r = JSON.parse(fs.readFileSync("eval/c16/results.json"));
console.log(
  `Frozen audit reproduced without changing published files. ${r.failures} known nuisance failures remain; source-disjoint generalization is not established.`,
);
