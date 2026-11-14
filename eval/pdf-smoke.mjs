// Local rendering check with the same PDF.js version as the browser build.
// The legacy entry supplies Node canvas support. This does not test a browser worker.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
const root = process.env.STOA_DATA ?? "../stoa-data/junction-dataset-preview";
const loading = pdfjs.getDocument({
  data: new Uint8Array(
    fs.readFileSync(
      path.join(root, "data/swiss_dwellings/site1102_bldg2242_floor10281.pdf"),
    ),
  ),
});
const doc = await loading.promise;
assert.ok(doc.numPages >= 1);
const page = await doc.getPage(1);
const viewport = page.getViewport({ scale: 1 });
const target = doc.canvasFactory.create(viewport.width, viewport.height);
await page.render({ canvasContext: target.context, viewport }).promise;
const png = target.canvas.toBuffer("image/png");
assert.ok(png.length > 10000);
fs.mkdirSync("work", { recursive: true });
fs.writeFileSync("work/pdfjs-example-render.png", png);
const result = {
  pdfjsVersion: pdfjs.version,
  pages: doc.numPages,
  width: viewport.width,
  height: viewport.height,
  rendered: true,
  bytes: png.length,
  scope: "Node rendering smoke check; browser worker unverified",
};
fs.writeFileSync(
  "eval/results/pdf-smoke.json",
  JSON.stringify(result, null, 2),
);
console.log(JSON.stringify(result));
