'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Trophy,
  Target,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Crown,
  Shield,
  BarChart3,
  Gamepad2,
  Award,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CampaignsTopbar } from '@/components/layout/campaigns-topbar'

// Sample featured campaigns data
const featuredCampaigns = [
  {
    id: '1',
    name: 'ফিটনেস চ্যালেঞ্জ ২০২৪',
    description: 'প্রতিদিনের ওয়ার্কআউট চ্যালেঞ্জ সম্পন্ন করুন আর জিতে নিন আকর্ষণীয় পুরষ্কার',
    difficulty: 'মাঝারি',
    participants: 1247,
    color: 'from-orange-500 to-red-600',
    icon: Flame,
    points: 500,
    duration: '৩০ দিন',
  },
  {
    id: '2',
    name: 'লার্নিং স্প্রিন্ট',
    description: 'নির্দিষ্ট লার্নিং পাথের মাধ্যমে নতুন দক্ষতা অর্জন করুন',
    difficulty: 'শিক্ষানবিশ',
    participants: 892,
    color: 'from-blue-500 to-cyan-600',
    icon: Sparkles,
    points: 350,
    duration: '২১ দিন',
  },
  {
    id: '3',
    name: 'প্রোডাক্টিভিটি মাস্টার',
    description: 'ভালো অভ্যাস গড়ে তুলুন এবং প্রতিদিনের কাজের গতি বাড়ান',
    difficulty: 'উন্নত',
    participants: 654,
    color: 'from-purple-500 to-violet-600',
    icon: Trophy,
    points: 750,
    duration: '৪৫ দিন',
  },
]

const steps = [
  {
    icon: Target,
    title: 'ক্যাম্পেইন খুঁজুন',
    description: 'আপনার আগ্রহ ও দক্ষতার সাথে মানানসই চ্যালেঞ্জগুলো বেছে নিন',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Gamepad2,
    title: 'টাস্ক সম্পন্ন করুন',
    description: 'আপনার সফলতার প্রমাণ জমা দিন এবং অগ্রগতির হিসাব রাখুন',
    color: 'from-violet-400 to-purple-500',
  },
  {
    icon: Crown,
    title: 'পুরষ্কার জিতুন',
    description: 'অ্যাচিভমেন্ট আনলক করুন, লিডারবোর্ডে এগিয়ে যান এবং পয়েন্ট অর্জন করুন',
    color: 'from-amber-400 to-orange-500',
  },
]

const features = [
  {
    icon: BarChart3,
    title: 'রিয়েল-টাইম লিডারবোর্ড',
    description: 'অন্যদের সাথে প্রতিযোগিতা করুন এবং আপনার র‍্যাঙ্কিং লাইভ আপডেট দেখুন',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'দলগত প্রতিযোগিতা',
    description: 'দল গঠন করুন এবং লক্ষ্য অর্জনে একে অপরকে সহযোগিতা করুন',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: Award,
    title: 'অ্যাচিভমেন্ট ব্যাজ',
    description: 'চ্যালেঞ্জ সম্পন্ন করে অনন্য সব ব্যাজ সংগ্রহ করুন',
    gradient: 'from-amber-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'যাচাইকৃত অগ্রগতি',
    description: 'স্বচ্ছতা নিশ্চিত করতে প্রতিটি টাস্ক অ্যাডমিন দ্বারা যাচাই করা হয়',
    gradient: 'from-emerald-500 to-teal-600',
  },
]

const stats = [
  { value: '১০হাজার+', label: 'সক্রিয় ব্যবহারকারী' },
  { value: '৫০০+', label: 'ক্যাম্পেইন' },
  { value: '১মিলিয়ন+', label: 'টাস্ক সম্পন্ন হয়েছে' },
  { value: '৫০মিলিয়ন+', label: 'পয়েন্ট অর্জিত হয়েছে' },
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [siteName, setSiteName] = useState('CampaignHub')

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)

    // Fetch site settings
    fetch('/api/public/site/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data.siteName) {
          setSiteName(data.data.siteName)
        }
      })
      .catch(console.error)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333308_1px,transparent_1px),linear-gradient(to_bottom,#33333308_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Animated Gradient Orbs */}
        <div
          className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-violet-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
          style={{
            left: '20%',
            top: '10%',
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
          }}
        />
        <div
          className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/25 via-purple-600/20 to-pink-500/25 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
          style={{
            right: '15%',
            bottom: '20%',
            transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.12}px)`,
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${-scrollY * 0.05}px, ${-scrollY * 0.05}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <CampaignsTopbar siteName={siteName} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-12">
        <div className="container mx-auto max-w-7xl px-6 pt-12 pb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div
                className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/5 backdrop-blur-sm transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
                  }`}
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-300 tracking-wide">
                  নেক আমলের ধারাবাহিকতা বজায় রাখুন
                </span>
              </div>

              <h1
                className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.15] transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                <span className="block text-white">নিয়মিত আমলই</span>
                <span className="block text-white">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                    আল্লাহর
                  </span>{' '}
                  কাছে
                </span>
                <span className="block text-white mt-2">সবচেয়ে প্রিয়</span>
              </h1>

              <p
                className={`text-xl text-neutral-400 max-w-xl leading-relaxed transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                রাসূলুল্লাহ (সা.) বলেছেন, "আল্লাহর কাছে সবচেয়ে প্রিয় আমল তা-ই যা নিয়মিত করা হয়, যদিও তা অল্প হয়।" (সহীহ বুখারী)। আপনার প্রতিদিনের নেক কাজগুলোকে একটি স্থায়ী অভ্যাসে রূপ দিন।
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-base px-8 py-6 h-auto font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  <Link href="/campaigns" className="gap-2">
                    আমল শুরু করুন
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 text-base px-8 py-6 h-auto backdrop-blur-sm"
                >
                  <Link href="/sign-up">অ্যাকাউন্ট তৈরি করুন</Link>
                </Button>
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-4 gap-6 pt-8 border-t border-white/10 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
              >
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl font-black bg-gradient-to-br from-white to-neutral-400 bg-clip-text text-transparent">
                      {stat.value}
                    </div>
                    <div className="text-xs font-medium text-neutral-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Animated Cards */}
            <div
              className={`relative transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
            >
              <div className="relative">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-violet-500/20 rounded-3xl blur-3xl" />

                {/* Floating Cards */}
                <div className="relative space-y-4">
                  {featuredCampaigns.slice(0, 2).map((campaign, index) => {
                    const Icon = campaign.icon
                    return (
                      <div
                        key={index}
                        className="group relative p-6 rounded-2xl bg-neutral-900/60 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                        style={{
                          animation: `float 6s ease-in-out infinite`,
                          animationDelay: `${index * 0.5}s`,
                        }}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${campaign.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />

                        <div className="relative">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${campaign.color} flex-shrink-0 shadow-lg`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-bold text-white mb-1">{campaign.name}</h3>
                              <p className="text-sm text-neutral-400 line-clamp-2">{campaign.description}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <Badge className={`bg-gradient-to-r ${campaign.color} text-white border-0`}>
                                  {campaign.difficulty}
                                </Badge>
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {campaign.participants.toLocaleString('bn-BD')}
                                </span>
                                <span className="text-xs text-neutral-500 flex items-center gap-1">
                                  <Star className="w-3 h-3 text-amber-400" />
                                  {campaign.points} পয়েন্ট
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="relative py-32 border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
              সেরা ক্যাম্পেইন
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              আমল চ্যালেঞ্জসমূহ
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              হাজার হাজার ব্যবহারকারীর সাথে শুরু করুন নিয়মিত নেক আমলের ছোট ছোট পদক্ষেপ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredCampaigns.map((campaign, index) => {
              const Icon = campaign.icon
              return (
                <Card
                  key={index}
                  className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${campaign.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                  <CardContent className="relative p-6">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${campaign.color} mb-6 shadow-lg group-hover:shadow-xl group-hover:shadow-${campaign.color.split('-')[1]}-500/30 transition-all`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2">{campaign.name}</h3>
                    <p className="text-neutral-400 mb-6">{campaign.description}</p>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={`bg-gradient-to-r ${campaign.color} text-white border-0`}>
                          {campaign.difficulty}
                        </Badge>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {campaign.participants.toLocaleString('bn-BD')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 w-4 text-amber-400" />
                            {campaign.points} পয়েন্ট
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <span className="text-sm text-neutral-500">{campaign.duration}</span>
                        <Button
                          asChild
                          size="sm"
                          className="bg-white text-neutral-900 hover:bg-neutral-100 font-semibold"
                        >
                          <Link href={`/campaigns/${campaign.id}`}>ক্যাম্পেইন দেখুন</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 hover:border-white/30"
            >
              <Link href="/campaigns" className="gap-2">
                সব আমল দেখুন
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative py-32 border-t border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-violet-500/20 to-purple-600/20 text-violet-300 border-violet-500/30">
              ধাপসমূহ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              কিভাবে কাজ করে
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              মাত্র তিনটি সহজ ধাপেই আপনার আমলনামা সমৃদ্ধ করুন
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={index}
                  className="relative group"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 z-10 w-12 h-12 rounded-full bg-gradient-to-br from-neutral-800 to-neutral-900 border-2 border-white/10 flex items-center justify-center text-xl font-black text-neutral-600">
                    {index + 1}
                  </div>

                  <div className="relative p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 group-hover:scale-[1.02]">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-neutral-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="relative py-32 border-t border-white/5">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <Badge className="mb-4 bg-gradient-to-r from-emerald-500/20 to-teal-600/20 text-emerald-300 border-emerald-500/30">
              বৈশিষ্ট্য
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
              কেন আমাদের বেছে নেবেন?
            </h2>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              আপনার দ্বীনি জীবনকে আরও সুন্দর ও গোছানো করতে যা যা প্রয়োজন
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="group relative p-8 rounded-2xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />

                  <div className="relative flex items-start gap-6">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.gradient} flex-shrink-0 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-neutral-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 border-t border-white/5">
        <div className="container mx-auto max-w-4xl px-6">
          <div className="relative p-12 lg:p-16 rounded-3xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
            {/* Background Pattern - like contact page */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Glow - similar to contact page */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10" />

            <div className="relative text-center">
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
                <Sparkles className="w-3 h-3 mr-2" />
                এখনই যোগ দিন
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                জীবনকে নেক আমলে ভরিয়ে দিতে প্রস্তুত?
              </h2>
              <p className="text-base text-neutral-400 mb-8 max-w-2xl mx-auto">
                হাজার হাজার মুসলমানের সাথে প্রতিযোগিতার পরিবর্তে একে অপরকে ভালো কাজে উৎসাহিত করুন।
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
                <Button
                  asChild
                  size="default"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm px-6 py-5 h-auto font-semibold shadow-lg shadow-cyan-500/25"
                >
                  <Link href="/sign-up" className="gap-2">
                    ফ্রি অ্যাকাউন্ট খুলুন
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="default"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 text-sm px-6 py-5 h-auto backdrop-blur-sm"
                >
                  <Link href="/campaigns">আমলসমূহ দেখুন</Link>
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-neutral-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>জয়েন করা একদম ফ্রি</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>কোনো ক্রেডিট কার্ড লাগবে না</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>জান্নাতের পথে এগিয়ে যান</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-16 border-t border-white/5 bg-neutral-900/30">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">{siteName}</span>
              </Link>
              <p className="text-sm text-neutral-400">
                ইমানের সাথে নেক আমল নিয়মিত করার মাধ্যমে আপনার দ্বীনি লক্ষ্য অর্জন করুন।
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-semibold text-white mb-4">প্ল্যাটফর্ম</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/campaigns" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    ক্যাম্পেইন
                  </Link>
                </li>
                <li>
                  <Link href="/leaderboard" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    লিডারবোর্ড
                  </Link>
                </li>
                <li>
                  <Link href="/teams" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    দলসমূহ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white mb-4">কোম্পানি</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    আমাদের সম্পর্কে
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    যোগাযোগ
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    সহায়তা কেন্দ্র
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-white mb-4">আইনি</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/terms" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    ব্যবহারের শর্তাবলী
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-neutral-400 hover:text-white transition-colors">
                    গোপনীয়তা নীতি
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10">
            <p className="text-sm text-neutral-500">
              © {new Date().getFullYear()} {siteName}. সর্বস্বত্ব সংরক্ষিত।
            </p>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 3.743 0 01-1.804 4.57 11.659 11.659 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  )
}
