'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  { label: 'সক্রিয় ব্যবহারকারী', value: '৫০কে+', icon: Users, color: 'from-cyan-500 to-blue-600' },
  { label: 'আয়োজিত ক্যাম্পেইন', value: '১,২০০+', icon: Trophy, color: 'from-violet-500 to-purple-600' },
  { label: 'সম্পন্ন চ্যালেঞ্জ', value: '২.৫এম+', icon: Sparkles, color: 'from-emerald-500 to-green-600' },
  { label: 'অর্জিত পুরস্কার', value: '$৫০০কে+', icon: Star, color: 'from-amber-500 to-orange-600' },
]

const values = [
  {
    icon: Lightbulb,
    title: 'উদ্ভাবনই প্রথম',
    description: 'আমরা চ্যালেঞ্জিং এবং অনুপ্রেরণীয় গেমিনিফিকেশন অভিজ্ঞতা তৈরির জন্য ক্রমাগত নতুন পথ খুঁজি।',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    icon: Heart,
    title: 'কমিউনিটি নির্ভর',
    description: 'আমাদের প্ল্যাটফর্মটি বিশ্বজুড়ে ছড়িয়ে থাকা একদল উদ্যমী মানুষের শক্তি এবং আবেগের উপর ভিত্তি করে গড়ে উঠেছে।',
    color: 'from-rose-500 to-pink-600',
  },
  {
    icon: Shield,
    title: 'সর্বদা সততা',
    description: 'বিশ্বাসই আমাদের ভিত্তি। প্রতিটি ক্যাম্পেইন এবং কার্যক্রমে আমরা স্বচ্ছতা ও নিরপেক্ষতা বজায় রাখি।',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Trophy,
    title: 'উৎকর্ষের গুরুত্ব',
    description: 'আমরা প্রতিটি খুঁটিনাটি বিষয়ের উপর গুরুত্ব দিই এবং নিশ্চিত করি যে প্রতিটি অভিজ্ঞতা যেন স্মরণীয় হয়।',
    color: 'from-violet-500 to-purple-600',
  },
]

const milestones = [
  {
    year: '২০২১',
    title: 'প্ল্যাটফর্মের শুভ সূচনা',
    description: 'ব্যক্তিগত উন্নয়ন এবং সাফল্য ট্র্যাকিংকে গেমের মতো সহজ করার লক্ষ্য নিয়ে আমাদের যাত্রা শুরু।',
    icon: Rocket,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    year: '২০২২',
    title: 'প্রথম ১০ হাজার ব্যবহারকারী',
    description: 'আমাদের ক্যাম্পেইন-ভিত্তিক চ্যালেঞ্জ সিস্টেম দ্রুত মানুষের কাছে জনপ্রিয় হয়ে ওঠে।',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-600',
  },
  {
    year: '২০২৩',
    title: 'এন্টারপ্রাইজ সংস্করণ',
    description: 'ব্যবসা এবং বিভিন্ন সংস্থার জন্য কাস্টম ক্যাম্পেইন সেবা প্রদান শুরু করি।',
    icon: Sparkles,
    color: 'from-violet-500 to-purple-600',
  },
  {
    year: '২০২৪',
    title: 'বিশ্বজুড়ে বিস্তার',
    description: 'বর্তমানে ৫০টিরও বেশি দেশে স্থানীয় ক্যাম্পেইন এবং পুরস্কার নিয়ে সফলভাবে কাজ করছি।',
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 bottom-0 right-0 animate-pulse delay-1000" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              className={`mb-6 bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-4 py-1.5 h-auto text-sm font-bold backdrop-blur-md ${isVisible ? 'animate-fade-in' : 'opacity-0'
                }`}
            >
              <Sparkles className="w-3.5 h-3.5 mr-2 text-cyan-400" />
              আমাদের গল্প
            </Badge>

            <h1
              className={`text-4xl sm:text-5xl lg:text-5xl font-black tracking-tight mb-8 transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
            >
              <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                চ্যালেঞ্জকে সাফল্যে
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                রূপান্তর করুন
              </span>
            </h1>

            <p
              className={`text-xl text-neutral-400 leading-relaxed mb-8 transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
            >
              আমাদের লক্ষ্য হ'ল ব্যক্তিগত উন্নয়নকে আনন্দদায়ক, ফলপ্রসূ এবং সামাজিক করে তোলা। গেমিনিফাইড ক্যাম্পেইন এবং বন্ধুসুলভ প্রতিযোগিতার মাধ্যমে আমরা লক্ষ লক্ষ মানুষকে তাদের সুপ্ত প্রতিভা বিকাশে এবং প্রতিটি সাফল্য উদযাপনে সহায়তা করছি।
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
                  ক্যাম্পেইনগুলো দেখুন
                  <ArrowUpRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5"
              >
                <Link href="/sign-up">আমাদের কমিউনিটিতে যোগ দিন</Link>
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
