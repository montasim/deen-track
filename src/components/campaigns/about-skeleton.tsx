'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { PageBackground } from '@/components/layout/page-background'

// Distinctive gradient themes for different sections
const sectionThemes = {
  stats: [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
  ],
  milestones: [
    'from-cyan-500 to-blue-600',
    'from-emerald-500 to-green-600',
    'from-violet-500 to-purple-600',
    'from-amber-500 to-orange-600',
  ],
  values: [
    'from-yellow-500 to-amber-600',
    'from-rose-500 to-pink-600',
    'from-blue-500 to-cyan-600',
    'from-violet-500 to-purple-600',
  ],
  team: [
    'from-cyan-500 to-blue-600',
    'from-violet-500 to-purple-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
  ],
}

function StatCardSkeleton({ index }: { index: number }) {
  const icons = [Users, Trophy, Sparkles, Star]
  const Icon = icons[index]
  const color = sectionThemes.stats[index]

  return (
    <Card
      className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${400 + index * 100}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`} />
      <CardContent className="relative p-8 text-center">
        <div
          className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg mb-6 animate-pulse`}
          style={{ animationDelay: `${index * 100 + 100}ms` }}
        >
          <Icon className="w-8 h-8 text-white/50" />
        </div>
        <div className="h-8 w-20 mx-auto mb-2 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 150}ms` }} />
        <div className="h-5 w-24 mx-auto bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 200}ms` }} />
      </CardContent>
    </Card>
  )
}

function MilestoneCardSkeleton({ index }: { index: number }) {
  const icons = [Rocket, TrendingUp, Sparkles, Target]
  const Icon = icons[index]
  const color = sectionThemes.milestones[index]

  return (
    <Card
      className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${800 + index * 120}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`} />
      <CardContent className="relative p-6">
        <div
          className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg mb-4 animate-pulse`}
          style={{ animationDelay: `${index * 120 + 50}ms` }}
        >
          <Icon className="w-6 h-6 text-white/50" />
        </div>
        <div className="h-8 w-16 mb-3 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 100}ms` }} />
        <div className="h-6 w-36 mb-3 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 150}ms` }} />
        <div className="space-y-2">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 200}ms` }} />
          <div className="h-4 w-2/3 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 250}ms` }} />
        </div>
      </CardContent>
    </Card>
  )
}

function ValueCardSkeleton({ index }: { index: number }) {
  const icons = [Lightbulb, Heart, Shield, Trophy]
  const Icon = icons[index]
  const color = sectionThemes.values[index]

  return (
    <Card
      className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${1400 + index * 120}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`} />
      <CardContent className="relative p-8">
        <div className="flex items-start gap-6">
          <div
            className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${color} shadow-lg animate-pulse`}
            style={{ animationDelay: `${index * 120 + 50}ms` }}
          >
            <Icon className="w-8 h-8 text-white/50" />
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-7 w-40 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 100}ms` }} />
            <div className="space-y-2">
              <div className="h-4 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 150}ms` }} />
              <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 120 + 200}ms` }} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function TeamMemberCardSkeleton({ index }: { index: number }) {
  const color = sectionThemes.team[index]

  return (
    <Card
      className="group relative bg-neutral-900/40 backdrop-blur-xl border-white/10 overflow-hidden opacity-0"
      style={{
        animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        animationDelay: `${2000 + index * 100}ms`,
      }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0`} />
      <CardContent className="relative p-6 text-center">
        {/* Avatar */}
        <div
          className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} mx-auto mb-4 flex items-center justify-center text-2xl font-black text-white/50 animate-pulse`}
          style={{ animationDelay: `${index * 100 + 50}ms` }}
        >
          ?
        </div>

        {/* Name */}
        <div className="h-6 w-36 mx-auto mb-1 bg-white/10 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 100}ms` }} />

        {/* Role */}
        <div className="h-4 w-28 mx-auto mb-4 bg-cyan-400/30 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 150}ms` }} />

        {/* Bio */}
        <div className="space-y-2 mb-6">
          <div className="h-4 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 200}ms` }} />
          <div className="h-4 w-3/4 mx-auto bg-white/5 rounded animate-pulse" style={{ animationDelay: `${index * 100 + 250}ms` }} />
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-9 h-9 rounded bg-white/5 animate-pulse"
              style={{ animationDelay: `${index * 100 + 300 + i * 50}ms` }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function SectionHeaderSkeleton({ delay, badgeIcon: BadgeIcon, badgeColor }: { delay: number; badgeIcon: any; badgeColor: string }) {
  const badgeColors = {
    violet: 'bg-violet-500/15 border-violet-500/30',
    emerald: 'bg-emerald-500/15 border-emerald-500/30',
    amber: 'bg-amber-500/15 border-amber-500/30',
  }

  return (
    <div
      className="text-center mb-16 opacity-0"
      style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: `${delay}ms` }}
    >
      {/* Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${badgeColors[badgeColor as keyof typeof badgeColors]} mb-6 animate-pulse`}>
        <BadgeIcon className="w-3.5 h-3.5 opacity-50" />
        <div className="h-4 w-24 bg-current opacity-30 rounded" />
      </div>

      {/* Title */}
      <div className="space-y-2 mb-4">
        <div className="h-10 w-64 mx-auto bg-gradient-to-r from-white/20 via-white/10 to-white/20 rounded animate-pulse" style={{ animationDelay: `${delay + 50}ms` }} />
        <div className="h-10 w-48 mx-auto bg-white/10 rounded animate-pulse" style={{ animationDelay: `${delay + 100}ms` }} />
      </div>

      {/* Description */}
      <div className="h-5 w-80 mx-auto bg-white/5 rounded animate-pulse" style={{ animationDelay: `${delay + 150}ms` }} />
    </div>
  )
}

function CallToActionSkeleton() {
  return (
    <div
      className="relative bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-violet-500/10
      backdrop-blur-xl border border-white/10 rounded-2xl p-12 opacity-0"
      style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards', animationDelay: '2500ms' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-600/5 to-violet-500/5 animate-pulse" />

      <div className="relative max-w-3xl mx-auto text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-gradient-to-br from-orange-500/20 to-rose-600/20 animate-pulse">
            <Flame className="w-12 h-12 text-orange-400/50" />
          </div>
        </div>

        {/* Title */}
        <div className="h-10 w-72 mx-auto bg-white/10 rounded-xl animate-pulse" style={{ animationDelay: '2550ms' }} />

        {/* Description */}
        <div className="space-y-2 mx-auto" style={{ maxWidth: '600px' }}>
          <div className="h-5 w-full bg-white/5 rounded animate-pulse" style={{ animationDelay: '2600ms' }} />
          <div className="h-5 w-3/4 mx-auto bg-white/5 rounded animate-pulse" style={{ animationDelay: '2650ms' }} />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <div className="h-12 w-44 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-lg animate-pulse" style={{ animationDelay: '2700ms' }} />
          <div className="h-12 w-36 border border-white/20 rounded-lg animate-pulse" style={{ animationDelay: '2750ms' }} />
        </div>
      </div>
    </div>
  )
}

export function AboutPageSkeleton() {
  return (
    <>
      <PageBackground />

      {/* Hero Section */}
      <section className="relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-hidden my-10 pt-20 pb-16">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative container mx-auto max-w-7xl px-6">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 opacity-0"
              style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
            >
              <Sparkles className="w-4 h-4 text-cyan-400/50 animate-pulse" />
              <div className="h-4 w-24 bg-cyan-400/30 rounded animate-pulse" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-normal space-y-2 opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 100ms', animationFillMode: 'forwards' }}>
              <div className="h-10 w-40 bg-gradient-to-r from-white/30 via-white/20 to-white/30 rounded animate-pulse mx-auto" />
              <div className="h-10 w-56 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-violet-500/30 rounded animate-pulse mx-auto" />
            </h1>

            {/* Description */}
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto h-6 w-[700px] bg-neutral-700/30 rounded animate-pulse opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 200ms', animationFillMode: 'forwards' }} />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0" style={{ animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards 300ms', animationFillMode: 'forwards' }}>
              <div className="h-12 w-40 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-lg animate-pulse" style={{ animationDelay: '350ms' }} />
              <div className="h-12 w-36 border border-white/20 rounded-lg animate-pulse" style={{ animationDelay: '400ms' }} />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-neutral-950 relative">
        {/* Stats Section */}
        <div className="container mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <StatCardSkeleton key={i} index={i} />
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="border-y border-white/5 bg-neutral-900/20">
          <div className="container mx-auto max-w-7xl px-6 py-24">
            <SectionHeaderSkeleton delay={700} badgeIcon={Calendar} badgeColor="violet" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <MilestoneCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="container mx-auto max-w-7xl px-6 py-24">
          <SectionHeaderSkeleton delay={1300} badgeIcon={Star} badgeColor="emerald" />
          <div className="grid gap-6 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <ValueCardSkeleton key={i} index={i} />
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="border-y border-white/5 bg-neutral-900/20">
          <div className="container mx-auto max-w-7xl px-6 py-24">
            <SectionHeaderSkeleton delay={1900} badgeIcon={Users} badgeColor="amber" />
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <TeamMemberCardSkeleton key={i} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
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
      `}</style>
    </>
  )
}
