/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: ["icongr.am"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icongr.am",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
