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

/** Reads the outer alignment wrapper (if any) so the toolbar can show the active state. */
export function detectAlign(html: string): "left" | "center" | "right" {
  const match = /^\s*<(?:div|span)\s+style="text-align:(center|right|justify)"/i.exec(html ?? "");
  if (!match) return "left";
  return match[1] === "justify" ? "left" : (match[1].toLowerCase() as "center" | "right");
}
