import { sanitizeRichText } from "@/lib/sanitize-html";

/**
 * Public-site renderer for text authored with the admin rich-text editor
 * (EditableText): bold/italic/underline + alignment. Sanitizes again at
 * render time as defense in depth (content is already sanitized on save).
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
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: sanitizeRichText(value) }} />;
}
