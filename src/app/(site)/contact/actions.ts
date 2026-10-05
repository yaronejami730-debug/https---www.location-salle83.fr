"use server";

import { z } from "zod";
import { after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeQuote, getPricingBrackets, getChapiteauUnitPrice, getExtraOptions } from "@/lib/pricing";
import { sendAlertEmail, sendEmail } from "@/lib/mail";
import { welcomeEmail, faqFollowUpEmail } from "@/lib/email-templates";

const FAQ_FOLLOW_UP_DELAY_MS = 4 * 60 * 1000;

const schema = z.object({
  eventType: z.enum(["mariage", "seminaire", "reception", "hebergement", "autre"]),
  eventDate: z.string().optional(),
  guestCount: z.string(),
  lendemain: z.boolean(),
  piscine: z.boolean(),
  vaisselle: z.boolean(),
  cuisine: z.boolean(),
  chapiteauCount: z.string(),
  extraIds: z.array(z.string()).default([]),
  civility: z.string().optional(),
  fullName: z.string().min(2),
  lastName: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email(),
  message: z.string().optional(),
});

export type SubmitLeadInput = z.infer<typeof schema>;

export async function submitLead(input: SubmitLeadInput) {
  const values = schema.parse(input);

  const [brackets, chapiteauUnitPrice, extraOptions] = await Promise.all([getPricingBrackets(), getChapiteauUnitPrice(), getExtraOptions()]);
  const extraIds = values.extraIds.filter((id) => extraOptions.some((o) => o.id === id));
  const quote = computeQuote(
    {
      guestCount: Number(values.guestCount) || 0,
      lendemain: values.lendemain,
      piscine: values.piscine,
      vaisselle: values.vaisselle,
      cuisine: values.cuisine,
      chapiteauCount: Number(values.chapiteauCount) || 0,
      extraIds,
    },
    brackets,
    chapiteauUnitPrice,
    extraOptions,
  );

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("leads")
    .insert({
      event_type: values.eventType,
      event_date: values.eventDate || null,
      guest_count: Number(values.guestCount) || null,
      civility: values.civility || null,
      full_name: values.fullName,
      address: values.address || null,
      phone: values.phone || null,
      email: values.email,
      message: values.message || null,
      pricing_bracket: quote?.bracket.key ?? null,
      estimated_total: quote?.total ?? null,
      option_lendemain: values.lendemain,
      option_piscine: values.piscine,
      option_vaisselle: values.vaisselle,
      option_cuisine: values.cuisine,
      option_chapiteau_count: Number(values.chapiteauCount) || 0,
    })
    .select("id")
    .single();

  if (error) throw new Error("insert_failed");

  // Separate from the insert on purpose: if the option_extras column hasn't been added yet (see supabase-setup.sql), a lead is never lost over it.
  if (extraIds.length > 0) {
    const { error: extrasError } = await supabase.from("leads").update({ option_extras: extraIds }).eq("id", data.id);
    if (extrasError) console.error("option_extras update failed", extrasError.message);
  }

  await sendAlertEmail(
    "Nouvelle demande de devis",
    `<p>Nouvelle demande reçue (${values.eventType}, ${values.guestCount || "?"} personnes) :</p>
     <ul>
       <li>${values.fullName}${values.phone ? ` — ${values.phone}` : ""} — ${values.email}</li>
       ${values.eventDate ? `<li>Date souhaitée : ${values.eventDate}</li>` : ""}
       ${quote ? `<li>Estimation : ${quote.total} € (arrhes ${quote.arrhes} €)</li>` : ""}
       ${values.message ? `<li>Message : ${values.message.replace(/</g, "&lt;")}</li>` : ""}
     </ul>
     <p>Voir la fiche complète dans le back-office.</p>`,
  );

  const welcome = await welcomeEmail({
    civility: values.civility,
    lastName: values.lastName,
    fullName: values.fullName,
    quote,
  });
  await sendEmail(values.email, welcome.subject, welcome.html, values.fullName);

  after(async () => {
    await new Promise((resolve) => setTimeout(resolve, FAQ_FOLLOW_UP_DELAY_MS));
    const followUp = await faqFollowUpEmail({ fullName: values.fullName });
    await sendEmail(values.email, followUp.subject, followUp.html, values.fullName);
  });

  return { quote, leadId: data.id as string };
}
