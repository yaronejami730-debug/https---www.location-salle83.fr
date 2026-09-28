import "server-only";
import { siteConfig } from "@/lib/site";

const CONTACT_NAME = "Gonzague Tassou";
const CONTACT_PHONE_HREF = `tel:${siteConfig.phone.replace(/\s/g, "")}`;

/**
 * Shell email — fond blanc, logo centré, titre centré, CTA bouton pill, footer minimaliste.
 * Pas de carte/bordure : structure inspirée de dealandcompany.fr.
 */
function baseEmail({
  title,
  heading,
  body,
  ctaLabel,
  ctaUrl,
  postCta,
}: {
  title: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
  postCta?: string;
}): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
  <style>
    body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
    body{margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;}
    img{border:0;height:auto;line-height:100%;outline:none;text-decoration:none;}
    @media(max-width:620px){
      .wrap{width:100%!important;}
      .pad{padding:0 24px 28px!important;}
      .h1{font-size:26px!important;}
      .logo{width:110px!important;}
    }
  </style>
</head>
<body bgcolor="#ffffff">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#ffffff">
<tr><td align="center" style="padding:48px 16px;">
<table class="wrap" role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <tr><td align="center" style="padding-bottom:28px;">
    <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:15px;letter-spacing:0.08em;text-transform:uppercase;color:#5c6b4a;">
      ${siteConfig.name}
    </p>
  </td></tr>

  <tr><td align="center" style="padding-bottom:24px;">
    <h1 class="h1" style="font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:normal;
      color:#2b2a26;letter-spacing:0;margin:0;line-height:1.25;text-align:center;">
      ${heading}
    </h1>
  </td></tr>

  <tr><td class="pad" style="padding:0 8px 32px;">
    <div style="font-size:15px;color:#3d3c37;line-height:1.75;text-align:center;">
      ${body}
    </div>
  </td></tr>

  ${
    ctaLabel && ctaUrl
      ? `
  <tr><td align="center" style="padding-bottom:${postCta ? "16px" : "48px"};">
    <a href="${ctaUrl}"
      style="display:inline-block;background:#5c6b4a;color:#ffffff;font-size:15px;
      font-weight:bold;text-decoration:none;padding:16px 40px;border-radius:9999px;
      letter-spacing:0.01em;">
      ${ctaLabel}
    </a>
  </td></tr>`
      : ""
  }

  ${
    postCta
      ? `
  <tr><td style="padding:0 8px 48px;">
    <p style="font-size:13px;color:#8a887f;line-height:1.75;margin:0;text-align:center;">
      ${postCta}
    </p>
  </td></tr>`
      : ""
  }

  <tr><td style="padding-bottom:32px;">
    <div style="height:1px;background:#eceef0;"></div>
  </td></tr>

  <tr><td align="center" style="padding-bottom:8px;">
    <p style="font-size:12px;color:#9ea4a9;line-height:1.7;margin:0;text-align:center;">
      ${siteConfig.name} — ${siteConfig.address}<br/>
      ${siteConfig.phone} — <a href="mailto:${siteConfig.email}" style="color:#9ea4a9;">${siteConfig.email}</a>
    </p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

const bins = [
  { name: "Poubelle jaune", color: "#c99a1f", description: "Tous les emballages" },
  { name: "Poubelle marron", color: "#8a5a3c", description: "Déchets ménagers" },
  { name: "Poubelle verte", color: "#4c7a4c", description: "Le verre" },
  { name: "Poubelle compost", color: "#6b4f2a", description: "Les déchets de légumes" },
  { name: "Poubelle carton", color: "#a68a5c", description: "Carton à plat" },
];

export function welcomeEmail(params: {
  civility?: string;
  lastName?: string;
  fullName: string;
  quote?: { total: number; arrhes: number } | null;
}): { subject: string; html: string } {
  const { civility, lastName, fullName, quote } = params;
  const greetingName = civility && lastName ? `${civility} ${lastName}` : fullName;

  const quoteBlock = quote
    ? `
      <p style="margin:28px 0 4px;font-size:13px;color:#8a887f;text-transform:uppercase;letter-spacing:0.1em;">Votre estimation</p>
      <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:32px;color:#5c6b4a;">${quote.total} €</p>
      <p style="margin:6px 0 0;font-size:13px;color:#8a887f;">
        Arrhes à la réservation (50 %) : ${quote.arrhes} € · Caution à l'arrivée : 1 000 €
      </p>`
    : "";

  const body = `
    <p>Bonjour ${greetingName},</p>
    <p>Merci pour l'intérêt que vous portez au Domaine de la Bégude.</p>
    <p>
      Trois hectares de nature préservée à Fayence, dans le Var, autour d'un mas provençal créé en 1995 :
      un cadre vrai et chaleureux pour les plus beaux moments, mariages, séminaires et réceptions.
    </p>
    ${quote ? `<p>Suite à l'estimation que vous avez faite en ligne, voici l'estimation que nous vous proposons :</p>${quoteBlock}` : ""}
  `;

  return {
    subject: "Bienvenue au Domaine de la Bégude",
    html: baseEmail({
      title: "Bienvenue au Domaine de la Bégude",
      heading: "Bienvenue au Domaine de la Bégude",
      body,
      ctaLabel: `Contacter Monsieur ${CONTACT_NAME}`,
      ctaUrl: CONTACT_PHONE_HREF,
      postCta: `Ou par email : <a href="mailto:${siteConfig.email}" style="color:#8a887f;">${siteConfig.email}</a>`,
    }),
  };
}

export function wasteSortingEmail(params: { fullName: string }): { subject: string; html: string } {
  const binsHtml = bins
    .map(
      (b) =>
        `<span style="display:inline-block;margin:4px 10px;font-size:14px;">
          <span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${b.color};margin-right:6px;"></span>
          <strong>${b.name}</strong> = ${b.description}
        </span>`,
    )
    .join("");

  const body = `
    <p>Bonjour ${params.fullName},</p>
    <p>Votre séjour au Domaine de la Bégude se termine bientôt. Avant votre départ, un rappel sur le tri sélectif —
    la communauté de communes nous demande d'être vigilants sur ce point.</p>
    <p style="margin-top:20px;">${binsHtml}</p>
    <p style="margin-top:28px;font-size:13px;color:#a33;">
      <strong>Sujet très important&nbsp;:</strong> si le tri n'est pas respecté durant votre séjour, la caution sera
      retenue en intégralité, et les autorités compétentes seront informées.
    </p>
    <p style="margin-top:20px;">Merci, et à bientôt !</p>
  `;

  return {
    subject: "Avant votre départ — le tri sélectif au domaine",
    html: baseEmail({
      title: "Avant votre départ",
      heading: "Avant votre départ",
      body,
    }),
  };
}
