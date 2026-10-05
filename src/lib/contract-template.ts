/**
 * Editable clauses of the contract PDF (src/lib/contract-pdf.tsx). Clause 1
 * (event/pricing table) and the signature block stay code-driven — they're
 * built from the lead's actual data, not free text.
 *
 * Clauses are a single ordered, editable list stored as JSON under the
 * "contrat" page's `clauses` content key — add/remove/reorder freely from
 * the admin, instead of a fixed clause2..clause12 shape. The one special
 * item (`special: "arrhes"`) keeps a computed amount (title/body text stay
 * editable, the € amount itself is always the live quote's arrhes) and
 * can't be removed, but can be reordered like any other clause.
 *
 * A body is stored as one line per paragraph/bullet (admin edits it as a
 * single textarea): a line starting with "- " renders as a bullet, any
 * other non-empty line renders as a paragraph.
 */
export type ClauseItem = {
  id: string;
  title: string;
  body: string;
  pageBreak: boolean;
  special?: "arrhes";
};

export const DEFAULT_CLAUSES: ClauseItem[] = [
  {
    id: "clause2",
    title: "MENAGE :",
    body: "Le ménage doit être fait par le locataire\nOu payé selon l'état de la salle : Tarif en vigueur = 30 € de l'heure",
    pageBreak: false,
  },
  {
    id: "clause3",
    title: "MONTANT CAUTION :",
    body: "1 000 EUROS en espèces payable d'avance à la prise en charge de la salle et restituée au départ, déduction faite éventuellement des détériorations occasionnées, des objets manquants et du nettoyage selon l'état des lieux.",
    pageBreak: false,
  },
  {
    id: "clause4",
    title: "ATTESTATION D'ASSURANCE :",
    body: "Avertir votre assureur de l'événement, (gratuit dans la plupart des cas). Fournir l'attestation de responsabilité civile.",
    pageBreak: false,
  },
  {
    id: "clause5",
    title: "PRISE EN CHARGE DE LA SALLE ET DE LA CUISINE :",
    body: "La salle peut être prise la veille de l'évènement à partir de 9 h, jusqu'à 19 h afin d'approvisionner les réfrigérateurs et de décorer la salle.\nPossibilité de brancher une sono dans une salle prévue à cet effet. L'équipement de la sonorisation devra être adapté à la dimension de la salle pour ne pas créer de nuisance sonore selon la législation en vigueur.\nLe jour de l'évènement, la fête peut durer jusqu'à 4 heures du matin mais la musique devra être baissée de façon conséquente ou certaines portes et fenêtres seront fermées à partir de 23H30 afin de préserver la tranquillité des résidents et selon la législation en vigueur.",
    pageBreak: false,
  },
  {
    id: "clause6",
    title: "EQUIPEMENTS DE LA SALLE ET DE LA CUISINE :",
    body: "Tarif en fonction du Nombre de personnes (voir le tableau en première page)\nSupplément utilisation de la cuisine forfait de {{cuisine_min}} à {{cuisine_max}} euros. Une cuisine professionnelle de 49 M² pour orchestrer vos repas.\n- Cinq frigos pour le stockage de toutes vos denrées alimentaires.\n- Une machine à Glaçons\n- Deux pianos de cuisson.\n- Deux Gaz pour faire vos cuissons.\n- Deux fours (un Gaz et un électrique) — Gaz en Bouteille non inclus, à voir ensemble selon vos besoins.\n- Deux fours micro-ondes\n- Salamandre\n- Deux étuves de petite taille.\n- Un espace plonge équipée (Machine à laver et d'un double évier en inox)\nSupplément utilisation de la vaisselle forfait de {{vaisselle_min}} à {{vaisselle_max}} euros. (sur demande la vaisselle : assiettes, verres, couverts). Un inventaire sera signé par le locataire.\nUtilisation en Extérieur : Supplément pour la location des chaises Blanches soit 1 euro pièce. Et les rendre nettoyées !\nSupplément Le lendemain Forfait de {{lendemain_min}} à {{lendemain_max}} Euros\nSupplément Accès Piscine Forfait de {{piscine_min}} à {{piscine_max}} Euros\nSupplément « aucun Gîte réservé » Forfait de 500 Euros. Ce supplément est toutefois possible d'être annulé en partie ou totalement dans le cas où vous louez des logements dans le Domaine de la Bégude. Exemple : Un logement loué vous permettra d'avoir une remise de 10% sur cette option unique. Ex : Cinq Logements 50% de remise sur cette option, et à partir de 10 logements réservés sur le domaine, ceci vous permettra l'annulation de ce supplément de 500 euros.\nInclus dans le tarif :\n- La salle de 90 M² est aménagée de tables rectangulaires ou rondes avec les chaises. Soit : 5 Tables Rondes d'un diamètre de 180 pour 12 personnes maxi, + 6 Tables Rondes d'un diamètre de 152 pour 8 personnes.\n- Double sanitaires avec sas.\n- Ainsi qu'une terrasse de 90 M².\n- Incluse Piste de danse en plus de 60 m² (pour les événements de plus de 65 Pers Gratuit).",
    pageBreak: false,
  },
  {
    id: "clause7",
    title: "MONTANT ARRHES :",
    body: "50 % du montant total payable le jour de la réservation, (non remboursées en cas d'annulation)",
    pageBreak: false,
    special: "arrhes",
  },
  {
    id: "clause8",
    title: "HYGIENE ET PROPRETE :",
    body: "- Interdiction de fumer dans salle\n- Les mégots doivent être éteints soigneusement dans les cendriers placés sur la terrasse et non pas jetés au sol afin de respecter les lieux et la nature environnante\n- Les poubelles sont situées à l'entrée de la Résidence et tous les détritus doivent y être déposés dans des sacs poubelles à la fin de la manifestation. De plus, il est obligatoire de faire le tri du verre et du plastique durant votre séjour. La direction du Domaine de la Begude se réserve le droit de conserver la totalité de la caution en cas de non-respect des règles.\n- Règlement de la Piscine : Horaire d'ouverture 9H à 20H\nLa piscine n'étant pas surveillée, nous prions les parents de bien vouloir accompagner les enfants de moins de 15 ans, même s'ils savent nager. Un accident est si vite arrivé ! Le Bailleur décline toute responsabilité éventuelle. Vous êtes priés d'informer vos invités du règlement de la Piscine.\n- De vous déchausser à l'entrée et de laisser vos chaussures de chaque côté de l'escalier dans le gazon\n- De tremper vos pieds dans le pédiluve à chaque fois que vous entrez en piscine.\n- De vous doucher obligatoirement avant chaque baignade (de la tête aux pieds)\n- Interdits en piscine : Les contenants en Verre, les sodas, l'alcool, les chiens, de fumer (toutes cigarettes même vapotage), la nourriture en général (excepté l'eau en bouteille plastique)\n- La musique est interdite en Piscine.\n- De ranger les transats utilisés et de les mettre en position horizontale lors de votre départ.\nDurant votre absence sur les lieux, il est interdit de laisser vos serviettes de bains sur les transats afin de les réserver.\n- Tout manquement à ces règles entrainera la fermeture de la Piscine immédiate.",
    pageBreak: false,
  },
  {
    id: "clause9",
    title: "CHAPITEAU :",
    body: "Couvre une belle partie de la terrasse extérieure.\n- Tarif unitaire : {{chapiteau}} Euros\n- En stock deux chapiteaux de cette taille : Dimension 8 Mts x 4 Mts pouvant accueillir 32 personnes par chapiteau.\n- En stock trois chapiteaux de cette taille : Dimension 4 Mts x 4 Mts pouvant accueillir 12 personnes par chapiteau.",
    pageBreak: false,
  },
  {
    id: "clause10",
    title: "L'INVENTAIRE :",
    body: "A signer le jour de la prise en charge de la salle. (Tout matériel détérioré ou cassé devra être remboursé au retour des clés).",
    pageBreak: false,
  },
  {
    id: "clause11",
    title: "TARIFS des HEBERGEMENTS en Formule Hôtel",
    body: "Le Domaine de la Begude pourra accueillir environ 60 Personnes.\nExemple : Pour un Mazet 2/4 Personnes 110 à 135 Euros la Nuitée en formule Hôtel.\nA certaines dates, un minimum de nuitée par logement vous sera demandé. Exemple en période estivale : en Juillet quatre nuitées et en Août 6 ou 7 nuitées.\nLa Formule Hôtel : sont inclus Draps, serviettes de toilette et ménage final selon le nombre de jours choisi. + Montant des Taxes de séjour (soit 1,30 €/pers de plus de 17 ans et par jour).\nA certaines périodes, l'ensemble des gîtes est indissociable du Contrat de location de Salle, c'est-à-dire qu'ils doivent être intégrés en totalité ou en partie.",
    pageBreak: false,
  },
  {
    id: "clause12",
    title: "LE REGLEMENT DE LA PRESTATION",
    body: "Le solde et la caution doivent être payés à l'arrivée dans les lieux.",
    pageBreak: false,
  },
];

/** Reads the "clauses" JSON field from saved content, falling back to the built-in defaults if it's missing entirely (never customized). */
export function resolveClauses(content: Record<string, string> | undefined): ClauseItem[] {
  const raw = content?.clauses;
  if (!raw) return DEFAULT_CLAUSES;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_CLAUSES;
  } catch {
    return DEFAULT_CLAUSES;
  }
}

/** Default text of clause 1 (the intro above the pricing table). Editable from the admin; price tokens ({{salle_min}}, {{salle_31dec}}…) are filled from the live grid, or type a fixed amount instead. */
export const DEFAULT_CLAUSE1_INTRO =
  "Les Tarifs et les Options : (En fonction du nombre de personnes le jour de l'évènement) Enfants comme adultes sont comptabilisés.\n(FORFAIT SALLE MINIMUM de {{salle_min}} euros, Sauf le 31 Décembre {{salle_31dec}} Euros).";

export const DEFAULT_CLAUSE1_TITLE = "EVENEMENT :";

export function resolveClause1(content: Record<string, string> | undefined): { title: string; intro: string } {
  return {
    title: content?.clause1_title?.trim() || DEFAULT_CLAUSE1_TITLE,
    intro: content?.clause1_intro?.trim() || DEFAULT_CLAUSE1_INTRO,
  };
}

/** Storage key of the "start this block on a new page" flag for the two fixed, non-reorderable blocks (the pricing table and the signature). */
export function pageBreakKey(blockKey: "clause1" | "signature"): string {
  return `${blockKey}_pagebreak`;
}

export function hasPageBreak(content: Record<string, string> | undefined, blockKey: "clause1" | "signature"): boolean {
  return content?.[pageBreakKey(blockKey)] === "1";
}

/**
 * Price variables usable in clause titles/bodies, e.g. "{{chapiteau}} €".
 * They are filled from the live pricing grid when the PDF is generated, so
 * editing the grid updates the contract with no clause edit. "_min"/"_max"
 * are the smallest/largest value across all brackets; "salle_31dec" is the
 * minimum room price + 100 € (the New Year's Eve surcharge).
 */
export const PRICE_TOKENS: { token: string; label: string }[] = [
  { token: "salle_min", label: "Forfait salle minimum" },
  { token: "salle_31dec", label: "Forfait salle minimum le 31 décembre (+100 €)" },
  { token: "lendemain_min", label: "Lendemain — minimum" },
  { token: "lendemain_max", label: "Lendemain — maximum" },
  { token: "piscine_min", label: "Piscine — minimum" },
  { token: "piscine_max", label: "Piscine — maximum" },
  { token: "vaisselle_min", label: "Vaisselle — minimum" },
  { token: "vaisselle_max", label: "Vaisselle — maximum" },
  { token: "cuisine_min", label: "Cuisine — minimum" },
  { token: "cuisine_max", label: "Cuisine — maximum" },
  { token: "chapiteau", label: "Prix d'un chapiteau" },
];

export function fillPriceTokens(
  text: string,
  brackets: { salle: number; lendemain: number; piscine: number; vaisselle: number; cuisine: number }[],
  chapiteauUnitPrice: number,
): string {
  if (!text.includes("{{")) return text;
  const range = (k: "lendemain" | "piscine" | "vaisselle" | "cuisine") => {
    const v = brackets.map((b) => b[k]);
    return v.length ? [Math.min(...v), Math.max(...v)] : [0, 0];
  };
  const salleMin = brackets.length ? Math.min(...brackets.map((b) => b.salle)) : 0;
  const values: Record<string, number> = {
    salle_min: salleMin,
    salle_31dec: salleMin + 100,
    chapiteau: chapiteauUnitPrice,
  };
  for (const k of ["lendemain", "piscine", "vaisselle", "cuisine"] as const) {
    const [lo, hi] = range(k);
    values[`${k}_min`] = lo;
    values[`${k}_max`] = hi;
  }
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (m, key: string) => (key in values ? String(values[key]) : m));
}

export type ClauseLine = { type: "text" | "bullet"; content: string };

export function parseClauseBody(body: string): ClauseLine[] {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.startsWith("- ") ? { type: "bullet" as const, content: line.slice(2) } : { type: "text" as const, content: line }));
}
