import { supabase } from "../../lib/supabase";
import PinterestGallery from "./GalleryGrid";

interface PageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

const ITEMS_PER_PAGE = 20;

export default async function GalleryPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    console.log("🔄 Fetching gallery items...");

    // Fetch gallery items with pagination
    const { data: galleryItems, error } = await supabase
      .from("gallery")
      .select("*", { count: "exact" })
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .range(offset, offset + ITEMS_PER_PAGE - 1);

    if (error) {
      console.error("❌ Error fetching gallery items:", error);
      throw error;
    }

    console.log("✅ Gallery items fetched:", galleryItems?.length);

    // Get total count for pagination
    const { count } = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true);

    const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

    console.log("✅ Total pages:", totalPages);

    // Ensure items is always an array, even if null/undefined
    const safeItems = Array.isArray(galleryItems) ? galleryItems : [];

    return (
      <PinterestGallery
        items={safeItems}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    );
  } catch (error) {
    console.error("❌ Error in gallery page:", error);

    // Return empty state with error
    return <PinterestGallery items={[]} currentPage={1} totalPages={1} />;
  }
}
