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

/**
 * Retire les balises HTML d'un contenu riche (événements/actualités) et le
 * tronque, pour l'utiliser comme meta description ou extrait texte brut
 * (JSON-LD, cartes "liés"...) — jamais pour de l'affichage riche.
 */
export function stripHtml(html: string | null | undefined, maxLength = 160): string {
  if (!html) return '';
  const text = DOMPurify.sanitize(html, { ALLOWED_TAGS: [] }).replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '...';
}
