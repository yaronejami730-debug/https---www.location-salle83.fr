import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { sendEmail } from "@/lib/mail";
import { wasteSortingEmail } from "@/lib/email-templates";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  const supabase = supabaseAdmin();
  const { data: leads, error } = await supabase
    .from("leads")
    .select("id, full_name, email")
    .eq("event_end_date", tomorrowStr)
    .is("departure_email_sent_at", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const lead of leads ?? []) {
    const { subject, html } = wasteSortingEmail({ fullName: lead.full_name });
    await sendEmail(lead.email, subject, html, lead.full_name);
    await supabase.from("leads").update({ departure_email_sent_at: new Date().toISOString() }).eq("id", lead.id);
    sent++;
  }

  return NextResponse.json({ sent });
}
