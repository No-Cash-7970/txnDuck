import { MetadataRoute } from 'next';

/** Generates a robots.txt file */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
