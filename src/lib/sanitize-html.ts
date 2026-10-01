const ALLOWED_INLINE_TAGS = new Set(["b", "strong", "i", "em", "u", "br"]);
const ALLOWED_BLOCK_TAGS = new Set(["div", "span"]);

/**
 * Allow-list sanitizer for the admin rich-text fields: bold/italic/underline
 * plus one outer alignment wrapper (div/span with only a validated
 * text-align style). Everything else — scripts, links, event handlers,
 * arbitrary attributes — is stripped. Pure string function, safe to run on
 * both the client (live preview) and the server (before persisting).
 *
 * Used for the SAVE/EDIT path only (EditableText, savePageContent), where a
 * div/span wrapper may legitimately be the value's outer alignment marker.
 * Render paths must use `sanitizeInlineHtml` on the content returned by
 * `parseAligned` instead — see its doc comment for why.
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

/**
 * Stricter sanitizer for rendering: only the inline formatting tags survive,
 * never div/span. Use this on the `html` returned by `parseAligned`, never
 * raw stored values — a bare block tag anywhere inside a <p>/<h1>-<h6> is
 * invalid HTML that browsers silently restructure, which previously caused
 * a real React hydration mismatch (both from the admin's own alignment
 * wrapper, and separately from unrelated legacy content that happened to
 * contain a literal "<div>"). Block tags have no legitimate reason to
 * appear here once the outer alignment wrapper has already been unwrapped.
 */
export function sanitizeInlineHtml(html: string): string {
  if (!html) return "";
  let out = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  out = out.replace(/<(\/?)([a-zA-Z0-9]+)[^>]*>/g, (match, closing: string, tagRaw: string) => {
    const tag = tagRaw.toLowerCase();
    if (ALLOWED_INLINE_TAGS.has(tag)) return closing ? `</${tag}>` : `<${tag}>`;
    // A bare block tag (div/span with no valid align style — e.g. legacy
    // content, or a browser inserting a <div> per line on Enter) has no
    // business surviving here, but dropping it silently would run two
    // paragraphs together. Degrade it to a line break instead.
    if (ALLOWED_BLOCK_TAGS.has(tag)) return closing ? "" : "<br>";
    return "";
  });
  // Leading/trailing line breaks (a stray Enter in the editor) only add empty
  // space above/below the text and make sibling cards uneven — drop them.
  return out.replace(/^(\s*<br>)+\s*/i, "").replace(/(\s*<br>)+\s*$/i, "");
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
