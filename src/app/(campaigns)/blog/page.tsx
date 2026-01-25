'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  FileText,
  Calendar,
  Clock,
  User,
  Eye,
  Star,
  Search,
  ArrowRight,
  Tag,
  FolderTree,
  PenSquare,
  TrendingUp,
  Sparkles,
} from 'lucide-react'
import { BlogPost, getBlogPosts, getBlogCategories, getBlogTags } from '@/app/dashboard/blog/actions'
import { getProxiedImageUrl } from '@/lib/image-proxy'
import { formatDate } from '@/lib/utils/format-date'
import { useAuth } from '@/context/auth-context'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function BlogPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [limit] = useState(9)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedTag, setSelectedTag] = useState<string>('')

  useEffect(() => {
    fetchPosts()
    fetchFeaturedPosts()
    fetchCategories()
    fetchTags()
  }, [page, selectedCategory, selectedTag])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const result = await getBlogPosts({
        page,
        limit,
        status: 'PUBLISHED',
        categoryId: selectedCategory || undefined,
        tagId: selectedTag || undefined,
        search: search || undefined,
      })
      setPosts(result.posts)
      setTotal(result.total)
    } catch (error) {
      console.error('Error fetching blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedPosts = async () => {
    try {
      const result = await getBlogPosts({
        limit: 3,
        status: 'PUBLISHED',
        featured: true,
      })
      setFeaturedPosts(result.posts)
    } catch (error) {
      console.error('Error fetching featured posts:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getBlogCategories()
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchTags = async () => {
    try {
      const data = await getBlogTags()
      setTags(data)
    } catch (error) {
      console.error('Error fetching tags:', error)
    }
  }

  const handleSearch = () => {
    setPage(1)
    fetchPosts()
  }

  const totalPages = Math.ceil(total / limit)

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
        {/* Hero Section */}
        <section className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl pt-20">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2" />
          </div>

          <div className="relative container mx-auto max-w-7xl px-6 py-16">
            <div className="text-center max-w-3xl mx-auto">
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
                <FileText className="w-3 h-3 mr-2" />
                Insights & Updates
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-6">
                <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                  Latest from Our
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Blog
                </span>
              </h1>

              <p className="text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                Discover articles, tutorials, and insights about gamification, campaigns, and community achievements.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="relative py-16 border-t border-white/5">
            <div className="container mx-auto max-w-7xl px-6">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <h2 className="text-3xl sm:text-4xl font-bold text-white">Featured Stories</h2>
                </div>
                <p className="text-neutral-400">Handpicked articles from our community</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {featuredPosts.map((post) => (
                  <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                    <Card className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden h-full">
                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-orange-600/0 to-yellow-500/0 group-hover:from-amber-500/10 group-hover:via-orange-600/10 group-hover:to-yellow-500/10 transition-all duration-500" />

                      <CardContent className="relative p-6 flex flex-col h-full">
                        <div className="relative h-40 overflow-hidden rounded-xl mb-4 bg-neutral-800">
                          {post.coverImage ? (
                            <Image
                              src={getProxiedImageUrl(post.coverImage) || post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                              <FileText className="h-12 w-12 text-cyan-400" />
                            </div>
                          )}
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-amber-500 text-white border-0 shadow-lg shadow-amber-500/25">
                              <Star className="h-3 w-3 mr-1 fill-current" />
                              Featured
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          {post.category && (
                            <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                              {post.category.name}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-xs text-neutral-500">
                            <Clock className="h-3 w-3" />
                            <span>{post.readTime} min</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors flex-1">
                          {post.title}
                        </h3>

                        <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded-full bg-cyan-500/20 flex items-center justify-center">
                              <User className="h-3 w-3 text-cyan-400" />
                            </div>
                            <span className="text-neutral-400">
                              {post.author.name || `${post.author.firstName} ${post.author.lastName || ''}`.trim()}
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
          </section>
        )}

        {/* Main Content Section */}
        <section className="relative py-16 border-t border-white/5">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {selectedCategory || selectedTag ? 'Filtered Results' : 'All Articles'}
                    </h2>
                    <p className="text-neutral-400">
                      {total} {total === 1 ? 'article' : 'articles'} found
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {user && !selectedCategory && !selectedTag && (
                      <Button
                        onClick={() => router.push('/dashboard/blog/new')}
                        size="sm"
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25"
                      >
                        <PenSquare className="h-4 w-4 mr-2" />
                        Write Article
                      </Button>
                    )}
                    {(selectedCategory || selectedTag) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedCategory('')
                          setSelectedTag('')
                          setPage(1)
                        }}
                        className="text-neutral-400 hover:text-white hover:bg-white/5"
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </div>

                {/* Posts Grid */}
                {loading ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="bg-neutral-900/40 border border-white/10 h-full">
                        <div className="h-48 animate-pulse bg-neutral-800" />
                        <div className="p-6 space-y-3">
                          <div className="h-4 w-24 bg-neutral-800 rounded animate-pulse" />
                          <div className="h-4 w-full bg-neutral-800 rounded animate-pulse" />
                          <div className="h-4 w-2/3 bg-neutral-800 rounded animate-pulse" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="inline-flex p-6 rounded-full bg-neutral-900/60 border border-white/10 mb-6">
                      <FileText className="w-12 h-12 text-neutral-700" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No articles found</h3>
                    <p className="text-neutral-400 mb-8">
                      Try adjusting your filters or check back later
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                      {posts.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                          <Card className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden h-full">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-600/0 to-violet-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-600/10 group-hover:to-violet-500/10 transition-all duration-500" />

                            <CardContent className="relative p-6 flex flex-col h-full">
                              <div className="relative h-48 overflow-hidden rounded-xl mb-4 bg-neutral-800">
                                {post.coverImage ? (
                                  <Image
                                    src={getProxiedImageUrl(post.coverImage) || post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                                    <FileText className="h-12 w-12 text-cyan-400" />
                                  </div>
                                )}
                                {post.featured && (
                                  <div className="absolute top-2 left-2">
                                    <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                                      <Star className="h-3 w-3 mr-1 fill-current" />
                                    Featured
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-2 mb-3 flex-wrap">
                                {post.category && (
                                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                                    {post.category.name}
                                  </Badge>
                                )}
                                <div className="flex items-center gap-1 text-xs text-neutral-500">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(post.publishedAt!)}</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-neutral-500">
                                  <Clock className="h-3 w-3" />
                                  <span>{post.readTime} min</span>
                                </div>
                              </div>

                              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors flex-1">
                                {post.title}
                              </h3>

                              <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
                                {post.excerpt}
                              </p>

                              {post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {post.tags.slice(0, 3).map((tagItem) => (
                                    <Badge key={tagItem.tag.id} variant="outline" className="text-xs border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10">
                                      <Tag className="h-2 w-2 mr-1" />
                                      {tagItem.tag.name}
                                    </Badge>
                                  ))}
                                </div>
                              )}

                              <div className="flex items-center justify-between pt-4 border-t border-white/10 text-sm mt-auto">
                                <div className="flex items-center gap-2">
                                  <div className="h-7 w-7 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                    <User className="h-3 w-3 text-cyan-400" />
                                  </div>
                                  <span className="text-neutral-400">
                                    {post.author.name || `${post.author.firstName} ${post.author.lastName || ''}`.trim()}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-neutral-400">
                                  <Eye className="h-3 w-3" />
                                  <span>{post.viewCount}</span>
                                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform text-cyan-400" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage(p => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                        >
                          <ArrowRight className="h-4 w-4 rotate-180" />
                        </Button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(p => p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1))
                            .map((pageNum, idx, arr) => {
                              const prevPage = arr[idx - 1]
                              const showDots = prevPage && pageNum - prevPage > 1

                              return (
                                <div key={pageNum} className="flex items-center">
                                  {showDots && <span className="px-2 text-neutral-600">...</span>}
                                  <Button
                                    variant={page === pageNum ? 'default' : 'outline'}
                                    size={page === pageNum ? 'default' : 'icon'}
                                    onClick={() => setPage(pageNum)}
                                    className={cn(
                                      page === pageNum
                                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25'
                                        : 'border-white/20 text-white hover:bg-white/5 hover:border-white/30',
                                      page === pageNum && 'min-w-[40px]'
                                    )}
                                  >
                                    {pageNum}
                                  </Button>
                                </div>
                              )
                            })}
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setPage(p => p + 1)}
                          disabled={page >= totalPages}
                          className="border-white/20 text-white hover:bg-white/5 hover:border-white/30"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Search Card */}
                <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Search className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-semibold text-white">Search Articles</h3>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Find articles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full px-4 py-2 rounded-lg bg-neutral-900/60 border border-white/10 text-white placeholder:text-neutral-500 focus:border-cyan-500/50 focus:ring-cyan-500/20 focus:outline-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Categories */}
                <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <FolderTree className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-semibold text-white">Categories</h3>
                    </div>
                    <div className="space-y-2">
                      <button
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                          !selectedCategory ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                        onClick={() => {
                          setSelectedCategory('')
                          setPage(1)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span>All Posts</span>
                          <Badge className={selectedCategory === '' ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-400'} className="text-xs">
                            {total}
                          </Badge>
                        </div>
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                              : 'hover:bg-neutral-800 text-neutral-400 hover:text-white'
                          }`}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setPage(1)
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span>{category.name}</span>
                            <Badge
                              className={selectedCategory === category.id ? 'bg-white/20 text-white' : 'bg-neutral-800 text-neutral-400'}
                              className="text-xs"
                            >
                              {category._count?.posts || 0}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag className="h-5 w-5 text-cyan-400" />
                      <h3 className="font-semibold text-white">Popular Tags</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags
                        .filter((t) => t._count?.posts && t._count.posts > 0)
                        .slice(0, 12)
                        .map((tag) => (
                          <Badge
                            key={tag.id}
                            variant={selectedTag === tag.id ? 'default' : 'outline'}
                            className={cn(
                              'cursor-pointer transition-all',
                              selectedTag === tag.id
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                                : 'border-white/20 text-neutral-400 hover:bg-white/5 hover:border-white/30'
                            )}
                            onClick={() => {
                              setSelectedTag(selectedTag === tag.id ? '' : tag.id)
                              setPage(1)
                            }}
                          >
                            {tag.name}
                            <span className="ml-1 text-xs opacity-70">({tag._count?.posts || 0})</span>
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Featured Post Sidebar */}
                {featuredPosts.length > 0 && (
                  <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-xl border border-amber-500/20">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                        <h3 className="font-semibold text-white">Editor's Pick</h3>
                      </div>
                      <Link href={`/blog/${featuredPosts[0].slug}`} className="group block">
                        {featuredPosts[0].coverImage && (
                          <div className="relative h-32 w-full rounded-lg overflow-hidden mb-3">
                            <Image
                              src={getProxiedImageUrl(featuredPosts[0].coverImage) || featuredPosts[0].coverImage}
                              alt={featuredPosts[0].title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              unoptimized
                            />
                          </div>
                        )}
                        <h4 className="font-semibold mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors text-white">
                          {featuredPosts[0].title}
                        </h4>
                        <p className="text-sm text-neutral-400 line-clamp-2">
                          {featuredPosts[0].excerpt}
                        </p>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
