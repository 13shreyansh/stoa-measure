// DOM-only repair checks with an authored DXF fixture; not browser verification.
import fs from "node:fs";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { build } from "esbuild";
import { webcrypto } from "node:crypto";
import { fixtureDxf } from "../repair/fixture.mjs";
const b = await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  write: false,
  format: "iife",
  loader: { ".css": "empty" },
  logLevel: "silent",
  external: ["pdfjs-dist"],
});
const w = new Window({ url: "https://stoa-eta.vercel.app" });
w.document.body.innerHTML = '<div id="app"></div>';
Object.defineProperty(w, "crypto", { value: webcrypto });
const downloads = [];
w.URL.createObjectURL = (blob) => {
  downloads.push(blob);
  return "blob:repair-test";
};
w.URL.revokeObjectURL = () => {};
w.fetch = async (u) => ({
  ok: true,
  text: async () => fixtureDxf(),
  json: async () => JSON.parse(fs.readFileSync("public/evaluation.json")),
});
w.eval(b.outputFiles[0].text);
const $ = (s) => w.document.querySelector(s);
const tick = async () => {
  for (let i = 0; i < 20; i++) await new Promise((r) => setImmediate(r));
};
const checks = [];
const check = (name, f) => {
  f();
  checks.push({ name, pass: true });
};
const ask = (q) => {
  $("#question").value = q;
  $("#ask").dispatchEvent(new w.Event("submit", { cancelable: true }));
};
$("#example").click();
await tick();
ask("How many square metres do all rooms named 'Bad' cover?");
check("Area wording renders 26 m² and enables export", () => {
  assert.match($("#answer").textContent, /26.00 m²/);
  assert.equal($("#export").disabled, false);
});
$("#export").click();
await tick();
let p = JSON.parse(await downloads.at(-1).text());
check(
  "Area JSON binds original question, operation, m² and engine1.2.0",
  () => {
    assert.equal(p.version, "1.2.0");
    assert.equal(p.geometryVersion, "1.0.0");
    assert.equal(p.result.intent, "area");
    assert.equal(p.result.unit, "m²");
    assert.equal(p.result.value, 26);
    assert.equal(
      p.question,
      "How many square metres do all rooms named 'Bad' cover?",
    );
  },
);
ask("How many rooms are labelled 'Bad'?");
$("#export").click();
await tick();
p = JSON.parse(await downloads.at(-1).text());
check("Count JSON contains count2, not area26", () => {
  assert.equal(p.result.value, 2);
  assert.equal(p.result.unit, "count");
  assert.equal(p.result.intent, "count");
});
const before = downloads.length;
$("#question").value = "What is the area of room 1.01?";
$("#question").dispatchEvent(new w.Event("input"));
check("Editing question disables stale export", () =>
  assert.equal($("#export").disabled, true),
);
$("#trace-tab").click();
$("#dxf-tab").click();
check("Returning from tracing keeps stale export disabled", () =>
  assert.equal($("#export").disabled, true),
);
$("#export").onclick();
await tick();
check("Direct stale-export handler cannot create a new download", () => {
  assert.equal(downloads.length, before);
  assert.match($("#message").textContent, /current question first/);
});
ask("Give the area and count of rooms labelled 'Bad'.");
check("Mixed intent refuses and disables export", () => {
  assert.match($("#answer").textContent, /Review needed/);
  assert.equal($("#export").disabled, true);
});
$("#export").onclick();
await tick();
assert.equal(downloads.length, before);
ask("What is the area of room 1.03 ('Wohnen')?");
check("Wohnen is not mistaken for ohne exclusion", () =>
  assert.match($("#answer").textContent, /24.00 m²/),
);
fs.writeFileSync(
  "eval/repair-v1.2/results/ui-regression.json",
  JSON.stringify(
    {
      scope:
        "DOM regression on authored fixture; not browser or unseen language",
      passed: checks.length,
      checks,
    },
    null,
    2,
  ) + "\n",
);
console.log(`${checks.length} area/count/export DOM regressions passed`);
await w.happyDOM.close();
