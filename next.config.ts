import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Allow loading profile pictures from Google accounts
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

// Log the site domain for startup
console.log('\n- Site Domain: ', `${process.env.ENABLE_HTTPS === 'true' ? 'https' : 'http'}://${process.env.BETTER_AUTH_DOMAIN}:${process.env.PORT}`);
export default nextConfig;
