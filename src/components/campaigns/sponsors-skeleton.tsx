'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Diamond, Award, Building2, Heart, Sparkles, Mail, CheckCircle2, ArrowUpRight, Globe, Crown, Star } from 'lucide-react'
import { PageBackground } from '@/components/layout/page-background'

// Premium gradient themes for different sponsor tiers
const tierGradients = {
  platinum: {
    primary: 'from-cyan-500 via-blue-600 to-violet-500',
    card: 'from-cyan-500/10 via-blue-600/10 to-violet-500/10',
    border: 'border-cyan-500/20',
    hoverBorder: 'hover:border-cyan-500/40',
    button: 'from-cyan-500 to-blue-600',
  },
  gold: {
    primary: 'from-violet-500 via-purple-600 to-pink-500',
    card: 'from-violet-500/0 via-purple-600/0 to-pink-500/0',
    border: 'border-white/10',
    hoverBorder: 'hover:border-violet-500/30',
    button: 'border-violet-500/30',
  },
  silver: {
    primary: 'from-blue-500 to-cyan-600',
    border: 'border-white/10',
    hoverBorder: 'hover:border-blue-500/30',
  },
}

function PlatinumSponsorCardSkeleton({ index }: { index: number }) {
  return (
    <Card
      className={`
        group relative bg-gradient-to-br ${tierGradients.platinum.card}
        backdrop-blur-xl border ${tierGradients.platinum.border} ${tierGradients.platinum.hoverBorder}
        transition-all duration-500 overflow-hidden opacity-0
      `}
      style={{
        animation: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${400 + index * 200}ms`,
      }}
    >
      {/* Animated Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-600/0 to-violet-500/0 animate-pulse" />

      {/* Shimmer sweep */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] animate-shimmer" />

      <CardContent className="relative p-8">
        <div className="flex items-start gap-6 mb-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div
              className={`
                w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30
                flex items-center justify-center shadow-2xl animate-pulse
              `}
              style={{ animationDelay: `${index * 200 + 100}ms` }}
            >
              <div className="text-3xl font-black text-white/50">?</div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-cyan-500/20 animate-pulse" style={{ animationDelay: `${index * 200 + 150}ms` }}>
                <Crown className="w-5 h-5 text-cyan-400/50" />
              </div>
              <div className="h-7 w-48 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 200 + 175}ms` }} />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 200 + 200}ms` }} />
              <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 200 + 225}ms` }} />
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div
          className="w-full h-12 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-lg animate-pulse"
          style={{ animationDelay: `${index * 200 + 250}ms` }}
        />
      </CardContent>
    </Card>
  )
}

function GoldSponsorCardSkeleton({ index }: { index: number }) {
  const colors = [
    'from-violet-500/30 to-purple-600/30',
    'from-purple-500/30 to-pink-600/30',
    'from-pink-500/30 to-rose-600/30',
    'from-violet-500/30 to-purple-600/30',
  ]

  return (
    <Card
      className={`
        group relative bg-neutral-900/40 backdrop-blur-xl border ${tierGradients.gold.border}
        ${tierGradients.gold.hoverBorder} transition-all duration-500 overflow-hidden opacity-0
      `}
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${800 + index * 120}ms`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 via-purple-600/0 to-pink-500/0 animate-pulse" />

      <CardContent className="relative p-6">
        {/* Logo */}
        <div
          className={`w-16 h-16 rounded-xl bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center shadow-lg mb-4 animate-pulse`}
          style={{ animationDelay: `${index * 120 + 50}ms` }}
        >
          <div className="text-2xl font-black text-white/50">?</div>
        </div>

        {/* Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1 rounded bg-violet-500/20 animate-pulse" style={{ animationDelay: `${index * 120 + 100}ms` }}>
            <Star className="w-4 h-4 text-violet-400/50" />
          </div>
          <div className="h-6 w-40 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 125}ms` }} />
        </div>
        <div className="mb-6 space-y-2">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 150}ms` }} />
          <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 175}ms` }} />
        </div>

        {/* CTA Button */}
        <div
          className="w-full h-10 border border-violet-500/30 rounded-lg animate-pulse"
          style={{ animationDelay: `${index * 120 + 200}ms` }}
        />
      </CardContent>
    </Card>
  )
}

function SilverSponsorCardSkeleton({ index }: { index: number }) {
  return (
    <Card
      className={`
        group relative bg-neutral-900/40 backdrop-blur-xl border ${tierGradients.silver.border}
        ${tierGradients.silver.hoverBorder} transition-all duration-300 opacity-0
      `}
      style={{
        animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${1300 + index * 80}ms`,
      }}
    >
      <CardContent className="relative p-6 text-center">
        {/* Logo */}
        <div
          className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/30 to-cyan-600/30 mx-auto mb-4 flex items-center justify-center shadow-lg animate-pulse"
          style={{ animationDelay: `${index * 80 + 50}ms` }}
        >
          <div className="text-xl font-bold text-white/50">?</div>
        </div>

        {/* Name */}
        <div className="h-5 w-32 mx-auto mb-4 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 80 + 100}ms` }} />

        {/* Link */}
        <div
          className="h-9 w-full bg-white/5 rounded animate-pulse flex items-center justify-center gap-2 mx-auto"
          style={{ animationDelay: `${index * 80 + 150}ms` }}
        >
          <div className="w-3 h-3 rounded bg-blue-500/30" />
        </div>
      </CardContent>
    </Card>
  )
}

function BenefitItemSkeleton({ index }: { index: number }) {
  return (
    <div
      className="flex items-center gap-3 text-left bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 opacity-0"
      style={{
        animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${1800 + index * 100}ms`,
      }}
    >
      <div
        className="w-5 h-5 rounded bg-emerald-500/30 flex-shrink-0 animate-pulse"
        style={{ animationDelay: `${index * 100 + 50}ms` }}
      />
      <div className="h-4 flex-1 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 100}ms` }} />
    </div>
  )
}

function CallToActionSkeleton() {
  return (
    <div
      className="relative bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-500/10
      backdrop-blur-xl border border-white/10 rounded-2xl p-12 opacity-0"
      style={{
        animation: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: '1900ms',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-violet-500/5 animate-pulse" />

      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 animate-pulse">
            <Sparkles className="w-12 h-12 text-cyan-400/50" />
          </div>
        </div>

        {/* Title */}
        <div className="h-10 w-64 mx-auto bg-white/10 rounded-xl animate-pulse" style={{ animationDelay: '1950ms' }} />

        {/* Description */}
        <div className="space-y-2 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="h-5 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: '2000ms' }} />
          <div className="h-5 w-3/4 mx-auto bg-white/5 rounded animate-pulse" style={{ animationDelay: '2050ms' }} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="h-12 w-40 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-lg animate-pulse" style={{ animationDelay: '2100ms' }} />
          <div className="h-12 w-32 border border-white/20 rounded-lg animate-pulse" style={{ animationDelay: '2150ms' }} />
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <BenefitItemSkeleton key={i} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export function SponsorsSkeleton() {
  return (
    <>
      <PageBackground />

      {/* Hero Section */}
      <section className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden my-10 pt-20 pb-16">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 opacity-0"
              style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <Heart className="w-4 h-4 text-cyan-400/50 animate-pulse" />
              <div className="h-4 w-28 bg-cyan-400/30 rounded animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal space-y-2 opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 100ms', animationFillMode: 'forwards' }}>
              <div className="h-10 w-32 bg-neutral-700/50 rounded animate-pulse mx-auto" />
              <div className="h-10 w-48 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 rounded animate-pulse mx-auto" />
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto h-6 w-[600px] bg-neutral-700/30 rounded animate-pulse opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 200ms', animationFillMode: 'forwards' }} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-neutral-950 relative">
        {/* Platinum Sponsors Section */}
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-12 opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 300ms' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-1 rounded bg-cyan-500/20 animate-pulse">
                <Diamond className="w-6 h-6 text-cyan-400/50" />
              </div>
              <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-5 w-48 mx-auto bg-white/5 rounded animate-pulse" />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[0, 1].map((i) => (
              <PlatinumSponsorCardSkeleton key={i} index={i} />
            ))}
          </div>
        </div>

        {/* Gold Sponsors Section */}
        <div className="border-y border-white/5 bg-neutral-900/20">
          <div className="container mx-auto max-w-7xl px-6 py-24">
            <div className="text-center mb-12 opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 700ms' }}>
              <div className="inline-flex items-center gap-2 mb-4">
                <div className="p-1 rounded bg-violet-500/20 animate-pulse">
                  <Award className="w-6 h-6 text-violet-400/50" />
                </div>
                <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-5 w-40 mx-auto bg-white/5 rounded animate-pulse" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[0, 1, 2, 3].map((i) => (
                <GoldSponsorCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Silver Sponsors Section */}
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-12 opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 1200ms' }}>
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="p-1 rounded bg-blue-500/20 animate-pulse">
                <Building2 className="w-6 h-6 text-blue-400/50" />
              </div>
              <div className="h-8 w-40 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="h-5 w-48 mx-auto bg-white/5 rounded animate-pulse" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <SilverSponsorCardSkeleton key={i} index={i} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <CallToActionSkeleton />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2.5s infinite;
        }
      `}</style>
    </>
  )
}
