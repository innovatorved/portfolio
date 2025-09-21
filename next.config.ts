import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Credly badge CDN variations
      { protocol: 'https', hostname: 'images.credly.com' },
      { protocol: 'https', hostname: 'media.licdn.com' }, // sometimes used in shares
      // Microsoft Learn / certification images (if any referenced)
      { protocol: 'https', hostname: 'learn.microsoft.com' },
      // QA certificates (PDF preview maybe not image; kept for potential hosting)
      { protocol: 'https', hostname: 'certificates.platform.qa.com' },
      // GitHub raw (if you store a badge asset in a repo)
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
    ],
  },
}

export default nextConfig