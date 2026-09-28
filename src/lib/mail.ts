import "server-only";
import { siteConfig } from "@/lib/site";

/** Version texte brut dérivée du HTML — les filtres anti-spam font davantage confiance à un mail multipart. */
function htmlToText(html: string): string {
  return html
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h1|h2|h3)>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Envoie un email transactionnel via l'API Brevo à un destinataire donné. Ne jette jamais. */
export async function sendEmail(to: string, subject: string, htmlContent: string, toName?: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[mail] BREVO_API_KEY absente, email non envoyé:", subject);
    return;
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: siteConfig.name, email: process.env.BREVO_SENDER_EMAIL || siteConfig.email },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent,
        textContent: htmlToText(htmlContent),
      }),
    });
    if (!res.ok) {
      console.error("[mail] échec envoi:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[mail] erreur envoi:", err);
  }
}

/** Envoie un email transactionnel à l'adresse du domaine (alerte interne). */
export async function sendAlertEmail(subject: string, htmlContent: string): Promise<void> {
  return sendEmail(siteConfig.email, subject, htmlContent);
}
