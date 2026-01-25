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
  'Brand visibility across all campaigns',
  'Direct access to engaged tech community',
  'Custom campaign sponsorship opportunities',
  'Logo placement on leaderboard and achievements',
  'Social media promotion and featured spots',
  'Analytics and engagement reports',
]

export default function SponsorsPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Hero Section */}
      <div className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
          <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 bottom-0 right-0 animate-pulse delay-1000" />
          <div className="absolute w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/15 via-cyan-600/10 to-teal-500/15 rounded-full blur-[80px] -translate-x-1/4 -translate-y-1/4 bottom-1/4 left-1/4 animate-pulse delay-500" />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
              <Heart className="w-3 h-3 mr-2" />
              Trusted Partners
            </Badge>

            <h1
              className={`flex items-center justify-center gap-4 text-5xl font-black tracking-tight mb-6 transition-all duration-1000 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              <span className="block text-white">Our</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                Sponsors
              </span>
            </h1>

            <p
              className={`text-lg text-neutral-400 leading-relaxed transition-all duration-1000 delay-200 ${
                mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}
            >
              We&apos;re proud to partner with industry leaders who share our vision for gamification,
              innovation, and community building. Our sponsors make it possible to create amazing
              campaigns and reward our dedicated users.
            </p>
          </div>
        </div>
      </div>

      {/* Platinum Sponsors Section */}
      <div className="container mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Diamond className="w-6 h-6 text-cyan-400" />
            <h2 className="text-3xl font-black text-white">Platinum Partners</h2>
          </div>
          <p className="text-neutral-400">Our highest level of partnership</p>
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
                    Visit Website
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
              <h2 className="text-3xl font-black text-white">Premium Partners</h2>
            </div>
            <p className="text-neutral-400">Trusted supporters of our community</p>
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
                      Visit Website
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
            <h2 className="text-3xl font-black text-white">Community Partners</h2>
          </div>
          <p className="text-neutral-400">Supporting our mission from the beginning</p>
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
                    Visit
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Become a Sponsor CTA */}
      <div className="border-t border-white/5 bg-neutral-900/20">
        <div className="container mx-auto max-w-5xl px-6 py-24">
          <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-violet-600 border-0 shadow-2xl shadow-cyan-500/25">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

            {/* Animated Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

            <CardContent className="relative p-12 lg:p-16">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-white/20 backdrop-blur-xl mb-6">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white mb-6">
                  Interested in Sponsoring?
                </h2>

                <p className="text-lg text-cyan-100 mb-10 max-w-2xl mx-auto leading-relaxed">
                  Join our roster of amazing partners and connect with thousands of engaged users.
                  We offer flexible sponsorship packages tailored to your goals.
                </p>

                {/* Benefits Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-left bg-white/10 backdrop-blur-sm rounded-lg p-4"
                    >
                      <CheckCircle2 className="w-5 h-5 text-cyan-300 flex-shrink-0" />
                      <span className="text-sm font-medium text-white">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-neutral-900 hover:bg-neutral-100 font-semibold shadow-xl"
                  >
                    <Link href="mailto:sponsors@example.com" className="gap-2">
                      <Mail className="w-5 h-5" />
                      Contact Us
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-semibold backdrop-blur-sm"
                  >
                    <Link href="/about">Learn More</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
