import Footer from "@/components/landing-page/footer";
import Navbar from "@/components/landing-page/navbar";
import db from "@/lib/db";
import { ArrowLeft, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type BlogDetailsPageProps = {
  params: {
    blogId: string;
  };
};

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

const richTextClassName =
  "text-base leading-8 text-slate-700 [&_a]:font-medium [&_a]:text-[#437634] [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-[#437634] [&_blockquote]:bg-[#f4f8f2] [&_blockquote]:py-3 [&_blockquote]:pl-4 [&_h1]:mb-4 [&_h1]:mt-6 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:mt-5 [&_h3]:text-xl [&_h3]:font-semibold [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mb-4 [&_strong]:font-semibold [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc";

const BlogDetailsPage = async ({ params }: BlogDetailsPageProps) => {
  const blog = await db.news.findUnique({
    where: {
      id: params.blogId,
    },
  });

  if (!blog) {
    notFound();
  }

  const recentBlogs = await db.news.findMany({
    where: {
      id: {
        not: blog.id,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />
      <main className="lg:px-20 px-3 py-10">
        <Link
          href="/blogs"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#437634] hover:text-[#2f5524]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to blogs
        </Link>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="overflow-hidden border bg-white shadow-sm">
            <div className="relative h-[280px] w-full bg-zinc-100 md:h-[430px]">
              {blog.videoUrl ? (
                <video
                  src={blog.videoUrl}
                  poster={blog.image}
                  controls
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  priority
                  className="object-cover"
                />
              )}
            </div>

            <div className="p-5 md:p-8">
              <div className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-[#437634]">
                <CalendarDays className="h-4 w-4" />
                {formatDate(blog.createdAt)}
              </div>
              <h1 className="mb-6 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">
                {blog.title}
              </h1>
              <div
                className={richTextClassName}
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </article>

          <aside className="h-fit border bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <h2 className="border-l-4 border-[#437634] pl-3 text-lg font-bold text-slate-950">
              Recent Blogs
            </h2>
            <div className="mt-5 space-y-5">
              {recentBlogs.length === 0 ? (
                <p className="text-sm text-slate-600">
                  No other blogs are available yet.
                </p>
              ) : (
                recentBlogs.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blogs/${item.id}`}
                    className="group grid grid-cols-[88px_1fr] gap-3"
                  >
                    <div className="relative h-20 w-[88px] overflow-hidden bg-zinc-100">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-[#437634]">
                        {item.createdAt.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-slate-900 group-hover:text-[#437634]">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogDetailsPage;
