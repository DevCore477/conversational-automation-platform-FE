import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  ExternalLink,
} from "lucide-react";
import { FacebookIcon, LinkedinIcon, XIcon } from "@/assets";
import type { Blog } from "@/types/blog.types";
import CopyLinkButton from "../../components/copy-link-button";

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

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2
          key={i}
          className="font-dm-sans mb-4 mt-10 text-xl font-semibold text-dark-gray md:text-2xl"
        >
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("**") && line.endsWith("**")) {
      return (
        <h3
          key={i}
          className="font-dm-sans mb-3 mt-6 text-lg font-semibold text-dark-gray"
        >
          {line.slice(2, -2)}
        </h3>
      );
    }
    if (line.startsWith("- ") || line.startsWith("* ")) {
      return (
        <li
          key={i}
          className="mb-2 ml-5 list-disc text-base leading-relaxed text-slate-gray"
        >
          {line.slice(2)}
        </li>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className="h-3" />;
    }
    return (
      <p key={i} className="mb-4 text-base leading-relaxed text-slate-gray">
        {line}
      </p>
    );
  });
}

function RelatedBlogCard({ blog, index }: { blog: Blog; index: number }) {
  return (
    <Link
      href={`/blog/${blog.id}`}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div
        className={`flex aspect-[16/10] items-center justify-center bg-gradient-to-br ${getGradient(index)}`}
      >
        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60">
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
          <span className="text-[10px] font-medium tracking-wider text-gray-400 uppercase">
            Read Article
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
          <Calendar className="h-3 w-3" />
          <span>{formatDate(blog.date)}</span>
        </div>
        <h3 className="font-dm-sans text-sm font-medium leading-snug text-dark-gray transition-colors group-hover:text-[#0EA5E9]">
          {blog.title}
        </h3>
        <p className="line-clamp-2 text-xs leading-relaxed text-slate-gray">
          {blog.description}
        </p>
      </div>
    </Link>
  );
}

export default function BlogDetailClient({
  blog,
  relatedBlogs,
}: {
  blog: Blog;
  relatedBlogs: Blog[];
}) {
  const blogUrl = `https://gethexa.ai/blog/${blog.id}`;

  const color =
    categoryColors[blog.category] ?? "bg-[#0EA5E9]/10 text-[#0EA5E9]";

  return (
    <main className="font-dm-sans bg-white">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] max-h-[520px] bg-gradient-to-b from-transparent to-[rgba(153,131,191,0.08)]"
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-30 ${getGradient(Number(blog.id))}`}
          aria-hidden
        />
        <div className="relative w-11/12 md:w-10/12 lg:w-11/12 2xl:w-10/12 mx-auto py-12 md:py-16 lg:py-20 xl:py-24">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-slate-gray transition-colors hover:text-[#0EA5E9]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ${color}`}
              >
                {blog.category}
              </span>
            </div>

            <h1 className="text-3xl font-bold leading-tight tracking-tight text-dark-gray md:text-4xl lg:text-5xl">
              {blog.title}
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-gray md:text-lg">
              {blog.description}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-gray">
              <div className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="w-11/12 max-w-4xl mx-auto py-10 md:py-14 lg:py-16">
        <article className="space-y-1">{renderContent(blog.content)}</article>
      </section>


      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="bg-gray-50/50 py-14 md:py-16 lg:py-20">
          <div className="mx-auto w-11/12 max-w-7xl px-4 md:px-16">
            <h2 className="font-dm-sans mb-8 text-xl font-semibold text-dark-gray md:text-2xl">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((b, i) => (
                <RelatedBlogCard key={b.id} blog={b} index={i + 4} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
