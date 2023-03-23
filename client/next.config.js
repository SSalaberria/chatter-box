/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "icongr.am",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "chatterbox-app.s3.us-east-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
};

module.exports = nextConfig;
