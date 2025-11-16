"use client";
import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  slug: string;
  content_markdown: string;
  cover_image_url: string;
  created_at: string;
  category: string;
  is_published: boolean;
  excerpt?: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="relative min-h-screen w-full bg-background-light dark:bg-background-dark text-[#F5F5F5]/90">
        {/* Blurred Background Image */}
        <div
          className="fixed inset-0 z-0 h-full w-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC77bBe9Wb0GBfg_2LaupMqF86So-oXuOQI90uVuXoOnVKhH0rvF1xvqfw9Rh5gmeSkmyWa2hWuKJdb3pXCqYxDnXAsx6aZvI07HbxyWX98uWkfcdX_xQjZ-4xzoPV1u0t-UN6cucO-uy1B9kygny7l5QrjX4mBEQcwNQBAFyVW1zhDNgFW1WfUWxRLOcmU7cKIKLs-lHI5D-fEsvbUtkJ8IlKdwV05RFyNXFE7vN6Uc2XDkajnR6l33_MDdPj1UixUp0_-WPoSuYg')`,
            filter: "blur(20px)",
          }}
        ></div>
        <div className="fixed inset-0 z-0 bg-black/50"></div>

        <div className="relative z-10 flex h-full grow flex-col">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 sm:px-6 lg:px-8">
            {/* TopNavBar */}
            <header className="sticky top-0 z-20 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-dark/30 px-6 py-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="size-6 text-primary">
                  <svg
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                      fill="currentColor"
                    ></path>
                    <path
                      clipRule="evenodd"
                      d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                      fill="currentColor"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Cognito
                </h2>
              </div>
              <div className="flex flex-1 items-center justify-end gap-8">
                <nav className="hidden items-center gap-8 md:flex">
                  <a
                    href="/"
                    className="text-sm font-medium text-white transition-colors hover:text-primary"
                  >
                    Home
                  </a>
                  <a
                    className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
                    href="/gallery"
                  >
                    Gallery
                  </a>
                  <a
                    className="text-sm font-medium text-white/70 transition-colors hover:text-primary"
                    href="https://linktr.ee/spacetime_0110"
                  >
                    Contact
                  </a>
                </nav>
                <div
                  className="size-10 rounded-full bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: `url("https://i.pinimg.com/1200x/ee/15/91/ee159194eee8da7dd7bacd1d74af9ff8.jpg")`,
                  }}
                ></div>
              </div>
            </header>

            <main className="flex-1">
              {/* HeroSection */}
              <section className="py-24 text-center sm:py-32">
                <div className="flex flex-col items-center gap-4">
                  <h1 className="font-serif text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl">
                    Welcome to my space.
                  </h1>
                  <h2 className="max-w-2xl text-lg font-normal text-white/80 sm:text-xl">
                    You're probably not supposed to be here, but you're free to
                    stay!
                  </h2>
                </div>
              </section>

              {/* Articles Grid */}
              <section className="pb-24 sm:pb-32">
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="text-white text-lg">
                      Loading articles...
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article: Article) => (
                      <Link
                        key={article.id}
                        href={`/article/${encodeURIComponent(article.slug)}`}
                        className="group flex flex-col gap-4 overflow-hidden rounded-xl bg-background-dark/30 p-4 backdrop-blur-md transition-all duration-300 hover:bg-background-dark/50 hover:shadow-2xl"
                      >
                        <div className="aspect-video w-full overflow-hidden rounded-lg">
                          <div
                            className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundImage: `url('${
                                article.cover_image_url ||
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuD_qkkg7Ga7EBU3gDyg5RsNCY-Zsd5MOiAhn3TWJflBVii-Sg_p3sy0jS_U_ZtVsPhISMhYU0NputrV_KEjckghBEylfz9l17c0SYeZJz1UUZf_Z5N5wgI2rpCq3I840s-PrSoL29aBxuVTxzR02dGYu5NrlFqkdR9D2a9qWrV8aW1I_r0vfPovASxIwqhD0tG6FvknYPf53rlgx-JHMWps7hIqNcmJqMpbk8eBV2ZTTmjWpFEINRX0xeLDI-I4jiZiEgfzm0xtzWQ"
                              }')`,
                            }}
                          ></div>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <p className="text-lg font-bold text-white transition-colors group-hover:text-primary">
                            {article.title}
                          </p>

                          <p className="text-sm font-normal text-white/80 line-clamp-2">
                            {article.excerpt || "..."}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {!loading && articles.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-white/70 text-lg">
                      No articles published yet.
                    </p>
                  </div>
                )}
              </section>
            </main>

            {/* Footer */}
            <footer className="flex flex-col items-center gap-6 border-t border-solid border-white/10 py-10 text-center">
              <div className="flex flex-wrap justify-center gap-6">
                <a
                  aria-label="Telegram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
                  href="t.me/bruh_011"
                >
                  <span className="material-symbols-outlined text-xl"></span>
                </a>
                <a
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-primary hover:text-white"
                  href="instagram.com/space_time0110"
                >
                  <span className="material-symbols-outlined text-xl"></span>
                </a>
              </div>
              <p className="text-sm font-normal text-white/60">
                © 2024 Cognito ergo sum.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
}
