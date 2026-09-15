"use client";

import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (!initialized.current && ref.current) {
      ref.current.textContent = value;
      initialized.current = true;
    }
  }, [value]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      contentEditable
      suppressContentEditableWarning
      onInput={(e: React.FormEvent<HTMLElement>) => onChange(e.currentTarget.textContent ?? "")}
      data-placeholder={placeholder}
      className={`editable-field rounded outline-none ${className}`}
    />
  );
}
