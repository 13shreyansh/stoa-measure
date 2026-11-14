import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/dm-sans/700.css";
import "./style.css";
import {
  parseDxf,
  answerDrawing,
  measureTrace,
  polygonArea,
  VERSION,
  GEOMETRY_VERSION,
  canExportAnswer,
} from "./engine-v1.1.js";
const $ = (s) => document.querySelector(s);
const el = (tag, attrs = {}, text = "") => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  e.textContent = text;
  return e;
};
const svgEl = (tag, attrs = {}) => {
  const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
};
const n = (x) =>
  Number(x).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const credit =
  "Swiss Dwellings v3.0.0, Matthias Standfest and co-authors, Archilyse AG. DOI 10.5281/zenodo.7788422. CC BY 4.0. Junction drawing derived from the published geometry. Display and measurement overlays added by The CS Guy.";
let model = null,
  result = null,
  hash = "",
  mode = "dxf",
  zoom = 1,
  trace = {
    image: null,
    width: 900,
    height: 600,
    phase: "idle",
    anchor: [],
    points: [],
    ppm: null,
    result: null,
  },
  objectUrl = null;
document.querySelector("#app").innerHTML = `
<header><a class="wordmark" href="/" aria-label="Measure home"><svg viewBox="0 0 28 28" aria-hidden="true"><path d="M4 24V4h20v20H4m0-6h7V4m0 14h13M17 18v6"/></svg>Measure<span>by The CS Guy</span></a><nav><a href="#evidence">Evaluation</a><a href="https://github.com/13shreyansh/stoa-measure" target="_blank" rel="noreferrer">Source code ↗</a></nav></header>
<main><section class="intro"><div><h1>Know the area.<br>See the boundary.</h1><p>For site engineers checking quantities before ordering. Ask a drawing, inspect the highlighted rooms, and keep the calculation.</p></div><div class="start"><button class="primary" id="example">Open real drawing <span>↗</span></button><label class="file-button">Upload your drawing<input id="file" type="file" accept=".dxf,.pdf,.png,.jpg,.jpeg,.webp"/></label><small>DXF for automatic takeoffs · PDF or image for tracing<br>Uploads stay in this browser.</small></div></section>
<div class="workspace-header"><div class="tabs" role="tablist" aria-label="Measurement method"><button id="dxf-tab" role="tab" aria-selected="true">Drawing questions</button><button id="trace-tab" role="tab" aria-selected="false">Calibrate & trace</button></div><span id="file-name">No drawing loaded</span></div>
<section class="workspace" aria-label="Drawing measurement workspace"><div class="drawing-pane"><div class="drawing-toolbar"><span id="drawing-status">Start with a drawing</span><div><button id="zoom-out" aria-label="Zoom out">−</button><button id="zoom-in" aria-label="Zoom in">+</button><button id="fit">Fit</button></div></div><div class="drawing-wrap"><svg id="drawing" viewBox="0 0 900 600" role="img" aria-label="Construction drawing and highlighted measurement boundaries"></svg><div id="empty"><h2>A quantity needs a boundary.</h2><p>Open the real Swiss Dwellings example to inspect room geometry, or upload a drawing to measure.</p><button id="empty-example">Open the example</button></div></div><div class="drawing-footer"><span id="legend">Shaded green = selected boundary</span><span id="unit-status">No scale set</span></div><p class="attribution" id="attribution">No drawing is sent to a model.</p></div>
<aside><div id="dxf-controls"><form id="ask"><label for="question">What do you need to measure?</label><textarea id="question" rows="2" placeholder="What is the area of room 5.11?"></textarea><button class="primary" type="submit" id="calculate" disabled>Show the calculation</button></form><div id="suggestions" class="suggestions"></div><div id="answer" aria-live="polite"><h2>Your evidence appears here.</h2><p>The boundary, units and formula stay attached to every answer.</p></div><details id="rooms-panel"><summary>Inspect room boundaries <span id="room-count"></span></summary><div id="rooms"></div></details></div>
<div id="trace-controls" hidden><h2>Measure a scan</h2><p>Set one known length, then trace the inside face of the room walls. Perspective-distorted photos need rectification first.</p><button id="practice">Open practice plan</button><p class="subtle">Practice plan uses authored dimensions, not benchmark data.</p><ol class="trace-steps"><li><strong>Set the scale</strong><p>Click both ends of a known dimension.</p><button id="calibrate">Pick reference endpoints</button><label for="reference-points">Reference endpoints, x,y per line</label><textarea id="reference-points" rows="2" placeholder="Or click two points on the drawing"></textarea><label for="known-length">Reference length, metres</label><input id="known-length" type="number" min="0.001" step="any" value="6"/><button id="save-scale">Apply scale</button><span id="scale-feedback" role="status"></span></li><li><strong>Trace the room</strong><p>Click each corner in order. The last edge closes automatically.</p><div class="inline-actions"><button id="trace-room">Start boundary</button><button id="undo">Undo point</button><button id="finish">Finish boundary</button></div><label for="trace-points">Boundary coordinates, x,y per line</label><textarea id="trace-points" rows="3" placeholder="Click on the drawing or enter image coordinates"></textarea><p class="subtle">Coordinate entry also supports keyboard-only measurement.</p></li></ol><div id="trace-answer" aria-live="polite"></div></div>
<button id="export" class="export" disabled>Download calculation & boundary ↓</button><p class="scope">Computed geometry is evidence, not a guarantee. Check the drawing revision, room identity and scale before ordering.</p></aside></section>
<section class="evidence" id="evidence"><h2>Measured, with limits in view.</h2><p>Current engine 1.1.0 repairs area/count intent and export binding. The benchmark below records historical engine 1.0.0; it is not a new unseen score for this repair. <a href="https://github.com/13shreyansh/stoa-measure/blob/main/eval/repair/README.md" target="_blank" rel="noreferrer">Read repair regressions and remaining wording failures ↗</a></p><p>This is a partial solution for semantic DXF drawings. Scans use human tracing. The preview test is easier than the sponsor's unreleased drawings.</p><div id="eval-metrics">Evaluation results will load here.</div><div class="evidence-columns"><div><h3>What the automatic path reads</h3><p>Closed room polygons, room labels and physical units from DXF. Area comes from polygon coordinates. Printed room areas are cross-checks from the same source, not independent human validation.</p></div><div><h3>What still needs a person</h3><p>Missing labels, fragmented rooms, ambiguous symbols, piping and unknown scale. These cases often need review. Unfamiliar wording can also select the wrong operation; check the unit and highlighted rooms. Automatic raster segmentation, IFC parsing and calibrated confidence are not implemented.</p></div></div><a href="https://github.com/13shreyansh/stoa-measure/blob/main/eval/LEDGER.md" target="_blank" rel="noreferrer">Read the evaluation ledger and failure analysis ↗</a><p><a href="https://github.com/13shreyansh/stoa-measure/blob/main/eval/c16/README.md" target="_blank" rel="noreferrer">Historical engine 1.0.0 audit: 29 area requests returned counts; immutable failures ↗</a></p></section>
</main><footer><span>Junction 2026 · Make Blueprints Talk · Independent competition entry</span><span>Project code MIT · Drawing licenses stay with their authors</span></footer><div id="message" role="alert" hidden></div>`;
function message(s) {
  $("#message").textContent = s;
  $("#message").hidden = false;
  setTimeout(() => ($("#message").hidden = true), 7000);
}
function setMode(m) {
  mode = m;
  $("#file-name").textContent =
    m === "dxf"
      ? (model?.name ?? "No DXF loaded")
      : (trace.name ?? "No scan loaded");
  $("#attribution").textContent =
    m === "dxf"
      ? (model?.credit ?? "No drawing is sent to a model.")
      : (trace.credit ?? "Upload a scan or open the practice plan.");
  $("#dxf-controls").hidden = m !== "dxf";
  $("#trace-controls").hidden = m !== "trace";
  $("#dxf-tab").setAttribute("aria-selected", m === "dxf");
  $("#trace-tab").setAttribute("aria-selected", m === "trace");
  $("#export").disabled =
    m === "dxf" ? !result || result.status !== "answer" : !trace.result;
  zoom = 1;
  render();
}
function baseBounds() {
  if (mode === "trace") return [0, 0, trace.width, trace.height];
  if (!model) return [0, 0, 900, 600];
  const [x0, y0, x1, y1] = model.bounds;
  const pad = Math.max(x1 - x0, y1 - y0) * 0.06;
  return [x0 - pad, -y1 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad];
}
function render() {
  const svg = $("#drawing");
  svg.replaceChildren();
  const [x, y, w, h] = baseBounds();
  svg.setAttribute(
    "viewBox",
    `${x + w / 2 - w / zoom / 2} ${y + h / 2 - h / zoom / 2} ${w / zoom} ${h / zoom}`,
  );
  $("#empty").hidden = mode === "dxf" ? !!model : !!trace.image;
  if (mode === "trace") {
    if (trace.image) {
      svg.append(
        svgEl("image", {
          href: trace.image,
          x: 0,
          y: 0,
          width: trace.width,
          height: trace.height,
        }),
      );
      if (trace.anchor.length) {
        svg.append(
          svgEl("polyline", {
            points: trace.anchor.map((p) => p.join(",")).join(" "),
            fill: "none",
            stroke: "#a64b14",
            "stroke-width": 3 / zoom,
          }),
        );
        for (const p of trace.anchor)
          svg.append(
            svgEl("circle", {
              cx: p[0],
              cy: p[1],
              r: 5 / zoom,
              fill: "#a64b14",
            }),
          );
      }
      if (trace.points.length) {
        svg.append(
          svgEl(trace.result ? "polygon" : "polyline", {
            points: trace.points.map((p) => p.join(",")).join(" "),
            fill: trace.result ? "#26745d30" : "none",
            stroke: "#176447",
            "stroke-width": 3 / zoom,
          }),
        );
        for (const p of trace.points)
          svg.append(
            svgEl("circle", {
              cx: p[0],
              cy: p[1],
              r: 4 / zoom,
              fill: "#176447",
            }),
          );
      }
    }
    $("#drawing-status").textContent =
      trace.phase === "calibrate"
        ? `Pick reference endpoints (${trace.anchor.length}/2)`
        : trace.phase === "trace"
          ? `${trace.points.length} boundary points`
          : "Calibrated tracing";
    $("#unit-status").textContent = trace.ppm
      ? `${n(trace.ppm)} pixels per metre`
      : "Scale required";
    return;
  }
  if (!model) return;
  const selected = new Set(
    result?.entityIds ?? result?.rooms?.map((r) => r.id) ?? [],
  );
  for (const e of model.entities) {
    let shape;
    const pts = e.points.map(([a, b]) => [a, -b]);
    const isSelected = selected.has(e.id);
    const attrs = {
      fill: "none",
      stroke:
        e.layer === "WALL"
          ? "#5a615a"
          : e.layer === "WINDOW"
            ? "#54869a"
            : "#9a9e94",
      "stroke-width": e.layer === "WALL" ? 0.035 : 0.015,
    };
    if (e.type === "LWPOLYLINE" && pts.length) {
      shape = svgEl(e.closed ? "polygon" : "polyline", {
        ...attrs,
        points: pts.map((p) => p.join(",")).join(" "),
        fill: e.layer === "WALL" ? "#d6d8d1" : "none",
      });
    } else if (e.type === "CIRCLE") {
      shape = svgEl("circle", {
        ...attrs,
        cx: e.at[0],
        cy: -e.at[1],
        r: e.radius,
      });
    } else if (e.type === "ARC") {
      const a = (e.start * Math.PI) / 180,
        b = (e.end * Math.PI) / 180;
      const end = e.end < e.start ? e.end + 360 : e.end;
      shape = svgEl("path", {
        ...attrs,
        d: `M ${e.at[0] + e.radius * Math.cos(a)} ${-e.at[1] - e.radius * Math.sin(a)} A ${e.radius} ${e.radius} 0 ${end - e.start > 180 ? 1 : 0} 0 ${e.at[0] + e.radius * Math.cos(b)} ${-e.at[1] - e.radius * Math.sin(b)}`,
      });
    }
    if (shape) {
      if (isSelected) {
        shape.setAttribute("fill", "#287c5938");
        shape.setAttribute("stroke", "#14603f");
        shape.setAttribute("stroke-width", ".06");
      }
      svg.append(shape);
    }
  }
  // Interactive room boundaries sit above the base paths. Text remains readable above shading.
  for (const r of model.rooms.filter((r) => r.numbered)) {
    const p = svgEl("polygon", {
      points: r.points.map(([a, b]) => `${a},${-b}`).join(" "),
      fill: "transparent",
      stroke: "none",
      tabindex: "0",
      role: "button",
      "aria-label": `Inspect room ${r.roomId} ${r.label}`,
    });
    p.addEventListener("click", () =>
      ask(`What is the area of room ${r.roomId}?`),
    );
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        ask(`What is the area of room ${r.roomId}?`);
      }
    });
    svg.append(p);
  }
  for (const e of model.entities.filter(
    (e) => e.type === "TEXT" && e.layer === "ROOM_TEXT",
  )) {
    const t = svgEl("text", {
      x: e.at[0],
      y: -e.at[1],
      "font-size": e.height * 0.92,
      "text-anchor": "middle",
      fill: "#303a31",
      "pointer-events": "none",
    });
    t.textContent = e.text;
    svg.append(t);
  }
  $("#drawing-status").textContent =
    `${model.rooms.filter((r) => r.numbered).length} numbered boundaries · DXF geometry`;
  $("#unit-status").textContent = model.metres
    ? `${model.metres} m / drawing unit`
    : "Unknown units";
}
async function fingerprint(raw) {
  return Array.from(
    new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        typeof raw === "string" ? new TextEncoder().encode(raw) : raw,
      ),
    ),
  )
    .map((x) => x.toString(16).padStart(2, "0"))
    .join("");
}
async function loadDxf(raw, name, example = false) {
  model = parseDxf(raw, name);
  hash = await fingerprint(raw);
  model.fileHash = hash;
  model.credit = example
    ? credit
    : "Uploaded drawing. Verify revision and permission to use it.";
  result = null;
  $("#file-name").textContent = name;
  $("#attribution").textContent = example
    ? credit
    : "Uploaded drawing. Verify that you have permission to use it and check the revision.";
  $("#calculate").disabled = false;
  $("#rooms").replaceChildren();
  for (const r of model.rooms.filter((r) => r.numbered)) {
    const b = el(
      "button",
      {},
      `${r.roomId}  ${r.label || "Unlabelled"}  ·  ${r.area === null ? "Scale unknown" : n(r.area) + " m²"}`,
    );
    b.addEventListener("click", () =>
      ask(`What is the area of room ${r.roomId}?`),
    );
    $("#rooms").append(b);
  }
  $("#room-count").textContent = model.rooms.filter((r) => r.numbered).length;
  $("#suggestions").replaceChildren();
  const first = model.rooms.find((r) => r.safe && r.label && !r.outdoor);
  const group =
    model.rooms.find(
      (r) => r.safe && /bagno|bad|bain/.test(r.label.toLowerCase()),
    ) ?? first;
  for (const q of [
    `What is the area of room ${first?.roomId ?? "1.01"}?`,
    `What is the total area of rooms labelled '${group?.label ?? "Room"}'?`,
    "What is the total indoor area?",
  ]) {
    const b = el("button", {}, q);
    b.addEventListener("click", () => ask(q));
    $("#suggestions").append(b);
  }
  setMode("dxf");
  if (model.warnings.length) message(model.warnings.join(" "));
  if (first) ask(`What is the area of room ${first.roomId}?`);
}
async function example() {
  const b = $("#example");
  b.disabled = true;
  b.textContent = "Opening drawing…";
  try {
    const r = await fetch("/samples/example.dxf");
    if (!r.ok) throw Error("Example is unavailable. Upload a DXF instead.");
    await loadDxf(
      await r.text(),
      "Swiss Dwellings · Site 1102 · Floor 5",
      true,
    );
    ask("What is the area of room 5.11?");
  } catch (e) {
    message(e.message);
  } finally {
    b.disabled = false;
    b.textContent = "Open real drawing ↗";
  }
}
function ask(q) {
  if (!model) return;
  $("#question").value = q;
  const start = performance.now();
  result = answerDrawing(model, q);
  result.queryMs = performance.now() - start;
  $("#answer").replaceChildren();
  const a = $("#answer");
  a.append(
    el(
      "p",
      { class: result.status === "answer" ? "result-state" : "review-state" },
      result.status === "answer"
        ? "Computed from drawing coordinates"
        : "Review needed",
    ),
  );
  if (result.status === "answer") {
    const headline = el(
      "h2",
      { class: "result-number" },
      `${n(result.value)} ${result.unit}`,
    );
    a.append(headline, el("p", {}, result.method));
    a.append(
      el(
        "p",
        { class: "subtle" },
        `0 model calls · ${result.queryMs.toFixed(2)} ms local calculation, excludes loading`,
      ),
    );
    for (const text of result.evidence)
      a.append(el("p", { class: "proof-line" }, text));
    if (result.rooms.length) {
      const table = el("table");
      table.innerHTML =
        "<thead><tr><th>Room</th><th>Computed</th><th>Printed</th></tr></thead>";
      const body = el("tbody");
      for (const r of result.rooms) {
        const tr = el("tr");
        for (const s of [
          r.roomId,
          `${n(r.area)} m²`,
          r.printedArea === null ? "Absent" : `${n(r.printedArea)} m²`,
        ])
          tr.append(el("td", {}, s));
        body.append(tr);
      }
      table.append(body);
      a.append(table);
      const details = el("details");
      details.append(el("summary", {}, "Show coordinates and checks"));
      const pre = el(
        "pre",
        {},
        JSON.stringify(
          result.rooms.map((r) => ({
            room: r.roomId,
            entity: r.id,
            vertices: r.points,
            issues: r.issues,
          })),
          null,
          2,
        ),
      );
      details.append(pre);
      a.append(details);
    }
  } else
    a.append(
      el("h2", {}, "No verified quantity yet."),
      el("p", {}, result.reason),
    );
  $("#export").disabled = !canExportAnswer(result, $("#question").value);
  render();
}
$("#ask").addEventListener("submit", (e) => {
  e.preventDefault();
  ask($("#question").value);
});
$("#example").onclick = example;
$("#empty-example").onclick = example;
$("#dxf-tab").onclick = () => setMode("dxf");
$("#trace-tab").onclick = () => setMode("trace");
$("#zoom-in").onclick = () => {
  zoom = Math.min(8, zoom * 1.4);
  render();
};
$("#zoom-out").onclick = () => {
  zoom = Math.max(0.6, zoom / 1.4);
  render();
};
$("#fit").onclick = () => {
  zoom = 1;
  render();
};
$("#file").onchange = async (e) => {
  const f = e.target.files[0];
  if (!f) return;
  try {
    if (f.size > 25e6) throw Error("Choose a single drawing below 25 MB.");
    if (/\.dxf$/i.test(f.name)) {
      await loadDxf(await f.text(), f.name);
      return;
    }
    const data = await f.arrayBuffer();
    hash = await fingerprint(data);
    let url, w, h;
    if (/\.pdf$/i.test(f.name)) {
      message("Rendering the first PDF page locally…");
      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.mjs",
        import.meta.url,
      ).href;
      const pdf = await pdfjs.getDocument({ data }).promise;
      const page = await pdf.getPage(1);
      const v = page.getViewport({
        scale: Math.min(2, 2400 / Math.max(page.view[2], page.view[3])),
      });
      const c = document.createElement("canvas");
      c.width = v.width;
      c.height = v.height;
      await page.render({ canvasContext: c.getContext("2d"), viewport: v })
        .promise;
      url = c.toDataURL();
      w = c.width;
      h = c.height;
      message(
        `Page 1 of ${pdf.numPages}. Only page 1 is loaded; export another sheet separately.`,
      );
    } else {
      if (!/^image\//.test(f.type))
        throw Error("Use an ASCII DXF, PDF, PNG, JPG or WebP.");
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(f);
      const img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = () => rej(Error("Could not decode this image."));
        img.src = objectUrl;
      });
      url = objectUrl;
      w = img.width;
      h = img.height;
    }
    trace = {
      image: url,
      width: w,
      height: h,
      phase: "idle",
      anchor: [],
      points: [],
      ppm: null,
      result: null,
      name: f.name,
      fileHash: hash,
      credit:
        "Uploaded drawing. Manual boundary and scale require your review. Measurements assume a flat, undistorted sheet.",
    };
    $("#file-name").textContent = f.name;
    $("#attribution").textContent =
      "Uploaded drawing. Manual boundary and scale require your review. Measurements assume a flat, undistorted sheet.";
    $("#trace-answer").replaceChildren();
    $("#trace-points").value = "";
    $("#scale-feedback").textContent = "";
    setMode("trace");
  } catch (err) {
    message(err.message);
  } finally {
    e.target.value = "";
  }
};
function syncPoints() {
  $("#trace-points").value = trace.points
    .map((p) => p.map((x) => x.toFixed(2)).join(", "))
    .join("\n");
  render();
}
$("#drawing").addEventListener("click", (e) => {
  if (mode !== "trace" || !trace.image) return;
  const svg = $("#drawing"),
    pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      svg.getScreenCTM().inverse(),
    );
  const p = [pt.x, pt.y];
  if (trace.phase === "calibrate") {
    if (trace.anchor.length === 2) trace.anchor = [];
    trace.anchor.push(p);
    $("#reference-points").value = trace.anchor
      .map((p) => p.map((x) => x.toFixed(2)).join(", "))
      .join("\n");
    render();
  } else if (trace.phase === "trace") {
    trace.points.push(p);
    syncPoints();
  }
});
$("#calibrate").onclick = () => {
  if (!trace.image)
    return message("Upload a PDF or image, or open the practice plan.");
  trace.phase = "calibrate";
  trace.anchor = [];
  $("#reference-points").value = "";
  trace.ppm = null;
  trace.result = null;
  $("#export").disabled = true;
  $("#scale-feedback").textContent = "Pick two endpoints on the drawing.";
  $("#trace-answer").replaceChildren();
  render();
};
$("#save-scale").onclick = () => {
  if ($("#reference-points").value.trim()) {
    const pts = $("#reference-points")
      .value.trim()
      .split("\n")
      .map((l) => l.split(",").map(Number));
    if (
      pts.length !== 2 ||
      pts.some((p) => p.length !== 2 || p.some((x) => !Number.isFinite(x)))
    )
      return message(
        "Enter two x,y reference coordinates, one endpoint per line.",
      );
    trace.anchor = pts;
  }
  const length = Number($("#known-length").value);
  if (trace.anchor.length !== 2 || !(length > 0))
    return message("Pick two reference endpoints and enter a positive length.");
  const d = Math.hypot(
    trace.anchor[1][0] - trace.anchor[0][0],
    trace.anchor[1][1] - trace.anchor[0][1],
  );
  if (d < 2)
    return message(
      "Reference points are too close. Pick a longer known dimension.",
    );
  trace.ppm = d / length;
  trace.referenceLength = length;
  trace.phase = "idle";
  trace.result = null;
  $("#export").disabled = true;
  $("#trace-answer").replaceChildren();
  $("#scale-feedback").textContent =
    `Scale set: ${n(trace.ppm)} pixels/metre. Trace the boundary next.`;
  render();
};
$("#trace-room").onclick = () => {
  if (!trace.ppm) return message("Apply a known scale first.");
  trace.phase = "trace";
  trace.points = [];
  trace.result = null;
  $("#export").disabled = true;
  $("#trace-answer").replaceChildren();
  syncPoints();
};
$("#undo").onclick = () => {
  trace.points.pop();
  trace.result = null;
  trace.phase = "trace";
  $("#export").disabled = true;
  $("#trace-answer").replaceChildren();
  syncPoints();
};
$("#trace-points").oninput = () => {
  trace.result = null;
  $("#export").disabled = true;
  $("#trace-answer").replaceChildren();
};
$("#finish").onclick = () => {
  try {
    const raw = $("#trace-points").value.trim();
    trace.points = raw.split("\n").map((l) => l.split(",").map(Number));
    if (trace.points.some((p) => p.length !== 2))
      throw Error("Enter exactly x,y on each line.");
    trace.result = measureTrace(trace.points, trace.ppm);
    trace.phase = "idle";
    const a = $("#trace-answer");
    a.replaceChildren(
      el("p", { class: "review-state" }, "Human-traced boundary"),
      el("h2", { class: "result-number" }, `${n(trace.result.area)} m²`),
      el(
        "p",
        {},
        `Boundary length ${n(trace.result.perimeter)} m · ${trace.result.vertices} vertices`,
      ),
      el(
        "p",
        { class: "proof-line" },
        `${n(polygonArea(trace.points))} image units² ÷ ${n(trace.ppm)}² = ${n(trace.result.area)} m²`,
      ),
      el(
        "p",
        {},
        "Scale and boundary are supplied by you. This is not an automatic detection. Boundary length includes every edge, without door deductions.",
      ),
      el(
        "p",
        { class: "subtle" },
        "A 1% linear scale error changes area by about 2%. No statistical confidence has been estimated.",
      ),
    );
    $("#export").disabled = false;
    render();
  } catch (e) {
    message(e.message);
  }
};
$("#practice").onclick = async () => {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="600"><rect width="900" height="600" fill="#faf9f5"/><path d="M150 100H750V300H550V500H150Z" fill="white" stroke="#3b453c" stroke-width="5"/><path d="M150 70H750M150 60V85M750 60V85" fill="none" stroke="#6a7067"/><text x="450" y="55" font-size="22" text-anchor="middle" font-family="sans-serif">6.00 m</text><text x="330" y="285" font-size="24" font-family="sans-serif">Practice room</text><text x="330" y="320" font-size="16" font-family="sans-serif">Authored L-shape: 20.00 m²</text></svg>`;
  trace = {
    image: "data:image/svg+xml," + encodeURIComponent(s),
    width: 900,
    height: 600,
    phase: "idle",
    anchor: [],
    points: [],
    ppm: null,
    result: null,
  };
  hash = await fingerprint(s);
  trace.fileHash = hash;
  trace.name = "Practice plan · authored analytic fixture";
  trace.credit =
    "Original practice drawing by The CS Guy. 6 × 4 m rectangle with a 2 × 2 m corner removed. Area 20 m², perimeter 20 m.";
  $("#file-name").textContent = "Practice plan · authored analytic fixture";
  $("#attribution").textContent =
    "Original practice drawing by The CS Guy. 6 × 4 m rectangle with a 2 × 2 m corner removed. Area 20 m², perimeter 20 m.";
  $("#trace-answer").replaceChildren();
  $("#trace-points").value = "";
  $("#scale-feedback").textContent = "";
  setMode("trace");
};
$("#question").addEventListener("input", () => {
  if (mode === "dxf") $("#export").disabled = true;
});
$("#export").onclick = () => {
  if (mode === "dxf" && !canExportAnswer(result, $("#question").value))
    return message(
      "Calculate the current question first. Unresolved, stale or mismatched units cannot be exported.",
    );
  if (mode === "trace" && !trace.result)
    return message("Finish a valid calibrated boundary before exporting.");
  const proof = {
    application: "Measure",
    version: VERSION,
    geometryVersion: GEOMETRY_VERSION,
    input: $("#file-name").textContent,
    inputSha256: mode === "dxf" ? model.fileHash : trace.fileHash,
    method: mode,
    createdAt: new Date().toISOString(),
    ...(mode === "dxf"
      ? {
          question: result.question,
          result,
          sourceUnits: model.unit,
          metresPerUnit: model.metres,
        }
      : { trace: { ...trace, image: undefined } }),
    limitations:
      "Verify revision, scale, room identity and boundary before ordering. No calibrated statistical confidence. Printed area checks are not independent validation.",
  };
  const u = URL.createObjectURL(
    new Blob([JSON.stringify(proof, null, 2)], { type: "application/json" }),
  );
  const a = el("a", { href: u, download: "measure-proof.json" });
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
};
fetch("/evaluation.json")
  .then((r) => (r.ok ? r.json() : Promise.reject()))
  .then((e) => {
    const held = e.heldout;
    $("#eval-metrics").replaceChildren();
    if (!held) return;
    const wrap = el("div", { class: "eval-grid" });
    for (const [label, value, explanation] of [
      [
        "Held-out questions",
        `${held.correct} / ${held.cases}`,
        "Correct across the whole Swiss subset, including refusals.",
      ],
      [
        "Answered correctly",
        `${held.correct} / ${held.answered}`,
        "Precision among answers. Refused cases are excluded here.",
      ],
      [
        "Answer coverage",
        `${(held.coverage * 100).toFixed(1)}%`,
        "The remaining questions return a review request.",
      ],
      [
        "Dumb baseline",
        `${held.baselineCorrect} / ${held.cases}`,
        "Always 1 for counts; first printed room area for area questions.",
      ],
    ]) {
      const item = el("div");
      item.append(
        el("p", {}, label),
        el("strong", {}, value),
        el("p", { class: "subtle" }, explanation),
      );
      wrap.append(item);
    }
    $("#eval-metrics").append(
      wrap,
      el(
        "p",
        { class: "subtle" },
        `${held.drawingCount} held-out drawings, split by site. PDF questions use their paired DXF. English and translated questions are paired, not independent. Zero LLM calls. Local query median ${held.queryMedianMs.toFixed(3)} ms, excludes parsing, UI and network. No frontier-model comparison or human ground truth collected.`,
      ),
    );
  })
  .catch(() => {
    $("#eval-metrics").textContent =
      "Evaluation results unavailable. See the repository ledger.";
  });
render();
