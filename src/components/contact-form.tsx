"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";
import { DatePicker } from "./date-picker";

const schema = z.object({
  eventType: z.enum(["mariage", "seminaire", "reception", "autre"]),
  eventDate: z.string().optional(),
  guestCount: z.string().optional(),
  fullName: z.string().min(2, "Nom requis"),
  phone: z.string().min(6, "Téléphone requis"),
  email: z.string().email("Email invalide"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const eventOptions: { value: FormValues["eventType"]; label: string }[] = [
  { value: "mariage", label: "Mariage" },
  { value: "seminaire", label: "Séminaire" },
  { value: "reception", label: "Réception" },
  { value: "autre", label: "Autre" },
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { eventType: "mariage" },
  });

  async function onSubmit(values: FormValues) {
    setStatus("loading");
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_EDGE_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("request_failed");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-black/5 bg-[var(--background-muted)] p-8 text-center">
        <p className="font-serif text-xl text-[var(--foreground)]">Merci pour votre demande</p>
        <p className="mt-2 text-sm text-[var(--foreground)]/70">
          Nous revenons vers vous très rapidement pour construire votre projet ensemble.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <span className="mb-2 block text-sm text-[var(--foreground)]/80">Votre événement</span>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {eventOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex cursor-pointer items-center justify-center rounded-lg border border-black/10 px-3 py-3 text-sm has-[:checked]:border-[var(--accent)] has-[:checked]:bg-[var(--accent)]/10"
            >
              <input type="radio" value={opt.value} {...register("eventType")} className="sr-only" />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">Date souhaitée</label>
          <Controller
            name="eventDate"
            control={control}
            render={({ field }) => <DatePicker value={field.value} onChange={field.onChange} />}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">Nombre de personnes</label>
          <input type="number" min={1} {...register("guestCount")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">Nom</label>
          <input {...register("fullName")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="mb-2 block text-sm text-[var(--foreground)]/80">Téléphone</label>
          <input {...register("phone")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-[var(--foreground)]/80">Email</label>
        <input type="email" {...register("email")} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm text-[var(--foreground)]/80">Votre message (optionnel)</label>
        <textarea {...register("message")} rows={4} className="w-full rounded-lg border border-black/10 px-4 py-3 text-sm" />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm text-white transition-opacity hover:opacity-90 disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? "Envoi en cours..." : "Recevoir une proposition"}
      </button>

      {status === "error" && (
        <p className="text-sm text-red-600">
          Une erreur est survenue. Merci de réessayer ou de nous appeler directement.
        </p>
      )}
    </form>
  );
}
