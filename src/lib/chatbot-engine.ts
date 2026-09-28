import { chatbotFaq, type FaqEntry } from "@/lib/faq-data";

const STOPWORDS = new Set(
  [
    "le", "la", "les", "l", "un", "une", "des", "de", "du", "d", "et", "ou", "a", "au", "aux",
    "ce", "ces", "cette", "cet", "que", "qui", "quoi", "dont", "est", "es", "etes", "sont", "suis",
    "il", "elle", "ils", "elles", "on", "nous", "vous", "je", "tu", "me", "te", "se", "s",
    "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses", "notre", "nos", "votre", "vos", "leur", "leurs",
    "pour", "avec", "sans", "sur", "sous", "dans", "chez", "par", "entre", "vers",
    "y", "en", "si", "ne", "pas", "plus", "tres", "bien", "tout", "toute", "tous", "toutes",
    "peut", "peux", "pouvez", "pouvons", "pourrait", "pourrais", "faut", "faire", "fait",
    "avoir", "avez", "avons", "ai", "as", "veux", "voudrais", "voudrait", "aimerais",
    "cherche", "cherchons", "besoin", "svp", "merci", "bonjour", "salut", "hello",
    "comment", "quel", "quelle", "quels", "quelles", "combien", "pourquoi", "quand", "jamais",
    "sera", "serait", "seront", "etait", "etaient", "va", "vais", "allons", "allez", "vont",
  ].map(normalizeText),
);

// tokens gardés malgré leur brièveté (porteurs de sens)
const KEEP_SHORT = new Set(["dj", "wc", "km", "ya", "clim"]);

const HIGH_CONFIDENCE = 0.55;
const LOW_CONFIDENCE = 0.22;
const AMBIGUITY_MARGIN = 1.4;

function normalizeText(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(" ")
    .filter((t) => t.length > 0)
    .filter((t) => KEEP_SHORT.has(t) || /^\d+$/.test(t) || (t.length > 2 && !STOPWORDS.has(t)));
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const dp: number[] = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[b.length];
}

/** Tolère les fautes de frappe : distance d'édition proportionnelle à la longueur du mot.
 * Les mots courts (<5 lettres) exigent une correspondance exacte pour éviter les faux amis
 * ("sera"/"fera", "clim"/"clic"...). */
function fuzzyEquals(a: string, b: string): boolean {
  if (a === b) return true;
  const maxLen = Math.max(a.length, b.length);
  // Tolérance à un seul mot-clé distinctif, jamais deux : au-delà, des mots différents mais
  // proches ("cuisine"/"cuisinier") finissent par se confondre à tort (voir section 6 du cahier
  // des charges : la cuisine ne doit pas être interprétée comme le traiteur).
  const tolerance = maxLen >= 6 ? 1 : 0;
  if (Math.abs(a.length - b.length) > tolerance) return false;
  return levenshtein(a, b) <= tolerance;
}

type EntryIndex = {
  entry: FaqEntry;
  bag: Set<string>;
  keywordSet: Set<string>;
};

let indexCache: EntryIndex[] | null = null;
let idfCache: Map<string, number> | null = null;

function buildIndex(): { index: EntryIndex[]; idf: Map<string, number> } {
  if (indexCache && idfCache) return { index: indexCache, idf: idfCache };

  const index: EntryIndex[] = chatbotFaq.map((entry) => {
    const bag = new Set<string>();
    const keywordSet = new Set<string>();
    for (const k of entry.keywords) {
      for (const t of tokenize(k)) {
        bag.add(t);
        keywordSet.add(t);
      }
    }
    for (const t of tokenize(entry.question)) bag.add(t);
    for (const v of entry.variants) for (const t of tokenize(v)) bag.add(t);
    return { entry, bag, keywordSet };
  });

  const df = new Map<string, number>();
  for (const { bag } of index) {
    for (const t of bag) df.set(t, (df.get(t) ?? 0) + 1);
  }
  const idf = new Map<string, number>();
  const n = index.length;
  for (const [t, count] of df) idf.set(t, Math.log(1 + n / count));

  indexCache = index;
  idfCache = idf;
  return { index, idf };
}

export type IntentMatch = {
  entry: FaqEntry;
  confidence: number;
};

export type ChatbotResult = {
  matches: IntentMatch[];
  status: "answered" | "clarify" | "unknown";
  clarifyOptions?: FaqEntry[];
};

// Phrase canonique partagée avec le prompt système du chatbot IA (src/app/api/chat/route.ts) :
// permet de détecter côté serveur qu'une question est restée sans réponse (pour l'alerte email).
export const FALLBACK_MESSAGE =
  "Je n'ai pas cette information précise dans les renseignements dont je dispose. Je vous conseille de contacter directement le Domaine de la Bégude afin qu'ils puissent vous confirmer ce point.";

/** Vrai si la réponse du chatbot (moteur local ou IA) signale qu'elle n'a pas trouvé l'information. */
export function isUnansweredReply(text: string): boolean {
  return text.includes("Je n'ai pas cette information précise");
}

/** Score chaque intention pour un message libre, en tolérant fautes, absence d'accents et reformulations. */
function scoreEntries(message: string): { entry: FaqEntry; confidence: number; raw: number }[] {
  const { index, idf } = buildIndex();
  const tokens = Array.from(new Set(tokenize(message)));
  if (tokens.length === 0) return [];

  const totalIdf = tokens.reduce((sum, t) => sum + (idf.get(t) ?? Math.log(1 + index.length)), 1e-6);

  const results = index.map(({ entry, bag, keywordSet }) => {
    let raw = 0;
    let keywordHits = 0;
    for (const t of tokens) {
      // La tolérance aux fautes ne s'applique qu'aux mots-clés distinctifs (curés, peu nombreux) :
      // l'appliquer à tout le sac de mots ferait matcher des paires accidentelles sans lien de
      // sens ("coûte"/"route", "salle"/"sale"...).
      const isKeywordHit = keywordSet.has(t) || Array.from(keywordSet).some((k) => fuzzyEquals(t, k));
      if (!isKeywordHit && !bag.has(t)) continue;
      if (isKeywordHit) keywordHits++;
      const weight = idf.get(t) ?? Math.log(1 + index.length);
      raw += isKeywordHit ? weight * 2 : weight;
    }
    let confidence = Math.min(1, raw / totalIdf);
    // Message d'un seul mot dont le seul point commun avec l'intention est un mot générique
    // (ex. "mariage" cité en passant dans plusieurs FAQ) : pas assez distinctif pour trancher seul.
    if (tokens.length === 1 && keywordHits === 0) confidence *= 0.5;
    return { entry, raw, confidence };
  });

  return results.filter((r) => r.raw > 0).sort((a, b) => b.raw - a.raw);
}

/**
 * Comprend un message libre (fautes, familier, indirect, plusieurs questions en une phrase)
 * et retourne les intentions reconnues à partir de la base officielle, sans jamais inventer.
 */
export function understandMessage(message: string): ChatbotResult {
  const scored = scoreEntries(message);

  if (scored.length === 0) {
    return { matches: [], status: "unknown" };
  }

  const top = scored[0];

  if (top.confidence < LOW_CONFIDENCE) {
    return { matches: [], status: "unknown" };
  }

  // plusieurs intentions confiantes dans un seul message ("dormir sur place ET combien ça coûte")
  const confident = scored.filter((r) => r.confidence >= HIGH_CONFIDENCE);
  if (confident.length > 0) {
    return {
      matches: confident.map((r) => ({ entry: r.entry, confidence: r.confidence })),
      status: "answered",
    };
  }

  // score intermédiaire : n'accepter que si l'intention se détache nettement des suivantes
  const second = scored[1];
  const clearlyAhead = !second || top.confidence >= second.confidence * AMBIGUITY_MARGIN;
  if (clearlyAhead) {
    return { matches: [{ entry: top.entry, confidence: top.confidence }], status: "answered" };
  }

  return {
    matches: [],
    status: "clarify",
    clarifyOptions: scored.slice(0, 3).map((r) => r.entry),
  };
}

/** Construit la réponse naturelle envoyée au visiteur (jamais de score/intention visible). */
export function answerMessage(message: string): string {
  const result = understandMessage(message);

  if (result.status === "unknown") return FALLBACK_MESSAGE;

  if (result.status === "clarify" && result.clarifyOptions) {
    const options = result.clarifyOptions.map((e) => `« ${e.question} »`).join(" ou ");
    return `Votre question est un peu générale, pouvez-vous préciser ? Vouliez-vous dire ${options} ?`;
  }

  const seen = new Set<string>();
  const answers: string[] = [];
  for (const m of result.matches) {
    if (seen.has(m.entry.id)) continue;
    seen.add(m.entry.id);
    answers.push(m.entry.answer);
    if (answers.length >= 3) break;
  }
  return answers.join("\n\n");
}

/**
 * Étage de récupération pour le RAG : renvoie les passages de la base officielle les plus
 * pertinents pour la question (et le contexte récent), à injecter dans le prompt du LLM plutôt
 * que d'envoyer toute la base à chaque appel. Purement lexical pour l'instant — remplaçable par
 * une recherche par embeddings sans changer l'appelant.
 */
export function retrieveContext(query: string, topK = 5): FaqEntry[] {
  const scored = scoreEntries(query).filter((r) => r.confidence >= LOW_CONFIDENCE);
  const seen = new Set<string>();
  const entries: FaqEntry[] = [];
  for (const r of scored) {
    if (seen.has(r.entry.id)) continue;
    seen.add(r.entry.id);
    entries.push(r.entry);
    if (entries.length >= topK) break;
  }
  return entries;
}
