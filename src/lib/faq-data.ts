export type FaqEntry = { keywords: string[]; question: string; answer: string };

export const chatbotFaq: FaqEntry[] = [
  {
    keywords: ["loger", "dormir", "hebergement", "nuit", "chambre", "mazet", "participant"],
    question: "Peut-on loger les participants ?",
    answer:
      "Oui, une soixantaine de personnes dans quinze mazets de deux à six personnes. Comptez 110 à 135 € la nuitée pour un mazet de deux à quatre personnes en formule hôtel, draps, serviettes et ménage final compris, plus la taxe de séjour de 1,30 € par personne de plus de 17 ans et par jour.",
  },
  {
    keywords: ["mobilite", "reduite", "handicap", "pmr", "accessible", "fauteuil"],
    question: "Le domaine est-il accessible aux personnes à mobilité réduite ?",
    answer:
      "Les hébergements sont annoncés accessibles aux personnes à mobilité réduite par le domaine. Pour un besoin précis — cheminement, sanitaires, place de stationnement — appelez avant de réserver afin qu'il soit vérifié sur place.",
  },
  {
    keywords: ["wifi", "internet", "telephone", "television", "connexion"],
    question: "Y a-t-il le wifi ?",
    answer:
      "Les mazets sont équipés du wifi, du téléphone et de la télévision. Pour la couverture de la salle de réunion et les équipements de projection, contactez-nous afin de vérifier vos besoins.",
  },
  {
    keywords: ["journee", "semaine", "weekend", "week-end", "duree", "location salle"],
    question: "La salle peut-elle être louée à la journée ou à la semaine ?",
    answer:
      "Oui : à la journée, au week-end ou à la semaine. Le forfait de la grille tarifaire correspond à une journée d'événement ; les autres jours se chiffrent sur devis (voir supplément du lendemain).",
  },
  {
    keywords: ["capacite", "personne", "invite", "combien", "accueillir"],
    question: "Quelle est la capacité pour un événement ?",
    answer:
      "La grille tarifaire couvre les groupes jusqu'à 110 personnes, par paliers de 40, 50, 65, 80, 95 et 110 participants. Au-delà, cela est possible en combinant salle, terrasse et chapiteaux, soit devis sur demande.",
  },
  {
    keywords: ["traiteur", "impose", "cuisine", "restauration", "cuisinier", "repas"],
    question: "Faut-il prendre un traiteur imposé ?",
    answer:
      "Non. Ni restauration ni traiteur ne sont imposés. Une cuisine professionnelle de 49 m² est mise à disposition en supplément (200 à 290 € selon le nombre de convives) pour votre traiteur, votre cuisinier à domicile ou vous-même.",
  },
  {
    keywords: ["heure", "fete", "musique", "bruit", "fin de soiree", "duree soiree"],
    question: "Jusqu'à quelle heure la fête peut-elle durer ?",
    answer:
      "Jusqu'à quatre heures du matin. En cours de soirée, le volume de la musique est baissé et certaines portes et fenêtres sont fermées, pour préserver la tranquillité des résidents et respecter la réglementation sur le bruit.",
  },
  {
    keywords: ["reserver", "reservation", "contrat", "arrhes", "caution", "assurance", "prevoir"],
    question: "Comment réserve-t-on, et que faut-il prévoir ?",
    answer:
      "La réservation est actée par la signature du contrat et le versement de 50 % du montant total, non remboursables en cas d'annulation. Le solde et une caution de 1000 € sont réglés à l'arrivée. Il faut également fournir une attestation de responsabilité civile — votre assureur la délivre gratuitement dans la plupart des cas.",
  },
  {
    keywords: ["ou", "adresse", "localisation", "acces", "fayence", "var", "route", "situe"],
    question: "Où se trouve exactement le domaine ?",
    answer:
      "Au 4876 route départementale 562, lieu-dit La Bégude, 83440 Fayence, dans le Var. À 35 km de Grasse, 23 km de Fréjus Saint-Raphaël et 30 km de Cannes, par l'autoroute A8, sortie Les Adrets.",
  },
  {
    keywords: ["exclusif", "prive", "seul", "autre mariage", "privatisation"],
    question: "Le domaine est-il privatisé en exclusivité ?",
    answer: "Oui, le domaine se privatise en exclusivité pour votre événement, sans autre réception le même jour.",
  },
  {
    keywords: ["seminaire", "entreprise", "reunion", "team building"],
    question: "Organisez-vous des séminaires d'entreprise ?",
    answer: "Oui, le domaine accueille séminaires, réunions et journées de team building avec salles équipées et hébergement sur place.",
  },
  {
    keywords: ["devis", "contact", "disponibilite"],
    question: "Comment obtenir un devis ?",
    answer: "Remplissez le formulaire de la page Contact avec votre date et le nombre d'invités : nous revenons vers vous sous 48h.",
  },
];
