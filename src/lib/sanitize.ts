import DOMPurify from 'dompurify';

/**
 * Nettoie le HTML riche (contenu d'événements/actualités) avant de l'injecter
 * via dangerouslySetInnerHTML, pour empêcher une faille XSS stockée à partir
 * d'un contenu saisi côté admin.
 */
export function sanitizeHtml(html: string | null | undefined): string {
  if (!html) return '';
  return DOMPurify.sanitize(html);
}
