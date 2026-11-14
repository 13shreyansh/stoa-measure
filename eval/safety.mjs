import assert from "node:assert/strict";
import fs from "node:fs";
import {
  polygonArea,
  measureTrace,
  parseDxf,
  answerDrawing,
} from "../src/engine.js";
const cases = [];
function check(name, fn) {
  fn();
  cases.push({ name, pass: true });
}
check("L-shaped analytic area is 20 m², not bounding-box 24", () =>
  assert.equal(
    polygonArea([
      [0, 0],
      [6, 0],
      [6, 2],
      [4, 2],
      [4, 4],
      [0, 4],
    ]),
    20,
  ),
);
check("Clockwise traversal gives same area", () =>
  assert.equal(
    polygonArea([
      [0, 0],
      [0, 4],
      [4, 4],
      [4, 2],
      [6, 2],
      [6, 0],
    ]),
    20,
  ),
);
check("100 pixels per metre yields 20 m² and 20 m perimeter", () => {
  const r = measureTrace(
    [
      [150, 100],
      [750, 100],
      [750, 300],
      [550, 300],
      [550, 500],
      [150, 500],
    ],
    100,
  );
  assert.equal(r.area, 20);
  assert.equal(r.perimeter, 20);
});
check("Translation does not change measured area", () =>
  assert.equal(
    measureTrace(
      [
        [0, 0],
        [300, 0],
        [300, 200],
        [0, 200],
      ],
      100,
    ).area,
    6,
  ),
);
check("Doubling scale divides area by four", () =>
  assert.equal(
    measureTrace(
      [
        [0, 0],
        [300, 0],
        [300, 200],
        [0, 200],
      ],
      200,
    ).area,
    1.5,
  ),
);
check("Unknown scale is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [0, 0],
        [3, 0],
        [3, 2],
      ],
      0,
    ),
  ),
);
check("Negative scale is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [0, 0],
        [3, 0],
        [3, 2],
      ],
      -1,
    ),
  ),
);
check("Infinite scale is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [0, 0],
        [3, 0],
        [3, 2],
      ],
      Infinity,
    ),
  ),
);
check("Self-crossing boundary is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [0, 0],
        [3, 3],
        [0, 3],
        [3, 0],
      ],
      1,
    ),
  ),
);
check("Too few vertices is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [0, 0],
        [3, 0],
      ],
      1,
    ),
  ),
);
check("Collinear boundary is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [0, 0],
        [3, 0],
        [6, 0],
      ],
      1,
    ),
  ),
);
check("Non-numeric boundary is rejected", () =>
  assert.throws(() =>
    measureTrace(
      [
        [NaN, 0],
        [3, 0],
        [3, 2],
      ],
      1,
    ),
  ),
);
const raw = fs.readFileSync(
  (process.env.STOA_DATA ?? "../stoa-data/junction-dataset-preview") +
    "/data/swiss_dwellings/site1102_bldg2242_floor10281.dxf",
  "utf8",
);
const m = parseDxf(raw, "Dev example");
check("Actual dev example room 5.11 recomputes to 13.62 m²", () =>
  assert.ok(
    Math.abs(answerDrawing(m, "What is the area of room 5.11?").value - 13.62) <
      0.01,
  ),
);
check("Piping query requests review", () =>
  assert.equal(
    answerDrawing(m, "What is the piping area of room 5.11?").status,
    "review",
  ),
);
check("Bathtub question is not a bathroom room count", () =>
  assert.equal(
    answerDrawing(m, "Quante vasche da bagno sono disegnate?").status,
    "review",
  ),
);
check("Double-leaf door symbols do not become an exact count", () =>
  assert.equal(answerDrawing(m, "How many doors are drawn?").status, "review"),
);
check("Unknown room does not return a guessed area", () =>
  assert.equal(
    answerDrawing(m, "What is the area of room 9.99?").status,
    "review",
  ),
);
check("Missing label does not mean verified zero", () =>
  assert.equal(
    answerDrawing(m, "How many rooms labelled 'Spaceship'? ").status,
    "review",
  ),
);
check("Unknown DXF units block area answers", () => {
  const unknown = parseDxf(raw.replace(/(\$INSUNITS\s+70\s+)6/, "$10"));
  assert.equal(
    answerDrawing(unknown, "What is the area of room 5.11?").status,
    "review",
  );
});
check("Scale disagreement blocks an area answer", () => {
  const changed = parseDxf(raw.replace(/(\$INSUNITS\s+70\s+)6/, "$15"));
  assert.equal(
    answerDrawing(changed, "What is the area of room 5.11?").status,
    "review",
  );
});
check("Unsupported exclusion requests review", () =>
  assert.equal(
    answerDrawing(m, "What is the area of room 5.11 excluding the kitchen?")
      .status,
    "review",
  ),
);
fs.writeFileSync(
  "eval/results/safety.json",
  JSON.stringify(
    {
      suite: "Analytic fixtures and dev safety cases; not human validation",
      passed: cases.length,
      cases,
    },
    null,
    2,
  ),
);
console.log(`${cases.length} safety and analytic checks passed`);
