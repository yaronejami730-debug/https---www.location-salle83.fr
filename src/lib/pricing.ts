import { supabasePublic } from "./supabase-public";

export type PricingBracket = {
  key: string;
  label: string;
  maxGuests: number;
  salle: number;
  lendemain: number;
  piscine: number;
  vaisselle: number;
  cuisine: number;
};

/** Repli si la table pricing_brackets est vide ou inaccessible. */
export const DEFAULT_PRICING_BRACKETS: PricingBracket[] = [
  { key: "40", label: "-40 pers.", maxGuests: 40, salle: 1700, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { key: "50", label: "-50 pers.", maxGuests: 50, salle: 1800, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { key: "65", label: "-65 pers.", maxGuests: 65, salle: 1950, lendemain: 300, piscine: 200, vaisselle: 120, cuisine: 230 },
  { key: "80", label: "-80 pers.", maxGuests: 80, salle: 2100, lendemain: 350, piscine: 250, vaisselle: 130, cuisine: 250 },
  { key: "95", label: "-95 pers.", maxGuests: 95, salle: 2250, lendemain: 400, piscine: 300, vaisselle: 140, cuisine: 270 },
  { key: "110", label: "-110 pers.", maxGuests: 110, salle: 2400, lendemain: 450, piscine: 350, vaisselle: 150, cuisine: 290 },
];

/** Repli si le champ "Prix du chapiteau" (page Séminaire) est vide ou inaccessible. */
export const DEFAULT_CHAPITEAU_UNIT_PRICE = 200;

export type QuoteOptions = {
  guestCount: number;
  lendemain: boolean;
  piscine: boolean;
  vaisselle: boolean;
  cuisine: boolean;
  chapiteauCount: number;
};

export async function getChapiteauUnitPrice(): Promise<number> {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pages").select("content").eq("slug", "seminaire").maybeSingle();
  const raw = (data?.content as Record<string, string> | null)?.chapiteau_price;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_CHAPITEAU_UNIT_PRICE;
}

export async function getPricingBrackets(): Promise<PricingBracket[]> {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pricing_brackets").select("*").order("sort_order", { ascending: true });
  if (!data || data.length === 0) return DEFAULT_PRICING_BRACKETS;
  return data.map((row) => ({
    key: row.key,
    label: row.label,
    maxGuests: row.max_guests,
    salle: row.salle,
    lendemain: row.lendemain,
    piscine: row.piscine,
    vaisselle: row.vaisselle,
    cuisine: row.cuisine,
  }));
}

export function findBracket(guestCount: number, brackets: PricingBracket[]): PricingBracket | null {
  if (!guestCount || guestCount <= 0) return null;
  return brackets.find((b) => guestCount <= b.maxGuests) ?? null;
}

/** Phrase prête à injecter dans le contexte du chatbot : tarif de base de la salle pour ce nombre d'invités. */
export function describeBaseRate(guestCount: number, brackets: PricingBracket[], chapiteauUnitPrice = DEFAULT_CHAPITEAU_UNIT_PRICE): string | null {
  const bracket = findBracket(guestCount, brackets);
  if (!bracket) return null;
  return `Pour un événement jusqu'à ${bracket.maxGuests} personnes, le tarif de base de la location de la salle est de ${bracket.salle} €. En supplément selon les besoins : le lendemain (${bracket.lendemain} €), l'accès piscine le lendemain (${bracket.piscine} €), la vaisselle (${bracket.vaisselle} €), la cuisine professionnelle (${bracket.cuisine} €), et les chapiteaux (${chapiteauUnitPrice} € l'unité). Un acompte de 50 % du montant total est demandé à la réservation.`;
}

export function computeQuote(options: QuoteOptions, brackets: PricingBracket[], chapiteauUnitPrice = DEFAULT_CHAPITEAU_UNIT_PRICE) {
  const bracket = findBracket(options.guestCount, brackets);
  if (!bracket) return null;

  const chapiteauTotal = Math.max(0, options.chapiteauCount) * chapiteauUnitPrice;
  const total =
    bracket.salle +
    (options.lendemain ? bracket.lendemain : 0) +
    (options.piscine ? bracket.piscine : 0) +
    (options.vaisselle ? bracket.vaisselle : 0) +
    (options.cuisine ? bracket.cuisine : 0) +
    chapiteauTotal;

  return {
    bracket,
    chapiteauTotal,
    total,
    arrhes: Math.round(total * 0.5),
  };
}
