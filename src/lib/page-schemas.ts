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
      { key: "stat3_value", label: "Chiffre 3 — valeur", type: "text", default: "150" },
      { key: "stat3_label", label: "Chiffre 3 — légende", type: "text", default: "invités max" },
      { key: "stat4_value", label: "Chiffre 4 — valeur", type: "text", default: "Fayence" },
      { key: "stat4_label", label: "Chiffre 4 — légende", type: "text", default: "Var" },
      { key: "galerie_title", label: "Section Galerie — titre", type: "text", default: "Galerie" },
      { key: "hebergement_title", label: "Section Hébergement — titre", type: "text", default: "Hébergement" },
      { key: "hebergement_text", label: "Section Hébergement — texte", type: "textarea", default: "15 mazets de 2 à 6 personnes, literie 4 étoiles, wifi et télévision, pour prolonger la fête et accueillir vos proches directement sur place." },
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
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Un cadre authentiquement provençal pour célébrer votre union entourés des vôtres, du vin d'honneur à la soirée dansante." },
      { key: "feature1_title", label: "Atout 1 — titre", type: "text", default: "Cérémonie" },
      { key: "feature1_text", label: "Atout 1 — texte", type: "textarea", default: "Un cadre naturel pour une cérémonie laïque ou religieuse, en extérieur ou sous une charpente en pierre." },
      { key: "feature2_title", label: "Atout 2 — titre", type: "text", default: "Réception & décoration" },
      { key: "feature2_text", label: "Atout 2 — texte", type: "textarea", default: "Salles et terrasses modulables, table d'honneur visible de tous, accompagnement pour la décoration et le plan de table." },
      { key: "feature3_title", label: "Atout 3 — titre", type: "text", default: "Exclusivité" },
      { key: "feature3_text", label: "Atout 3 — texte", type: "textarea", default: "Le domaine est privatisé pour votre événement, sans autre mariage le même jour." },
    ],
  },
  {
    slug: "seminaire",
    label: "Séminaire",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Travail, détente et cohésion dans un cadre privilégié" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Séminaires, formations, événements d'entreprise, incentive : à 30 minutes de Grasse, Antibes, Cannes, Fréjus-Saint-Raphaël ou Draguignan." },
      { key: "feature1_title", label: "Atout 1 — titre", type: "text", default: "Salles de travail" },
      { key: "feature1_text", label: "Atout 1 — texte", type: "textarea", default: "Espaces équipés, lumineux et modulables pour réunions, ateliers et conférences." },
      { key: "feature2_title", label: "Atout 2 — titre", type: "text", default: "Team building" },
      { key: "feature2_text", label: "Atout 2 — texte", type: "textarea", default: "Piscine, boulodrome, terrain de volley et 3 hectares de nature pour renforcer la cohésion d'équipe." },
      { key: "feature3_title", label: "Atout 3 — titre", type: "text", default: "Hébergement sur place" },
      { key: "feature3_text", label: "Atout 3 — texte", type: "textarea", default: "15 hébergements permettent de loger vos équipes sans quitter le domaine." },
    ],
  },
  {
    slug: "evenements",
    label: "Événements & réceptions",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Un cadre unique pour tous vos événements privés" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Entre Cannes et Draguignan, un lieu privatif pour vos soirées et réceptions : nous vous mettons en relation avec traiteurs, DJ et photographes selon vos besoins." },
      { key: "event1", label: "Type d'événement 1", type: "text", default: "Anniversaires, communions & baptêmes" },
      { key: "event2", label: "Type d'événement 2", type: "text", default: "Soirées à thème & réveillon" },
      { key: "event3", label: "Type d'événement 3", type: "text", default: "Tournages & shootings" },
      { key: "event4", label: "Type d'événement 4", type: "text", default: "Événements d'entreprise" },
      { key: "pricing_title", label: "Grille tarifaire — titre", type: "text", default: "Grille tarifaire" },
      { key: "pricing_note", label: "Grille tarifaire — note", type: "textarea", default: "À partir de 18 € par personne. Forfait salle minimum : 1700 € (1800 € le 31 décembre). Tarifs en fonction du nombre de personnes le jour de l'événement, enfants comme adultes." },
    ],
  },
  {
    slug: "domaine",
    label: "Le domaine",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "3 hectares de nature préservée en plein cœur du Var" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Bâtisses en pierre, jardins méditerranéens et lumière de Provence : un lieu pensé pour accueillir vos plus beaux moments." },
      { key: "feature1_title", label: "Atout 1 — titre", type: "text", default: "Piscine & espaces extérieurs" },
      { key: "feature1_text", label: "Atout 1 — texte", type: "textarea", default: "Piscine, boulodrome, terrain de volley et espace enfants pour profiter du domaine entre deux réceptions." },
      { key: "feature2_title", label: "Atout 2 — titre", type: "text", default: "Cuisine professionnelle" },
      { key: "feature2_text", label: "Atout 2 — texte", type: "textarea", default: "Cuisine équipée aux normes, ouverte aux traiteurs, avec chambres froides et matériel professionnel." },
      { key: "feature3_title", label: "Atout 3 — titre", type: "text", default: "Étang & nature" },
      { key: "feature3_text", label: "Atout 3 — texte", type: "textarea", default: "Un étang et des jardins méditerranéens offrant un cadre naturel pour vos photos et vidéos." },
    ],
  },
  {
    slug: "hebergement",
    label: "Hébergement",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "15 mazets au cœur du domaine" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "15 mazets de 2 à 6 personnes, literie 4 étoiles, wifi et télévision, pour accueillir vos proches et prolonger la fête sans quitter les lieux." },
    ],
  },
  {
    slug: "galerie",
    label: "Galerie",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Le domaine en images" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Un aperçu des lieux, des réceptions et des hébergements du domaine." },
      { key: "events_title", label: "Section 1 — titre", type: "text", default: "Mariages & séminaires" },
      { key: "hebergement_title", label: "Section 2 — titre", type: "text", default: "Hébergement" },
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
