import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    // Add use-wallet dependency modules that cause "not found" errors. Also see
    // https://github.com/WalletConnect/walletconnect-monorepo/issues/1908#issuecomment-1487801131
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    config.resolve.fallback = { fs: false };

    /**
     * Provide fallbacks for optional wallet dependencies.
     * This allows the app to build and run without these packages installed, enabling users to
     * include only the wallet packages they need. Each package is set to 'false', which means
     * Webpack will provide an empty module if the package is not found, preventing build errors for
     * unused wallets.
     */
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@agoralabs-sh/avm-web-provider': false,
        '@blockshake/defly-connect': false,
        '@magic-ext/algorand': false,
        '@perawallet/connect': false,
        '@perawallet/connect-beta': false,
        '@walletconnect/modal': false,
        '@walletconnect/sign-client': false,
        'lute-connect': false,
        'magic-sdk': false,
        '@algorandfoundation/liquid-auth-use-wallet-client': false,
      };
    }

    return config;
  },
  eslint: {
    // !! WARN !!
    // This allows production builds to successfully complete even if your project has ESLint
    // errors.
    // !! WARN !!
    ignoreDuringBuilds: process.env.IGNORE_ESLINT_BUILD_ERRORS?.toLowerCase() === 'true',
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if your project has type
    // errors.
    // !! WARN !!
    ignoreBuildErrors: process.env.IGNORE_TS_BUILD_ERRORS?.toLowerCase() === 'true',
  },
};

if (process.env.STATIC_BUILD?.toLowerCase() === 'true') {
  nextConfig.output = 'export';
}

if (process.env.STANDALONE_BUILD?.toLowerCase() === 'true') {
  nextConfig.output = 'standalone';
}

// Create configuration for next-pwa plugin
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.DISABLE_PWA === 'true',
  // register: true,
  // scope: '/app',
  // sw: 'service-worker.js',
  //...
});

// Export the combined Next.js and PWA configuration
module.exports = withPWA(nextConfig);
