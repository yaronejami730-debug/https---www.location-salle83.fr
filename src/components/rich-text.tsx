import { sanitizeInlineHtml, parseAligned } from "@/lib/sanitize-html";

/**
 * Public-site renderer for text authored with the admin rich-text editor
 * (EditableText): bold/italic/underline + alignment. Sanitizes again at
 * render time as defense in depth (content is already sanitized on save).
 * Alignment is applied as a style on this component's own tag — never as a
 * nested wrapper, which would be invalid HTML inside <p>/<h1>-<h6>.
 */
export function RichText({
  value,
  as: Tag = "span",
  className = "",
}: {
  value: string;
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const { align, html } = parseAligned(value);
  return (
    <Tag
      className={className}
      style={align !== "left" ? { textAlign: align } : undefined}
      dangerouslySetInnerHTML={{ __html: sanitizeInlineHtml(html) }}
    />
  );
}
