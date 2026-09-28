"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { chatbotFaq } from "@/lib/faq-data";
import { ChatQuoteForm } from "./chat-quote-form";

type Message = { role: "bot" | "user"; text: string } | { role: "quote-form" };

/** Rend les **gras** et les sauts de ligne du texte du modèle, sans injecter de HTML brut. */
function formatMessageText(text: string) {
  return text.split("\n").map((line, lineIndex) => (
    <Fragment key={lineIndex}>
      {lineIndex > 0 && <br />}
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={partIndex}>{part.slice(2, -2)}</strong>
        ) : (
          <Fragment key={partIndex}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ));
}

const WELCOME: Message = {
  role: "bot",
  text: "Bonjour, je suis Edmond, l'assistant du Domaine de la Bégude. Comment puis-je vous aider ?",
};

const TECH_ERROR_MESSAGE =
  "Désolé, je rencontre momentanément un problème technique. Pouvez-vous réessayer dans quelques instants ?";

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const streamedText = useRef("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  async function ask(text: string) {
    if (!text.trim() || typing) return;
    const history = [...messages, { role: "user" as const, text }];
    setMessages(history);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history
            .filter((m): m is { role: "bot" | "user"; text: string } => m.role !== "quote-form")
            .map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })),
        }),
      });
      if (!res.ok || !res.body) throw new Error("chat request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      streamedText.current = "";
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        streamedText.current += decoder.decode(value, { stream: true });
        if (!started) {
          started = true;
          setTyping(false);
          setMessages((prev) => [...prev, { role: "bot", text: streamedText.current }]);
        } else {
          setMessages((prev) => [...prev.slice(0, -1), { role: "bot", text: streamedText.current }]);
        }
      }
    } catch {
      setTyping(false);
      setMessages((prev) => [...prev, { role: "bot", text: TECH_ERROR_MESSAGE }]);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {open && (
        <div className="mb-4 flex h-[75vh] max-h-[40rem] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-black/10 bg-[var(--background)] shadow-xl sm:w-96">
          <div className="flex items-center justify-between bg-[var(--accent)] px-4 py-3">
            <p className="text-sm font-medium text-white">Edmond — Domaine de la Bégude</p>
            <button aria-label="Fermer" onClick={() => setOpen(false)} className="text-white/90 hover:text-white">
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) =>
              m.role === "quote-form" ? (
                <ChatQuoteForm
                  key={i}
                  onDone={(summary) => setMessages((prev) => [...prev, { role: "bot", text: summary }])}
                />
              ) : (
                <div
                  key={i}
                  className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "bot"
                      ? "bg-[var(--background-muted)] text-[var(--foreground)]"
                      : "ml-auto bg-[var(--accent)] text-white"
                  }`}
                >
                  {formatMessageText(m.text)}
                </div>
              ),
            )}

            {typing && (
              <div className="flex max-w-[85%] items-center gap-1 rounded-xl bg-[var(--background-muted)] px-3 py-2.5">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--foreground)]/40 [animation-delay:-0.3s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--foreground)]/40 [animation-delay:-0.15s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[var(--foreground)]/40" />
              </div>
            )}

          </div>

          {showSuggestions && !typing && (
            <div className="flex flex-wrap gap-2 border-t border-black/5 px-3 pt-3">
              {chatbotFaq.slice(0, 4).map((f) => (
                <button
                  key={f.question}
                  onClick={() => {
                    setShowSuggestions(false);
                    ask(f.question);
                  }}
                  className="rounded-full border border-black/10 px-3 py-1.5 text-xs text-[var(--foreground)]/80 hover:bg-black/5"
                >
                  {f.question}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between px-3 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setShowSuggestions((v) => !v)}
              className="text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:underline"
            >
              {showSuggestions ? "Masquer les exemples" : "Exemples de questions"}
            </button>
            <button
              type="button"
              onClick={() => setMessages((prev) => [...prev, { role: "quote-form" }])}
              className="font-medium text-[var(--accent)] hover:underline"
            >
              📋 Faire une estimation
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="flex gap-2 p-3"
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
