import { supabase } from "../../../lib/supabase";
import { notFound } from "next/navigation";
import ArticleContent from "./ArticleContent";

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ArticlePage({ params }: PageProps) {
  // Await the params promise
  const { slug } = await params;

  console.log("🔍 Looking for article with slug:", slug);

  try {
    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .single();

    if (error) {
      console.error("❌ Supabase error:", error);
      notFound();
    }

    if (!article) {
      console.log("❌ Article not found");
      notFound();
    }

    console.log("✅ Article found:", article.title);
    return <ArticleContent article={article} />;
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    notFound();
  }
}

// Generate static params
export async function generateStaticParams() {
  try {
    const { data: articles } = await supabase
      .from("articles")
      .select("slug")
      .eq("is_published", true);

    console.log("📄 Generating static params for articles:", articles);

    return (
      articles?.map((article) => ({
        slug: article.slug,
      })) || []
    );
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Force dynamic rendering to avoid static generation issues
export const dynamic = "force-dynamic";
