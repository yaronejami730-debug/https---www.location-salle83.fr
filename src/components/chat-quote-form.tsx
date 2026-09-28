"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { computeQuote } from "@/lib/pricing";
import { leadReference } from "@/lib/lead-reference";
import { submitLead } from "@/app/(site)/contact/actions";

const schema = z
  .object({
    eventType: z.enum(["mariage", "seminaire", "reception", "autre"]),
    guestCount: z.string().min(1, "Requis"),
    lendemain: z.boolean(),
    piscine: z.boolean(),
    vaisselle: z.boolean(),
    cuisine: z.boolean(),
    chapiteauCount: z.string(),
    civility: z.enum(["madame", "monsieur"]),
    firstName: z.string().min(2, "Prénom requis"),
    lastName: z.string().min(2, "Nom requis"),
    address: z.string().min(5, "Adresse requise"),
    phone: z.string().min(6, "Téléphone requis"),
    email: z.string().email("Email invalide"),
    message: z.string().optional(),
    termsAccepted: z.boolean().refine((v) => v, { message: "Merci d'accepter les conditions générales" }),
  })
  .refine((data) => data.eventType !== "autre" || (data.message ?? "").trim().length > 0, {
    message: "Merci de préciser votre demande",
    path: ["message"],
  });

type FormValues = z.infer<typeof schema>;

const eventOptions: { value: FormValues["eventType"]; label: string }[] = [
  { value: "mariage", label: "Mariage" },
  { value: "seminaire", label: "Séminaire" },
  { value: "reception", label: "Réception" },
  { value: "autre", label: "Autre" },
];

const optionFields: { name: "lendemain" | "piscine" | "vaisselle" | "cuisine"; label: string }[] = [
  { name: "lendemain", label: "Accès le lendemain" },
  { name: "piscine", label: "Accès piscine" },
  { name: "vaisselle", label: "Vaisselle" },
  { name: "cuisine", label: "Cuisine pro" },
];

/** Version compacte du formulaire de devis (src/components/contact-form.tsx), pour l'intégrer dans le chatbot. */
export function ChatQuoteForm({ onDone }: { onDone: (summary: string) => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      eventType: "mariage",
      guestCount: "",
      lendemain: false,
      piscine: false,
      vaisselle: false,
      cuisine: false,
      chapiteauCount: "0",
      civility: "madame",
      termsAccepted: false,
    },
  });

  const watched = watch();
  const quote = computeQuote({
    guestCount: Number(watched.guestCount) || 0,
    lendemain: watched.lendemain,
    piscine: watched.piscine,
    vaisselle: watched.vaisselle,
    cuisine: watched.cuisine,
    chapiteauCount: Number(watched.chapiteauCount) || 0,
  });

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    try {
      const { quote, leadId } = await submitLead({ ...values, fullName: `${values.firstName} ${values.lastName}`.trim() });
      const ref = leadReference(leadId);
      onDone(
        quote
          ? `Merci ! Votre demande a bien été envoyée (référence ${ref}). Estimation : ${quote.total} € dont ${quote.arrhes} € d'arrhes à la réservation. Nous revenons vers vous sous 48h.`
          : `Merci ! Votre demande a bien été envoyée (référence ${ref}). Nous revenons vers vous sous 48h.`,
      );
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 rounded-xl border border-black/10 bg-[var(--background)] p-3 text-sm">
      <div>
        <span className="mb-1 block text-xs text-[var(--foreground)]/70">Type d&apos;événement</span>
        <div className="grid grid-cols-2 gap-1.5">
          {eventOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-lg border border-black/10 px-2 py-1.5 text-center text-xs has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/10"
            >
              <input type="radio" value={opt.value} {...register("eventType")} className="sr-only" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-[var(--foreground)]/70">Nombre de personnes</label>
        <input type="number" min={1} {...register("guestCount")} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
        {errors.guestCount && <p className="mt-0.5 text-xs text-red-600">{errors.guestCount.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {optionFields.map((opt) => (
          <label key={opt.name} className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-black/10 px-2 py-1.5 text-xs has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/8">
            <input type="checkbox" {...register(opt.name)} className="h-3.5 w-3.5" />
            {opt.label}
          </label>
        ))}
      </div>

      {quote && (
        <div className="rounded-lg bg-[var(--background-muted)] p-2.5 text-xs">
          <div className="flex justify-between font-medium text-[var(--foreground)]">
            <span>Estimation ({quote.bracket.label})</span>
            <span>{quote.total} €</span>
          </div>
          <p className="mt-0.5 text-[var(--foreground)]/60">Dont {quote.arrhes} € d&apos;arrhes + caution 500 € à l&apos;arrivée.</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-1.5">
        <input placeholder="Prénom" {...register("firstName")} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
        <input placeholder="Nom" {...register("lastName")} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
      </div>
      {(errors.firstName || errors.lastName) && (
        <p className="text-xs text-red-600">{errors.firstName?.message || errors.lastName?.message}</p>
      )}

      <input placeholder="Adresse postale" {...register("address")} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
      {errors.address && <p className="text-xs text-red-600">{errors.address.message}</p>}

      <div className="grid grid-cols-2 gap-1.5">
        <input type="email" placeholder="Email" {...register("email")} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
        <input placeholder="Téléphone" {...register("phone")} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
      </div>
      {(errors.email || errors.phone) && <p className="text-xs text-red-600">{errors.email?.message || errors.phone?.message}</p>}

      {watched.eventType === "autre" && (
        <div>
          <textarea placeholder="Précisez votre demande" {...register("message")} rows={2} className="w-full rounded-lg border border-black/10 px-2.5 py-1.5 text-sm" />
          {errors.message && <p className="mt-0.5 text-xs text-red-600">{errors.message.message}</p>}
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-2 text-xs text-[var(--foreground)]/70">
        <input type="checkbox" {...register("termsAccepted")} className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <span>
          J&apos;accepte les{" "}
          <Link href="/conditions-generales" target="_blank" className="text-[var(--accent)] hover:underline">
            conditions générales
          </Link>
          .
        </span>
      </label>
      {errors.termsAccepted && <p className="text-xs text-red-600">{errors.termsAccepted.message}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-lg bg-[var(--accent)] px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours..." : "Recevoir ma proposition"}
      </button>

      {status === "error" && <p className="text-xs text-red-600">Une erreur est survenue, merci de réessayer.</p>}
    </form>
  );
}
