/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/postgrest/:path*',
        destination: 'http://localhost:3010/:path*',
      },
      {
        source: '/api/power/:path*',
        destination: 'http://localhost:3012/api/power/:path*',
      },
    ]
  },
}

module.exports = nextConfig
