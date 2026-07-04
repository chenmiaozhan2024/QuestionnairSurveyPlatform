import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.BACKEND_URL || 'http://localhost:8080'}/:path*`,
      },
      {
        source: '/static/:path*',
        destination: `${process.env.BACKEND_URL}/static/:path*`,
      },
    ]
  },
}

export default nextConfig
