// Small scoped patch over frozen1.3.0. Geometry and base routing stay unchanged.
export {
  parseDxf,
  polygonArea,
  perimeter,
  inside,
  validRing,
  measureTrace,
} from "./engine.js";
export {
  GEOMETRY_VERSION,
  canExportAnswer,
  resolveIntent,
} from "./engine-v1.3.js";
import { answerDrawing as baseAnswer, resolveIntent } from "./engine-v1.3.js";
export const VERSION = "1.3.1";
export function answerDrawing(model, question) {
  question = String(question ?? "");
  const parsed = resolveIntent(question);
  const q = parsed.masked ?? "";
  const indoor =
    /all numbered indoor|total net floor|total indoor|indoor total|tutti i locali interni|aller nummerierten|tous les locaux interieurs|toutes les pieces interieures numerotees/.test(
      q,
    );
  // An indoor-total request cannot silently override an additional subset target.
  const ex = q.match(
    /(?<![\p{L}\p{N}_])(?:except|excluding|exclude|without|ohne|sans|hors|escluso|esclusi|escluse|escludendo)(?![\p{L}\p{N}_])/u,
  );
  const prefix = ex ? q.slice(0, ex.index) : q;
  const subset =
    (parsed.labels?.length ?? 0) > 0 ||
    /\b(?:room|raum|raums|locale|piece|huone)\s+-?\d+\.\d{2}(?!\d|\.\d)/.test(
      prefix,
    ) ||
    /\b(?:apartments?|appartements?|appartamento|appartamenti|wohnungen|wohnung)\b/.test(
      prefix,
    ) ||
    /(?<![\p{L}\p{N}_])(?:bathrooms?|bad|bagno|badezimmer|salle de bain|kylpyhuone|kitchens?|cucina|kuche|cuisine|keittio|bedrooms?|schlafzimmer|chambre|camera|balconies|balcony|balcone|balcon|balkon)(?![\p{L}\p{N}_])/u.test(
      prefix,
    );
  if (indoor && subset)
    return {
      question,
      intent: parsed.intent ?? null,
      status: "review",
      reason:
        "Whole-floor indoor area and a room/apartment subset are different scopes. Ask for the subset area or indoor total separately.",
      value: null,
      unit: null,
      rooms: [],
      entityIds: [],
      evidence: [],
      engineVersion: VERSION,
      geometryVersion: "1.0.0",
    };
  return { ...baseAnswer(model, question), engineVersion: VERSION };
}
