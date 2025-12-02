import { Container } from "@/components/ui/container";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlogPost(slug: string) {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        isPublished: true
      },
    });
    return post;
  } catch (error) {
    console.error("Blog yazısı alınamadı:", error);
    return null;
  }
}

async function getRelatedPosts(currentSlug: string, category: string) {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        category,
        slug: { not: currentSlug },
      },
      take: 3,
      orderBy: { publishedAt: "desc" },
    });
    return posts;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Yazı Bulunamadı" };
  }

  return {
    title: `${post.title} | En Ucuz Hac Umre Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category);

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 w-full">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <Container className="relative h-full flex items-end pb-8">
          <div className="text-white max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-[#059669] text-white text-xs font-bold rounded-full">
                {post.category}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-bold mb-3">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-200">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {post.author}
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-[#059669] font-medium mb-6 hover:gap-3 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Tüm Yazılar
            </Link>

            <article className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
              {/* Excerpt */}
              <p className="text-lg text-gray-600 mb-6 pb-6 border-b border-gray-100 italic">
                {post.excerpt}
              </p>

              {/* Content */}
              <div
                className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-[#059669] prose-strong:text-primary"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/\n/g, '<br>')
                    .replace(/^/, '<p>')
                    .replace(/$/, '</p>')
                    .replace(/## (.*?)(<br>|<\/p>)/g, '</p><h2>$1</h2><p>')
                    .replace(/### (.*?)(<br>|<\/p>)/g, '</p><h3>$1</h3><p>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/- (.*?)(<br>|<\/p>)/g, '<li>$1</li>')
                }}
              />
            </article>

            {/* Share Buttons */}
            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-sm font-medium text-gray-600 mb-3">Bu yazıyı paylaş:</p>
              <div className="flex gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://enucuzhacumre.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1DA1F2] text-white text-sm rounded-lg hover:bg-[#1a8cd8] transition-colors"
                >
                  Twitter
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://enucuzhacumre.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#4267B2] text-white text-sm rounded-lg hover:bg-[#365899] transition-colors"
                >
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - https://enucuzhacumre.com/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#25D366] text-white text-sm rounded-lg hover:bg-[#20bd5a] transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  İlgili Yazılar
                </h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={relatedPost.image}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-primary line-clamp-2 group-hover:text-[#059669] transition-colors">
                            {relatedPost.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {relatedPost.publishedAt
                              ? new Date(relatedPost.publishedAt).toLocaleDateString("tr-TR", {
                                  day: "numeric",
                                  month: "short",
                                })
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 bg-gradient-to-br from-[#059669] to-[#047857] rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Umre Turları</h3>
              <p className="text-sm text-white/90 mb-4">
                En uygun fiyatlı umre turlarını inceleyin ve yerinizi hemen ayırtın.
              </p>
              <Link
                href="/umre-turlari"
                className="inline-block w-full text-center px-4 py-2 bg-white text-[#059669] font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Turları İncele
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
