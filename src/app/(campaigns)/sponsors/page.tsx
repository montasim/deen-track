'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Building2,
  Globe,
  ArrowUpRight,
  Mail,
  CheckCircle2,
  Heart,
  Star,
  Diamond,
  Award,
  Crown,
} from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'
import { CallToAction } from '@/components/marketing/call-to-action'
import { PageBackground } from '@/components/layout/page-background'

// Featured Platinum Sponsors
const platinumSponsors = [
  {
    id: '1',
    name: 'TechVentures Inc.',
    description: 'Leading venture capital firm empowering the next generation of innovative startups and game-changing technologies.',
    logo: 'TV',
    website: 'https://techventures.example.com',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: '2',
    name: 'Digital Dreams Ltd.',
    description: 'Pioneering digital transformation solutions that help businesses thrive in the modern economy.',
    logo: 'DD',
    website: 'https://digitaldreams.example.com',
    color: 'from-blue-500 to-violet-600',
  },
]

// Premium Gold Sponsors
const goldSponsors = [
  {
    id: '3',
    name: 'CloudScale',
    description: 'Cloud infrastructure and scaling solutions for modern applications.',
    logo: 'CS',
    website: 'https://cloudscale.example.com',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: '4',
    name: 'DataFlow Systems',
    description: 'Real-time data analytics and business intelligence platforms.',
    logo: 'DF',
    website: 'https://dataflow.example.com',
    color: 'from-purple-500 to-pink-600',
  },
  {
    id: '5',
    name: 'SecureCore',
    description: 'Enterprise cybersecurity and compliance solutions.',
    logo: 'SC',
    website: 'https://securecore.example.com',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: '6',
    name: 'NextGen AI',
    description: 'Artificial intelligence and machine learning platforms.',
    logo: 'NG',
    website: 'https://nextgenai.example.com',
    color: 'from-violet-500 to-purple-600',
  },
]

// Standard Silver Sponsors
const silverSponsors = [
  { id: '7', name: 'DevTools Pro', logo: 'DT', website: 'https://devtools.example.com' },
  { id: '8', name: 'CodeCraft', logo: 'CC', website: 'https://codecraft.example.com' },
  { id: '9', name: 'PixelPerfect', logo: 'PP', website: 'https://pixelperfect.example.com' },
  { id: '10', name: 'StackFlow', logo: 'SF', website: 'https://stackflow.example.com' },
  { id: '11', name: 'CloudNative', logo: 'CN', website: 'https://cloudnative.example.com' },
  { id: '12', name: 'APIFirst', logo: 'AF', website: 'https://apifirst.example.com' },
  { id: '13', name: 'DevOps Hub', logo: 'DH', website: 'https://devopshub.example.com' },
  { id: '14', name: 'MicroServe', logo: 'MS', website: 'https://microserve.example.com' },
]

const benefits = [
  'সব ক্যাম্পেইনে আপনার ব্র্যান্ড দেখানো হবে',
  'সরাসরি হাজার হাজার সক্রিয় মানুষের সাথে যুক্ত হওয়ার সুযোগ',
  'আপনার পছন্দমত ক্যাম্পেইন স্পন্সর করুন',
  'লিডারবোর্ড আর সাফল্যে আপনার লোগো থাকবে',
  'সোশ্যাল মিডিয়াতেও আপনার প্রচার',
  'রেজাল্ট আর রিপোর্ট দেখুন সহজেই',
]

export default function SponsorsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <PageBackground />
      {/* Hero Section */}
      <PageHeader
        badgeIcon={Heart}
        badgeText="আমাদের সহযোগীরা"
        badgeColor="cyan"
        title={
            <>
                <span className="text-white">আমাদের</span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">স্পন্সররা</span>
            </>
        }
        description="চমৎকার সব চ্যালেঞ্জ বানাতে আর আপনাদের পুরস্কার দিতে এই দুর্দান্ত কোম্পানিগুলো আমাদের সাহায্য করে! তাদের সাপোর্টে আমরা আপনাদের জন্য আরও সুন্দর অভিজ্ঞতা তৈরি করতে পারছি।"
      />

      {/* Platinum Sponsors Section */}
      <div className="container mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Diamond className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">প্লাটিনাম পার্টনার</h2>
          </div>
          <p className="text-neutral-400">আমাদের সর্বোচ্চ পর্যায়ের অংশীদারিত্ব</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {platinumSponsors.map((sponsor, index) => (
            <Card
              key={sponsor.id}
              className="group relative bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-500/10 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Animated Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-600/0 to-violet-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-600/10 group-hover:to-violet-500/10 transition-all duration-500" />

              <CardContent className="relative p-8">
                <div className="flex items-start gap-6 mb-6">
                  {/* Logo */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${sponsor.color} flex items-center justify-center text-3xl font-black text-white shadow-2xl shadow-${sponsor.color.split('-')[1]}-500/30 group-hover:scale-110 transition-transform duration-500`}
                    >
                      {sponsor.logo}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-xl font-black text-white">{sponsor.name}</h3>
                    </div>
                    <p className="text-neutral-400 leading-relaxed">{sponsor.description}</p>
                  </div>
                </div>

                {/* CTA */}
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all"
                >
                  <Link href={sponsor.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    ওয়েবসাইট দেখুন
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gold Sponsors Section */}
      <div className="border-y border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Award className="w-6 h-6 text-violet-400" />
              <h2 className="text-xl sm:text-2xl font-bold text-white">প্রিমিয়াম পার্টনার</h2>
            </div>
            <p className="text-neutral-400">কমিউনিটির বিশ্বস্ত সহযোগী</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goldSponsors.map((sponsor, index) => (
              <Card
                key={sponsor.id}
                className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-violet-500/30 transition-all duration-500 overflow-hidden hover:scale-[1.02]"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-600/0 to-pink-500/0 group-hover:from-violet-500/10 group-hover:via-purple-600/10 group-hover:to-pink-500/10 transition-all duration-500" />

                <CardContent className="relative p-6">
                  {/* Logo */}
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${sponsor.color} flex items-center justify-center text-2xl font-black text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-500`}
                  >
                    {sponsor.logo}
                  </div>

                  {/* Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 text-violet-400" />
                    <h3 className="text-xl font-bold text-white">{sponsor.name}</h3>
                  </div>
                  <p className="text-sm text-neutral-400 mb-6 line-clamp-2">
                    {sponsor.description}
                  </p>

                  {/* CTA */}
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-violet-500/30 text-white hover:bg-violet-500/10 hover:border-violet-500/50 font-semibold"
                  >
                    <Link href={sponsor.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                      ওয়েবসাইট দেখুন
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Silver Sponsors Section */}
      <div className="container mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Building2 className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">কমিউনিটি পার্টনার</h2>
          </div>
          <p className="text-neutral-400">শুরু থেকেই আমাদের লক্ষ্য অর্জনে সহায়ক</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {silverSponsors.map((sponsor, index) => (
            <Card
              key={sponsor.id}
              className="group relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-blue-500/30 transition-all duration-300 hover:scale-[1.05]"
            >
              <CardContent className="relative p-6 text-center">
                {/* Logo */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 mx-auto mb-4 flex items-center justify-center text-xl font-bold text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {sponsor.logo}
                </div>

                {/* Name */}
                <h3 className="font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                  {sponsor.name}
                </h3>

                {/* Link */}
                <Button
                  asChild
                  size="sm"
                  variant="ghost"
                  className="text-neutral-400 hover:text-white hover:bg-white/5 w-full"
                >
                  <Link href={sponsor.website} target="_blank" rel="noopener noreferrer" className="gap-2">
                    <Globe className="w-3 h-3" />
                    দেখুন
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Become a Sponsor CTA */}
      <CallToAction
        icon={Sparkles}
        title="স্পন্সর করতে আগ্রহী?"
        description="আমাদের সাথে যুক্ত হয়ে হাজার হাজার সক্রিয় ব্যবহারকারীর কাছে পৌঁছান। আমরা আপনাদের লক্ষ্যের সাথে মিল রেখে নমনীয় স্পন্সরশিপ প্যাকেজ অফার করি।"
        primaryButtonHref="mailto:sponsors@deen-track.com"
        primaryButtonText="যোগাযোগ করুন"
        primaryButtonIcon={Mail}
        secondaryButtonHref="/about"
        secondaryButtonText="আরও জানুন"
        extraContent={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-left bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-medium text-white">{benefit}</span>
              </div>
            ))}
          </div>
        }
      />
    </>
  )
}
