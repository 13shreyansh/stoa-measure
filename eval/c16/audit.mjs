import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
import { parseDxf, answerDrawing } from "../../src/engine.js";
const root = process.env.STOA_DATA ?? "../stoa-data/junction-dataset-preview";
const hash = (x) => crypto.createHash("sha256").update(x).digest("hex");
const engineHash = hash(fs.readFileSync("src/engine.js"));
assert.equal(
  engineHash,
  "c648b3673cf96aaa06f4d3809418abae5912400f158859ce1d455a2a65706bf8",
  "Frozen engine changed",
);
const questionBytes = fs.readFileSync(path.join(root, "questions.jsonl"));
const qs = questionBytes
  .toString()
  .trim()
  .split("\n")
  .map((s, index) => ({ ...JSON.parse(s), index }));
const original = Object.fromEntries(
  ["dev", "heldout"].map((s) => [
    s,
    JSON.parse(fs.readFileSync(`eval/results/${s}-traces.json`)),
  ]),
);
const origSummaries = Object.fromEntries(
  ["dev", "heldout"].map((s) => [
    s,
    JSON.parse(fs.readFileSync(`eval/results/${s}-summary.json`)),
  ]),
);
assert.equal(
  hash(questionBytes),
  origSummaries.heldout.datasetQuestionsSha256,
  "Wrong dataset",
);
const identity = (q) => {
  const stem = path.basename(q.path, path.extname(q.path));
  return {
    source: q.path.split("/")[1],
    drawing: stem,
    site: stem.match(/site\d+/)?.[0],
    project: stem.match(/bldg\d+/)?.[0],
  };
};
const split = (q) =>
  parseInt(hash(identity(q).site ?? identity(q).drawing).slice(0, 2), 16) %
    4 ===
  0
    ? "heldout"
    : "dev";
const swiss = qs.filter((q) => identity(q).source === "swiss_dwellings");
const groups = new Map();
for (const q of swiss) {
  const id = identity(q);
  const item = groups.get(id.drawing) ?? {
    ...id,
    split: split(q),
    recordIndices: [],
    formats: [],
  };
  item.recordIndices.push(q.index);
  groups.set(id.drawing, item);
}
for (const g of groups.values()) {
  g.formats = ["pdf", "dxf", "png"].filter((ext) =>
    fs.existsSync(
      path.join(root, "data/swiss_dwellings", g.drawing + "." + ext),
    ),
  );
  assert.ok(g.formats.includes("dxf"));
}
const overlapBy = (key) => {
  const a = new Set(
    [...groups.values()].filter((g) => g.split === "dev").map((g) => g[key]),
  );
  return [
    ...new Set(
      [...groups.values()]
        .filter((g) => g.split === "heldout")
        .map((g) => g[key])
        .filter((x) => a.has(x)),
    ),
  ];
};
const manifest = JSON.parse(fs.readFileSync("eval/split-manifest.json"));
const manifestMatches = Object.fromEntries(
  ["dev", "heldout"].map((s) => [
    s,
    JSON.stringify(swiss.filter((q) => split(q) === s).map((q) => q.index)) ===
      JSON.stringify(manifest[s].recordIndices),
  ]),
);
const translation = {
  adjacentPairsChecked: 0,
  allPairsTogether: true,
  unpairedRecords: [],
};
for (let i = 0; i < swiss.length;) {
  const a = swiss[i],
    b = swiss[i + 1];
  if (
    b &&
    a.path === b.path &&
    a.answer === b.answer &&
    a.unit === b.unit &&
    a.type === b.type &&
    /^(How|What)/.test(a.question) &&
    !/^(How|What)/.test(b.question)
  ) {
    translation.adjacentPairsChecked++;
    if (split(a) !== split(b)) translation.allPairsTogether = false;
    i += 2;
  } else {
    translation.unpairedRecords.push(a.index);
    i++;
  }
}
const sourceFamilies = Object.fromEntries(
  [...new Set(qs.map((q) => identity(q).source))].sort().map((source) => {
    const rows = qs.filter((q) => identity(q).source === source);
    const scored = swiss.filter((q) => identity(q).source === source);
    return [
      source,
      {
        questionRecords: rows.length,
        uniqueQuestionPaths: new Set(rows.map((q) => q.path)).size,
        devScored: scored.filter((q) => split(q) === "dev").length,
        heldoutScored: scored.filter((q) => split(q) === "heldout").length,
        status:
          source === "swiss_dwellings"
            ? "scored_semantic_paired_DXF"
            : "not_evaluated",
        sourceDisjointHoldout: false,
      },
    ];
  }),
);
function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((x) =>
      x.isDirectory() ? walk(path.join(dir, x.name)) : [path.join(dir, x.name)],
    );
}
const sourceProbes = [];
for (const p of walk(path.join(root, "data")).filter(
  (p) => p.endsWith(".dxf") && !p.includes("/swiss_dwellings/"),
)) {
  try {
    const m = parseDxf(fs.readFileSync(p, "utf8"), path.basename(p));
    sourceProbes.push({
      source: path.relative(root, p).split("/")[1],
      path: path.relative(root, p),
      parsed: true,
      numberedRooms: m.rooms.filter((r) => r.numbered).length,
      note: "Parse-only probe; no QA score",
    });
  } catch (e) {
    sourceProbes.push({
      source: path.relative(root, p).split("/")[1],
      path: path.relative(root, p),
      parsed: false,
      error: e.message,
      note: "Parse-only rejection; not answer accuracy or source generalization",
    });
  }
}
const close = (a, b) =>
  a === b ||
  (typeof a === "number" &&
    typeof b === "number" &&
    Math.abs(a - b) <= 1e-8 * Math.max(1, Math.abs(a), Math.abs(b)));
const sorted = (a) => [...a].sort();
const digest = (r) => ({
  status: r.status,
  value: r.value,
  unit: r.unit,
  entities: sorted(r.entityIds ?? r.rooms.map((r) => r.id)),
  rooms: sorted(r.rooms.map((r) => r.roomId)),
});
function differences(a, b) {
  const out = [];
  if (a.status !== b.status) out.push("status");
  if (!close(a.value, b.value)) out.push("value");
  if (a.unit !== b.unit) out.push("unit");
  if (JSON.stringify(a.entities) !== JSON.stringify(b.entities))
    out.push("selected_entities");
  if (JSON.stringify(a.rooms) !== JSON.stringify(b.rooms))
    out.push("selected_rooms");
  return out;
}
function reorder(raw, kind) {
  const l = raw.replace(/\r/g, "").split("\n");
  const p = [];
  for (let i = 0; i < l.length - 1; i += 2) p.push([l[i], l[i + 1]]);
  const start = p.findIndex((a) => +a[0] === 2 && a[1].trim() === "ENTITIES");
  assert.ok(start >= 0);
  const end = p.findIndex(
    (a, i) => i > start && +a[0] === 0 && a[1].trim() === "ENDSEC",
  );
  assert.ok(end > start);
  const chunks = [];
  let chunk = [];
  for (const pair of p.slice(start + 1, end)) {
    if (+pair[0] === 0 && chunk.length) {
      chunks.push(chunk);
      chunk = [];
    }
    chunk.push(pair);
  }
  if (chunk.length) chunks.push(chunk);
  if (kind === "reverse") chunks.reverse();
  else {
    let seed = 0x5716;
    for (let i = chunks.length - 1; i > 0; i--) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const j = seed % (i + 1);
      [chunks[i], chunks[j]] = [chunks[j], chunks[i]];
    }
  }
  return (
    [...p.slice(0, start + 1), ...chunks.flat(), ...p.slice(end)]
      .map((a) => a.join("\n"))
      .join("\n") + "\n"
  );
}
const familyStats = {};
const failures = [];
function record(family, variant, q, base, changed, prompt = null) {
  const diff = differences(base, changed);
  const f = (familyStats[family] ??= {
    checks: 0,
    stable: 0,
    changed: 0,
    baselineAnswered: 0,
    baselineRefused: 0,
    refusalChanges: 0,
    answerChanges: 0,
  });
  f.checks++;
  f[base.status === "answer" ? "baselineAnswered" : "baselineRefused"]++;
  if (!diff.length) f.stable++;
  else {
    f.changed++;
    if (base.status !== changed.status) f.refusalChanges++;
    else f.answerChanges++;
    failures.push({
      family,
      variant,
      recordIndex: q.index,
      source: identity(q).source,
      drawing: identity(q).drawing,
      authoredQuestion: prompt,
      changedFields: diff,
      baseline: base,
      observed: changed,
    });
  }
}
const dev = swiss.filter((q) => split(q) === "dev");
const models = new Map();
const raws = new Map();
const baseline = new Map();
const baselineReplay = { checks: 0, matched: 0, mismatches: [] };
for (const q of dev) {
  const id = identity(q);
  if (!models.has(id.drawing)) {
    const raw = fs.readFileSync(
      path.join(root, "data/swiss_dwellings", id.drawing + ".dxf"),
      "utf8",
    );
    raws.set(id.drawing, raw);
    models.set(id.drawing, parseDxf(raw, id.drawing + ".dxf"));
  }
  const out = digest(answerDrawing(models.get(id.drawing), q.question));
  baseline.set(q.index, out);
  const old = original.dev.find((r) => r.index === q.index);
  const match =
    old &&
    old.answered === (out.status === "answer") &&
    close(old.value, out.value) &&
    JSON.stringify(sorted(old.rooms)) === JSON.stringify(out.rooms);
  baselineReplay.checks++;
  if (match) baselineReplay.matched++;
  else baselineReplay.mismatches.push(q.index);
}
for (const name of [
  "untitled.dxf",
  "floor-42.dxf",
  "site999999_bldg999999_floor999999.dxf",
]) {
  const renamed = new Map(
    [...raws].map(([stem, raw]) => [stem, parseDxf(raw, name)]),
  );
  for (const q of dev)
    record(
      "filename",
      name,
      q,
      baseline.get(q.index),
      digest(answerDrawing(renamed.get(identity(q).drawing), q.question)),
    );
}
for (const q of [...dev].reverse())
  record(
    "question_row_order",
    "reverse",
    q,
    baseline.get(q.index),
    digest(answerDrawing(models.get(identity(q).drawing), q.question)),
  );
for (const variant of ["reverse", "seeded_shuffle"]) {
  const changed = new Map(
    [...raws].map(([stem, raw]) => [
      stem,
      parseDxf(reorder(raw, variant), stem + ".dxf"),
    ]),
  );
  for (const q of dev)
    record(
      "DXF_entity_order",
      variant,
      q,
      baseline.get(q.index),
      digest(answerDrawing(changed.get(identity(q).drawing), q.question)),
    );
}
for (const q of dev.filter((q) => /^(How|What)/.test(q.question))) {
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
  for (let i = 0; i < variants.length; i++)
    record(
      family,
      `template_${i + 1}`,
      q,
      baseline.get(q.index),
      digest(answerDrawing(models.get(identity(q).drawing), variants[i])),
      variants[i],
    );
}
const results = {
  audit: "C-16",
  engineSha256: engineHash,
  datasetQuestionsSha256: hash(questionBytes),
  nuisanceScope: "dev only; original held-out not replayed or tuned",
  grouping: {
    drawings: groups.size,
    sites: new Set([...groups.values()].map((g) => g.site)).size,
    projects: new Set([...groups.values()].map((g) => g.project)).size,
    overlap: {
      site: overlapBy("site"),
      project: overlapBy("project"),
      drawing: overlapBy("drawing"),
    },
    originalManifestMatches: manifestMatches,
    translationPairs: translation,
    formatCounts: [...groups.values()].reduce((a, g) => {
      for (const f of g.formats) a[f] = (a[f] ?? 0) + 1;
      return a;
    }, {}),
  },
  sourceFamilies,
  sourceDisjointGeneralization:
    "not established: both scored splits use Swiss Dwellings; other sources were not question-scored",
  sourceProbes,
  baselineReplay,
  nuisances: familyStats,
  failures: failures.length,
  cost: {
    scope:
      "Frozen Swiss paired-DXF held-out QA run; not end-to-end or independently overlay-graded",
    requests: 586,
    correctAnswers: 277,
    reviewRequests: 309,
    modelCalls: 0,
    inferenceApiCostUsd: 0,
    inferenceApiCostPerCorrectUsd: 0,
    hardwareHostingNetworkEnergyStorageHumanCost: "not measured",
    totalCostPerCorrect: "unknown",
  },
};
fs.writeFileSync(
  "eval/c16/results.json",
  JSON.stringify(results, null, 2) + "\n",
);
fs.writeFileSync(
  "eval/c16/failures.json",
  JSON.stringify(failures, null, 2) + "\n",
);
fs.writeFileSync(
  "eval/c16/group-manifest.json",
  JSON.stringify([...groups.values()], null, 2) + "\n",
);
const files = [
  "eval/c16/SPEC.md",
  "eval/c16/audit.mjs",
  "src/engine.js",
  "eval/run.mjs",
  "eval/split-manifest.json",
  "eval/results/dev-summary.json",
  "eval/results/heldout-summary.json",
  "eval/c16/results.json",
  "eval/c16/failures.json",
  "eval/c16/group-manifest.json",
];
const freeze = {
  audit: "C-16",
  frozenAt: new Date().toISOString(),
  inputQuestionSha256: hash(questionBytes),
  files: Object.fromEntries(files.map((f) => [f, hash(fs.readFileSync(f))])),
  note: "First registered audit execution. Original engine and held-out evaluation not changed. This hash manifest is integrity metadata, not an external timestamp or certification.",
};
fs.writeFileSync(
  "eval/c16/FREEZE.json",
  JSON.stringify(freeze, null, 2) + "\n",
);
console.log(JSON.stringify(results, null, 2));
