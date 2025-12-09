/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param text - The text to escape
 * @returns Escaped HTML string
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Escapes HTML and converts newlines to <br> tags
 * @param text - The text to escape and format
 * @returns Escaped HTML string with line breaks
 */
export function escapeHtmlWithBreaks(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

