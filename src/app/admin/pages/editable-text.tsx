"use client";

import { useEffect, useRef, useState } from "react";
import { sanitizeRichText, detectAlign } from "@/lib/sanitize-html";

type Align = "left" | "center" | "right";

function unwrapAlign(html: string): string {
  const match = /^\s*<(div|span)\s+style="text-align:(?:center|right|justify)">([\s\S]*)<\/\1>\s*$/i.exec(html);
  return match ? match[2] : html;
}

export function EditableText({
  value,
  onChange,
  className = "",
  as: Tag = "div",
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
  as?: "div" | "span" | "h1" | "h2" | "h3";
  placeholder?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const initialized = useRef(false);
  const [focused, setFocused] = useState(false);
  const [align, setAlign] = useState<Align>(() => detectAlign(value));

  useEffect(() => {
    if (!initialized.current && ref.current) {
      ref.current.innerHTML = sanitizeRichText(value);
      initialized.current = true;
    }
  }, [value]);

  function format(cmd: "bold" | "italic" | "underline") {
    ref.current?.focus();
    document.execCommand(cmd);
    onChange(sanitizeRichText(ref.current?.innerHTML ?? ""));
  }

  function applyAlign(target: Align) {
    const el = ref.current;
    if (!el) return;
    el.focus();
    const inner = unwrapAlign(el.innerHTML);
    const wrapped = target === "left" ? inner : `<div style="text-align:${target}">${inner}</div>`;
    const clean = sanitizeRichText(wrapped);
    el.innerHTML = clean;
    setAlign(target);
    onChange(clean);
  }

  return (
    <div className="editable-field-wrap relative">
      {focused && (
        <span
          className="absolute -top-9 left-0 z-20 flex items-center gap-0.5 whitespace-nowrap rounded-full border border-black/10 bg-[var(--background)] px-1.5 py-1 shadow-md"
          onMouseDown={(e) => e.preventDefault()}
        >
          <button type="button" onClick={() => format("bold")} className="flex h-6 w-6 items-center justify-center rounded text-xs font-bold hover:bg-black/5" title="Gras">
            G
          </button>
          <button type="button" onClick={() => format("italic")} className="flex h-6 w-6 items-center justify-center rounded text-xs italic hover:bg-black/5" title="Italique">
            I
          </button>
          <button type="button" onClick={() => format("underline")} className="flex h-6 w-6 items-center justify-center rounded text-xs underline hover:bg-black/5" title="Souligné">
            S
          </button>
          <span className="mx-1 h-4 w-px bg-black/10" />
          {(["left", "center", "right"] as const).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => applyAlign(a)}
              className={`flex h-6 w-6 items-center justify-center rounded text-xs hover:bg-black/5 ${
                align === a ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "text-[var(--foreground)]/60"
              }`}
              title={a === "left" ? "Aligner à gauche" : a === "center" ? "Centrer" : "Aligner à droite"}
            >
              {a === "left" ? "⇤" : a === "center" ? "↔" : "⇥"}
            </button>
          ))}
        </span>
      )}
      <Tag
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onInput={(e: React.FormEvent<HTMLElement>) => onChange(sanitizeRichText(e.currentTarget.innerHTML))}
        data-placeholder={placeholder}
        className={`editable-field rounded outline-none ${className}`}
      />
    </div>
  );
}
