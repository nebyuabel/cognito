"use client";

import { useState } from "react";
import { useAdminAuth } from "../../../hooks/useAdminAuth";
import ArticlesTab from "../components/ArticlesTab";
import GalleryTab from "../components/GalleryTab";
import CommentsTab from "../components/CommentsTab";

export default function AdminDashboard() {
  const { isAuthenticated, isLoading, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<
    "articles" | "gallery" | "comments"
  >("articles");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-white text-center">
          <p>Access Denied</p>
          <a href="/admin" className="text-primary hover:underline">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-[#201A15] border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-stone-900 dark:text-white">
                Admin Dashboard
              </h1>
            </div>
            <button
              onClick={logout}
              className="bg-stone-200 dark:bg-[#393028] text-stone-800 dark:text-white px-4 py-2 rounded-lg hover:bg-stone-300 dark:hover:bg-[#4a3f35] transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white dark:bg-[#201A15] border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: "articles", label: "Articles" },
              { id: "gallery", label: "Gallery" },
              { id: "comments", label: "Comments" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "articles" && <ArticlesTab />}
        {activeTab === "gallery" && <GalleryTab />}
        {activeTab === "comments" && <CommentsTab />}
      </main>
    </div>
  );
}
