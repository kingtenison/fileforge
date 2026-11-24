import type { MetadataRoute } from 'next';
import { TOOLS } from '@/lib/tools';
import { SITE_URL, siteUrl } from '@/lib/site';

const LAST_MODIFIED = new Date('2026-11-24T00:00:00.000Z');

export default function sitemap(): MetadataRoute.Sitemap {
  const toolPages: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: siteUrl(`/tools/${tool.id}`),
    lastModified: LAST_MODIFIED,
    changeFrequency: 'weekly',
    priority: tool.popular ? 0.9 : 0.7,
  }));

  return [
    { url: SITE_URL, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
    { url: siteUrl('/about'), lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.5 },
    { url: siteUrl('/privacy'), lastModified: LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    ...toolPages,
  ];
}
