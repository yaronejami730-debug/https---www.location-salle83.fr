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

/** Option supplémentaire libre (ex. « Sono », « Photobooth ») ajoutée depuis l'admin, au même titre que le chapiteau : un libellé et un prix forfaitaire. */
export type ExtraOption = { id: string; label: string; price: number };

export type QuoteOptions = {
  guestCount: number;
  lendemain: boolean;
  piscine: boolean;
  vaisselle: boolean;
  cuisine: boolean;
  chapiteauCount: number;
  /** Ids des options supplémentaires cochées (voir getExtraOptions). */
  extraIds?: string[];
};

/** Les options supplémentaires vivent dans leur propre ligne `pages` (slug "tarifs-options") pour ne pas entrer en conflit avec l'enregistrement de la page Séminaire. */
export async function getExtraOptions(): Promise<ExtraOption[]> {
  const supabase = supabasePublic();
  const { data } = await supabase.from("pages").select("content").eq("slug", "tarifs-options").maybeSingle();
  return parseExtraOptions((data?.content as Record<string, string> | null)?.extras);
}

export function parseExtraOptions(raw: string | undefined | null): ExtraOption[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((o) => o && typeof o.id === "string" && typeof o.label === "string" && o.label.trim())
      .map((o) => ({ id: o.id, label: o.label.trim(), price: Number.isFinite(Number(o.price)) ? Math.max(0, Number(o.price)) : 0 }));
  } catch {
    return [];
  }
}

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

export function computeQuote(
  options: QuoteOptions,
  brackets: PricingBracket[],
  chapiteauUnitPrice = DEFAULT_CHAPITEAU_UNIT_PRICE,
  extraOptions: ExtraOption[] = [],
) {
  const bracket = findBracket(options.guestCount, brackets);
  if (!bracket) return null;

  const chapiteauTotal = Math.max(0, options.chapiteauCount) * chapiteauUnitPrice;
  const extrasTotal = extraOptions.filter((o) => options.extraIds?.includes(o.id)).reduce((sum, o) => sum + o.price, 0);
  const total =
    bracket.salle +
    (options.lendemain ? bracket.lendemain : 0) +
    (options.piscine ? bracket.piscine : 0) +
    (options.vaisselle ? bracket.vaisselle : 0) +
    (options.cuisine ? bracket.cuisine : 0) +
    chapiteauTotal +
    extrasTotal;

  return {
    bracket,
    chapiteauTotal,
    extrasTotal,
    total,
    arrhes: Math.round(total * 0.5),
  };
}
