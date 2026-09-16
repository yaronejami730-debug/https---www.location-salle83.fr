"use client";

import Link from "next/link";
import { useState } from "react";
import { chatbotFaq } from "@/lib/faq-data";

type Message = { role: "bot" | "user"; text: string };

const WELCOME: Message = {
  role: "bot",
  text: "Bonjour ! Posez-moi une question sur le domaine (capacité, hébergement, tarifs, localisation...) ou choisissez une question ci-dessous.",
};

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function findAnswer(input: string): string {
  const q = normalize(input);
  const match = chatbotFaq.find((entry) => entry.keywords.some((k) => q.includes(k)));
  if (match) return match.answer;
  return "Je n'ai pas la réponse précise à cette question. Contactez-nous directement, nous vous répondrons sous 48h.";
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  function ask(text: string) {
    if (!text.trim() || typing) return;
    const answer = findAnswer(text);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setTyping(true);
    const delay = 600 + Math.random() * 900 + Math.min(answer.length * 12, 1800);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: answer }]);
    }, delay);
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[28rem] w-80 flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--background)] shadow-xl">
          <div className="flex items-center justify-between bg-[var(--accent)] px-4 py-3">
            <p className="text-sm font-medium text-white">Une question ?</p>
            <button aria-label="Fermer" onClick={() => setOpen(false)} className="text-white/90 hover:text-white">
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                  m.role === "bot"
                    ? "bg-[var(--background-muted)] text-[var(--foreground)]"
                    : "ml-auto bg-[var(--accent)] text-white"
                }`}
              >
                {m.text}
              </div>
            ))}

            {typing && (
              <div className="flex max-w-[85%] items-center gap-1 rounded-xl bg-[var(--background-muted)] px-3 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--foreground)]/40 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--foreground)]/40 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--foreground)]/40" />
              </div>
            )}

            {!typing && (
              <>
                <div className="flex flex-wrap gap-2 pt-2">
                  {chatbotFaq.slice(0, 4).map((f) => (
                    <button
                      key={f.question}
                      onClick={() => ask(f.question)}
                      className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-[var(--foreground)]/80 hover:bg-black/5"
                    >
                      {f.question}
                    </button>
                  ))}
                </div>

                <Link href="/contact" className="block pt-2 text-xs text-[var(--accent)] hover:underline">
                  → Demander un devis personnalisé
                </Link>
              </>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex gap-2 border-t border-black/5 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question..."
              disabled={typing}
              className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={typing}
              className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
            >
              →
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ouvrir le chat"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-lg hover:opacity-90"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4l-1 4.5A7.96 7.96 0 0 1 21 12Z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
