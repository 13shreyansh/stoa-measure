// Engine 1.2.0. Intent/selection repair; geometry remains in the frozen 1.0.0 module.
export {
  parseDxf,
  polygonArea,
  perimeter,
  inside,
  validRing,
  measureTrace,
} from "./engine.js";
export const VERSION = "1.2.0";
export const GEOMETRY_VERSION = "1.0.0";
const norm = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
const words = String.raw`[\p{L}\p{N}_]`;
const word = (pattern) =>
  new RegExp(`(?<!${words})(?:${pattern})(?!${words})`, "u");
const exclusion = word(
  "except|excluding|exclude|without|ohne|sans|hors|escluso|esclusi|escluse|escludendo",
);
const reject = (question, reason, intent = null) => ({
  question,
  intent,
  status: "review",
  reason,
  value: null,
  unit: null,
  rooms: [],
  entityIds: [],
  evidence: [],
  engineVersion: VERSION,
  geometryVersion: GEOMETRY_VERSION,
});
function quoted(question) {
  const rx = /(?<![\p{L}\p{N}])'([^']+)'|«([^»]+)»|“([^”]+)”|"([^"]+)"/gu;
  const labels = [];
  let masked = question;
  for (const m of question.matchAll(rx)) {
    labels.push(m[1] ?? m[2] ?? m[3] ?? m[4]);
    masked = masked.replace(m[0], " [label] ");
  }
  return { labels, masked: norm(masked) };
}
export function resolveIntent(question) {
  const { labels, masked: q } = quoted(String(question));
  if (labels.length > 1)
    return { error: "Use one exact room label at a time." };
  const dimension = String.raw`(?:square\s+met(?:re|er)s?|sq\.?\s*m|m²|m2|sqm|quadratmeter|metres?\s+carres?|metri\s+quadrati)`;
  const area =
    new RegExp(`(?<!${words})${dimension}(?!${words})`, "u").test(q) ||
    word(
      "area|flache|nettoflache|nettowohnflache|nettogeschossflache|superficie|surface|pinta-ala|sqm",
    ).test(q) ||
    word("m²|m2").test(q) ||
    /\bsquare\s+met(?:re|er)s?\b|\bsq\.?\s*m\b/.test(q);
  const dimensionalCountRemoved = q.replace(
    new RegExp(
      `(?<!${words})(?:how many|number of|wie viele|combien(?: de)?|quanti|quante|kuinka monta)\\s+${dimension}(?!${words})`,
      "gu",
    ),
    " ",
  );
  const count =
    word(
      "count|how many|number of|wie viele|combien|quanti|quante|kuinka monta",
    ).test(dimensionalCountRemoved) ||
    /\btotal\s+(?:number of\s+)?rooms?\b/.test(q);
  if (area && count)
    return {
      error:
        "This asks for both area and count. Ask for one quantity at a time.",
    };
  if (
    word("not|never|minus|subtract|instead|rather").test(q) ||
    /\b(?:do not|don.t)\b/.test(q)
  )
    return {
      error:
        "Negation or arithmetic makes the requested quantity unclear. Ask for one explicit area or count.",
    };
  if (
    word(
      "feet|foot|ft²|ft2|sqft|acres?|hectares?|cm²|cm2|mm²|mm2|km²|km2|in²|in2|yd²|yd2",
    ).test(q) ||
    /\b(?:square|sq\.?)\s+(?:centimet(?:re|er)s?|millimet(?:re|er)s?|kilomet(?:re|er)s?|inches|yards|feet)\b/.test(
      q,
    )
  )
    return {
      error:
        "Requested units are unsupported. This engine returns m² for area or count for objects.",
    };
  return { intent: area ? "area" : count ? "count" : null, labels, masked: q };
}
const indoorSelector =
  /all numbered indoor|total net floor|total indoor|indoor total|tutti i locali interni|aller nummerierten|tous les locaux interieurs|toutes les pieces interieures numerotees/;
const outdoor = word(
  "balconies|balcony|balcon|balcons|balcone|balconi|balkon|balkone|loggias|loggia|loggien|logge|terraces|terrace|terrass|terrassen|terrazze|outdoor|shafts|shaft|voids|void|cavedi|vuoti|aussenraume|schachte|luftraume",
);
function permittedIndoorExclusion(q) {
  const m = q.match(exclusion);
  if (!m) return true;
  const suffix = q.slice(m.index + m[0].length);
  if (!outdoor.test(suffix)) return false;
  const remaining = suffix
    .replace(new RegExp(outdoor.source, "gu"), " ")
    .replace(/[\p{P}\p{N}]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const allowed = new Set([
    "and",
    "or",
    "all",
    "other",
    "spaces",
    "space",
    "the",
    "any",
    "und",
    "andere",
    "autres",
    "espaces",
    "et",
    "e",
    "altri",
    "spazi",
    "esterni",
    "ausgenommen",
    "exterieurs",
    "interieurs",
  ]);
  return remaining.every((w) => allowed.has(w));
}
// Reject request content that this narrow grammar has not accounted for.
// Labels, canonical IDs, accepted units and verified exclusion suffixes are data.
function completeRequestError(q) {
  let residue = q;
  const ex = residue.match(exclusion);
  if (ex) residue = residue.slice(0, ex.index);
  residue = residue
    .replace(/\[label\]/g, " ")
    .replace(/-?\d+\.\d{2}(?![\d.])/g, " ")
    .replace(
      /\b(?:apartment|appartement|appartamento|wohnung)\s+[a-z]\b/g,
      " apartment ",
    )
    .replace(/(?<![\p{L}\p{N}_])(?:m²|m2|sqm)(?![\p{L}\p{N}_])/gu, " ");
  if (/[\p{N}+*\/×÷=^%]/u.test(residue))
    return "Arithmetic, scaling or an extra numeric constraint is unsupported. Ask for one unmodified quantity.";
  if (word("and|or|und|et|plus|multiplied|divided|times").test(residue))
    return "Multiple targets, operations or alternatives need review. Ask for one explicit quantity.";
  residue = residue.replace(
    new RegExp(
      word(
        "bathrooms?|bad|bagno|badezimmer|salle de bain|kylpyhuone|kitchens?|cucina|kuche|cuisine|keittio|bedrooms?|schlafzimmer|chambre|camera|balconies|balcony|balcone|balcon|balkon",
      ).source,
      "gu",
    ),
    " ",
  );
  const allowed = new Set(
    (
      "what how many is are the a an give me please compute calculate measure area net floor of room rooms all numbered indoor indoors total labelled labeled named with label name on this plan shown there in count number for does do cover covers have has apartment apartments residential units summing sum its " +
      "square metre metres meter meters sq quadratmeter carres metri quadrati " +
      "tell show report return find provide could would you can need want " +
      "wie viele raume der bezeichnung gibt es diesem geschoss gross die nettowohnflache nettogeschossflache nettoflache von wohnung wohnungen summe aller " +
      "qual e la superficie netta del locale locali denominati denominazione ci sono questo piano totale tutti i interni numerati dell appartamento quanti quante " +
      "quelle est surface nette de l du piece pieces toutes les interieures numerotees cet etage appartement combien " +
      "kuinka monta huone huonetta pinta ala"
    ).split(/\s+/),
  );
  const tokens = residue
    .replace(/[\p{P}]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.some((t) => !allowed.has(t)))
    return "Unrecognised request wording or modifier needs review. Use one room number or quoted label with area in m² or count.";
  return null;
}
export function canExportAnswer(result, question = result?.question) {
  return (
    !!result &&
    result.status === "answer" &&
    result.question === question &&
    Number.isFinite(result.value) &&
    ((result.intent === "area" && result.unit === "m²") ||
      (result.intent === "count" && result.unit === "count"))
  );
}
export function answerDrawing(model, question) {
  question = String(question ?? "");
  const parsed = resolveIntent(question);
  if (parsed.error) return reject(question, parsed.error);
  const { intent, labels, masked: q } = parsed;
  if (!intent)
    return reject(
      question,
      "Ask for an explicit area in m² or a room count. Unrecognised wording needs review.",
    );
  if (
    word(
      "pipe|pipes|piping|slab|slabs|reinforcement|volume|thickness|cost|price|tiles?|baseboards?|skirting|ceiling|height|bathtubs?|washbasins?|sinks?|toilets?|fixtures?|lavabi|vasche|baignoire|lavabo|lavabos|badewanne|waschbecken",
    ).test(q)
  )
    return reject(
      question,
      "This takeoff needs evidence this parser does not extract.",
      intent,
    );
  if (
    word(
      "doors?|porte|portes|turen|windows?|fenster|finestre|fenetre|ikkuna",
    ).test(q)
  )
    return reject(
      question,
      "Door and window counting conventions are unresolved. Exact fixture counts need review.",
      intent,
    );
  const roomMatches = [
    ...q.matchAll(
      /\b(?:room|raum|raums|locale|piece|huone)\s+(-?\d+\.\d{2})(?![\d.])/g,
    ),
  ].map((m) => m[1]);
  const numericTargets = [
    ...q.matchAll(/(?<![\d.])-?\d+\.\d{2}(?![\d.])/g),
  ].map((m) => m[0]);
  if (new Set(numericTargets).size > 1)
    return reject(
      question,
      "Multiple numbered targets are ambiguous. Ask for one room or one labelled group.",
      intent,
    );
  const aptMatches = [
    ...q.matchAll(
      /\b(?:apartment|appartement|appartamento|wohnung)\s+([a-z])\b/g,
    ),
  ].map((m) => m[1]);
  if (
    new Set(roomMatches).size > 1 ||
    new Set(aptMatches).size > 1 ||
    (roomMatches.length && aptMatches.length)
  )
    return reject(
      question,
      "Multiple targets are ambiguous. Ask for one numbered room, one apartment or one labelled group.",
      intent,
    );
  let rooms = [],
    method = "",
    entities = [];
  const categoryTargets = [
    "bathrooms?|bad|bagno|badezimmer|salle de bain|kylpyhuone",
    "kitchens?|cucina|kuche|cuisine|keittio",
    "bedrooms?|schlafzimmer|chambre|camera",
    "balconies|balcony|balcone|balcon|balkon",
  ].filter((p) => word(p).test(q));
  if (
    categoryTargets.length > 1 ||
    (categoryTargets.length &&
      (roomMatches.length || aptMatches.length || labels.length))
  )
    return reject(
      question,
      "A numbered, apartment or labelled target cannot silently include another room category. Ask for one target.",
      intent,
    );
  if (
    labels.length &&
    word("apartments?|wohnungen|appartamenti|appartements").test(q)
  )
    return reject(
      question,
      "Room labels and apartments are different targets. Ask for one.",
      intent,
    );
  const hasExclusion = exclusion.test(q);
  if (
    hasExclusion &&
    !(
      intent === "area" &&
      (indoorSelector.test(q) || aptMatches.length) &&
      permittedIndoorExclusion(q)
    )
  )
    return reject(
      question,
      "This exclusion cannot be verified. Ask for one explicit target without exclusions.",
      intent,
    );
  const unhandled = completeRequestError(q);
  if (unhandled) return reject(question, unhandled, intent);
  if (roomMatches.length) {
    if (intent !== "area")
      return reject(
        question,
        "A numbered-room lookup supports area. Ask for an area in m².",
        intent,
      );
    rooms = model.rooms.filter((r) => r.roomId === roomMatches[0]);
    if (rooms.length !== 1)
      return reject(
        question,
        "That room number is missing or ambiguous.",
        intent,
      );
    if (labels.length && norm(rooms[0].label) !== norm(labels[0]))
      return reject(
        question,
        "The supplied label does not match that numbered room.",
        intent,
      );
    method = `Boundary of room ${roomMatches[0]}`;
  } else if (aptMatches.length) {
    if (intent !== "area")
      return reject(
        question,
        "Ask for apartment area, or the total apartment count.",
        intent,
      );
    const apt = model.apartments.find(
      (a) => a.name && norm(a.name) === aptMatches[0],
    );
    if (!apt)
      return reject(
        question,
        "That apartment boundary could not be located.",
        intent,
      );
    if (labels.length)
      return reject(
        question,
        "An apartment and a room label are different targets. Ask for one.",
        intent,
      );
    rooms = model.rooms.filter(
      (r) => r.unit === apt.id && r.numbered && !r.outdoor,
    );
    method = `Indoor numbered rooms in apartment ${apt.name}`;
  } else if (labels.length) {
    rooms = model.rooms.filter((r) => norm(r.label) === norm(labels[0]));
    if (!rooms.length)
      return reject(
        question,
        "No matching room label was found; a verified zero cannot be inferred.",
        intent,
      );
    if (
      model.entities.filter(
        (e) =>
          e.type === "TEXT" &&
          e.layer === "ROOM_TEXT" &&
          norm(e.text) === norm(labels[0]),
      ).length !== rooms.length
    )
      return reject(
        question,
        "Some labels cannot be linked to a unique boundary.",
        intent,
      );
    method = `Rooms labelled "${labels[0]}"`;
  } else if (
    intent === "count" &&
    word(
      "apartments|apartment|wohnungen|wohnung|appartamenti|appartament|appartements",
    ).test(q)
  ) {
    if (
      !model.apartments.length ||
      model.apartments.some((a) => !a.name) ||
      new Set(model.apartments.map((a) => a.name)).size !==
        model.apartments.length
    )
      return reject(
        question,
        "Apartment outlines are fragmented or unlabelled.",
        intent,
      );
    return {
      question,
      intent,
      status: "answer",
      value: model.apartments.length,
      unit: "count",
      rooms: [],
      entityIds: model.apartments.map((a) => a.id),
      method: "Count labelled UNIT_OUTLINE polygons",
      evidence: [
        "This uses explicit labelled apartment boundaries, not inferred symbols.",
      ],
      reason: null,
      engineVersion: VERSION,
      geometryVersion: GEOMETRY_VERSION,
    };
  } else if (intent === "area" && indoorSelector.test(q)) {
    rooms = model.rooms.filter((r) => r.numbered && !r.outdoor);
    method = "Sum of numbered indoor room boundaries";
  } else {
    const groups = [
      [
        "bathrooms?|bad|bagno|badezimmer|salle de bain|kylpyhuone",
        [
          "bad",
          "bagno",
          "badezimmer",
          "salle de bain",
          "bain",
          "wc",
          "toilette",
        ],
      ],
      [
        "kitchens?|cucina|kuche|cuisine|keittio",
        ["kitchen", "cucina", "kuche", "cuisine"],
      ],
      [
        "bedrooms?|schlafzimmer|chambre|camera",
        ["bedroom", "schlafzimmer", "chambre", "camera"],
      ],
      [
        "balconies|balcony|balcone|balcon|balkon",
        ["balcone", "balkon", "balcon"],
      ],
    ];
    const selected = groups.filter(([pattern]) => word(pattern).test(q));
    if (selected.length !== 1)
      return reject(
        question,
        "No single supported room target was identified. Use a room number or one quoted label.",
        intent,
      );
    rooms = model.rooms.filter((r) => selected[0][1].includes(norm(r.label)));
    method = "Match room labels across supported aliases";
  }
  if (!rooms.length)
    return reject(question, "No eligible room boundaries found.", intent);
  if (new Set(rooms.map((r) => r.roomId)).size !== rooms.length)
    return reject(
      question,
      "Several boundaries share a room number. A multipart room needs review.",
      intent,
    );
  if (
    (intent === "count" || rooms.length > 1) &&
    new Set(model.rooms.filter((r) => r.numbered).map((r) => r.roomId)).size !==
      model.rooms.filter((r) => r.numbered).length
  )
    return reject(
      question,
      "Room numbers are duplicated on this sheet; a complete group cannot be verified.",
      intent,
    );
  if (rooms.length > 1 && model.rooms.some((r) => r.numbered && !r.label))
    return reject(
      question,
      "Some numbered spaces have no label; a complete group cannot be verified.",
      intent,
    );
  if (rooms.some((r) => !r.safe))
    return reject(
      question,
      "A selected boundary or room identity is invalid.",
      intent,
    );
  if (intent === "area" && rooms.some((r) => r.agreement === false))
    return {
      ...reject(
        question,
        "Geometry and printed area disagree. Review the selected rooms.",
        intent,
      ),
      rooms,
    };
  const result = {
    question,
    intent,
    status: "answer",
    value:
      intent === "area" ? rooms.reduce((s, r) => s + r.area, 0) : rooms.length,
    unit: intent === "area" ? "m²" : "count",
    rooms,
    entityIds: rooms.map((r) => r.id),
    method,
    evidence: [
      intent === "area"
        ? "Area = ½ |Σ(xᵢyᵢ₊₁ − xᵢ₊₁yᵢ)| × metres per drawing unit²."
        : "One matched numbered boundary per room.",
      `Units from $INSUNITS = ${model.unit}; ${model.metres} m per drawing unit.`,
      `${rooms.filter((r) => r.agreement).length}/${rooms.length} selected rooms agree with printed area within 2%. This shares the source geometry, not independent validation.`,
    ],
    reason: null,
    engineVersion: VERSION,
    geometryVersion: GEOMETRY_VERSION,
  };
  return canExportAnswer(result)
    ? result
    : reject(
        question,
        "The result unit does not match the requested operation.",
        intent,
      );
}
