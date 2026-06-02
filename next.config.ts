import type { NextConfig } from 'next'

const config: NextConfig = {
  experimental: {
    // Required for @neondatabase/serverless WebSocket support in Node.js runtime
    serverComponentsExternalPackages: ['@neondatabase/serverless'],
  },
}

export default config
