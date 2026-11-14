# Third-party material

The MIT license applies to project code and original documentation. It does not relicense datasets, reference quantities, drawings or dependency assets.

## Swiss Dwellings

The deployed example, `public/samples/example.dxf`, is kept out of Git. It is a Junction-rendered drawing derived from Swiss Dwellings v3.0.0, DOI https://doi.org/10.5281/zenodo.7788422.

Credit: Matthias Standfest, Michael Franzen, Yvonne Schröder, Luis Gonzalez Medina, Yarilo Villanueva Hernandez, Jan Hendrik Buck, Yen-Ling Tan, Milena Niedzwiecka and Rachele Colmegna, Archilyse AG. License: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

Junction's source notice says the PDF, DXF and PNG were rendered from the published geometry, with drawing style, room/unit numbers, room names, door swings and title block added. Archilyse AG does not endorse these drawings. This application adds display, measurement and selection overlays.

Numeric reference quantities and drawing-derived room labels/identities in `eval/results/*-traces.json` and `eval/c16/` derive from the supplied Swiss Dwellings questions and retain CC BY 4.0. The matching question text is not redistributed; record indices point to the official `questions.jsonl` in the downloaded preview. Evaluation summaries and original project code are MIT.

Other official preview sources include noncommercial, share-alike and no-derivatives material. This repository includes none of those drawings. The official preview is provided for noncommercial use in the Junction challenge.

## Dependencies

DM Sans by Colophon Foundry, SIL Open Font License 1.1, distributed by @fontsource/dm-sans. PDF.js is Apache-2.0. Vite, esbuild and happy-dom retain their package licenses. See the installed package license files and package-lock.json for exact versions. Dependencies are not relicensed by this project's MIT license.
