// DOM interaction checks. This is not browser rendering or visual verification.
import fs from "node:fs";
import assert from "node:assert/strict";
import { Window } from "happy-dom";
import { build } from "esbuild";
import { webcrypto } from "node:crypto";
const built = await build({
  entryPoints: ["src/main.js"],
  bundle: true,
  write: false,
  format: "iife",
  loader: { ".css": "empty" },
  logLevel: "silent",
  external: ["pdfjs-dist"],
});
const window = new Window({ url: "https://stoa-eta.vercel.app" });
const document = window.document;
document.body.innerHTML = '<div id="app"></div>';
Object.defineProperty(window, "crypto", { value: webcrypto });
const downloads = [];
window.URL.createObjectURL = (blob) => {
  downloads.push(blob);
  return "blob:test";
};
window.URL.revokeObjectURL = () => {};
window.fetch = async (url) => {
  const p =
    url === "/samples/example.dxf"
      ? "public/samples/example.dxf"
      : "public/evaluation.json";
  return {
    ok: true,
    text: async () => fs.readFileSync(p, "utf8"),
    json: async () => JSON.parse(fs.readFileSync(p, "utf8")),
  };
};
const run = window.eval.bind(window);
run(built.outputFiles[0].text);
const $ = (s) => document.querySelector(s);
const wait = async () => {
  for (let i = 0; i < 20; i++) await new Promise((r) => setImmediate(r));
};
const checks = [];
const check = (name, fn) => {
  fn();
  checks.push({ name, pass: true });
};
check("First screen names the task and upload action", () => {
  assert.match(document.body.textContent, /Know the area/);
  assert.ok($("#file"));
});
$("#example").click();
await wait();
check("Real DXF loads through example action", () =>
  assert.match($("#file-name").textContent, /Site 1102/),
);
check("Room 5.11 answer is 13.62 m²", () =>
  assert.match($("#answer").textContent, /13.62 m²/),
);
check("Selected room boundary is visibly marked in SVG attributes", () =>
  assert.ok(document.querySelector('#drawing polygon[fill="#287c5938"]')),
);
$("#question").value = "What is the area of room 5.03?";
$("#ask").dispatchEvent(new window.Event("submit", { cancelable: true }));
check("New question recomputes to 10.15 m²", () =>
  assert.match($("#answer").textContent, /10.15 m²/),
);
$("#export").click();
await wait();
const proof = JSON.parse(await downloads.at(-1).text());
check("Export includes actual boundary and input fingerprint", () => {
  assert.equal(proof.result.rooms[0].roomId, "5.03");
  assert.equal(proof.inputSha256.length, 64);
  assert.ok(proof.result.rooms[0].points.length >= 3);
});
$("#question").value = "How many doors are drawn?";
$("#ask").dispatchEvent(new window.Event("submit", { cancelable: true }));
check("Ambiguous door question abstains and disables export", () => {
  assert.match($("#answer").textContent, /Review needed/);
  assert.equal($("#export").disabled, true);
});
$("#trace-tab").click();
$("#practice").click();
await wait();
check("Practice drawing opens in trace mode", () => {
  assert.match($("#file-name").textContent, /Practice/);
  assert.equal($("#trace-controls").hidden, false);
});
$("#reference-points").value = "150,100\n750,100";
$("#known-length").value = "6";
$("#save-scale").click();
check("Known reference sets 100 pixels/metre", () =>
  assert.match($("#scale-feedback").textContent, /100.00/),
);
$("#trace-points").value =
  "150,100\n750,100\n750,300\n550,300\n550,500\n150,500";
$("#finish").click();
check("Calibrated L-shape measures 20 m² and 20 m boundary", () => {
  assert.match($("#trace-answer").textContent, /20.00 m²/);
  assert.match($("#trace-answer").textContent, /length 20.00 m/);
});
$("#export").click();
await wait();
const traced = JSON.parse(await downloads.at(-1).text());
check(
  "Trace export preserves calibration, vertices and true source hash",
  () => {
    assert.equal(traced.trace.ppm, 100);
    assert.equal(traced.trace.result.area, 20);
    assert.equal(traced.trace.points.length, 6);
    assert.equal(traced.inputSha256.length, 64);
  },
);
$("#dxf-tab").click();
check("Switching modes restores correct source identity", () =>
  assert.match($("#file-name").textContent, /Site 1102/),
);
$("#trace-tab").click();
$("#trace-points").value = "0,0\n300,300\n0,300\n300,0";
$("#trace-points").dispatchEvent(new window.Event("input"));
$("#finish").click();
check("Crossed manual boundary cannot export a stale quantity", () => {
  assert.equal($("#export").disabled, true);
  assert.match($("#message").textContent, /crosses itself/);
});
fs.writeFileSync(
  "eval/results/ui.json",
  JSON.stringify(
    {
      suite: "DOM interaction checks in happy-dom; not a real browser",
      passed: checks.length,
      checks,
    },
    null,
    2,
  ),
);
console.log(
  `${checks.length} DOM interaction checks passed. Browser visual verification remains separate.`,
);
await window.happyDOM.close();
