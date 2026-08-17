import DOMPurify from 'dompurify';

/**
 * Sanitizes rich-text HTML (event/news content) before it is rendered via
 * dangerouslySetInnerHTML, to prevent stored XSS from admin-authored content.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}
