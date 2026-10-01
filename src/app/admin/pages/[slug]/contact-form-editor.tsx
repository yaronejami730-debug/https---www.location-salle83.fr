"use client";

import { EditableText } from "../editable-text";

type Props = { val: (key: string) => string; set: (key: string) => (v: string) => void };

const INPUT = "w-full rounded-lg border border-black/10 px-4 py-3 text-sm text-[var(--foreground)]/30";
const LABEL = "mb-2 block text-sm text-[var(--foreground)]/80";
const CHOICE = "flex items-center justify-center rounded-lg border border-black/10 px-3 py-3 text-center text-sm";

/**
 * Admin mirror of components/contact-form.tsx: same layout and classes, but the
 * fields are inert and every label is edited in place. Keep in sync with the
 * public form when its structure changes.
 */
export function ContactFormEditor({ val, set }: Props) {
  const t = (key: string, className = "") => <EditableText as="span" value={val(key)} onChange={set(key)} className={className} />;
  const options = ["form_option_lendemain", "form_option_piscine", "form_option_vaisselle", "form_option_cuisine"];

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div>
          <span className={LABEL}>{t("form_event_label")}</span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {["form_event_mariage", "form_event_reception", "form_event_hebergement", "form_event_autre"].map((k, i) => (
              <div key={k} className={`${CHOICE} ${i === 0 ? "border-[var(--accent)] bg-[var(--accent)]/10" : ""}`}>
                {t(k)}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <span className={LABEL}>{t("form_date_label")}</span>
            <div className={INPUT}>jj/mm/aaaa</div>
          </div>
          <div>
            <span className={LABEL}>{t("form_guests_label")}</span>
            <div className={INPUT}>&nbsp;</div>
          </div>
        </div>

        <div>
          <span className={LABEL}>{t("form_options_label")}</span>
          <div className="grid gap-3 sm:grid-cols-2">
            {options.map((k) => (
              <div key={k} className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3.5 text-sm">
                <span className="h-5 w-5 shrink-0 rounded-md border border-black/20" />
                <span className="flex-1 text-[var(--foreground)]">{t(k)}</span>
                <span className="text-xs text-[var(--foreground)]/50">+ … €</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-black/10 px-4 py-3.5">
            <span className="flex items-center gap-3 text-sm text-[var(--foreground)]">
              {t("form_chapiteau_label")} <span className="text-xs text-[var(--foreground)]/50">(200 €/pièce)</span>
            </span>
            <div className="flex items-center gap-3 text-sm text-[var(--foreground)]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15">−</span>
              <span className="w-4 text-center">0</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15">+</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-[var(--background-muted)] p-5">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-[var(--foreground)]/70">{t("form_quote_estimate_label")} (…)</span>
            <span className="font-serif text-2xl text-[var(--accent)]">… €</span>
          </div>
          <p className="mt-1 text-xs text-[var(--foreground)]/50">Dont … € d&apos;arrhes à la réservation (50%).</p>
          <div className="mt-3 space-y-1 border-t border-black/10 pt-3 text-xs text-[var(--foreground)]/60">
            <p className="flex justify-between">
              {t("form_quote_caution_label")}
              <span>1 000 €</span>
            </p>
            <div>{t("form_quote_menage_note")}</div>
          </div>
          <div className="mt-4 border-t border-black/10 pt-3 text-xs text-[var(--foreground)]/60">
            <p className="mb-1 text-[10px] uppercase tracking-wide text-[var(--foreground)]/40">Texte avant saisie du nombre de personnes</p>
            {t("form_quote_empty_hint")}
          </div>
        </div>

        <div>
          <span className={LABEL}>{t("form_civility_label")}</span>
          <div className="flex gap-3">
            <div className={`${CHOICE} flex-1 border-[var(--accent)] bg-[var(--accent)]/10`}>{t("form_civility_madame")}</div>
            <div className={`${CHOICE} flex-1`}>{t("form_civility_monsieur")}</div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <span className={LABEL}>{t("form_firstname_label")}</span>
            <div className={INPUT}>&nbsp;</div>
          </div>
          <div>
            <span className={LABEL}>{t("form_lastname_label")}</span>
            <div className={INPUT}>&nbsp;</div>
          </div>
        </div>

        <div>
          <span className={LABEL}>{t("form_address_label")}</span>
          <div className={INPUT}>&nbsp;</div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <span className={LABEL}>{t("form_email_label")}</span>
            <div className={INPUT}>&nbsp;</div>
          </div>
          <div>
            <span className={LABEL}>{t("form_phone_label")}</span>
            <div className={INPUT}>&nbsp;</div>
          </div>
        </div>

        <div>
          <span className={LABEL}>{t("form_message_label")}</span>
          <div className={`${INPUT} h-28`}>&nbsp;</div>
          <p className="mt-1 text-xs text-[var(--foreground)]/40">Affiché uniquement si « Autre » est choisi.</p>
        </div>

        <div className="flex items-start gap-3 text-sm text-[var(--foreground)]/80">
          <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-black/20" />
          <span>
            J&apos;ai pris connaissance des <span className="font-medium text-[var(--accent)] underline underline-offset-2">conditions générales</span> (caution, ménage, réglement intérieur).
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm text-white">{t("form_submit_label")}</span>
          <span className="inline-flex rounded-full bg-[var(--accent)]/60 px-6 py-3.5 text-sm text-white">{t("form_submit_loading_label")}</span>
        </div>
        <div className="text-sm text-red-600">{t("form_error_message")}</div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium text-[var(--accent)]">Si « Hébergement » est choisi</p>
        <div className="rounded-2xl border border-black/10 bg-[var(--background-muted)] p-8 text-center">
          <div className="font-serif text-lg text-[var(--foreground)]">{t("form_hebergement_title")}</div>
          <div className="mx-auto mt-2 max-w-sm text-sm text-[var(--foreground)]/70">{t("form_hebergement_text")}</div>
          <span className="mt-5 inline-flex rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white">{t("form_hebergement_cta")}</span>
        </div>
      </div>

      <div>
        <p className="mb-3 text-xs font-medium text-[var(--accent)]">Écran affiché après l&apos;envoi</p>
        <div className="rounded-2xl border border-black/5 bg-[var(--background-muted)] p-8 text-center">
          <div className="font-serif text-xl text-[var(--foreground)]">{t("form_success_title")}</div>
          <div className="mt-2 text-sm text-[var(--foreground)]/70">{t("form_success_text")}</div>
          <p className="mt-3 text-sm text-[var(--foreground)]/70">
            {t("form_reference_label")} <span className="font-medium text-[var(--foreground)]">XXXX</span>
          </p>
          <div className="mx-auto mt-6 max-w-xs rounded-xl bg-[var(--background)] p-5 text-left text-sm">
            <p className="flex justify-between text-[var(--foreground)]/70">
              {t("form_quote_estimate_label")}
              <span className="font-medium text-[var(--foreground)]">… €</span>
            </p>
            <p className="mt-1 flex justify-between text-[var(--foreground)]/70">
              {t("form_quote_arrhes_label")}
              <span>… €</span>
            </p>
            <p className="mt-1 flex justify-between text-[var(--foreground)]/70">
              {t("form_quote_caution_label")}
              <span>1 000 €</span>
            </p>
            <div className="mt-3 text-xs text-[var(--foreground)]/50">{t("form_quote_success_disclaimer")}</div>
          </div>
          <p className="mx-auto mt-6 max-w-sm text-xs text-[var(--foreground)]/60">
            {t("form_explore_before")} <span className="text-[var(--accent)]">FAQ</span>
            {t("form_explore_after")}
          </p>
        </div>
      </div>
    </div>
  );
}
