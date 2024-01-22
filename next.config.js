/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  webpack: (config) => {
    // Add use-wallet dependency modules that cause "not found" errors
    config.externals.push('bufferutil', 'utf-8-validate', 'encoding');
    config.resolve.fallback = { fs: false };

    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: process.env.IGNORE_ESLINT_BUILD_ERRORS?.toLowerCase() === 'true',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: process.env.IGNORE_TS_BUILD_ERRORS?.toLowerCase() === 'true',
  },
};

if (process.env.STATIC_BUILD?.toLowerCase() === 'true') {
  nextConfig.output = 'export';
}

// Create configuration for next-pwa plugin
const withPWA = require('next-pwa')({
  dest: 'public',
  // disable: process.env.NODE_ENV === 'development',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});

// Export the combined Next.js and PWA configuration
module.exports = withPWA(nextConfig);
