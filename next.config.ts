import type { NextConfig } from "next";

module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3003/api/:path*' // Proxy a tu servidor Express
      }
    ]
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        'dns/promises': false,
        child_process: false,
        'fs/promises': false,
        'timers/promises': false,
      };
    }
    return config;
  },
  // Especificar paquetes que solo deben ejecutarse en el servidor
  serverExternalPackages: ['mongodb'],
};

export default nextConfig;
