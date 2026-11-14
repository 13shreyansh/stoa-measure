// Verify original C-16 evidence against its immutable Git tag and replay that snapshot.
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync, execFileSync } from "node:child_process";
import assert from "node:assert/strict";
const tag = "audit-c16-v1";
const hash = (x) => crypto.createHash("sha256").update(x).digest("hex");
for (const dir of ["eval/c16", "eval/results"])
  for (const file of fs.readdirSync(dir)) {
    const p = dir + "/" + file;
    if (!fs.statSync(p).isFile()) continue;
    const old = execFileSync("git", ["show", `${tag}:${p}`]);
    assert.equal(
      hash(fs.readFileSync(p)),
      hash(old),
      `Historical evidence changed: ${p}`,
    );
  }
for (const p of [
  "src/engine.js",
  "eval/run.mjs",
  "eval/split-manifest.json",
  "EVAL_SPEC.md",
])
  assert.equal(
    hash(fs.readFileSync(p)),
    hash(execFileSync("git", ["show", `${tag}:${p}`])),
    `Historical source changed: ${p}`,
  );
const root = path.resolve(
  process.env.STOA_DATA ?? "../stoa-data/junction-dataset-preview",
);
fs.mkdirSync("work", { recursive: true });
const tmp = fs.mkdtempSync(path.resolve("work/c16-history-"));
const archive = execFileSync("git", ["archive", tag], {
  maxBuffer: 64 * 1024 * 1024,
});
execFileSync("tar", ["-x", "-C", tmp], { input: archive });
const run = spawnSync(process.execPath, ["eval/c16/verify.mjs"], {
  cwd: tmp,
  env: { ...process.env, STOA_DATA: root },
  encoding: "utf8",
});
assert.equal(run.status, 0, run.stderr);
process.stdout.write(run.stdout);
console.log(
  "Historic audit replayed from immutable tag; current repair code is separate.",
);
