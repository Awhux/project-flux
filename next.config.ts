import type { NextConfig } from 'next';
// import createMDX from '@next/mdx'

const nextConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right'
  },
  // pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        hostname: '**',
        protocol: 'http',
      },
      {
        hostname: '**',
        protocol: 'https',
      },
    ],
    qualities: [25, 50, 75, 100],
    minimumCacheTTL: 60 * 60 * 24,
  },
  transpilePackages: [
    'better-auth',
    'prisma',
    '@prisma/client',
  ],
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
};

// const withMDX = createMDX({
//   extension: /\.(md|mdx)$/,
// });

// export default withMDX(nextConfig);

export default nextConfig;