'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Megaphone, Calendar, ChevronDown, ChevronUp, Home } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MDXViewer } from '@/components/ui/mdx-viewer'
import { BreadcrumbList } from '@/components/breadcrumb/breadcrumb'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

interface Notice {
  id: string
  title: string
  content: string
  isActive: boolean
  validFrom: string | null
  validTo: string | null
  order: number
  createdAt: string
}

interface NoticesResponse {
  success: boolean
  data: {
    notices: Notice[]
    total: number
  }
}

function NoticesPageContent() {
  const searchParams = useSearchParams()
  const [notices, setNotices] = useState<Notice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedNoticeId, setExpandedNoticeId] = useState<string | null>(null)

  useEffect(() => {
    async function fetchNotices() {
      try {
        const res = await fetch('/api/public/notices', {
          cache: 'no-store',
        })
        if (res.ok) {
          const data: NoticesResponse = await res.json()
          setNotices(data.data.notices)
        }
      } catch (error) {
        console.error('Failed to fetch notices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchNotices()
  }, [])

  // Update expanded notice based on URL query param
  useEffect(() => {
    const noticeId = searchParams.get('notice')
    if (noticeId) {
      setExpandedNoticeId(noticeId)
    }
  }, [searchParams])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const isNoticeValid = (notice: Notice) => {
    const now = new Date()
    if (notice.validFrom && new Date(notice.validFrom) > now) return false
    if (notice.validTo && new Date(notice.validTo) < now) return false
    return true
  }

  const validNotices = notices.filter(isNoticeValid)

  // Check if expanded notice exists in valid notices
  const expandedNoticeExists = expandedNoticeId
    ? validNotices.some(n => n.id === expandedNoticeId)
    : false

  // Scroll to expanded notice after data is loaded
  useEffect(() => {
    if (expandedNoticeId && !isLoading && expandedNoticeExists) {
      // Wait for next tick to ensure DOM is rendered
      const scrollTimer = setTimeout(() => {
        const element = document.getElementById(`notice-${expandedNoticeId}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)

      return () => clearTimeout(scrollTimer)
    }
  }, [expandedNoticeId, isLoading, expandedNoticeExists])

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
              { label: 'Notices' },
            ]}
          />
        </div>

        {/* Hero Section */}
        <div className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl pt-20">
          <div className="relative container mx-auto max-w-7xl px-6 py-16">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-6">
              <span className="block text-white">Notices &</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Announcements
              </span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
              Stay updated with the latest news, updates, and announcements from our team.
            </p>

            {/* Active Notices Badge */}
            <div className="mt-6">
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
                {validNotices.length} Active Notice{validNotices.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          </div>
        </div>

        {/* Notices Content */}
        <main className="container mx-auto max-w-4xl px-6 py-16">
          {isLoading ? (
            <div className="grid gap-6">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-7 w-3/4 bg-white/10" />
                    <Skeleton className="h-5 w-1/2 bg-white/10" />
                    <Skeleton className="h-24 w-full bg-white/10" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : validNotices.length === 0 ? (
            <Card className="bg-neutral-900/40 backdrop-blur-xl border border-white/10">
              <CardContent className="pt-16 pb-16 text-center">
                <Megaphone className="h-16 w-16 text-neutral-500 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-white mb-3">No Active Notices</h3>
                <p className="text-neutral-400">
                  Check back later for new announcements and updates.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {validNotices.map((notice) => {
                const isExpanded = expandedNoticeId === notice.id
                return (
                  <Card
                    key={notice.id}
                    id={`notice-${notice.id}`}
                    className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="p-6 cursor-pointer hover:bg-white/5 transition-colors"
                      onClick={() => {
                        if (isExpanded) {
                          setExpandedNoticeId(null)
                          window.history.replaceState(null, '', '/notices')
                        } else {
                          setExpandedNoticeId(notice.id)
                          window.history.replaceState(null, '', `/notices?notice=${notice.id}`)
                        }
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Megaphone className="h-5 w-5 text-cyan-400 shrink-0" />
                            <h3 className="text-xl font-bold text-white truncate">{notice.title}</h3>
                            <Button variant="ghost" size="icon" className="shrink-0 text-neutral-400 hover:text-white hover:bg-white/5">
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-400">
                            {notice.validFrom && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                                <span>From: {formatDate(notice.validFrom)}</span>
                              </span>
                            )}
                            {notice.validTo && (
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                                <span>To: {formatDate(notice.validTo)}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-300 border-emerald-500/30 shrink-0">
                          Active
                        </Badge>
                      </div>
                    </div>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="border-t border-white/10 p-6 bg-black/20">
                        <div className="prose prose-invert prose-slate max-w-none prose-headings:font-semibold prose-p:text-base prose-p:leading-relaxed prose-a:text-cyan-400 prose-a:underline-offset-4 hover:prose-a:text-cyan-300 prose-strong:text-white prose-code:text-sm prose-code:rounded prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-semibold prose-code:text-cyan-300">
                          <MDXViewer content={notice.content} />
                        </div>
                      </div>
                    )}
                  </Card>
                )
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

// Wrapper with Suspense boundary for useSearchParams
export default function NoticesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    }>
      <NoticesPageContent />
    </Suspense>
  )
}
