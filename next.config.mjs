/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 828, 1080, 1200, 1920],
  },
  async headers() {
    return [
      {
        source: '/videos/:path*',
        headers: [
          { key: 'Accept-Ranges', value: 'bytes' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
  async rewrites() {
    return [
      { source: '/favicon.ico', destination: '/images/icon.png' },
    ]
  },
}

export default nextConfig
