import sanitizeHtml from "sanitize-html";

/**
 * Sanitize HTML rendered from CMS (blog/careers) to mitigate stored XSS if an admin account is compromised
 * or malicious content is inserted.
 */
export function sanitizePublicContentHtml(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags: [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "br",
      "strong",
      "em",
      "b",
      "i",
      "ul",
      "ol",
      "li",
      "a",
      "blockquote",
      "code",
      "pre",
      "span",
      "div",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "title"],
      "*": ["class"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => {
        const out: Record<string, string> = { ...attribs };
        if (out.target === "_blank") {
          out.rel = "noopener noreferrer";
        }
        return { tagName: "a", attribs: out };
      },
    },
  });
}
