import fs from "node:fs";
import path from "node:path";
const root = process.env.STOA_DATA ?? process.argv[2];
if (!root)
  throw Error(
    "Set STOA_DATA to the extracted official junction-dataset-preview directory.",
  );
const sample = path.join(
  root,
  "data/swiss_dwellings/site1102_bldg2242_floor10281.dxf",
);
fs.mkdirSync("public/samples", { recursive: true });
fs.copyFileSync(sample, "public/samples/example.dxf");
console.log(
  "Copied CC BY 4.0 example into gitignored deployment assets. See THIRD_PARTY.md.",
);
