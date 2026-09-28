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
      {
        protocol: "https",
        hostname: "d2dy9w7mmecm6m.cloudfront.net",
      },
      {
        protocol: "https",
        hostname: "managemylawsuits.com",
      },
    ],

    qualities: [75, 78, 80, 85, 90, 100],
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