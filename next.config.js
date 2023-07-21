/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
};

if (process.env.STATIC_BUILD?.toLowerCase() === 'true') {
  nextConfig.output = 'export';
}

module.exports = nextConfig;
