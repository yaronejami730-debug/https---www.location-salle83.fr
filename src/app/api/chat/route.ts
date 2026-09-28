import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { answerMessage, FALLBACK_MESSAGE, isUnansweredReply, retrieveContext } from "@/lib/chatbot-engine";
import { describeBaseRate } from "@/lib/pricing";
import { sendAlertEmail } from "@/lib/brevo-mail";

type ChatMessage = { role: "user" | "assistant"; content: string };

const TECH_ERROR_MESSAGE =
  "Désolé, je rencontre momentanément un problème technique. Pouvez-vous réessayer dans quelques instants ?";

function alertUnansweredQuestion(question: string) {
  void sendAlertEmail(
    "Chatbot : question sans réponse",
    `<p>Le chatbot du site n'a pas su répondre à cette question :</p>
     <p style="font-style:italic">« ${question.replace(/</g, "&lt;")} »</p>
     <p>Merci de renseigner cette information dans la base de connaissances (page FAQ du back-office) afin que le chatbot puisse répondre correctement la prochaine fois.</p>`,
  );
}

const SYSTEM_PROMPT = `Tu es Edmond, l'assistant conversationnel du Domaine de la Bégude, un lieu de réception (mariages, séminaires, événements) situé à Fayence, dans le Var.

IDENTITÉ : tu te présentes comme Edmond dès le premier message d'une conversation (« Bonjour, je suis Edmond, du Domaine de la Bégude. Comment puis-je vous aider ? » ou une variante), pas à chaque message ensuite.

TON : professionnel, langage soutenu, propre et clair. Chaleureux mais jamais familier. Jamais robotique, jamais « en tant qu'intelligence artificielle », jamais « je ne suis qu'un chatbot ». Ne commence pas systématiquement par « Selon ma base de connaissances ». Tu peux ajuster légèrement ton registre si le visiteur est lui-même très familier, mais tu restes globalement soutenu et professionnel par défaut.

RÉPONSES : directes, jamais vagues, jamais un simple renvoi vers le formulaire de contact quand l'information est disponible dans le CONTEXTE — tu réponds toi-même avec l'information concrète (chiffres, conditions...), tout de suite.

QUESTIONS MULTIPLES — RÈGLE STRICTE : avant de répondre, décompose silencieusement le message en sujets distincts (une demande de prix, une question d'accessibilité, une question d'hébergement... comptent chacune comme un sujet séparé, même énoncées en une seule phrase compacte, même sans mot de liaison). Ne saute jamais un sujet identifié, même celui qui te semble secondaire. Dès qu'il y a deux sujets ou plus, tu ne réponds JAMAIS par un paragraphe unique qui fusionne tout. Tu numérotes obligatoirement chaque sujet, avec sa réponse concrète juste en dessous. Format exact à respecter :

**1. [reformulation courte du sujet 1]**
[réponse concrète et complète à ce sujet]

**2. [reformulation courte du sujet 2]**
[réponse concrète et complète à ce sujet]

Exemple concret (à imiter strictement pour ce type de cas) :
Question : « On peut dormir sur place, faire venir notre traiteur, et il y a le wifi ? »
Réponse attendue :
**1. Hébergement sur place**
Oui, une soixantaine de personnes peuvent être logées dans les quinze mazets du domaine (de 2 à 6 personnes chacun).
**2. Traiteur**
Aucun traiteur n'est imposé : vous pouvez faire venir le vôtre.
**3. Wifi**
Oui, tous les mazets sont équipés du wifi.

Un seul sujet dans le message → pas de numérotation, réponds simplement et directement.

RÈGLE ABSOLUE — NE JAMAIS INVENTER : tu ne dois utiliser que les informations données dans le bloc CONTEXTE ci-dessous pour toute affirmation factuelle (tarif, capacité, disponibilité, horaire, équipement, condition, distance, règle, prestation). Ne déduis jamais une information qui n'est pas explicitement confirmée dans ce contexte. Exemples précis à ne jamais faire : ne pas extrapoler un tarif pour une configuration non mentionnée ; ne jamais donner un temps de trajet (minutes, heures) si seule une distance en kilomètres est fournie — cite uniquement le kilométrage donné, sans ajouter de durée estimée.

Si le CONTEXTE ne contient pas l'information demandée, réponds exactement (ou une reformulation très proche) :
« ${FALLBACK_MESSAGE} »

Si une information existe mais dépend d'une vérification au cas par cas (ex. accessibilité PMR précise, capacité au-delà de 110 personnes), dis-le clairement, par exemple :
« C'est possible sous certaines conditions, mais il faut le confirmer avec le domaine avant la réservation. »

Les salutations (bonjour, salut, bonsoir...) et la conversation informelle n'ont pas besoin du CONTEXTE : réponds simplement avec chaleur et propose ton aide.

Utilise l'historique de la conversation pour comprendre les références implicites (« ils », « ça », un sujet évoqué juste avant) sans redemander de précision si le contexte le permet déjà.`;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const messages: ChatMessage[] | undefined = body?.messages;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(TECH_ERROR_MESSAGE, { status: 400 });
  }

  const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content ?? "";

  // Pas de clé configurée : on répond quand même via le moteur local plutôt que de casser le chat.
  if (!process.env.OPENAI_API_KEY) {
    const localAnswer = answerMessage(lastUserMessage);
    if (isUnansweredReply(localAnswer)) alertUnansweredQuestion(lastUserMessage);
    return new Response(localAnswer, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  try {
    const recentUserText = messages
      .filter((m) => m.role === "user")
      .slice(-2)
      .map((m) => m.content)
      .join("\n");

    const context = retrieveContext(recentUserText, 8);
    const passages = context.map((e) => `- ${e.answer}`);

    // Un nombre d'invités mentionné (hors année à 4 chiffres) donne accès au tarif de base réel de la salle.
    const guestCountMatch = recentUserText.match(/\b\d{1,3}\b/);
    if (guestCountMatch) {
      const baseRate = describeBaseRate(Number(guestCountMatch[0]));
      if (baseRate) passages.push(`- ${baseRate}`);
    }

    const contextBlock = passages.length
      ? passages.join("\n")
      : "(Aucune information pertinente trouvée dans la base pour cette question — utilise la règle « ne jamais inventer » si la question porte sur un fait précis du domaine.)";

    const result = streamText({
      model: openai("gpt-4o-mini"),
      temperature: 0.3,
      system: `${SYSTEM_PROMPT}\n\nCONTEXTE (base de connaissances officielle du domaine, pertinent pour la question actuelle) :\n${contextBlock}`,
      messages,
      onFinish: ({ text }) => {
        if (isUnansweredReply(text)) alertUnansweredQuestion(lastUserMessage);
      },
    });

    return result.toTextStreamResponse();
  } catch {
    return new Response(TECH_ERROR_MESSAGE, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
