"use server";

import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { computeQuote } from "@/lib/pricing";
import { sendAlertEmail } from "@/lib/brevo-mail";

const schema = z.object({
  eventType: z.enum(["mariage", "seminaire", "reception", "hebergement", "autre"]),
  eventDate: z.string().optional(),
  guestCount: z.string(),
  lendemain: z.boolean(),
  piscine: z.boolean(),
  vaisselle: z.boolean(),
  cuisine: z.boolean(),
  chapiteauCount: z.string(),
  civility: z.string().optional(),
  fullName: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().min(6),
  email: z.string().email(),
  message: z.string().optional(),
});

export type SubmitLeadInput = z.infer<typeof schema>;

export async function submitLead(input: SubmitLeadInput) {
  const values = schema.parse(input);

  const quote = computeQuote({
    guestCount: Number(values.guestCount) || 0,
    lendemain: values.lendemain,
    piscine: values.piscine,
    vaisselle: values.vaisselle,
    cuisine: values.cuisine,
    chapiteauCount: Number(values.chapiteauCount) || 0,
  });

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
      phone: values.phone,
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

  void sendAlertEmail(
    "Nouvelle demande de devis",
    `<p>Nouvelle demande reçue (${values.eventType}, ${values.guestCount || "?"} personnes) :</p>
     <ul>
       <li>${values.fullName} — ${values.phone} — ${values.email}</li>
       ${values.eventDate ? `<li>Date souhaitée : ${values.eventDate}</li>` : ""}
       ${quote ? `<li>Estimation : ${quote.total} € (arrhes ${quote.arrhes} €)</li>` : ""}
       ${values.message ? `<li>Message : ${values.message.replace(/</g, "&lt;")}</li>` : ""}
     </ul>
     <p>Voir la fiche complète dans le back-office.</p>`,
  );

  return { quote, leadId: data.id as string };
}
