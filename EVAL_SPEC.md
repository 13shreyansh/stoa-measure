# Evaluation spec, frozen before implementation

Primary scope: semantic DXF drawings, with room polygons and labels. Queries include numbered-room area, total area by room label, indoor total, apartment area, counts by room label, door/window counts when the layer convention is supported. Unsupported requests must abstain.

Split by site, not extension or question. SHA-256(site identifier) first byte modulo 4 equals 0 is held-out; all other sites are dev. Never use held-out results to tune. PDF questions may use a paired DXF; report this input advantage explicitly. No PDF-only accuracy claim.

Exact counts; numeric area within 2% per supplied scoring. Report accuracy over all Swiss questions, answer coverage, precision among answered and a separate full-preview coverage count. Report English and translated cases separately. Baseline returns 1 for counts and the first printed room area for areas. Geometry v0 uses axis-aligned bounding-box area, v1 uses shoelace polygon area. No frontier inference baseline has been run. Printed areas are not independent ground truth; they come from the same published geometry.

No human labels are implied. Agent inspection of failure traces is not human annotation. Evaluate manual tracing with authored analytic fixtures, report it separately from dataset performance. Safety checks must reject unknown units, open rings, self intersections, ambiguous label matches, unsupported entities, unrecognised queries and requested subsets that cannot be located.
