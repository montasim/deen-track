'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MDXViewer } from '@/components/ui/mdx-viewer'
import { BlogCommentsSection } from '@/components/blog/blog-comments-section'
import { BreadcrumbList } from '@/components/breadcrumb/breadcrumb-list'
import { BlogPost, getBlogPostBySlug, incrementBlogPostView, getBlogPosts } from '@/app/dashboard/blog/actions'
import { getProxiedImageUrl } from '@/lib/image-proxy'
import { formatDate } from '@/lib/utils/format-date'
import {
  Calendar,
  Clock,
  User,
  Eye,
  ArrowLeft,
  Share2,
  Home,
  FileText,
  Tag,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogPostPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const postData = await getBlogPostBySlug(slug)
      setPost(postData)

      // Increment view count (non-blocking)
      incrementBlogPostView(slug).catch(console.error)

      // Fetch related posts (same category)
      if (postData.categoryId) {
        const related = await getBlogPosts({
          limit: 3,
          status: 'PUBLISHED',
          categoryId: postData.categoryId,
        })
        setRelatedPosts(related.posts.filter((p) => p.id !== postData.id))
      }
    } catch (error) {
      console.error('Error fetching blog post:', error)
      // Redirect to 404
      router.push('/404')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || post?.title,
          url: window.location.href,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white">
        {/* Breadcrumb */}
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <Skeleton className="h-5 w-48" />
        </div>

        <main className="container mx-auto max-w-4xl px-6 pb-16">
          {/* Post Header */}
          <div className="mb-8">
            <Skeleton className="h-6 w-20 rounded-full mb-4" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-5 w-full mb-6" />
          </div>

          {/* Cover Image */}
          <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />

          {/* Meta */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          {/* Content */}
          <div className="space-y-3 mb-12">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333308_1px,transparent_1px),linear-gradient(to_bottom,#33333308_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Animated Gradient Orbs */}
        <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-violet-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out" style={{ left: '20%', top: '10%' }} />
        <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/25 via-purple-600/20 to-pink-500/25 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out" style={{ right: '15%', bottom: '20%' }} />
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out" style={{ left: '50%', top: '50%' }} />
      </div>

      <div className="relative">
        {/* Breadcrumb */}
        <div className="container mx-auto max-w-7xl px-6 py-4">
          <BreadcrumbList
            items={[
              { label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
              { label: 'Blog', href: '/blog' },
              { label: post.title },
            ]}
          />
        </div>

        {/* Back Button */}
        <div className="container mx-auto max-w-7xl px-6 pt-8 pb-4">
          <Button
            asChild
            variant="ghost"
            className="text-neutral-400 hover:text-white hover:bg-white/5"
          >
            <Link href="/blog" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>

        <main className="container mx-auto max-w-4xl px-6 pb-16">
          {/* Post Header */}
          <article>
            <header className="mb-8">
              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-6">
                {post.category && (
                  <Link href={`/blog?category=${post.category.id}`}>
                    <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30">
                      {post.category.name}
                    </Badge>
                  </Link>
                )}
                {post.featured && (
                  <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-600/20 text-amber-300 border-amber-500/30">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-6 leading-tight">
                {post.title}
              </h1>

              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-neutral-400 mb-8 max-w-3xl leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Cover Image */}
              {post.coverImage && (
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-8 border border-white/10">
                  <Image
                    src={getProxiedImageUrl(post.coverImage) || post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                  />
                </div>
              )}

              {/* Author & Meta */}
              <div className="flex flex-wrap items-center justify-between gap-6 text-neutral-400 mb-6 pb-6 border-b border-white/10">
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    <span>{formatDate(post.publishedAt!)}</span>
                  </div>
                  {post.readTime && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-400" />
                      <span>{post.readTime} min read</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-cyan-400" />
                    <span>{post.viewCount} views</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="border-white/20 text-white hover:bg-white/5"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tagItem) => (
                    <Link key={tagItem.tag.id} href={`/blog?tag=${tagItem.tag.id}`}>
                      <Badge className="bg-neutral-800/50 text-neutral-300 border border-white/10 hover:bg-white/10 hover:border-white/30 hover:text-white transition-all">
                        <Tag className="h-3 w-3 mr-1" />
                        {tagItem.tag.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </header>

            {/* Post Content */}
            <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-24 prose-headings:font-semibold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:underline-offset-4 hover:prose-a:text-cyan-300 prose-strong:text-white prose-code:text-sm prose-code:rounded prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-semibold prose-code:text-cyan-300 prose-pre:bg-neutral-900 prose-pre:text-neutral-50 prose-li:marker:text-neutral-500 prose-img:rounded-xl prose-img:shadow-lg mb-12">
              <MDXViewer content={post.content} />
            </div>

            <div className="h-px w-full bg-white/10 my-12" />

            {/* Author Bio */}
            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    {post.author.avatar ? (
                      <AvatarImage src={getProxiedImageUrl(post.author.avatar) || post.author.avatar} />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                        <User className="h-8 w-8" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">
                      {post.author.name || `${post.author.firstName} ${post.author.lastName || ''}`.trim()}
                    </h3>
                    <p className="text-sm text-cyan-400 mb-2">Author</p>
                    {post.author.bio ? (
                      <p className="text-sm text-neutral-400 whitespace-pre-wrap">{post.author.bio}</p>
                    ) : (
                      <p className="text-sm text-neutral-500 italic">
                        No bio available for this author.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </article>

          {/* Comments Section */}
          {post.allowComments && (
            <div className="mt-12">
              <BlogCommentsSection postId={post.id} postSlug={post.slug} />
            </div>
          )}
        </main>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-white/5 pt-16">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Related Articles
                </h2>
                <p className="text-neutral-400">
                  You might also like these articles
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`} className="group">
                    <Card className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-600/0 to-violet-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-600/10 group-hover:to-violet-500/10 transition-all duration-500" />

                      <CardContent className="relative p-6 flex flex-col h-full">
                        {relatedPost.coverImage && (
                          <div className="relative h-40 w-full rounded-xl overflow-hidden mb-4">
                            <Image
                              src={getProxiedImageUrl(relatedPost.coverImage) || relatedPost.coverImage}
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          {relatedPost.category && (
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                              {relatedPost.category.name}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <Clock className="h-3 w-3" />
                            <span>{relatedPost.readTime} min</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors flex-1">
                          {relatedPost.title}
                        </h3>

                        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
                          {relatedPost.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm mt-auto">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-cyan-500/20 flex items-center justify-center">
                              <User className="h-3 w-3 text-cyan-400" />
                            </div>
                            <span className="text-neutral-500">
                              {relatedPost.author.name || `${relatedPost.author.firstName} ${relatedPost.author.lastName || ''}`.trim()}
                            </span>
                          </div>
                          <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
