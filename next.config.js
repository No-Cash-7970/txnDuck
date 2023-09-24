/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  webpack: (config) => {
    // Add use-wallet dependency modules that cause "not found" errors
    config.externals.push('bufferutil', 'utf-8-validate', 'encoding');
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

module.exports = nextConfig;
