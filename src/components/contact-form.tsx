"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { DatePicker } from "./date-picker";
import { AddressAutocomplete } from "./address-autocomplete";
import { computeQuote, findBracket, type PricingBracket } from "@/lib/pricing";
import { leadReference } from "@/lib/lead-reference";
import { submitLead } from "@/app/(site)/contact/actions";
import { RichText } from "@/components/rich-text";

export type ContactFormLabels = {
  eventLabel: string;
  eventMariage: string;
  eventSeminaire: string;
  eventReception: string;
  eventHebergement: string;
  eventAutre: string;
  hebergementTitle: string;
  hebergementText: string;
  hebergementCta: string;
  dateLabel: string;
  guestsLabel: string;
  optionsLabel: string;
  optionLendemain: string;
  optionPiscine: string;
  optionVaisselle: string;
  optionCuisine: string;
  chapiteauLabel: string;
  civilityLabel: string;
  firstNameLabel: string;
  lastNameLabel: string;
  addressLabel: string;
  emailLabel: string;
  phoneLabel: string;
  messageLabel: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  civilityMadame: string;
  civilityMonsieur: string;
  referenceLabel: string;
  quoteEstimateLabel: string;
  quoteArrhesLabel: string;
  quoteCautionLabel: string;
  quoteMenageNote: string;
  quoteSuccessDisclaimer: string;
  quoteEmptyHint: string;
  exploreBefore: string;
  exploreAfter: string;
  submitLoadingLabel: string;
  errorMessage: string;
};

const schema = z
  .object({
    eventType: z.enum(["mariage", "seminaire", "reception", "hebergement", "autre"]),
    eventDate: z.string().optional(),
    guestCount: z.string(),
    lendemain: z.boolean(),
    piscine: z.boolean(),
    vaisselle: z.boolean(),
    cuisine: z.boolean(),
    chapiteauCount: z.string(),
    civility: z.array(z.enum(["madame", "monsieur"])).min(1, "Sélectionnez au moins une civilité"),
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    address: z.string().min(5, "Adresse requise"),
    phone: z.string().optional(),
    email: z.string().email("Email invalide"),
    message: z.string().optional(),
    termsAccepted: z.boolean().refine((v) => v, { message: "Merci d'accepter les conditions générales" }),
  })
  .refine((data) => data.eventType !== "autre" || (data.message ?? "").trim().length > 0, {
    message: "Merci de préciser votre demande",
    path: ["message"],
  })
  .refine((data) => data.eventType === "hebergement" || data.guestCount.trim().length > 0, {
    message: "Nombre de personnes requis",
    path: ["guestCount"],
  });

type FormValues = z.infer<typeof schema>;

const HEBERGEMENT_BOOKING_URL = "https://www.domainedelabegude.com/fr";

export function ContactForm({ labels, pricingBrackets }: { labels: ContactFormLabels; pricingBrackets: PricingBracket[] }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [lastQuote, setLastQuote] = useState<ReturnType<typeof computeQuote>>(null);
  const [lastReference, setLastReference] = useState<string | null>(null);

  const eventOptions: { value: FormValues["eventType"]; label: string }[] = [
    { value: "mariage", label: labels.eventMariage },
    { value: "seminaire", label: labels.eventSeminaire },
    { value: "reception", label: labels.eventReception },
    { value: "hebergement", label: labels.eventHebergement },
    { value: "autre", label: labels.eventAutre },
  ];

  const optionFields: {
    name: "lendemain" | "piscine" | "vaisselle" | "cuisine";
    label: string;
    priceKey: "lendemain" | "piscine" | "vaisselle" | "cuisine";
  }[] = [
    { name: "lendemain", label: labels.optionLendemain, priceKey: "lendemain" },
    { name: "piscine", label: labels.optionPiscine, priceKey: "piscine" },
    { name: "vaisselle", label: labels.optionVaisselle, priceKey: "vaisselle" },
    { name: "cuisine", label: labels.optionCuisine, priceKey: "cuisine" },
  ];

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: "mariage",
      guestCount: "",
      firstName: "",
      lastName: "",
      address: "",
      phone: "",
      email: "",
      message: "",
      lendemain: false,
      piscine: false,
      vaisselle: false,
      cuisine: false,
      chapiteauCount: "0",
      civility: ["madame"],
      termsAccepted: false,
    },
  });

  const watched = watch();
  const previewBracket = findBracket(Number(watched.guestCount) || 0, pricingBrackets) ?? pricingBrackets[0];
  const quote = computeQuote(
    {
      guestCount: Number(watched.guestCount) || 0,
      lendemain: watched.lendemain,
      piscine: watched.piscine,
      vaisselle: watched.vaisselle,
      cuisine: watched.cuisine,
      chapiteauCount: Number(watched.chapiteauCount) || 0,
    },
    pricingBrackets,
  );

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    try {
      const civilityLabel = values.civility.map((v) => v.charAt(0).toUpperCase() + v.slice(1)).join(" et ");
      const { quote, leadId } = await submitLead({
        ...values,
        civility: civilityLabel,
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        lastName: values.lastName,
      });
      setLastQuote(quote);
      setLastReference(leadReference(leadId));
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-black/5 bg-[var(--background-muted)] p-8 text-center">
        <RichText as="p" value={labels.successTitle} className="font-serif text-xl text-[var(--foreground)]" />
        <RichText as="p" value={labels.successText} className="mt-2 text-sm text-[var(--foreground)]/70" />
        {lastReference && (
          <p className="mt-3 text-sm text-[var(--foreground)]/70">
            <RichText value={labels.referenceLabel} /> <span className="font-medium text-[var(--foreground)]">{lastReference}</span>
          </p>
        )}
        {lastQuote && (
          <div className="mx-auto mt-6 max-w-xs rounded-xl bg-[var(--background)] p-5 text-left text-sm">
            <p className="flex justify-between text-[var(--foreground)]/70">
              <RichText value={labels.quoteEstimateLabel} />
              <span className="font-medium text-[var(--foreground)]">{lastQuote.total} €</span>
            </p>
            <p className="mt-1 flex justify-between text-[var(--foreground)]/70">
              <RichText value={labels.quoteArrhesLabel} />
              <span>{lastQuote.arrhes} €</span>
            </p>
            <p className="mt-1 flex justify-between text-[var(--foreground)]/70">
              <RichText value={labels.quoteCautionLabel} />
              <span>1 000 €</span>
            </p>
            <p className="mt-3 text-xs text-[var(--foreground)]/50">
              <RichText value={labels.quoteSuccessDisclaimer} /> <RichText value={labels.quoteMenageNote} />
            </p>
          </div>
        )}
        <p className="mx-auto mt-6 max-w-sm text-xs text-[var(--foreground)]/60">
          <RichText value={labels.exploreBefore} />{" "}
          <Link href="/faq" className="text-[var(--accent)] hover:underline">
            FAQ
          </Link>
          <RichText value={labels.exploreAfter} />
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <span className="mb-2 block text-sm text-[var(--foreground)]/80">
          <RichText value={labels.eventLabel} />
        </span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {eventOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-lg border border-black/10 px-3 py-3 text-center text-sm has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/10"
            >
              <input type="radio" value={opt.value} {...register("eventType")} className="sr-only" />
              <RichText value={opt.label} />
            </label>
          ))}
        </div>
      </div>

      {watched.eventType === "hebergement" ? (
        <div className="rounded-2xl border border-black/10 bg-[var(--background-muted)] p-8 text-center">
          <RichText as="p" value={labels.hebergementTitle} className="font-serif text-lg text-[var(--foreground)]" />
          <RichText as="p" value={labels.hebergementText} className="mx-auto mt-2 max-w-sm text-sm text-[var(--foreground)]/70" />
          <a
            href={HEBERGEMENT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white hover:opacity-90"
          >
            <RichText value={labels.hebergementCta} />
          </a>
        </div>
      ) : (
        <>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.dateLabel} />
          </label>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.guestsLabel} />
          </label>
          <input type="number" min={1} {...register("guestCount")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.guestCount && <p className="mt-1 text-xs text-red-600">{errors.guestCount.message}</p>}
        </div>
      </div>

      <div>
        <span className="mb-2 block text-sm text-[var(--foreground)]/80">
          <RichText value={labels.optionsLabel} />
        </span>
        <div className="grid gap-3 sm:grid-cols-2">
          {optionFields.map((opt) => (
            <label
              key={opt.name}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-black/10 px-4 py-3.5 text-sm has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/8"
            >
              <input type="checkbox" {...register(opt.name)} className="peer sr-only" />
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-black/20 text-[10px] text-transparent peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-checked:text-white">
                ✓
              </span>
              <span className="flex-1 text-[var(--foreground)]">
                <RichText value={opt.label} />
              </span>
              <span className="text-xs text-[var(--foreground)]/50">+{previewBracket[opt.priceKey]} €</span>
            </label>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3.5">
          <span className="flex items-center gap-3 text-sm text-[var(--foreground)]">
            <RichText value={labels.chapiteauLabel} /> <span className="text-xs text-[var(--foreground)]/50">(200 €/pièce)</span>
          </span>
          <Controller
            name="chapiteauCount"
            control={control}
            render={({ field }) => {
              const count = Number(field.value) || 0;
              return (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => field.onChange(String(Math.max(0, count - 1)))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-[var(--foreground)] hover:bg-black/5"
                  >
                    −
                  </button>
                  <span className="w-4 text-center text-sm text-[var(--foreground)]">{count}</span>
                  <button
                    type="button"
                    onClick={() => field.onChange(String(Math.min(5, count + 1)))}
                    className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 text-[var(--foreground)] hover:bg-black/5"
                  >
                    +
                  </button>
                </div>
              );
            }}
          />
        </div>
      </div>

      <div className="rounded-xl bg-[var(--background-muted)] p-5">
        {quote ? (
          <>
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[var(--foreground)]/70">
                <RichText value={labels.quoteEstimateLabel} /> ({quote.bracket.label})
              </span>
              <span className="font-serif text-2xl text-[var(--accent)]">{quote.total} €</span>
            </div>
            <p className="mt-1 text-xs text-[var(--foreground)]/50">
              Dont {quote.arrhes} € d&apos;arrhes à la réservation (50%).
            </p>
            <div className="mt-3 space-y-1 border-t border-black/10 pt-3 text-xs text-[var(--foreground)]/60">
              <p className="flex justify-between">
                <RichText value={labels.quoteCautionLabel} />
                <span>1 000 €</span>
              </p>
              <RichText as="p" value={labels.quoteMenageNote} />
            </div>
          </>
        ) : (
          <p className="text-sm text-[var(--foreground)]/60">
            <RichText value={labels.quoteEmptyHint} />
          </p>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm text-[var(--foreground)]/80">
          <RichText value={labels.civilityLabel} />
        </span>
        <div className="flex gap-3">
          {(
            [
              { value: "madame", label: labels.civilityMadame },
              { value: "monsieur", label: labels.civilityMonsieur },
            ] as const
          ).map(({ value, label }) => (
            <label
              key={value}
              className="flex flex-1 cursor-pointer items-center justify-center rounded-lg border border-black/10 px-3 py-3 text-center text-sm has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/10"
            >
              <input type="checkbox" value={value} {...register("civility")} className="sr-only" />
              <RichText value={label} />
            </label>
          ))}
        </div>
        {errors.civility && <p className="mt-1 text-xs text-red-600">{errors.civility.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.firstNameLabel} />
          </label>
          <input {...register("firstName")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.lastNameLabel} />
          </label>
          <input {...register("lastName")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-[var(--foreground)]/80">
          <RichText value={labels.addressLabel} />
        </label>
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <AddressAutocomplete
              value={field.value}
              onChange={field.onChange}
              className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm"
            />
          )}
        />
        {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.emailLabel} />
          </label>
          <input type="email" {...register("email")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.phoneLabel} />
          </label>
          <input {...register("phone")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      {watched.eventType === "autre" && (
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">
            <RichText value={labels.messageLabel} />
          </label>
          <textarea {...register("message")} rows={4} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
        </div>
      )}

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-[var(--foreground)]/80">
          <input type="checkbox" {...register("termsAccepted")} className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            J&apos;ai pris connaissance des{" "}
            <Link href="/conditions-generales" target="_blank" className="font-medium text-[var(--accent)] underline underline-offset-2 hover:opacity-80">
              conditions générales
            </Link>{" "}
            (caution, ménage, réglement intérieur).
          </span>
        </label>
        {errors.termsAccepted && <p className="mt-1 text-xs text-red-600">{errors.termsAccepted.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? <RichText value={labels.submitLoadingLabel} /> : <RichText value={labels.submitLabel} />}
      </button>

      {status === "error" && <RichText as="p" value={labels.errorMessage} className="text-sm text-red-600" />}
        </>
      )}
    </form>
  );
}
