const ALLOWED_INLINE_TAGS = new Set(["b", "strong", "i", "em", "u", "br"]);
const ALLOWED_BLOCK_TAGS = new Set(["div", "span"]);

/**
 * Allow-list sanitizer for the admin rich-text fields: bold/italic/underline
 * plus one outer alignment wrapper (div/span with only a validated
 * text-align style). Everything else — scripts, links, event handlers,
 * arbitrary attributes — is stripped. Pure string function, safe to run on
 * both the client (live preview) and the server (before persisting).
 */
export function sanitizeRichText(html: string): string {
  if (!html) return "";
  let out = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  out = out.replace(/<(\/?)([a-zA-Z0-9]+)([^>]*)>/g, (match, closing: string, tagRaw: string, attrs: string) => {
    const tag = tagRaw.toLowerCase();
    if (ALLOWED_INLINE_TAGS.has(tag)) return closing ? `</${tag}>` : `<${tag}>`;
    if (ALLOWED_BLOCK_TAGS.has(tag)) {
      if (closing) return `</${tag}>`;
      const styleMatch = /style\s*=\s*"([^"]*)"/i.exec(attrs);
      const alignMatch = styleMatch ? /text-align\s*:\s*(left|center|right|justify)/i.exec(styleMatch[1]) : null;
      return alignMatch ? `<${tag} style="text-align:${alignMatch[1]}">` : `<${tag}>`;
    }
    return "";
  });
  return out;
}

/** Plain text (tags stripped) for contexts that can't render HTML — alt text, <title>, aria labels. */
export function stripHtml(html: string): string {
  return (html ?? "").replace(/<[^>]*>/g, "");
}

type Align = "left" | "center" | "right";

/**
 * Alignment is never embedded as a nested wrapper (a block-level <div> inside
 * a <p>/<h1> is invalid HTML — browsers silently restructure it, which is
 * exactly what caused a real hydration mismatch here). Instead it's carried
 * as an outer wrapper on the STORED value only so the admin toolbar can
 * detect it; renderers must unwrap it and apply text-align as a style on
 * their own container tag instead. See RichText and EditableText.
 */
export function parseAligned(html: string): { align: Align; html: string } {
  const match = /^\s*<div style="text-align:(center|right|justify)">([\s\S]*)<\/div>\s*$/i.exec(html ?? "");
  if (!match) return { align: "left", html: html ?? "" };
  const align = match[1].toLowerCase() === "justify" ? "left" : (match[1].toLowerCase() as Align);
  return { align, html: match[2] };
}

/** Reads the outer alignment wrapper (if any) so the toolbar can show the active state. */
export function detectAlign(html: string): Align {
  return parseAligned(html).align;
}
