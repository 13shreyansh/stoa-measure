// Original analytic drawing, authored for the repair checks.
import { parseDxf } from "../../src/engine.js";
export function fixtureDxf() {
  let id = 1;
  const pairs = [
    [0, "SECTION"],
    [2, "HEADER"],
    [9, "$INSUNITS"],
    [70, 6],
    [0, "ENDSEC"],
    [0, "SECTION"],
    [2, "ENTITIES"],
  ];
  const add = (type, layer, rest) =>
    pairs.push([0, type], [5, (id++).toString(16)], [8, layer], ...rest);
  const polygon = (layer, p) =>
    add("LWPOLYLINE", layer, [
      [90, p.length],
      [70, 1],
      ...p.flatMap(([x, y]) => [
        [10, x],
        [20, y],
      ]),
    ]);
  const text = (t, x, y) =>
    add("TEXT", "ROOM_TEXT", [
      [10, x],
      [20, y],
      [40, 0.15],
      [1, t],
    ]);
  for (const [r, label, p, a] of [
    [
      "1.01",
      "Bad",
      [
        [0, 0],
        [4, 0],
        [4, 5],
        [0, 5],
      ],
      20,
    ],
    [
      "1.02",
      "Bad",
      [
        [5, 0],
        [7, 0],
        [7, 3],
        [5, 3],
      ],
      6,
    ],
    [
      "1.03",
      "Wohnen",
      [
        [0, 6],
        [6, 6],
        [6, 10],
        [0, 10],
      ],
      24,
    ],
    [
      "1.04",
      "Balkon",
      [
        [7, 6],
        [10, 6],
        [10, 8],
        [7, 8],
      ],
      6,
    ],
  ]) {
    polygon("ROOM_OUTLINE", p);
    const x = p.reduce((s, p) => s + p[0], 0) / p.length,
      y = p.reduce((s, p) => s + p[1], 0) / p.length;
    text(label, x, y + 0.3);
    text(r, x, y);
    text(`${a} m²`, x, y - 0.3);
  }
  polygon("UNIT_OUTLINE", [
    [-1, -1],
    [11, -1],
    [11, 11],
    [-1, 11],
  ]);
  text("App. A", 10, 10);
  pairs.push([0, "ENDSEC"], [0, "EOF"]);
  return pairs.map(([c, v]) => `${c}\n${v}`).join("\n") + "\n";
}
export function fixture() {
  return parseDxf(fixtureDxf(), "Authored analytic fixture");
}
