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

export const pricingBrackets: PricingBracket[] = [
  { key: "40", label: "-40 pers.", maxGuests: 40, salle: 1700, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { key: "50", label: "-50 pers.", maxGuests: 50, salle: 1800, lendemain: 250, piscine: 150, vaisselle: 110, cuisine: 200 },
  { key: "65", label: "-65 pers.", maxGuests: 65, salle: 1950, lendemain: 300, piscine: 200, vaisselle: 120, cuisine: 230 },
  { key: "80", label: "-80 pers.", maxGuests: 80, salle: 2100, lendemain: 350, piscine: 250, vaisselle: 130, cuisine: 250 },
  { key: "95", label: "-95 pers.", maxGuests: 95, salle: 2250, lendemain: 400, piscine: 300, vaisselle: 140, cuisine: 270 },
  { key: "110", label: "-110 pers.", maxGuests: 110, salle: 2400, lendemain: 450, piscine: 350, vaisselle: 150, cuisine: 290 },
];

export const CHAPITEAU_UNIT_PRICE = 200;

export type QuoteOptions = {
  guestCount: number;
  lendemain: boolean;
  piscine: boolean;
  vaisselle: boolean;
  cuisine: boolean;
  chapiteauCount: number;
};

export function findBracket(guestCount: number): PricingBracket | null {
  if (!guestCount || guestCount <= 0) return null;
  return pricingBrackets.find((b) => guestCount <= b.maxGuests) ?? null;
}

export function computeQuote(options: QuoteOptions) {
  const bracket = findBracket(options.guestCount);
  if (!bracket) return null;

  const chapiteauTotal = Math.max(0, options.chapiteauCount) * CHAPITEAU_UNIT_PRICE;
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
