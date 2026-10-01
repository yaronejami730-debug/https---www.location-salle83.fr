import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Container } from "@/components/container";
import { ContactForm } from "@/components/contact-form";
import { getPageContent } from "@/lib/content";
import { getSchema, fieldValue } from "@/lib/page-schemas";
import { getPricingBrackets } from "@/lib/pricing";

const schema = getSchema("contact")!;

export async function generateMetadata(): Promise<Metadata> {
  const content = await getPageContent("contact");
  return {
    title: content?.seo_title || "Contact & devis",
    description:
      content?.seo_description ||
      "Demandez votre devis personnalisé pour votre mariage, séminaire ou réception au Domaine de la Bégude, à Fayence dans le Var.",
    openGraph: { images: [{ url: "/images/home-hero.jpg", width: 1600, height: 1200, alt: "Domaine de la Bégude" }] },
    twitter: { images: ["/images/home-hero.jpg"] },
  };
}

export default async function ContactPage() {
  const pageContent = await getPageContent("contact");
  const pricingBrackets = await getPricingBrackets();
  const c = pageContent?.content ?? {};
  const f = (key: string) => fieldValue(c, schema.fields.find((x) => x.key === key)!);

  const labels = {
    eventLabel: f("form_event_label"),
    eventMariage: f("form_event_mariage"),
    eventReception: f("form_event_reception"),
    eventHebergement: f("form_event_hebergement"),
    eventAutre: f("form_event_autre"),
    hebergementTitle: f("form_hebergement_title"),
    hebergementText: f("form_hebergement_text"),
    hebergementCta: f("form_hebergement_cta"),
    dateLabel: f("form_date_label"),
    guestsLabel: f("form_guests_label"),
    optionsLabel: f("form_options_label"),
    optionLendemain: f("form_option_lendemain"),
    optionPiscine: f("form_option_piscine"),
    optionVaisselle: f("form_option_vaisselle"),
    optionCuisine: f("form_option_cuisine"),
    chapiteauLabel: f("form_chapiteau_label"),
    civilityLabel: f("form_civility_label"),
    firstNameLabel: f("form_firstname_label"),
    lastNameLabel: f("form_lastname_label"),
    addressLabel: f("form_address_label"),
    emailLabel: f("form_email_label"),
    phoneLabel: f("form_phone_label"),
    messageLabel: f("form_message_label"),
    submitLabel: f("form_submit_label"),
    successTitle: f("form_success_title"),
    successText: f("form_success_text"),
    civilityMadame: f("form_civility_madame"),
    civilityMonsieur: f("form_civility_monsieur"),
    referenceLabel: f("form_reference_label"),
    quoteEstimateLabel: f("form_quote_estimate_label"),
    quoteArrhesLabel: f("form_quote_arrhes_label"),
    quoteCautionLabel: f("form_quote_caution_label"),
    quoteMenageNote: f("form_quote_menage_note"),
    quoteSuccessDisclaimer: f("form_quote_success_disclaimer"),
    quoteEmptyHint: f("form_quote_empty_hint"),
    exploreBefore: f("form_explore_before"),
    exploreAfter: f("form_explore_after"),
    submitLoadingLabel: f("form_submit_loading_label"),
    errorMessage: f("form_error_message"),
  };

  return (
    <>
      <PageHero eyebrow={f("eyebrow")} title={f("hero_title")} />

      <section className="py-20">
        <Container className="max-w-2xl">
          <ContactForm labels={labels} pricingBrackets={pricingBrackets} />
        </Container>
      </section>
    </>
  );
}
