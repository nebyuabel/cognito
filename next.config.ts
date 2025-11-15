/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@supabase/supabase-js"],
  },
  images: {
    domains: [
      "static.vecteezy.com",
      "lh3.googleusercontent.com",
      "p16-amd-va.tiktokcdn.com",
      "p77-amd-va.tiktokcdn.com",
      "i.ytimg.com",
      "vimeo.com",
    ],
  },
  // Allow TikTok embed scripts
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.tiktok.com *.youtube.com *.vimeo.com;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
