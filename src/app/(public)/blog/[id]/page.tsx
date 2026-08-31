import { notFound } from "next/navigation";
import { getBlogById, getBlogs } from "@/lib/blog-data";
import BlogDetailClient from "./components/blog-detail-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) return { title: "Blog Not Found" };

  return {
    title: `${blog.title} | Hexa-AI Blog`,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: "article",
      siteName: "Hexa-AI",
      locale: "en_US",
      url: `https://gethexa.ai/blog/${id}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.description,
      images: ["/og-image.png"],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [blog, allBlogs] = await Promise.all([getBlogById(id), getBlogs()]);

  if (!blog) notFound();

  const relatedBlogs = allBlogs.filter((b) => b.id !== id).slice(0, 3);

  return <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />;
}
