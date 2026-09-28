import "server-only";
import { siteConfig } from "@/lib/site";

/** Envoie un email transactionnel via l'API Brevo à un destinataire donné. Ne jette jamais. */
export async function sendEmail(to: string, subject: string, htmlContent: string, toName?: string): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[brevo-mail] BREVO_API_KEY absente, email non envoyé:", subject);
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
        sender: { name: siteConfig.name, email: siteConfig.email },
        to: [{ email: to, name: toName }],
        subject,
        htmlContent,
      }),
    });
    if (!res.ok) {
      console.error("[brevo-mail] échec envoi:", res.status, await res.text());
    }
  } catch (err) {
    console.error("[brevo-mail] erreur envoi:", err);
  }
}

/** Envoie un email transactionnel à l'adresse du domaine (alerte interne). */
export async function sendAlertEmail(subject: string, htmlContent: string): Promise<void> {
  return sendEmail(siteConfig.email, subject, htmlContent);
}
