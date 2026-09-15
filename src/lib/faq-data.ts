export type FaqEntry = { keywords: string[]; question: string; answer: string };

export const chatbotFaq: FaqEntry[] = [
  {
    keywords: ["personne", "capacite", "invite", "combien"],
    question: "Combien de personnes le domaine peut-il accueillir ?",
    answer: "Le domaine accueille jusqu'à 180 invités pour une réception assise, avec plusieurs espaces modulables en intérieur et extérieur.",
  },
  {
    keywords: ["dormir", "hebergement", "nuit", "loger", "chambre"],
    question: "Peut-on dormir sur place ?",
    answer: "Oui, le domaine dispose de 15 hébergements pour loger une partie de vos invités directement sur place.",
  },
  {
    keywords: ["exclusif", "prive", "seul", "autre mariage"],
    question: "Le domaine est-il privatisé en exclusivité ?",
    answer: "Oui, le domaine se privatise en exclusivité pour votre événement, sans autre réception le même jour.",
  },
  {
    keywords: ["prix", "tarif", "budget", "cout", "combien coute"],
    question: "Quel est le tarif de location ?",
    answer: "Le tarif dépend de la date, du nombre d'invités et de la formule choisie. Faites une demande de devis pour recevoir une proposition personnalisée.",
  },
  {
    keywords: ["ou", "adresse", "localisation", "acces", "fayence", "var"],
    question: "Où se trouve le domaine ?",
    answer: "Le domaine se situe à Fayence, dans le Var, en Provence.",
  },
  {
    keywords: ["seminaire", "entreprise", "reunion", "team building"],
    question: "Organisez-vous des séminaires d'entreprise ?",
    answer: "Oui, le domaine accueille séminaires, réunions et journées de team building avec salles équipées et hébergement sur place.",
  },
  {
    keywords: ["devis", "contact", "reserver", "disponibilite"],
    question: "Comment obtenir un devis ?",
    answer: "Remplissez le formulaire de la page Contact avec votre date et le nombre d'invités : nous revenons vers vous sous 48h.",
  },
];
