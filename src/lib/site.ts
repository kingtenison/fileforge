/**
 * Central site configuration.
 * Set NEXT_PUBLIC_SITE_URL at build time if you move to a custom domain.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://fileforge-iota.vercel.app').replace(/\/$/, '');

export const SITE_NAME = 'FileForge';
export const SITE_TAGLINE = 'Free Online File Converter';

export function siteUrl(path: string = ''): string {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
