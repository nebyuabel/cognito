"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function ArticlesTab() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const saveArticle = async (publish: boolean = false) => {
    if (!title || !content) {
      alert("Please fill in title and content first");
      return false;
    }

    setIsSubmitting(true);
    try {
      const articleData = {
        title,
        slug: slug || generateSlug(title),
        content_markdown: content,
        cover_image_url: coverImage || null,
        category: category || null,
        is_published: publish,
      };

      const { error } = await supabase.from("articles").insert([articleData]);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error(
        `Error ${publish ? "publishing" : "saving"} article:`,
        error
      );
      alert(`Error ${publish ? "publishing" : "saving"} article`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await saveArticle(false);
    if (success) {
      setTitle("");
      setSlug("");
      setContent("");
      setCoverImage("");
      setCategory("");
      alert("Article saved as draft!");
    }
  };

  const handlePublish = async () => {
    const success = await saveArticle(true);
    if (success) {
      setTitle("");
      setSlug("");
      setContent("");
      setCoverImage("");
      setCategory("");
      alert("Article published!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
        Create New Article
      </h2>

      <form onSubmit={handleSaveDraft} className="space-y-6">
        {/* Cover Image */}
        <div className="rounded-lg border-2 border-dashed border-stone-300 dark:border-[#54473b] p-8 text-center hover:border-primary/50 transition-colors">
          <div className="flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-stone-400 dark:text-stone-500 text-3xl">
              add_photo_alternate
            </span>
            <p className="text-stone-800 dark:text-white text-lg font-bold">
              Add a cover image
            </p>
            <input
              type="url"
              placeholder="Paste image URL here..."
              className="w-full max-w-md px-3 py-2 border border-stone-300 dark:border-stone-600 rounded-lg bg-white dark:bg-[#201A15] text-stone-900 dark:text-white"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
            />
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Article Title *
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 text-2xl font-bold text-stone-900 dark:text-white bg-transparent border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="Untitled Article"
            value={title}
            onChange={handleTitleChange}
            required
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            URL Slug *
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-stone-900 dark:text-white bg-transparent border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />
          <p className="text-xs text-stone-500 mt-1">
            This will be used in the article URL: /article/
            {slug || "your-slug-here"}
          </p>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Category
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 text-stone-900 dark:text-white bg-transparent border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
            placeholder="e.g., Technology, Design"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">
            Content (Markdown) *
          </label>
          <textarea
            className="w-full h-96 px-4 py-3 text-stone-900 dark:text-white bg-white dark:bg-[#27211b] border border-stone-300 dark:border-stone-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
            placeholder="Start writing your article in markdown..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={isSubmitting}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
          >
            {isSubmitting ? "Publishing..." : "Publish Now"}
          </button>
        </div>
      </form>
    </div>
  );
}
