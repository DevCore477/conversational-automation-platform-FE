"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { Calendar, Clock, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { Blog } from "@/types/blog.types";

const GRID_PER_PAGE = 9;

const gradients = [
  "from-[#0EA5E9]/20 to-[#EE10E5]/10",
  "from-[#06B6D4]/20 to-[#0EA5E9]/10",
  "from-[#8B5CF6]/20 to-[#0EA5E9]/10",
  "from-[#EC4899]/20 to-[#8B5CF6]/10",
  "from-[#14B8A6]/20 to-[#06B6D4]/10",
  "from-[#F97316]/20 to-[#EC4899]/10",
  "from-[#0EA5E9]/20 to-[#14B8A6]/10",
];

const categoryColors: Record<string, string> = {
  "AI Voice": "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  "Customer Support": "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  WhatsApp: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  Communication: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  Healthcare: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
  Tutorial: "bg-[#0EA5E9]/10 text-[#0EA5E9]",
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getGradient(index: number) {
  return gradients[index % gradients.length];
}

function CategoryBadge({ category }: { category: string }) {
  const color =
    categoryColors[category] ?? "bg-[#0EA5E9]/10 text-[#0EA5E9]";
  return (
    <span
      className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${color}`}
    >
      {category}
    </span>
  );
}

function BlogCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`flex aspect-[16/10] items-end justify-start bg-gradient-to-br ${getGradient(index)}`}
      >
        <div className="p-3">
          <CategoryBadge category={blog.category} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formatDate(blog.date)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{blog.readTime}</span>
          </div>
        </div>
        <h3 className="font-dm-sans text-base font-medium leading-snug text-dark-gray transition-colors group-hover:text-[#0EA5E9]">
          {blog.title}
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-slate-gray">
          {blog.description}
        </p>
        <div className="mt-1 flex items-center justify-between border-t border-gray-50 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <User className="h-3.5 w-3.5" />
            <span>{blog.author}</span>
          </div>
          <span className="flex items-center gap-1 text-xs font-medium text-[#0EA5E9] opacity-0 transition-opacity group-hover:opacity-100">
            Read More
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-gray transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-gray">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
              p === currentPage
                ? "bg-[#0EA5E9] text-white"
                : "border border-gray-200 text-slate-gray hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-slate-gray transition-colors hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function BlogPageClient({ blogs }: { blogs: Blog[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Math.max(1, Number(searchParams.get("page")) || 1);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const qs = params.toString();
      router.push(qs ? `/blog?${qs}` : "/blog", { scroll: false });
    },
    [router, searchParams],
  );

  const [featured, ...rest] = blogs;
  const totalGridPages = Math.max(1, Math.ceil(rest.length / GRID_PER_PAGE));

  // Page 1 = featured + first 9; Page 2+ = 9 per page
  const isPageOne = currentPage === 1;
  const gridPageIndex = isPageOne ? 0 : currentPage - 1;
  const gridStart = isPageOne ? 0 : (currentPage - 1) * GRID_PER_PAGE;
  const gridEnd = isPageOne ? GRID_PER_PAGE : currentPage * GRID_PER_PAGE;
  const visibleBlogs = rest.slice(gridStart, gridEnd);
  const totalPages = totalGridPages;

  return (
    <main className="font-dm-sans bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-16 md:py-16 lg:py-20">
        {/* Featured Blog Hero — only on page 1 */}
        {isPageOne && (
          <div className="mb-16 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
            <Link
              href={`/blog/${featured.id}`}
              className="flex flex-col lg:flex-row"
            >
              <div
                className={`relative flex aspect-[16/9] min-h-[280px] w-full items-end justify-start bg-gradient-to-br ${getGradient(0)} lg:aspect-auto lg:w-1/2`}
              >
                <div className="p-4">
                  <CategoryBadge category={featured.category} />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-center gap-4 p-6 md:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(featured.date)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span>{featured.readTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{featured.author}</span>
                  </div>
                </div>
                <h1 className="font-dm-sans text-2xl font-bold leading-tight tracking-tight text-dark-gray md:text-3xl lg:text-4xl">
                  {featured.title}
                </h1>
                <p className="text-base leading-relaxed text-slate-gray md:text-lg">
                  {featured.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium text-[#0EA5E9]">
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog Grid */}
        {visibleBlogs.length > 0 && (
          <div className="mb-8">
            <h2 className="font-dm-sans mb-8 text-xl font-semibold text-dark-gray md:text-2xl">
              {isPageOne ? "Latest Articles" : `Page ${currentPage}`}
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visibleBlogs.map((blog, i) => (
                <BlogCard
                  key={blog.id}
                  blog={blog}
                  index={isPageOne ? i + 1 : i + currentPage * 3}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </main>
  );
}
