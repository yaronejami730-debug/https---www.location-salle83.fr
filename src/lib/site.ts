export const siteConfig = {
  name: "Domaine de la Bégude",
  tagline: "Un lieu d'exception pour vos moments inoubliables",
  address: "4876 RD 562, La Bégude, 83440 Fayence",
  locality: "Fayence, Var",
  // domainedelabegude.fr returns 403 (not actually pointed at the deployment) —
  // domainedelabegude-reception.com is the real, working custom domain.
  domain: "https://www.domainedelabegude-reception.com",
  appUrl: "https://www.domainedelabegude-reception.com",
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
  { label: "Séminaire & Événements", href: "/seminaire" },
  { label: "Le domaine", href: "/domaine" },
  { label: "Hébergement", href: "/hebergement" },
  { label: "Galerie", href: "/galerie" },
  { label: "Faq", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
