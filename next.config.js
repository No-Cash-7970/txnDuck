/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
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
