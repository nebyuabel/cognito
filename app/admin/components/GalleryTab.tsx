"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function GalleryTab() {
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [embedHtml, setEmbedHtml] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTikTokHelp, setShowTikTokHelp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // For TikTok, we need to use the embed code, not the direct URL
      let finalMediaUrl = mediaUrl;
      let finalEmbedHtml = embedHtml;

      // If it's a TikTok URL and no embed code provided, show help
      if (
        mediaType === "video" &&
        mediaUrl.includes("tiktok.com") &&
        !embedHtml
      ) {
        alert(
          'For TikTok videos, please use the embed code. Click the "Get TikTok Embed Code" help button for instructions.'
        );
        setIsSubmitting(false);
        return;
      }

      // If embed HTML is provided for TikTok, we'll use a placeholder image as media_url
      if (
        mediaType === "video" &&
        embedHtml &&
        mediaUrl.includes("tiktok.com")
      ) {
        // Extract video ID for placeholder
        const videoId = extractTikTokVideoId(mediaUrl);
        finalMediaUrl = `https://p16-sign-va.tiktokcdn.com/obj/tos-useast5-p-0068-tx/${videoId}?x-expires=1700000000&x-signature=xxx`; // Placeholder
      }

      const galleryData = {
        title,
        description: description || null,
        media_url: finalMediaUrl,
        media_type: mediaType,
        embed_html: mediaType === "video" ? finalEmbedHtml : null,
        category: category || null,
        is_published: true,
      };

      const { error } = await supabase.from("gallery").insert([galleryData]);

      if (error) throw error;

      // Reset form
      setMediaUrl("");
      setTitle("");
      setDescription("");
      setEmbedHtml("");
      setCategory("");
      alert("Item added to gallery successfully!");
    } catch (error) {
      console.error("Error adding to gallery:", error);
      alert("Error adding to gallery");
    } finally {
      setIsSubmitting(false);
    }
  };

  const extractTikTokVideoId = (url: string) => {
    // Extract video ID from TikTok URL
    const match = url.match(/\/video\/(\d+)/);
    return match ? match[1] : "unknown";
  };

  const getTikTokEmbedCode = async () => {
    if (!mediaUrl.includes("tiktok.com")) {
      alert("Please enter a TikTok URL first");
      return;
    }

    try {
      // This is a client-side workaround since we can't make server requests from admin
      const embedCode = `<!-- TikTok Embed -->
      <blockquote class="tiktok-embed" cite="${mediaUrl}" data-video-id="${extractTikTokVideoId(
        mediaUrl
      )}" style="max-width: 605px;min-width: 325px;">
        <section></section>
      </blockquote>
      <script async src="https://www.tiktok.com/embed.js"></script>`;

      setEmbedHtml(embedCode);
      alert("TikTok embed code generated! You can now submit the form.");
    } catch (error) {
      console.error("Error generating TikTok embed:", error);
      alert(
        "Error generating embed code. Please manually paste the embed code from TikTok."
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
        Add to Gallery
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Media Type
          </label>
          <select
            value={mediaType}
            onChange={(e) => setMediaType(e.target.value as "image" | "video")}
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            {mediaType === "image" ? "Image URL" : "Video URL"}
          </label>
          <input
            type="url"
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white"
            placeholder={
              mediaType === "image"
                ? "https://example.com/image.jpg"
                : "YouTube/Vimeo/TikTok URL"
            }
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            required
          />

          {mediaType === "video" && mediaUrl.includes("tiktok.com") && (
            <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                <strong>TikTok Detected:</strong> You'll need to use the embed
                code below for TikTok videos to work properly.
              </p>
            </div>
          )}
        </div>

        {mediaType === "video" && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300">
                Embed HTML{" "}
                {mediaUrl.includes("tiktok.com") && "(Required for TikTok)"}
              </label>

              {mediaUrl.includes("tiktok.com") && (
                <button
                  type="button"
                  onClick={getTikTokEmbedCode}
                  className="text-sm bg-primary text-black px-3 py-1 rounded hover:bg-primary/90 transition-colors"
                >
                  Generate TikTok Embed
                </button>
              )}
            </div>

            <textarea
              className="w-full h-32 px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white resize-none font-mono text-sm"
              placeholder={
                mediaUrl.includes("tiktok.com")
                  ? "TikTok embed code will be generated automatically..."
                  : "Paste YouTube/Vimeo/Instagram embed code here (optional)"
              }
              value={embedHtml}
              onChange={(e) => setEmbedHtml(e.target.value)}
            />

            {mediaUrl.includes("tiktok.com") && (
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setShowTikTokHelp(!showTikTokHelp)}
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  {showTikTokHelp ? "Hide" : "Show"} TikTok Help
                </button>

                {showTikTokHelp && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-blue-800 dark:text-blue-200 text-sm mb-2">
                      <strong>How to get TikTok embed code:</strong>
                    </p>
                    <ol className="text-blue-800 dark:text-blue-200 text-sm list-decimal list-inside space-y-1">
                      <li>
                        Go to the TikTok video on the TikTok app or website
                      </li>
                      <li>Click the "Share" button</li>
                      <li>Select "Embed" from the share options</li>
                      <li>Copy the embed code and paste it above</li>
                      <li>
                        Or click "Generate TikTok Embed" to auto-generate a
                        basic embed
                      </li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Title *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Description
          </label>
          <textarea
            className="w-full h-24 px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white resize-none"
            placeholder="Enter a description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white"
            placeholder="e.g., Nature, Architecture, Art"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Adding..." : "Add to Gallery"}
        </button>
      </form>
    </div>
  );
}
