import { Container } from "@/components/ui/container";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE_DESC = "Hac ve Umre ile ilgili faydalı bilgiler";

async function getPageData() {
  try {
    const [posts, settings] = await Promise.all([
      prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: "desc" },
      }),
      prisma.siteSettings.findUnique({
        where: { id: "site_settings" },
      }),
    ]);
    return { posts, settings };
  } catch (error) {
    console.error("Blog yazıları alınamadı:", error);
    return { posts: [], settings: null };
  }
}

export default async function BlogPage() {
  const { posts, settings } = await getPageData();
  const pageDesc = settings?.pageDescBlog || DEFAULT_PAGE_DESC;

  return (
    <main className="min-h-screen bg-gray-50/50">
      <Container className="pt-4 pb-8 md:pt-6 md:pb-12">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-primary mb-1">
            Blog
          </h1>
          <p className="text-sm text-gray-600">
            {posts.length > 0
              ? `${posts.length} yazı listeleniyor`
              : pageDesc}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#059669] text-white text-xs font-bold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {post.publishedAt
                        ? new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "-"}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      {post.author}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-primary mb-3 line-clamp-2 group-hover:text-[#059669] transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-[#059669] font-semibold text-sm hover:gap-3 transition-all"
                  >
                    Devamını Oku
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
            <p className="text-gray-500">
              Henüz blog yazısı bulunmuyor.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
