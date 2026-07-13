/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],

    qualities: [75, 85, 90, 100],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://propertybouquet.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;