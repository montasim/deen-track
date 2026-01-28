'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AnimatedHeroBackground } from '@/components/layout/animated-hero-background'
import {
  Trophy,
  Heart,
  Lightbulb,
  Shield,
  Star,
  Users,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Target,
  Flame,
  Calendar,
  Github,
  Twitter,
  Linkedin,
  Rocket,
} from 'lucide-react'

const stats = [
  { label: 'সক্রিয় মানুষ', value: '৫০হাজার+', icon: Users, color: 'from-cyan-500 to-blue-600' },
  { label: 'চ্যালেঞ্জ আয়োজন', value: '১,২০০+', icon: Trophy, color: 'from-violet-500 to-purple-600' },
  { label: 'সম্পন্ন টাস্ক', value: '২.৫মিলিয়ন+', icon: Sparkles, color: 'from-emerald-500 to-green-600' },
  { label: 'পুরস্কার বিতরণ', value: '৫০০হাজার+', icon: Star, color: 'from-amber-500 to-orange-600' },
]

const values = [
  {
    icon: Lightbulb,
    title: 'সবসময় নতুন কিছু',
    description: 'আমরা সবসময় নতুন নতুন আইডিয়া নিয়ে কাজ করি যাতে আপনি আরও মজা পান!',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Heart,
    title: 'মানুষের জন্য',
    description: 'আমাদের প্ল্যাটফর্মটি সারা বিশ্বের হাজার হাজার মানুষের ভালোবাসায় গড়ে উঠেছে।',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Shield,
    title: 'বিশ্বাস আমাদের ভিত্তি',
    description: 'আমরা সবসময় সততা বজায় রাখি। প্রতিটা কাজ স্বচ্ছ ভাবে করা হয়।',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Trophy,
    title: 'সেরা হওয়ার চেষ্টা',
    description: 'আমরা প্রতিটা ছোট বিষয়ে যত্ন নিই যাতে আপনার অভিজ্ঞতা দুর্দান্ত হয়!',
    color: 'from-violet-500 to-purple-600',
  },
]

const milestones = [
  {
    year: '২০২১',
    title: 'যাত্রা শুরু',
    description: 'ব্যক্তিগত উন্নয়নকে গেমের মতা মজার বানানোর স্বপ্ন নিয়ে আমাদের শুরু!',
    icon: Rocket,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    year: '২০২২',
    title: '১০ হাজার মানুষ!',
    description: 'আমাদের চ্যালেঞ্জ সিস্টেম দ্রুত মানুষের কাছে জনপ্রিয় হয়ে যায়।',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-600',
  },
  {
    year: '২০২৩',
    title: 'নতুন যাত্রা',
    description: 'বড় বড় কোম্পানির জন্য কাস্টম চ্যালেঞ্জ বানানো শুরু করলাম।',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
  },
  {
    year: '২০২৪',
    title: 'বিশ্বজুড়ে ছড়িয়ে পড়লাম',
    description: 'এখন ৫০+ দেশে আমাদের চ্যালেঞ্জ চলছে আর মানুষ পুরস্কার জিতছে!',
    icon: Target,
    color: 'from-amber-500 to-orange-600',
  },
]

const team = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former product lead at Stripe. Passionate about gamification and behavioral psychology.',
    avatar: 'SC',
    social: { github: '#', twitter: '#', linkedin: '#' },
    color: 'from-cyan-500 to-blue-600',
  },
  {
    name: 'Marcus Johnson',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Google engineer with expertise in scalable systems and real-time platforms.',
    avatar: 'MJ',
    social: { github: '#', twitter: '#', linkedin: '#' },
    color: 'from-violet-500 to-purple-600',
  },
  {
    name: 'Elena Rodriguez',
    role: 'Head of Product',
    bio: 'Building delightful experiences that users love. Design-thinking advocate.',
    avatar: 'ER',
    social: { github: '#', twitter: '#', linkedin: '#' },
    color: 'from-emerald-500 to-green-600',
  },
  {
    name: 'David Kim',
    role: 'Head of Community',
    bio: 'Community architect who believes in the power of shared challenges and growth.',
    avatar: 'DK',
    social: { github: '#', twitter: '#', linkedin: '#' },
    color: 'from-amber-500 to-orange-600',
  },
]

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <div className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden pt-20">
        {/* Animated Background */}
        <AnimatedHeroBackground />

        <div className="relative container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              className={`mb-6 bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-4 py-1.5 h-auto text-sm font-bold backdrop-blur-md ${isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-cyan-400" />
              আমাদের কথা
            </Badge>

            <h1
              className={`text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
            >
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                চ্যালেঞ্জ থেকে
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                সাফল্যের পথে
              </span>
            </h1>

            <p
              className={`text-xl text-neutral-400 leading-relaxed mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
            >
              আমাদের লক্ষ্য - আপনার ব্যক্তিগত উন্নয়নকে আনন্দদায়ক আর পুরস্কারপূর্ণ করা! গেমের মতা চ্যালেঞ্জ আর বন্ধুত্বপূর্ণ প্রতিযোগিতার মাধ্যমে আমরা লক্ষ লক্ষ মানুষকে তাদের স্বপ্ন পূরণে সাহায্য করছি।
            </p>

            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
            >
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25"
              >
                <Link href="/campaigns" className="gap-2">
                  🎯 চ্যালেঞ্জ দেখুন
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                <Link href="/sign-up">👋 কমিউনিটিতে যোগ দিন</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={stat.label}
                className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardContent className="relative p-8 text-center">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                  <div className="text-neutral-400 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Our Story / Timeline */}
      <div className="border-y border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-violet-500/15 text-violet-400 border-violet-500/30 px-4 py-1.5 h-auto text-sm font-bold backdrop-blur-md">
              <Calendar className="w-3.5 h-3.5 mr-2 text-violet-400" />
              আমাদের পথচলা
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                ব্যতিক্রমী কিছু
              </span>
              <br />
              <span className="text-white">গড়ে তোলার গল্প</span>
            </h2>
            <p className="text-base text-neutral-400 max-w-2xl mx-auto">
              একটি সাধারণ চিন্তা থেকে বৈশ্বিক আন্দোলনে রূপান্তর হওয়ার যাত্রা
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {milestones.map((milestone, index) => {
              const Icon = milestone.icon
              return (
                <Card
                  key={milestone.year}
                  className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${milestone.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  <CardContent className="relative p-6">
                    <div
                      className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${milestone.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-black text-white mb-3">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{milestone.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed">{milestone.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-emerald-500/15 text-emerald-400 border-emerald-500/30 px-4 py-1.5 h-auto text-sm font-bold backdrop-blur-md">
            <Star className="w-3.5 h-3.5 mr-2 text-emerald-400" />
            আমাদের বিশ্বাস
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black mb-4">
            <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 bg-clip-text text-transparent">
              মূল আদর্শ
            </span>
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            যে নীতিগুলো আমাদের প্রতিটি কাজকে পরিচালিত করে
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card
                key={value.title}
                className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${value.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardContent className="relative p-8">
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${value.color} shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                      <p className="text-neutral-400 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Team Section */}
      <div className="border-y border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-amber-500/15 text-amber-400 border-amber-500/30 px-4 py-1.5 h-auto text-sm font-bold backdrop-blur-md">
              <Users className="w-3.5 h-3.5 mr-2 text-amber-400" />
              আমাদের সদস্যবৃন্দ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                নেপথ্যের কারিগরদের
              </span>
              <br />
              <span className="text-white">সাথে পরিচিত হোন</span>
            </h2>
            <p className="text-base text-neutral-400 max-w-2xl mx-auto">
              সৃজনশীল এবং উদ্যমী আধুনিক নির্মাতাদের একটি নিবেদিত দল
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Card
                key={member.name}
                className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                />
                <CardContent className="relative p-6 text-center">
                  <div
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white group-hover:scale-110 transition-transform duration-500`}
                  >
                    {member.avatar}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                  <div className="text-sm font-semibold text-cyan-400 mb-4">{member.role}</div>
                  <p className="text-sm text-neutral-400 leading-relaxed mb-6">{member.bio}</p>
                  <div className="flex items-center justify-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-neutral-400 hover:text-white hover:bg-white/5"
                      asChild
                    >
                      <Link href={member.social.github}>
                        <Github className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-neutral-400 hover:text-white hover:bg-white/5"
                      asChild
                    >
                      <Link href={member.social.twitter}>
                        <Twitter className="w-4 h-4" />
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-neutral-400 hover:text-white hover:bg-white/5"
                      asChild
                    >
                      <Link href={member.social.linkedin}>
                        <Linkedin className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="border-t border-white/5 bg-neutral-900/30">
        <div className="container mx-auto max-w-4xl px-6 py-24">
          <Card className="relative overflow-hidden bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10" />

            <CardContent className="relative p-12 lg:p-16 text-center">
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 mb-6">
                <Flame className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-6">
                আপনার যাত্রা শুরু করতে প্রস্তুত?
              </h2>
              <p className="text-base text-neutral-400 mb-8 max-w-2xl mx-auto">
                আমাদের হাজার হাজার ব্যবহারকারীর সাথে যোগ দিন যারা ইতোমধ্যে নিজেদের চ্যালেঞ্জ করছেন এবং পুরস্কার পাচ্ছেন।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  asChild
                  size="default"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm px-6 py-5 h-auto font-semibold shadow-lg shadow-cyan-500/25"
                >
                  <Link href="/sign-up" className="gap-2">
                    ফ্রি অ্যাকাউন্ট তৈরি করুন
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="default"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 text-sm px-6 py-5 h-auto backdrop-blur-sm"
                >
                  <Link href="/campaigns">ক্যাম্পেইনগুলো দেখুন</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
