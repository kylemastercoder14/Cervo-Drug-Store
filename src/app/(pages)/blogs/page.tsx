import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import db from "@/lib/db";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const BlogsPage = async () => {
  const blogs = await db.news.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />
      <main className="lg:px-20 px-3 py-10">
        <div className="mb-8 flex items-start">
          <div className="h-20 w-2 bg-[#437634]" />
          <div className="ml-3">
            <p className="font-semibold text-sm text-muted-foreground">
              READ OUR
            </p>
            <h1 className="text-4xl font-bold">BLOGS</h1>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {blogs.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden border bg-white shadow-sm"
            >
              <div className="relative h-64 w-full bg-zinc-100">
                {item.videoUrl ? (
                  <video
                    src={item.videoUrl}
                    poster={item.image}
                    controls
                    preload="metadata"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>
              <div className="space-y-3 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-[#437634]">
                  {item.createdAt.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h2 className="text-xl font-bold leading-snug text-slate-950">
                  <Link
                    href={`/blogs/${item.id}`}
                    className="transition-colors hover:text-[#437634]"
                  >
                    {item.title}
                  </Link>
                </h2>
                <div
                  className="line-clamp-3 text-sm text-slate-700 [&_a]:text-[#437634] [&_blockquote]:border-l-4 [&_blockquote]:border-[#437634] [&_blockquote]:pl-3 [&_h1]:text-2xl [&_h2]:text-xl [&_h3]:text-lg [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:mb-3 [&_strong]:font-semibold [&_ul]:ml-5 [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: item.content }}
                />
                <Link
                  href={`/blogs/${item.id}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#437634] hover:text-[#2f5524]"
                >
                  Read full blog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogsPage;
