export type FieldType = "text" | "textarea";

export type PageField = { key: string; label: string; type: FieldType; default: string };

export type PageSchema = { slug: string; label: string; fields: PageField[] };

export const pageSchemas: PageSchema[] = [
  {
    slug: "home",
    label: "Accueil",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Un lieu d'exception pour vos moments inoubliables" },
      { key: "hero_description", label: "Hero — sous-titre", type: "text", default: "Mariages · Séminaires · Réceptions · Événements privés" },
      { key: "lieu_title", label: "Section \"Le lieu\" — titre", type: "text", default: "Le lieu" },
      { key: "lieu_text", label: "Section \"Le lieu\" — texte", type: "textarea", default: "Un domaine pensé pour accueillir vos plus beaux moments : nature préservée, bâtisses en pierre, lumière de Provence et attention portée à chaque détail. Ici, chaque événement devient une expérience." },
      { key: "mariage_card_title", label: "Carte Mariage — titre", type: "text", default: "Mariage" },
      { key: "mariage_card_text", label: "Carte Mariage — texte", type: "text", default: "Votre réception, votre ambiance, vos invités." },
      { key: "seminaire_card_title", label: "Carte Séminaire — titre", type: "text", default: "Séminaire" },
      { key: "seminaire_card_text", label: "Carte Séminaire — texte", type: "text", default: "Travail, détente et cohésion dans un cadre privilégié." },
      { key: "stats_title", label: "Section chiffres — titre", type: "text", default: "Le domaine en quelques chiffres" },
      { key: "stat1_value", label: "Chiffre 1 — valeur", type: "text", default: "3 ha" },
      { key: "stat1_label", label: "Chiffre 1 — légende", type: "text", default: "de domaine" },
      { key: "stat2_value", label: "Chiffre 2 — valeur", type: "text", default: "15" },
      { key: "stat2_label", label: "Chiffre 2 — légende", type: "text", default: "hébergements" },
      { key: "stat3_value", label: "Chiffre 3 — valeur", type: "text", default: "180" },
      { key: "stat3_label", label: "Chiffre 3 — légende", type: "text", default: "invités max" },
      { key: "stat4_value", label: "Chiffre 4 — valeur", type: "text", default: "Fayence" },
      { key: "stat4_label", label: "Chiffre 4 — légende", type: "text", default: "Var" },
      { key: "galerie_title", label: "Section Galerie — titre", type: "text", default: "Galerie" },
      { key: "hebergement_title", label: "Section Hébergement — titre", type: "text", default: "Hébergement" },
      { key: "hebergement_text", label: "Section Hébergement — texte", type: "textarea", default: "15 mazets et chambres répartis sur le domaine pour prolonger la fête et accueillir vos proches directement sur place." },
      { key: "faq_title", label: "Section FAQ — titre", type: "text", default: "Questions fréquentes" },
      { key: "cta_title", label: "CTA final — titre", type: "text", default: "Parlons de votre projet" },
      { key: "cta_text", label: "CTA final — texte", type: "text", default: "Recevez une proposition personnalisée sous 48h." },
      { key: "cta_button", label: "CTA final — bouton", type: "text", default: "Demander un devis" },
    ],
  },
  {
    slug: "mariage",
    label: "Mariage",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Votre réception, votre ambiance, vos invités" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Un domaine privé en Provence pour célébrer votre union entourés des vôtres, du vin d'honneur à la soirée dansante." },
      { key: "feature1_title", label: "Atout 1 — titre", type: "text", default: "Cérémonie" },
      { key: "feature1_text", label: "Atout 1 — texte", type: "textarea", default: "Un cadre naturel pour une cérémonie laïque ou religieuse, en extérieur ou sous une charpente en pierre." },
      { key: "feature2_title", label: "Atout 2 — titre", type: "text", default: "Réception" },
      { key: "feature2_text", label: "Atout 2 — texte", type: "textarea", default: "Salles et terrasses modulables pour votre vin d'honneur, dîner et soirée dansante." },
      { key: "feature3_title", label: "Atout 3 — titre", type: "text", default: "Exclusivité" },
      { key: "feature3_text", label: "Atout 3 — texte", type: "textarea", default: "Le domaine est privatisé pour votre événement, sans autre mariage le même jour." },
    ],
  },
  {
    slug: "seminaire",
    label: "Séminaire",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Travail, détente et cohésion dans un cadre privilégié" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Un domaine privé en Provence pour vos séminaires d'entreprise, entre espaces de travail et moments de convivialité." },
      { key: "feature1_title", label: "Atout 1 — titre", type: "text", default: "Salles de travail" },
      { key: "feature1_text", label: "Atout 1 — texte", type: "textarea", default: "Espaces équipés, lumineux et modulables pour réunions, ateliers et conférences." },
      { key: "feature2_title", label: "Atout 2 — titre", type: "text", default: "Team building" },
      { key: "feature2_text", label: "Atout 2 — texte", type: "textarea", default: "Activités en extérieur sur un domaine de 3 hectares pour renforcer la cohésion d'équipe." },
      { key: "feature3_title", label: "Atout 3 — titre", type: "text", default: "Hébergement sur place" },
      { key: "feature3_text", label: "Atout 3 — texte", type: "textarea", default: "15 hébergements permettent de loger vos équipes sans quitter le domaine." },
    ],
  },
  {
    slug: "evenements",
    label: "Événements & réceptions",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Un cadre unique pour tous vos événements privés" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Anniversaire, réception, tournage ou dîner privé : le domaine se privatise pour donner vie à votre projet." },
      { key: "event1", label: "Type d'événement 1", type: "text", default: "Anniversaires" },
      { key: "event2", label: "Type d'événement 2", type: "text", default: "Réceptions privées" },
      { key: "event3", label: "Type d'événement 3", type: "text", default: "Tournages & shootings" },
      { key: "event4", label: "Type d'événement 4", type: "text", default: "Dîners de gala" },
      { key: "pricing_title", label: "Grille tarifaire — titre", type: "text", default: "Grille tarifaire" },
      { key: "pricing_note", label: "Grille tarifaire — note", type: "textarea", default: "Forfait salle minimum : 1700 € (1800 € le 31 décembre). Tarifs en fonction du nombre de personnes le jour de l'événement, enfants comme adultes." },
    ],
  },
  {
    slug: "domaine",
    label: "Le domaine",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "3 hectares de nature préservée en plein cœur du Var" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Bâtisses en pierre, jardins méditerranéens et lumière de Provence : un lieu pensé pour accueillir vos plus beaux moments." },
    ],
  },
  {
    slug: "hebergement",
    label: "Hébergement",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "15 hébergements au cœur du domaine" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Mazets et chambres répartis sur le domaine pour accueillir vos proches et prolonger la fête sans quitter les lieux." },
    ],
  },
  {
    slug: "galerie",
    label: "Galerie",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Le domaine en images" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Un aperçu des lieux, des réceptions et des hébergements du domaine." },
    ],
  },
  {
    slug: "contact",
    label: "Contact",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Parlons de votre projet" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Remplissez le formulaire ci-dessous, nous revenons vers vous sous 48h avec une proposition personnalisée." },
    ],
  },
];

export function getSchema(slug: string) {
  return pageSchemas.find((p) => p.slug === slug) ?? null;
}

export function fieldValue(content: Record<string, string> | null | undefined, field: PageField): string {
  return content?.[field.key] || field.default;
}
