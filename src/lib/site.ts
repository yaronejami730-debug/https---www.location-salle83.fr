export const siteConfig = {
  name: "Domaine de la Bégude",
  tagline: "Un lieu d'exception pour vos moments inoubliables",
  address: "4876 RD 562, La Bégude, 83440 Fayence",
  locality: "Fayence, Var",
  domain: "https://www.domainedelabegude.fr",
  // Actual reachable deployment (custom domain not pointed here yet) — use for
  // links that must work right now (QR codes, the /api/contrat route), not SEO metadata.
  appUrl: "https://domaine-begude.vercel.app",
  phone: "+33 6 08 06 72 34",
  phoneLandline: "+33 4 94 39 09 60",
  email: "domainedelabegude@orange.fr",
  lat: 43.58489007966609,
  lng: 6.652272484118086,
};

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Mariage", href: "/mariage" },
  { label: "Séminaire", href: "/seminaire" },
  { label: "Événements & réceptions", href: "/evenements" },
  { label: "Le domaine", href: "/domaine" },
  { label: "Hébergement", href: "/hebergement" },
  { label: "Galerie", href: "/galerie" },
  { label: "Contact", href: "/contact" },
];
