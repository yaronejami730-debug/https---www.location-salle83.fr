export const siteConfig = {
  name: "Domaine de la Bégude",
  tagline: "Un lieu d'exception pour vos moments inoubliables",
  locality: "Fayence, Var",
  domain: "https://www.domainedelabegude.fr",
  phone: "+33 6 08 06 72 34",
  email: "domainedelabegude@orange.fr",
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
