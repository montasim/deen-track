'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SupportTicket, TicketPriority, TicketStatus } from '@prisma/client'
import {
  LifeBuoy,
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Send,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Sparkles,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ROUTES } from '@/lib/routes/client-routes'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  views: number
  helpfulCount: number
  notHelpfulCount: number
}

interface UserTicket extends SupportTicket {
  responses: {
    id: string
    message: string
    isFromAdmin: boolean
    createdAt: string
    sender: {
      name: string
      email: string
    }
  }[]
}

const FAQ_CATEGORIES = {
  pricing: 'দাম ও প্ল্যান',
  account: 'অ্যাকাউন্ট ও সেটিংস',
  reading: 'পড়াশোনা ও লাইব্রেরি',
  technical: 'টেকনিক্যাল সাপোর্ট',
  general: 'সাধারণ',
} as const

const TICKET_CATEGORIES = {
  technical: 'টেকনিক্যাল সমস্যা',
  billing: 'পেমেন্ট ও বিলিং',
  feature: 'নতুন ফিচার অনুরোধ',
  bug: 'বাগ রিপোর্ট',
  other: 'অন্যান্য',
} as const

const PRIORITY_LABELS: Record<TicketPriority, string> = {
  LOW: 'কম',
  MEDIUM: 'মাঝারি',
  HIGH: 'জরুরি',
  URGENT: 'অত্যন্ত জরুরি',
}

const STATUS_LABELS: Record<TicketStatus, string> = {
  OPEN: 'খোলা আছে',
  IN_PROGRESS: 'চলমান',
  WAITING_FOR_USER: 'আপনার জবাবের অপেক্ষায়',
  RESOLVED: 'সমাধান হয়েছে',
  CLOSED: 'বন্ধ হয়েছে',
}

const STATUS_COLORS: Record<TicketStatus, string> = {
  OPEN: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  IN_PROGRESS: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  WAITING_FOR_USER: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  RESOLVED: 'bg-green-500/10 text-green-500 border-green-500/20',
  CLOSED: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

function HelpCenterPageContent() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'faq'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loadingFaqs, setLoadingFaqs] = useState(true)

  const [tickets, setTickets] = useState<UserTicket[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)

  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    category: 'technical' as keyof typeof TICKET_CATEGORIES,
    priority: 'MEDIUM' as TicketPriority,
  })
  const [submittingTicket, setSubmittingTicket] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    async function fetchFaqs() {
      setLoadingFaqs(true)
      try {
        const response = await fetch('/api/public/faqs')
        if (response.ok) {
          const result = await response.json()
          setFaqs(result.data.faqs || [])
        }
      } catch (error) {
        console.error('Error fetching FAQs:', error)
      } finally {
        setLoadingFaqs(false)
      }
    }
    fetchFaqs()
  }, [])

  useEffect(() => {
    if (!user) return
    async function fetchTickets() {
      setLoadingTickets(true)
      try {
        const response = await fetch('/api/user/support-tickets')
        if (response.ok) {
          const result = await response.json()
          setTickets(result.data.tickets || [])
        }
      } catch (error) {
        console.error('Error fetching tickets:', error)
      } finally {
        setLoadingTickets(false)
      }
    }
    fetchTickets()
  }, [user])

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const groupedFaqs = filteredFaqs.reduce(
    (acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = []
      acc[faq.category].push(faq)
      return acc
    },
    {} as Record<string, FAQ[]>
  )

  const handleFaqFeedback = async (faqId: string, helpful: boolean) => {
    try {
      const response = await fetch(`/api/public/faqs/${faqId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ helpful }),
      })
      if (response.ok) {
        setFaqs((prev) =>
          prev.map((faq) =>
            faq.id === faqId
              ? {
                ...faq,
                helpfulCount: helpful ? faq.helpfulCount + 1 : faq.helpfulCount,
                notHelpfulCount: helpful ? faq.notHelpfulCount : faq.notHelpfulCount + 1,
              }
              : faq
          )
        )
        toast({
          title: 'ধন্যবাদ! 🙏',
          description: helpful ? 'ভালো লাগলে জেনেছি!' : 'আমরা উত্তরটা আরও ভালো করার চেষ্টা করবো।',
        })
      }
    } catch (error) {
      console.error('Error submitting feedback:', error)
    }
  }

  const handleSubmitTicket = async () => {
    if (!newTicket.subject.trim() || !newTicket.description.trim()) {
      toast({
        title: 'সমস্যা হয়েছে',
        description: 'সব ঘর পূরণ করুন।',
        variant: 'destructive',
      })
      return
    }

    setSubmittingTicket(true)
    try {
      const response = await fetch('/api/user/support-tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTicket),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: 'টিকেট তৈরি হয়েছে! ✅',
          description: "আপনার সাপোর্ট টিকেট জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করবো।",
        })
        setNewTicket({ subject: '', description: '', category: 'technical', priority: 'MEDIUM' })
        router.push(`${ROUTES.helpCenter.href}?tab=tickets`)
        const ticketsResponse = await fetch('/api/user/support-tickets')
        if (ticketsResponse.ok) {
          const ticketsResult = await ticketsResponse.json()
          setTickets(ticketsResult.data.tickets || [])
        }
      } else {
        toast({
          title: 'সমস্যা হয়েছে',
          description: result.message || 'টিকেট তৈরি করতে সমস্যা হয়েছে।',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন।',
        variant: 'destructive',
      })
    } finally {
      setSubmittingTicket(false)
    }
  }

  const renderSignInRequired = () => (
    <div className="p-12 rounded-2xl bg-white/80 backdrop-blur-sm border border-slate-200/50 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-50 to-violet-50 shadow-lg">
        <LifeBuoy className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">লগইন করতে হবে</h3>
      <p className="text-slate-600 mb-6">এই ফিচার ব্যবহার করতে আগে লগইন করুন।</p>
      <Button asChild className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700">
        <a href={ROUTES.signIn.href}>লগইন করুন</a>
      </Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Animated Background - matches root page exactly */}
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
        <section className="relative pt-20">
          <div className="container mx-auto max-w-7xl px-6 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-8 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <LifeBuoy className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300">সাহায্য কেন্দ্র</span>
              </div>

              <h1 className={`text-5xl font-bold tracking-tight mb-8 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="text-white">আমরা কিভাবে</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">সাহায্য করতে পারি?</span>
              </h1>

              <p className={`text-lg text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {user ? 'উত্তর খুঁজুন বা আমাদের টিম থেকে ব্যক্তিগত সাহায্য নিন!' : 'FAQ দেখুন বা লগইন করে ব্যক্তিগত সাহায্য নিন!'}
              </p>
            </div>
          </div>
        </section>

        {/* Content Section - NO white overlay */}
        <section className="relative pb-24">
          <div className="container mx-auto max-w-7xl px-6">
            <div className="max-w-6xl mx-auto">
              <Tabs value={activeTab} className="space-y-6" onValueChange={(value) => router.push(`${ROUTES.helpCenter.href}?tab=${value}`)}>
                <div className="flex flex-col md:flex-row md:justify-between gap-4 items-stretch">
                  <TabsList className="bg-neutral-900/40 backdrop-blur-xl border border-white/10 p-1">
                    <Link href={`${ROUTES.helpCenter.href}?tab=faq`}>
                      <TabsTrigger value="faq" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white">❓ সাধারণ প্রশ্ন</TabsTrigger>
                    </Link>
                    <Link href={`${ROUTES.helpCenter.href}?tab=tickets`}>
                      <TabsTrigger value="tickets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white">
                        আমার টিকেট
                        {tickets.some((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_USER') && (
                          <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                            {tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS' || t.status === 'WAITING_FOR_USER').length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    </Link>
                    {user && (
                      <Link href={`${ROUTES.helpCenter.href}?tab=new`}>
                        <TabsTrigger value="new" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-violet-600 data-[state=active]:text-white">➕ নতুন টিকেট</TabsTrigger>
                      </Link>
                    )}
                  </TabsList>

                  <div className="flex items-center gap-2">
                    {user && activeTab !== 'new' && (
                      <Button onClick={() => router.push(`${ROUTES.helpCenter.href}?tab=new`)} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25">
                        <Plus className="h-4 w-4 mr-2" />টিকেট তৈরি করুন
                      </Button>
                    )}
                    {activeTab === 'faq' && (
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input placeholder="FAQ খুঁজুন..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-64 border-white/10 bg-neutral-900/60 backdrop-blur-xl" />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-48 border-white/10 bg-neutral-900/60 backdrop-blur-xl">
                            <SelectValue placeholder="বিষয়" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">সব বিষয়</SelectItem>
                            {Object.entries(FAQ_CATEGORIES).map(([key, label]) => (
                              <SelectItem key={key} value={key}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  {activeTab === 'faq' && (
                    <div className="space-y-6">
                      {loadingFaqs ? (
                        <div className="p-12 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 text-center">
                          <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
                          <p className="text-slate-600">Loading FAQs...</p>
                        </div>
                      ) : filteredFaqs.length === 0 ? (
                        <div className="p-12 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 border border-white/10 shadow-lg">
                            <Search className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2">কোনো FAQ পাওয়া যায়নি</h3>
                          <p className="text-neutral-400">অন্য কিওয়ার্ড দিয়ে চেষ্টা করুন!</p>
                        </div>
                      ) : (
                        Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
                          <div key={category} className="p-6 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300">
                            <h3 className="text-2xl font-bold text-white mb-4">{FAQ_CATEGORIES[category as keyof typeof FAQ_CATEGORIES] || category}</h3>
                            <div className="space-y-2">
                              {categoryFaqs.map((faq) => (
                                <div key={faq.id} className="border border-white/10 rounded-xl overflow-hidden">
                                  <button onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)} className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-800/50 transition-colors">
                                    <span className="font-medium text-white flex-1 pr-4">{faq.question}</span>
                                    {expandedFaq === faq.id ? <ChevronDown className="h-5 w-5 text-neutral-400 flex-shrink-0" /> : <ChevronRight className="h-5 w-5 text-neutral-400 flex-shrink-0" />}
                                  </button>
                                  {expandedFaq === faq.id && (
                                    <div className="p-4 pt-0 border-t border-white/10">
                                      <p className="text-neutral-400 mb-4 leading-relaxed">{faq.answer}</p>
                                      <div className="flex items-center gap-4 text-sm">
                                        <span className="text-neutral-500">কি ভালো লাগলো?</span>
                                        <Button variant="ghost" size="sm" onClick={() => handleFaqFeedback(faq.id, true)} className="h-8 hover:text-emerald-600 hover:bg-emerald-50">
                                          <CheckCircle2 className="h-4 w-4 mr-1" />হ্যাঁ ({faq.helpfulCount})
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleFaqFeedback(faq.id, false)} className="h-8 hover:text-red-600 hover:bg-red-50">
                                          <XCircle className="h-4 w-4 mr-1" />না ({faq.notHelpfulCount})
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'tickets' && (
                    <div className="space-y-6">
                      {!user ? (
                        renderSignInRequired()
                      ) : loadingTickets ? (
                        <div className="p-12 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 text-center">
                          <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
                          <p className="text-slate-600">Loading tickets...</p>
                        </div>
                      ) : tickets.length === 0 ? (
                        <div className="p-12 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 text-center">
                          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 border border-white/10 shadow-lg">
                            <MessageSquare className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900 mb-2">কোনো টিকেট নেই</h3>
                          <p className="text-slate-600 mb-6">আপনি এখনো কোনো টিকেট খোলেননি।</p>
                          <Button onClick={() => router.push(`${ROUTES.helpCenter.href}?tab=new`)} className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white shadow-lg shadow-blue-500/25">
                            <Plus className="h-4 w-4 mr-2" />প্রথম টিকেট খুলুন
                          </Button>
                        </div>
                      ) : (
                        tickets.map((ticket) => (
                          <div key={ticket.id} className="p-6 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">{ticket.subject}</h3>
                                <p className="text-neutral-400">{ticket.description}</p>
                              </div>
                              <Badge className={STATUS_COLORS[ticket.status]}>{STATUS_LABELS[ticket.status]}</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                              <span className="px-2 py-1 rounded-md bg-neutral-800 border border-white/10">{TICKET_CATEGORIES[ticket.category as keyof typeof TICKET_CATEGORIES]}</span>
                              <span>•</span>
                              <span>{PRIORITY_LABELS[ticket.priority]} জরুরিতা</span>
                              <span>•</span>
                              <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                            </div>
                            {ticket.responses.length > 0 && (
                              <div className="space-y-3">
                                {ticket.responses.map((response) => (
                                  <div key={response.id} className={`flex gap-3 p-3 rounded-xl ${response.isFromAdmin ? 'bg-cyan-500/10' : 'bg-neutral-800/50'}`}>
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${response.isFromAdmin ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white' : 'bg-neutral-700 text-neutral-300'}`}>
                                      {response.isFromAdmin ? <AlertCircle className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-sm text-white">{response.isFromAdmin ? 'Support Team' : 'You'}</span>
                                        <span className="text-xs text-neutral-500">{new Date(response.createdAt).toLocaleString()}</span>
                                      </div>
                                      <p className="text-sm text-neutral-300">{response.message}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'new' && (!user ? renderSignInRequired() : (
                    <div className="p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">সাপোর্ট টিকেট খুলুন</h2>
                          <p className="text-neutral-400">ফর্মটি পূরণ করুন, আমরা শীঘ্রই উত্তর দেব</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">বিষয়</label>
                            <Select value={newTicket.category} onValueChange={(value) => setNewTicket({ ...newTicket, category: value as keyof typeof TICKET_CATEGORIES })}>
                              <SelectTrigger className="border-white/10 bg-neutral-900/60"><SelectValue /></SelectTrigger>
                              <SelectContent>{Object.entries(TICKET_CATEGORIES).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-neutral-300">জরুরিতা</label>
                            <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value as TicketPriority })}>
                              <SelectTrigger className="border-white/10 bg-neutral-900/60"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value={TicketPriority.LOW}>{PRIORITY_LABELS[TicketPriority.LOW]}</SelectItem>
                                <SelectItem value={TicketPriority.MEDIUM}>{PRIORITY_LABELS[TicketPriority.MEDIUM]}</SelectItem>
                                <SelectItem value={TicketPriority.HIGH}>{PRIORITY_LABELS[TicketPriority.HIGH]}</SelectItem>
                                <SelectItem value={TicketPriority.URGENT}>{PRIORITY_LABELS[TicketPriority.URGENT]}</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-neutral-300">বিষয় *</label>
                          <Input placeholder="সংক্ষেপে বলুন সমস্যা কি..." value={newTicket.subject} onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })} className="border-white/10 bg-neutral-900/60" />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-neutral-300">বিস্তারিত *</label>
                          <Textarea placeholder="সমস্যা সম্পর্কে বিস্তারিত লিখুন..." rows={6} value={newTicket.description} onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })} className="border-white/10 bg-neutral-900/60" />
                        </div>

                        <Button onClick={handleSubmitTicket} disabled={submittingTicket} className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25">
                          {submittingTicket ? (<><Clock className="h-4 w-4 mr-2 animate-spin" />জমা হচ্ছে...</>) : (<><Send className="h-4 w-4 mr-2" />📨 টিকেট পাঠান</>)}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Tabs>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function HelpCenterPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <HelpCenterPageContent />
    </Suspense>
  )
}

export default HelpCenterPage
