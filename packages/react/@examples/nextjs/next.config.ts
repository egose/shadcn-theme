import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  // Static export has no image-optimization server, so next/image is used
  // with unoptimized output: images are served as-is from their source URLs.
  images: { unoptimized: true },
};

export default nextConfig;
