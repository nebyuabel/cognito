"use client";

export default function SocialLinks() {
  const socials = [
    {
      name: "Telegram",
      username: "@bruh_011",
      url: "https://t.me/bruh_011",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Instagram",
      username: "@space_time0110",
      url: "https://instagram.com/space_time0110",
      icon: "📸",
      color: "from-purple-500 to-pink-500",
    },
    {
      name: "TikTok",
      username: "@space_time-0110",
      url: "https://tiktok.com/@space_time-0110",
      icon: "🎵",
      color: "from-black to-gray-800",
    },
    {
      name: "Email",
      username: "nebyud4@gmail.com",
      url: "mailto:nebyud4@gmail.com",
      icon: "✉️",
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-black mb-6 text-center">
        Connect With Me
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {socials.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              group p-4 rounded-xl border border-white/10 bg-white/5 
              hover:bg-white/10 transition-all duration-300 hover:scale-105
              backdrop-blur-sm
            `}
          >
            <div className="flex items-center gap-4">
              <div
                className={`text-2xl group-hover:scale-110 transition-transform duration-300`}
              >
                {social.icon}
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-black group-hover:text-primary transition-colors">
                  {social.name}
                </div>
                <div className="text-black/70 text-sm truncate">
                  {social.username}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
