import "server-only";
import { siteConfig } from "@/lib/site";

/** Envoie un email transactionnel via l'API Brevo. Ne jette jamais : un échec d'envoi ne doit pas casser l'appelant. */
export async function sendAlertEmail(subject: string, htmlContent: string): Promise<void> {
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
        to: [{ email: siteConfig.email }],
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
