"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface GalleryItem {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  media_type: "image" | "video";
  embed_html: string | null;
  category: string | null;
  created_at: string;
}

interface PinterestGalleryProps {
  items?: GalleryItem[]; // Make items optional
  currentPage: number;
  totalPages: number;
}

export default function PinterestGallery({
  items = [], // Default to empty array
  currentPage,
  totalPages,
}: PinterestGalleryProps) {
  const [isClient, setIsClient] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => new Set(prev).add(id));
  };

  // Safe items array
  const safeItems = Array.isArray(items) ? items : [];
  const hasItems = safeItems.length > 0;

  // Render media content based on type
  // In the renderMedia function, update the video section:
  const renderMedia = (item: GalleryItem) => {
    if (item.media_type === "video") {
      if (item.embed_html) {
        // Check if it's a TikTok embed
        if (
          item.embed_html.includes("tiktok.com") ||
          item.embed_html.includes("tiktok-embed")
        ) {
          return (
            <div className="w-full aspect-[9/16] bg-black">
              <div
                className="w-full h-full tiktok-embed-container"
                dangerouslySetInnerHTML={{ __html: item.embed_html }}
              />
            </div>
          );
        } else {
          // Other embeds (YouTube, Vimeo, etc.)
          return (
            <div
              className="w-full aspect-video"
              dangerouslySetInnerHTML={{ __html: item.embed_html }}
            />
          );
        }
      } else {
        // Direct video URLs
        return (
          <div className="w-full aspect-video bg-black flex items-center justify-center">
            <video
              className="w-full h-full object-cover"
              src={item.media_url}
              controls
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
    } else {
      // For images
      return (
        <img
          className={`w-full h-auto object-cover transition-transform duration-300 ${
            loadedImages.has(item.id) ? "opacity-100" : "opacity-0"
          }`}
          src={item.media_url}
          alt={item.description || item.title}
          onLoad={() => handleImageLoad(item.id)}
          loading="lazy"
        />
      );
    }
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark  text-[#e3e1e1]">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-background-dark/30 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-black">
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
          <h2 className="text-black text-lg font-bold tracking-tight">
            Cognito
          </h2>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-black/80 hover:text-black text-sm font-medium transition-colors"
          >
            Home
          </Link>
          <Link
            href="/gallery"
            className="text-black text-sm font-medium transition-colors"
          >
            Gallery
          </Link>
          <a
            className="text-black/80 hover:text-black text-sm font-medium transition-colors"
            href="https://linktr.ee/spacetime_0110"
          >
            Contact
          </a>
        </nav>
      </header>

      {/* Masonry Grid */}
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {!hasItems ? (
          // Empty State
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="size-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">
                  photo_library
                </span>
              </div>
              <h3 className="text-2xl font-bold text-black mb-4">
                No Gallery Items Yet
              </h3>

              <Link
                href="/admin/dashboard"
                className="inline-flex items-center px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors backdrop-blur-sm border border-primary/30"
              >
                <span className="material-symbols-outlined mr-2">add</span>
                Add Items in Admin
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Gallery Grid */}

            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {safeItems.map((item) => (
                <div
                  key={item.id}
                  className={`
        group relative block overflow-hidden rounded-xl break-inside-avoid 
        backdrop-blur-sm border
        ${
          item.media_type === "video"
            ? "bg-blue-500/5 border-blue-500/20"
            : "bg-white/5 border-white/10"
        }
      `}
                >
                  {/* Media */}
                  <div className="w-full h-auto relative">
                    {renderMedia(item)}

                    {/* Video indicator badge */}
                    {item.media_type === "video" && (
                      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-primary text-sm">
                          play_arrow
                        </span>
                        <span className="text-white text-xs font-medium">
                          {item.embed_html?.includes("tiktok.com")
                            ? "TikTok"
                            : "Video"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content - Always visible for videos, hover for images */}
                  <div
                    className={`
        p-4 transition-all duration-300
        ${
          item.media_type === "video"
            ? "bg-linear-to-t from-black/80 to-transparent"
            : "group-hover:bg-black/60 absolute inset-0 opacity-0 group-hover:opacity-100 flex flex-col justify-end"
        }
      `}
                  >
                    <div
                      className={
                        item.media_type === "video"
                          ? ""
                          : "transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300"
                      }
                    >
                      <h3 className="text-white text-lg font-bold leading-tight mb-2">
                        {item.title}
                      </h3>
                      {item.description && item.media_type === "video" && (
                        <p className="text-white/80 text-sm mb-3 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                      {item.category && (
                        <span
                          className={`
              inline-block px-3 py-1 text-xs rounded-full backdrop-blur-sm border
              ${
                item.media_type === "video"
                  ? "bg-primary/30 text-primary border-primary/40"
                  : "bg-primary/20 text-primary border-primary/30"
              }
            `}
                        >
                          {item.category}
                        </span>
                      )}

                      {/* Show description on hover for images only */}
                      {item.description && item.media_type === "image" && (
                        <p className="text-white/80 text-sm mb-3 leading-relaxed mt-2">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 pt-12">
                {/* Previous Button */}
                <Link
                  href={
                    currentPage > 1 ? `/gallery?page=${currentPage - 1}` : "#"
                  }
                  className={`flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold transition-colors backdrop-blur-sm border ${
                    currentPage > 1
                      ? "bg-primary text-black hover:bg-primary/90 border-primary/30"
                      : "bg-stone-600/50 text-stone-400 cursor-not-allowed border-stone-600/30"
                  }`}
                >
                  Previous
                </Link>

                {/* Page Info */}
                <span className="text-white/80 px-4 py-2 bg-black/10 backdrop-blur-sm rounded-lg border border-white/10">
                  Page {currentPage} of {totalPages}
                </span>

                {/* Next Button */}
                <Link
                  href={
                    currentPage < totalPages
                      ? `/gallery?page=${currentPage + 1}`
                      : "#"
                  }
                  className={`flex items-center justify-center rounded-lg px-6 py-3 text-base font-bold transition-colors backdrop-blur-sm border ${
                    currentPage < totalPages
                      ? "bg-primary text-black hover:bg-primary/90 border-primary/30"
                      : "bg-stone-600/50 text-stone-900 cursor-not-allowed border-stone-600/30"
                  }`}
                >
                  Next
                </Link>
              </div>
            )}
            {/* Load More Button */}
            {currentPage < totalPages && (
              <div className="flex pt-8 justify-center">
                <Link
                  href={`/gallery?page=${currentPage + 1}`}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary text-black text-base font-bold tracking-[0.015em] hover:bg-primary/90 transition-colors backdrop-blur-sm border border-primary/30"
                >
                  <span className="truncate">Load More</span>
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      {/* Glassmorphism Footer */}
      <footer className="flex flex-col gap-8 px-5 py-10 text-center border-t border-solid border-white/10 mt-12 bg-background-dark/30 backdrop-blur-sm">
        <div className="flex justify-center gap-6">
          <a
            className="text-white/60 hover:text-primary transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10"
            href="gmail.com/nebyud4@gmail.com"
          >
            <span className="material-symbols-outlined text-lg">
              alternate_email
            </span>
          </a>
          <a
            className="text-white/60 hover:text-primary transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">
              photo_camera
            </span>
          </a>
          <a
            className="text-white/60 hover:text-primary transition-colors p-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/10"
            href="#"
          >
            <span className="material-symbols-outlined text-lg">link</span>
          </a>
        </div>
        <p className="text-white/50 text-sm font-normal leading-normal">
          © 2025 Cognito ergo sum.
        </p>
      </footer>
    </div>
  );
}
