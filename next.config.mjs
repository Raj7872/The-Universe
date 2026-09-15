/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  experimental: {
    optimizePackageImports: ['framer-motion'],
  },
  webpack: (config, { isServer }) => {
    // Handle Three.js on server (disable)
    if (isServer) {
      config.externals = [...(config.externals || []), 'three', '@react-three/fiber'];
    }
    return config;
  },
};

export default nextConfig;
