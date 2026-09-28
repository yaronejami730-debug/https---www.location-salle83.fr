import "server-only";
import { siteConfig } from "@/lib/site";

const bins = [
  { name: "Poubelle jaune", color: "#c99a1f", description: "Tous les emballages" },
  { name: "Poubelle marron", color: "#8a5a3c", description: "Déchets ménagers" },
  { name: "Poubelle verte", color: "#4c7a4c", description: "Le verre" },
  { name: "Poubelle compost", color: "#6b4f2a", description: "Les déchets de légumes" },
  { name: "Poubelle carton", color: "#a68a5c", description: "Carton à plat" },
];

function emailShell(title: string, bodyHtml: string): string {
  return `
  <div style="background:#f7f5f0;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;color:#2b2a26;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e5dc;">
      <div style="background:#5c6b4a;padding:28px 32px;text-align:center;">
        <p style="margin:0;color:#ffffff;font-size:20px;letter-spacing:0.02em;">${siteConfig.name}</p>
      </div>
      <div style="padding:32px;">
        <h1 style="margin:0 0 16px;font-size:22px;color:#2b2a26;">${title}</h1>
        ${bodyHtml}
      </div>
      <div style="padding:20px 32px;background:#f7f5f0;text-align:center;font-family:Arial,sans-serif;font-size:12px;color:#8a887f;">
        ${siteConfig.name} — ${siteConfig.address}<br/>
        ${siteConfig.phone} — ${siteConfig.email}
      </div>
    </div>
  </div>`;
}

export function welcomeEmail(params: {
  fullName: string;
  eventType: string;
  guestCount?: number;
  quote?: { total: number; arrhes: number } | null;
}): { subject: string; html: string } {
  const { fullName, quote } = params;

  const quoteBlock = quote
    ? `
      <table style="width:100%;border-collapse:collapse;margin-top:8px;font-family:Arial,sans-serif;font-size:14px;color:#3d3c37;">
        <tr>
          <td style="padding:6px 0;">Estimation</td>
          <td style="padding:6px 0;text-align:right;font-weight:bold;color:#5c6b4a;">${quote.total} €</td>
        </tr>
        <tr>
          <td style="padding:6px 0;">Arrhes à la réservation (50%)</td>
          <td style="padding:6px 0;text-align:right;">${quote.arrhes} €</td>
        </tr>
        <tr>
          <td style="padding:6px 0;">Caution (à l'arrivée)</td>
          <td style="padding:6px 0;text-align:right;">1 000 €</td>
        </tr>
      </table>
      <p style="margin-top:14px;font-family:Arial,sans-serif;font-size:12px;color:#8a887f;">
        Estimation indicative, confirmée par notre équipe.
      </p>`
    : "";

  const body = `
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      Bonjour ${fullName},
    </p>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      Merci pour votre demande. Le Domaine de la Bégude, c'est trois hectares de nature préservée à Fayence, dans le Var,
      autour d'un mas provençal créé en 1995 : un lieu vrai et chaleureux pour mariages, séminaires et réceptions.
    </p>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      4876 RD 562, La Bégude, 83440 Fayence.
    </p>
    ${quote ? `<h2 style="margin:24px 0 4px;font-size:17px;color:#2b2a26;">Votre estimation</h2>${quoteBlock}` : ""}
    <p style="margin-top:24px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      Veuillez contacter directement Monsieur Gonzague pour finaliser votre projet.
    </p>`;

  return { subject: "Bienvenue au Domaine de la Bégude", html: emailShell("Bienvenue au Domaine de la Bégude", body) };
}

export function wasteSortingEmail(params: { fullName: string }): { subject: string; html: string } {
  const binsHtml = bins
    .map(
      (b) => `
      <tr>
        <td style="padding:10px 0;font-family:Arial,sans-serif;font-size:14px;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${b.color};margin-right:10px;"></span>
          <strong>${b.name}</strong> = ${b.description}
        </td>
      </tr>`,
    )
    .join("");

  const body = `
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      Bonjour ${params.fullName},
    </p>
    <p style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      Votre séjour au Domaine de la Bégude se termine bientôt. Avant votre départ, voici un rappel sur le tri sélectif —
      un sujet important, la communauté de communes nous demande d'être vigilants.
    </p>
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">${binsHtml}</table>
    <div style="margin-top:24px;padding:16px;border-radius:8px;background:#fdecec;border:1px solid #e8b4b4;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#a33;font-weight:bold;">Sujet très important</p>
      <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:13px;color:#5a2222;line-height:1.5;">
        Si le tri n'est pas respecté durant votre séjour, la caution sera retenue en intégralité, et les autorités
        compétentes seront informées.
      </p>
    </div>
    <p style="margin-top:24px;font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#3d3c37;">
      Merci et à bientôt !
    </p>`;

  return { subject: "Avant votre départ — le tri sélectif au domaine", html: emailShell("Avant votre départ", body) };
}
