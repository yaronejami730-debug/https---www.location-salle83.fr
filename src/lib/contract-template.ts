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
    body: "Tarif en fonction du Nombre de personnes (voir le tableau en première page)\nSupplément utilisation de la cuisine forfait de 200 à 290 euros. Une cuisine professionnelle de 49 M² pour orchestrer vos repas.\n- Cinq frigos pour le stockage de toutes vos denrées alimentaires.\n- Une machine à Glaçons\n- Deux pianos de cuisson.\n- Deux Gaz pour faire vos cuissons.\n- Deux fours (un Gaz et un électrique) — Gaz en Bouteille non inclus, à voir ensemble selon vos besoins.\n- Deux fours micro-ondes\n- Salamandre\n- Deux étuves de petite taille.\n- Un espace plonge équipée (Machine à laver et d'un double évier en inox)\nSupplément utilisation de la vaisselle forfait de 110 à 150 euros. (sur demande la vaisselle : assiettes, verres, couverts). Un inventaire sera signé par le locataire.\nUtilisation en Extérieur : Supplément pour la location des chaises Blanches soit 1 euro pièce. Et les rendre nettoyées !\nSupplément Le lendemain Forfait de 250 à 450 Euros\nSupplément Accès Piscine Forfait de 150 à 350 Euros\nSupplément « aucun Gîte réservé » Forfait de 500 Euros. Ce supplément est toutefois possible d'être annulé en partie ou totalement dans le cas où vous louez des logements dans le Domaine de la Bégude. Exemple : Un logement loué vous permettra d'avoir une remise de 10% sur cette option unique. Ex : Cinq Logements 50% de remise sur cette option, et à partir de 10 logements réservés sur le domaine, ceci vous permettra l'annulation de ce supplément de 500 euros.\nInclus dans le tarif :\n- La salle de 90 M² est aménagée de tables rectangulaires ou rondes avec les chaises. Soit : 5 Tables Rondes d'un diamètre de 180 pour 12 personnes maxi, + 6 Tables Rondes d'un diamètre de 152 pour 8 personnes.\n- Double sanitaires avec sas.\n- Ainsi qu'une terrasse de 90 M².\n- Incluse Piste de danse en plus de 60 m² (pour les événements de plus de 65 Pers Gratuit).",
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
    body: "Couvre une belle partie de la terrasse extérieure.\n- Tarif unitaire : 200 Euros\n- En stock deux chapiteaux de cette taille : Dimension 8 Mts x 4 Mts pouvant accueillir 32 personnes par chapiteau.\n- En stock trois chapiteaux de cette taille : Dimension 4 Mts x 4 Mts pouvant accueillir 12 personnes par chapiteau.",
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

/** Storage key of the "start this block on a new page" flag for the two fixed, non-reorderable blocks (the pricing table and the signature). */
export function pageBreakKey(blockKey: "clause1" | "signature"): string {
  return `${blockKey}_pagebreak`;
}

export function hasPageBreak(content: Record<string, string> | undefined, blockKey: "clause1" | "signature"): boolean {
  return content?.[pageBreakKey(blockKey)] === "1";
}

export type ClauseLine = { type: "text" | "bullet"; content: string };

export function parseClauseBody(body: string): ClauseLine[] {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.startsWith("- ") ? { type: "bullet" as const, content: line.slice(2) } : { type: "text" as const, content: line }));
}
