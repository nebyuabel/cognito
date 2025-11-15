"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

interface Comment {
  id: string;
  created_at: string;
  author_name: string;
  comment_text: string;
  is_approved: boolean;
  article_id: string;
  articles?: {
    title: string;
  };
}

export default function CommentsTab() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      // First, get all comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

      if (commentsError) throw commentsError;

      // Then, get article titles for each comment
      const commentsWithArticles = await Promise.all(
        (commentsData || []).map(async (comment) => {
          if (comment.article_id) {
            const { data: articleData } = await supabase
              .from("articles")
              .select("title")
              .eq("id", comment.article_id)
              .single();

            return {
              ...comment,
              articles: articleData || { title: "Unknown Article" },
            };
          }
          return {
            ...comment,
            articles: { title: "No Article" },
          };
        })
      );

      setComments(commentsWithArticles);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from("comments")
        .update({ is_approved: true })
        .eq("id", commentId);

      if (error) throw error;

      setComments(
        comments.map((comment) =>
          comment.id === commentId ? { ...comment, is_approved: true } : comment
        )
      );
    } catch (error) {
      console.error("Error approving comment:", error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="text-stone-600 dark:text-stone-400">
        Loading comments...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
        Comments Management ({comments.length})
      </h2>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white dark:bg-[#27211b] rounded-lg border border-stone-200 dark:border-stone-700 p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-stone-900 dark:text-white">
                  {comment.author_name}
                </h3>
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {new Date(comment.created_at).toLocaleDateString()} •
                  {comment.articles?.title}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  comment.is_approved
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {comment.is_approved ? "Approved" : "Pending"}
              </span>
            </div>

            <p className="text-stone-700 dark:text-stone-300 mb-4 whitespace-pre-wrap">
              {comment.comment_text}
            </p>

            <div className="flex gap-2">
              {!comment.is_approved && (
                <button
                  onClick={() => handleApprove(comment.id)}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                >
                  Approve
                </button>
              )}
              <button
                onClick={() => handleDelete(comment.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-stone-500 dark:text-stone-400">
              No comments yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
