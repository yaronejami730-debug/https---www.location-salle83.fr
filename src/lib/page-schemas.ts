export type FieldType = "text" | "textarea" | "list";

export type ListItemField = { key: string; label: string; type: "text" | "textarea" };

export type PageField = {
  key: string;
  label: string;
  type: FieldType;
  default: string;
  /** "list" fields only: shape of each card, and the JSON-stringified default array. */
  itemFields?: ListItemField[];
};

export type PageSchema = { slug: string; label: string; fields: PageField[] };

/** A "list" field's value is a JSON array of objects keyed by itemFields[].key. */
export type ListItem = Record<string, string>;

export function parseListField(value: string): ListItem[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const pageSchemas: PageSchema[] = [
  {
    slug: "home",
    label: "Accueil",
    fields: [
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Vivez l'expérience du Domaine de" },
      { key: "hero_accent", label: "Hero — signature", type: "text", default: "la Bégude" },
      { key: "hero_description", label: "Hero — sous-titre", type: "text", default: "Mariages · Réceptions · Événements privés" },
      { key: "lieu_title", label: "Section \"Le lieu\" — titre", type: "text", default: "Le lieu" },
      { key: "lieu_text", label: "Section \"Le lieu\" — texte", type: "textarea", default: "Un domaine pensé pour accueillir vos plus beaux moments : nature préservée, bâtisses en pierre, lumière de Provence et attention portée à chaque détail. Ici, chaque événement devient une expérience." },
      { key: "histoire_title", label: "Section \"Notre histoire\" — titre", type: "text", default: "Notre histoire" },
      { key: "histoire_text", label: "Section \"Notre histoire\" — texte", type: "textarea", default: "Le Domaine de la Bégude a été créé en 1995, autour d'un mas provençal et de ses terres, avec l'envie de préserver un lieu authentique plutôt que d'en faire un simple décor. Année après année, le domaine s'est agrandi et transformé pour accueillir mariages, séminaires et réceptions, tout en gardant l'esprit du départ : un cadre vrai, chaleureux, où chaque événement devient un souvenir." },
      { key: "stats_title", label: "Section chiffres — titre", type: "text", default: "Le domaine en quelques chiffres" },
      { key: "stat1_value", label: "Chiffre 1 — valeur", type: "text", default: "3 ha" },
      { key: "stat1_label", label: "Chiffre 1 — légende", type: "text", default: "de domaine" },
      { key: "stat2_value", label: "Chiffre 2 — valeur", type: "text", default: "15" },
      { key: "stat2_label", label: "Chiffre 2 — légende", type: "text", default: "hébergements" },
      { key: "stat3_value", label: "Chiffre 3 — valeur", type: "text", default: "150" },
      { key: "stat3_label", label: "Chiffre 3 — légende", type: "text", default: "invités max" },
      { key: "stat4_value", label: "Chiffre 4 — valeur", type: "text", default: "900 m²" },
      { key: "stat4_label", label: "Chiffre 4 — légende", type: "text", default: "bâti" },
      { key: "stat5_label", label: "Case à part — texte", type: "text", default: "Salles et cuisine professionnelle" },
      { key: "galerie_title", label: "Section Galerie — titre", type: "text", default: "Galerie" },
      { key: "hebergement_title", label: "Section Hébergement — titre", type: "text", default: "Hébergement" },
      { key: "hebergement_text", label: "Section Hébergement — texte", type: "textarea", default: "15 mazets de 2 à 6 personnes, literie 4 étoiles, wifi et télévision, pour prolonger la fête et accueillir vos proches directement sur place." },
      { key: "choices_title", label: "Section 3 choix — titre", type: "text", default: "Que recherchez-vous ?" },
      { key: "choice_mariage_label", label: "Choix 1 — libellé", type: "text", default: "Mariage" },
      { key: "choice_evenements_label", label: "Choix 2 — libellé", type: "text", default: "Séminaire & Événements" },
      { key: "choice_domaine_label", label: "Choix 3 — libellé", type: "text", default: "Le domaine" },
      { key: "faq_title", label: "Section FAQ — titre", type: "text", default: "Questions fréquentes" },
      { key: "cta_title", label: "CTA final — titre", type: "text", default: "Parlons de votre projet" },
      { key: "cta_text", label: "CTA final — texte", type: "text", default: "Recevez une proposition personnalisée sous 48h." },
      { key: "cta_button", label: "CTA final — bouton", type: "text", default: "Parlons de votre projet" },
    ],
  },
  {
    slug: "mariage",
    label: "Mariage",
    fields: [
      { key: "eyebrow", label: "Hero — eyebrow (petit texte script au-dessus du titre)", type: "text", default: "Mariage" },
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Votre réception, votre ambiance, vos invités" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Un cadre authentiquement provençal pour célébrer votre union entourés des vôtres, du vin d'honneur à la soirée dansante." },
      { key: "intro_title", label: "Introduction — titre", type: "text", default: "Une fête à votre image" },
      { key: "intro_text", label: "Introduction — texte", type: "textarea", default: "Pour l'organisation de vos fêtes privées, la décoration, les accessoires, l'air de fête, pour \"marier\" ambiance, loisirs et jeux d'enfants, visitez le Domaine de la Bégude à Fayence. La salle de votre mariage se prête à tous les plans de table, à tous les placements d'invités. La table des mariés ou table d'honneur est centrale, accessible à la vue de tous vos invités. Les mariés doivent pouvoir se lever et tourner entre les tables. Votre but est de faire plaisir, d'obtenir une ambiance gaie et détendue, de faciliter photos et vidéos..." },
      {
        key: "features",
        label: "Atouts (cartes)",
        type: "list",
        itemFields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "text", label: "Texte", type: "textarea" },
        ],
        default: JSON.stringify([
          { title: "Cérémonie", text: "Un cadre naturel pour une cérémonie laïque ou religieuse, en extérieur ou sous une charpente en pierre." },
          { title: "Réception & décoration", text: "Salles et terrasses modulables, table d'honneur visible de tous, accompagnement pour la décoration et le plan de table." },
          { title: "Exclusivité", text: "Le domaine est privatisé pour votre événement, sans autre mariage le même jour." },
        ]),
      },
      { key: "zigzag1_title", label: "Section détail 1 — titre", type: "text", default: "Votre plan de table" },
      { key: "zigzag1_text", label: "Section détail 1 — texte", type: "textarea", default: "Marques places, noms de tables, chevalets, mais aussi à l'affichage ou à la distribution du plan de table à l'arrivée de vos invités. Confiez à deux personnes au moins l'accueil et l'organisation pour que votre mariage soit une réussite aux yeux de chacun !" },
      { key: "zigzag2_title", label: "Section détail 2 — titre", type: "text", default: "Une décoration qui vous ressemble" },
      { key: "zigzag2_text", label: "Section détail 2 — texte", type: "textarea", default: "La décoration de la salle et des tables est essentielle : elle crée une ambiance inoubliable pour ce jour de fête unique. Fleurs, voyages, musique, cinéma, sport... mettez vos passions en avant, déclinées table par table et même invité par invité ! Nous vous aidons, si vous le souhaitez, à choisir votre décoration et vos accessoires, à élaborer le plan et l'organisation qui correspondent le mieux à l'ambiance que vous visez." },
      { key: "zigzag3_title", label: "Section détail 3 — titre", type: "text", default: "Vos invités bien installés" },
      { key: "zigzag3_text", label: "Section détail 3 — texte", type: "textarea", default: "C'est votre fête et celle de vos invités : elle doit être une réussite pour tout le monde. À votre disposition, 15 mazets de 2 à 6 personnes pour vous et vos invités." },
      { key: "zigzag1_interval", label: "Section détail 1 — vitesse fondu (s)", type: "text", default: "6" },
      { key: "zigzag2_interval", label: "Section détail 2 — vitesse fondu (s)", type: "text", default: "6" },
      { key: "zigzag3_interval", label: "Section détail 3 — vitesse fondu (s)", type: "text", default: "6" },
    ],
  },
  {
    slug: "seminaire",
    label: "Séminaire & Événements",
    fields: [
      { key: "eyebrow", label: "Hero — eyebrow (petit texte script au-dessus du titre)", type: "text", default: "Paris & Événements" },
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Travail, détente et cohésion dans un cadre privilégié" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Séminaires, formations, événements d'entreprise, incentive : à 30 minutes de Grasse, Antibes, Cannes, Fréjus-Saint-Raphaël ou Draguignan." },
      { key: "intro_title", label: "Introduction — titre", type: "text", default: "Un cadre propice au travail" },
      { key: "intro_button", label: "Introduction — texte du bouton (défile vers la grille tarifaire)", type: "text", default: "Voir la grille tarifaire" },
      { key: "intro_text", label: "Introduction — texte (non affiché)", type: "textarea", default: "Vous cherchez un lieu de séminaire à la fois original, calme et agréable pour l'organisation d'un événement professionnel, tout en restant proche des Alpes-Maritimes, dans l'Est du Var ? Vous souhaitez une salle en location pour vous réunir ou réaliser une formation avec possibilité de restauration, un hébergement associé, des activités de team building, une animation événementielle, bref un lieu vous permettant d'associer travail et détente ou encore incentive et tourisme ?" },
      { key: "feature1_title", label: "Atout 1 — titre", type: "text", default: "Salles de travail" },
      { key: "feature1_text", label: "Atout 1 — texte", type: "textarea", default: "Espaces équipés, lumineux et modulables pour réunions, ateliers et conférences." },
      { key: "feature2_title", label: "Atout 2 — titre", type: "text", default: "Team building" },
      { key: "feature2_text", label: "Atout 2 — texte", type: "textarea", default: "Piscine, boulodrome, terrain de volley et 3 hectares de nature pour renforcer la cohésion d'équipe." },
      { key: "feature3_title", label: "Atout 3 — titre", type: "text", default: "Hébergement sur place" },
      { key: "feature3_text", label: "Atout 3 — texte", type: "textarea", default: "15 hébergements permettent de loger vos équipes sans quitter le domaine." },
      { key: "feature1_interval", label: "Atout 1 — vitesse fondu (s)", type: "text", default: "6" },
      { key: "feature2_interval", label: "Atout 2 — vitesse fondu (s)", type: "text", default: "6" },
      { key: "feature3_interval", label: "Atout 3 — vitesse fondu (s)", type: "text", default: "6" },
      { key: "events_title", label: "Types d'événements — titre", type: "text", default: "Un cadre unique pour tous vos événements privés" },
      { key: "events_text", label: "Types d'événements — texte", type: "textarea", default: "Vous souhaitez organiser une soirée originale avec ou sans animation, dans un lieu privatif pour vous et vos amis ? Pour vos soirées, réceptions, banquets, soirées à thème, soirées dansantes, soirées de gala, soirées jeu ou quiz, dans un lieu calme et agréable avec possibilité de restauration et d'hébergement, nous vous mettons en relation directe avec des traiteurs, cuisiniers, animateurs, artistes, décorateurs, DJ, photographes et prestataires de spectacles." },
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
      { key: "eyebrow", label: "Hero — eyebrow (petit texte script au-dessus du titre)", type: "text", default: "Le domaine" },
      { key: "hero_title", label: "Hero — titre", type: "text", default: "3 hectares de nature préservée en plein cœur du Var" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Bâtisses en pierre, jardins méditerranéens et lumière de Provence : un lieu pensé pour accueillir vos plus beaux moments." },
      {
        key: "features",
        label: "Atouts (cartes)",
        type: "list",
        itemFields: [
          { key: "title", label: "Titre", type: "text" },
          { key: "text", label: "Texte", type: "textarea" },
        ],
        default: JSON.stringify([
          { title: "Piscine & espaces extérieurs", text: "Piscine, boulodrome, terrain de volley et espace enfants pour profiter du domaine entre deux réceptions." },
          { title: "Cuisine professionnelle", text: "Cuisine équipée aux normes, ouverte aux traiteurs, avec chambres froides et matériel professionnel." },
          { title: "Étang & nature", text: "Un étang et des jardins méditerranéens offrant un cadre naturel pour vos photos et vidéos." },
        ]),
      },
      { key: "amenities_title", label: "Équipements — titre", type: "text", default: "Équipements" },
      {
        key: "amenities",
        label: "Équipements (cartes icône + texte)",
        type: "list",
        itemFields: [
          { key: "icon", label: "Icône", type: "text" },
          { key: "text", label: "Texte", type: "text" },
        ],
        default: JSON.stringify([
          { icon: "wifi", text: "Wifi inclus" },
          { icon: "parking", text: "Parking inclus" },
          { icon: "pool", text: "Piscine extérieure" },
          { icon: "paw", text: "Accepte les animaux" },
          { icon: "child", text: "Adapté aux enfants" },
          { icon: "restaurant", text: "Restaurant" },
          { icon: "kitchen", text: "Cuisine dans tous les mazets" },
          { icon: "fitness", text: "Centre de fitness" },
        ]),
      },
    ],
  },
  {
    slug: "hebergement",
    label: "Hébergement",
    fields: [
      { key: "eyebrow", label: "Hero — eyebrow (petit texte script au-dessus du titre)", type: "text", default: "Hébergement" },
      { key: "hero_title", label: "Hero — titre", type: "text", default: "15 mazets au cœur du domaine" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "15 mazets de 2 à 6 personnes, literie 4 étoiles, wifi et télévision, pour accueillir vos proches et prolonger la fête sans quitter les lieux." },
      { key: "intro_title", label: "Section équipements — titre", type: "text", default: "Un confort pensé pour prolonger la fête" },
      { key: "intro_text", label: "Section équipements — texte", type: "textarea", default: "Chaque mazet dispose d'une literie 4 étoiles, d'une salle de bain privative et de tout le nécessaire pour un séjour confortable. Idéal pour loger vos proches directement sur place, sans quitter l'ambiance de votre événement." },
      { key: "amenities_title", label: "Équipements — titre", type: "text", default: "Équipements" },
      {
        key: "amenities",
        label: "Équipements (cartes icône + texte)",
        type: "list",
        itemFields: [
          { key: "icon", label: "Icône", type: "text" },
          { key: "text", label: "Texte", type: "text" },
        ],
        default: JSON.stringify([
          { icon: "wifi", text: "Wifi inclus" },
          { icon: "parking", text: "Parking inclus" },
          { icon: "kitchen", text: "Cuisine équipée" },
          { icon: "pool", text: "Accès à la piscine" },
        ]),
      },
      { key: "gallery_cta", label: "Bouton vers la galerie", type: "text", default: "Voir la galerie entière" },
      { key: "booking_cta", label: "Bouton réserver un hébergement", type: "text", default: "Réserver un hébergement ↗" },
    ],
  },
  {
    slug: "galerie",
    label: "Galerie",
    fields: [
      { key: "eyebrow", label: "Hero — eyebrow (petit texte script au-dessus du titre)", type: "text", default: "Galerie" },
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
      { key: "eyebrow", label: "Hero — eyebrow (petit texte script au-dessus du titre)", type: "text", default: "Contact" },
      { key: "hero_title", label: "Hero — titre", type: "text", default: "Parlons de votre projet" },
      { key: "hero_description", label: "Hero — sous-titre", type: "textarea", default: "Remplissez le formulaire ci-dessous, nous revenons vers vous sous 48h avec une proposition personnalisée." },
      { key: "form_event_label", label: "Formulaire — libellé \"Votre événement\"", type: "text", default: "Votre événement" },
      { key: "form_event_mariage", label: "Formulaire — option \"Mariage\"", type: "text", default: "Mariage" },
      { key: "form_event_seminaire", label: "Formulaire — option \"Séminaire\"", type: "text", default: "Séminaire" },
      { key: "form_event_reception", label: "Formulaire — option \"Événements & réceptions\"", type: "text", default: "Événements & réceptions" },
      { key: "form_event_hebergement", label: "Formulaire — option \"Hébergement\"", type: "text", default: "Hébergement" },
      { key: "form_event_autre", label: "Formulaire — option \"Autre\"", type: "text", default: "Autre" },
      { key: "form_hebergement_title", label: "Formulaire — bloc hébergement, titre", type: "text", default: "Réservation d'hébergement" },
      { key: "form_hebergement_text", label: "Formulaire — bloc hébergement, texte", type: "textarea", default: "Les séjours en mazet se réservent directement sur notre site de réservation, avec les disponibilités en temps réel." },
      { key: "form_hebergement_cta", label: "Formulaire — bloc hébergement, bouton", type: "text", default: "Réserver un hébergement ↗" },
      { key: "form_date_label", label: "Formulaire — libellé date", type: "text", default: "Date souhaitée" },
      { key: "form_guests_label", label: "Formulaire — libellé nombre de personnes", type: "text", default: "Nombre de personnes" },
      { key: "form_options_label", label: "Formulaire — libellé \"Options souhaitées\"", type: "text", default: "Options souhaitées" },
      { key: "form_option_lendemain", label: "Formulaire — option \"Accès le lendemain\"", type: "text", default: "Accès le lendemain" },
      { key: "form_option_piscine", label: "Formulaire — option \"Accès piscine\"", type: "text", default: "Accès piscine" },
      { key: "form_option_vaisselle", label: "Formulaire — option \"Vaisselle complète\"", type: "text", default: "Vaisselle complète" },
      { key: "form_option_cuisine", label: "Formulaire — option \"Cuisine professionnelle\"", type: "text", default: "Cuisine professionnelle" },
      { key: "form_chapiteau_label", label: "Formulaire — libellé \"Chapiteaux\"", type: "text", default: "Chapiteaux" },
      { key: "form_civility_label", label: "Formulaire — libellé civilité", type: "text", default: "Civilité (plusieurs choix possibles)" },
      { key: "form_firstname_label", label: "Formulaire — libellé prénom", type: "text", default: "Prénom" },
      { key: "form_lastname_label", label: "Formulaire — libellé nom", type: "text", default: "Nom" },
      { key: "form_address_label", label: "Formulaire — libellé adresse", type: "text", default: "Adresse postale" },
      { key: "form_email_label", label: "Formulaire — libellé email", type: "text", default: "Email" },
      { key: "form_phone_label", label: "Formulaire — libellé téléphone", type: "text", default: "Téléphone (facultatif)" },
      { key: "form_message_label", label: "Formulaire — libellé message (si \"Autre\")", type: "text", default: "Précisez votre demande" },
      { key: "form_submit_label", label: "Formulaire — bouton d'envoi", type: "text", default: "Recevoir ma proposition" },
      { key: "form_success_title", label: "Formulaire — écran succès, titre", type: "text", default: "Merci pour votre demande" },
      { key: "form_success_text", label: "Formulaire — écran succès, texte", type: "textarea", default: "Vous allez recevoir d'ici quelques secondes un mail récapitulatif reprenant votre numéro de demande ainsi que l'estimation ci-dessous." },
      { key: "form_civility_madame", label: "Formulaire — case civilité \"Madame\"", type: "text", default: "Madame" },
      { key: "form_civility_monsieur", label: "Formulaire — case civilité \"Monsieur\"", type: "text", default: "Monsieur" },
      { key: "form_reference_label", label: "Formulaire — libellé numéro de demande", type: "text", default: "Votre numéro de demande :" },
      { key: "form_quote_estimate_label", label: "Formulaire — devis, libellé \"Estimation\"", type: "text", default: "Estimation" },
      { key: "form_quote_arrhes_label", label: "Formulaire — devis, libellé \"Arrhes\"", type: "text", default: "Arrhes (50%)" },
      { key: "form_quote_caution_label", label: "Formulaire — devis, libellé \"Caution\"", type: "text", default: "Caution (à l'arrivée, en espèces)" },
      { key: "form_quote_menage_note", label: "Formulaire — devis, note ménage", type: "textarea", default: "Ménage à la charge du locataire, ou facturé 30 €/heure selon l'état des lieux." },
      { key: "form_quote_success_disclaimer", label: "Formulaire — devis, note (écran succès)", type: "text", default: "Estimation indicative, confirmée par notre équipe." },
      { key: "form_quote_empty_hint", label: "Formulaire — devis, texte avant saisie", type: "text", default: "Indiquez le nombre de personnes pour voir une estimation en direct." },
      { key: "form_explore_before", label: "Formulaire — écran succès, texte avant le lien FAQ", type: "text", default: "En attendant, prenez le temps d'explorer le site et notre" },
      { key: "form_explore_after", label: "Formulaire — écran succès, texte après le lien FAQ", type: "text", default: ", qui répond à la plupart des questions sur le domaine." },
      { key: "form_submit_loading_label", label: "Formulaire — bouton d'envoi, texte pendant l'envoi", type: "text", default: "Envoi en cours..." },
      { key: "form_error_message", label: "Formulaire — message d'erreur", type: "textarea", default: "Une erreur est survenue. Merci de réessayer ou de nous appeler directement." },
    ],
  },
];

export function getSchema(slug: string) {
  return pageSchemas.find((p) => p.slug === slug) ?? null;
}

export function fieldValue(content: Record<string, string> | null | undefined, field: PageField): string {
  return content?.[field.key] || field.default;
}
