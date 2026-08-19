import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tourhelpdesk.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/login', '/credit-card-verification'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
