"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content_markdown: string;
  cover_image_url: string;
  created_at: string;
  category: string;
}

interface ArticleContentProps {
  article: Article;
}

export default function ArticleContent({ article }: ArticleContentProps) {
  const [name, setName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !commentText.trim()) {
      alert("Please fill in both name and comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("comments").insert([
        {
          article_id: article.id,
          author_name: name.trim(),
          comment_text: commentText.trim(),
          is_approved: false,
        },
      ]);

      if (error) throw error;

      // Show success message and reset form
      setShowSuccess(true);
      setName("");
      setCommentText("");

      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Error submitting comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple markdown parser for basic formatting
  const renderContent = (content: string) => {
    const lines = content.split("\n");
    const elements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.startsWith("### ")) {
        elements.push(
          <h3 key={i} className="text-xl font-bold text-slate-900  mt-8 mb-4">
            {line.slice(4)}
          </h3>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-2xl font-bold text-slate-900  mt-10 mb-6">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-3xl font-bold text-slate-900  mt-12 mb-8">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <blockquote
            key={i}
            className="border-l-4 border-primary pl-4 italic text-slate-600  my-6"
          >
            {line.slice(2)}
          </blockquote>
        );
      } else if (line === "") {
        elements.push(<br key={i} />);
      } else {
        elements.push(
          <p
            key={i}
            className="mb-6 text-slate-800  text-base font-normal leading-relaxed"
          >
            {line}
          </p>
        );
      }
    }

    return elements;
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      {/* Navigation Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-solid border-white/10 bg-background-dark/30 px-6 py-4 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-3">
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
            My Space
          </h2>
        </Link>
      </header>

      <main className="flex flex-1 justify-center py-5 sm:px-6 md:px-10 lg:px-20 xl:px-40">
        <div className="layout-content-container flex flex-col max-w-4xl w-full flex-1">
          {/* Cover Image */}
          {article.cover_image_url && (
            <div className="@container mb-8">
              <div
                className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden rounded-xl min-h-[400px]"
                style={{
                  backgroundImage: `url('${article.cover_image_url}')`,
                }}
              ></div>
            </div>
          )}

          {/* Article Content */}
          <div className="px-4 md:px-8">
            <h1 className="text-slate-900  tracking-tight text-3xl md:text-4xl font-bold leading-tight text-center pb-3 pt-10">
              {article.title}
            </h1>
            <p className="text-slate-700  text-sm font-normal leading-normal pb-8 text-center">
              {formatDate(article.created_at)}{" "}
              {article.category && `• ${article.category}`}
            </p>

            <div className="text-slate-800 prose prose-lg  max-w-none">
              {renderContent(article.content_markdown)}
            </div>

            {/* Share Buttons */}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 my-8"></div>

          {/* Comment Form */}
          <div className="px-4 md:px-8 pb-10">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Leave a Comment
            </h2>

            {showSuccess && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg">
                Thank you for your comment! It has been submitted for review.
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmitComment}>
              <div>
                <label
                  className="block text-sm font-medium text-slate-700  mb-2"
                  htmlFor="name"
                >
                  Name *
                </label>
                <input
                  className="block w-full rounded-lg  bg-black p-4  dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-primary transition"
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-slate-700  mb-2"
                  htmlFor="comment"
                >
                  Comment *
                </label>
                <textarea
                  className="block w-full rounded-lg border-slate-300 bg-black p-6 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-primary focus:ring-primary transition"
                  id="comment"
                  name="comment"
                  placeholder="Write your comment here..."
                  rows={4}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center bg-black justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Submitting..." : "Submit Comment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
