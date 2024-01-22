import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    start_url: '/',
    display: 'standalone',
    background_color: '#332d2d', // "base-100" color in tailwind.config.js
    theme_color: '#332d2d', // "base-100" color in tailwind.config.js
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
