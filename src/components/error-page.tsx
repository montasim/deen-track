'use client'

import { ReactNode, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CampaignsTopbar } from '@/components/layout/campaigns-topbar'
import {
  Ghost,
  AlertTriangle,
  Lock,
  Server,
  ArrowRight,
  Home,
  RefreshCw,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'

export interface ErrorPageConfig {
  /** Error code to display (e.g., 404, 401, 403, 500) */
  code: string | number
  /** Title of the error */
  title: string
  /** Description of the error */
  description: ReactNode
  /** Primary button configuration */
  primaryButton: {
    label: string
    onClick: () => void
  }
  /** Secondary button configuration */
  secondaryButton?: {
    label: string
    onClick: () => void
  }
}

interface ErrorPageProps {
  config: ErrorPageConfig
}

const errorIcons = {
  '404': Ghost,
  '401': Lock,
  '403': Lock,
  '500': Server,
}

const errorGradients = {
  '404': 'from-violet-500 via-purple-600 to-indigo-600',
  '401': 'from-amber-500 via-orange-600 to-red-600',
  '403': 'from-red-500 via-rose-600 to-pink-600',
  '500': 'from-cyan-500 via-blue-600 to-violet-600',
}

export function ErrorPage({ config }: ErrorPageProps) {
  const { code, title, description, primaryButton, secondaryButton } = config
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const errorCode = String(code)
  const ErrorIcon = errorIcons[errorCode as keyof typeof errorIcons] || AlertTriangle
  const gradient = errorGradients[errorCode as keyof typeof errorGradients] || 'from-cyan-500 via-blue-600 to-violet-600'

  useEffect(() => {
    setMounted(true)
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333308_1px,transparent_1px),linear-gradient(to_bottom,#33333308_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* Animated Gradient Orbs */}
        <div
          className="absolute w-[1000px] h-[1000px] bg-gradient-to-br from-cyan-500/25 via-blue-600/20 to-violet-600/25 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
          style={{
            left: '20%',
            top: '10%',
            transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)`,
          }}
        />
        <div
          className={`absolute w-[800px] h-[800px] bg-gradient-to-tr ${gradient} rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out`}
          style={{
            right: '15%',
            bottom: '20%',
            transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-700 ease-out"
          style={{
            left: '50%',
            top: '50%',
            transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)`,
          }}
        />
      </div>

      {/* Navigation */}
      <CampaignsTopbar siteName="CampaignHub" />

      {/* Main Error Content */}
      <main className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 pb-12">
        <div className="text-center max-w-3xl mx-auto">
          {/* Error Code Badge */}
          <div
            className={`inline-flex items-center gap-3 mb-6 sm:mb-8 transition-all duration-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <div className={`relative`}>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-2xl blur-xl opacity-50 animate-pulse`}
              />
              <div
                className={`relative inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl border border-white/20`}
              >
                <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-lg">{errorCode}</span>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div
            className={`inline-flex p-4 sm:p-6 rounded-full bg-gradient-to-br ${gradient} shadow-2xl shadow-cyan-500/30 mb-6 sm:mb-8 transition-all duration-1000 delay-200 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <ErrorIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>

          {/* Title */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-5xl font-black leading-[0.95] tracking-tight mb-4 sm:mb-6 transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block text-white">{title}</span>
          </h1>

          {/* Description */}
          <p
            className={`text-base sm:text-lg md:text-xl text-neutral-400 leading-relaxed mb-8 sm:mb-12 px-2 sm:px-0 transition-all duration-1000 delay-500 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {description}
          </p>

          {/* Action Buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center transition-all duration-1000 delay-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {secondaryButton && (
              <Button
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 backdrop-blur-sm"
                size="default"
                onClick={secondaryButton.onClick}
              >
                {secondaryButton.label === 'Go Back' && <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
                {secondaryButton.label}
              </Button>
            )}
            <Button
              className={`bg-gradient-to-r ${gradient.replace('via-', 'to-')} hover:opacity-90 text-white font-semibold shadow-lg shadow-cyan-500/25 transition-all`}
              size="default"
              onClick={primaryButton.onClick}
            >
              {primaryButton.label === 'Back to Home' && <Home className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {primaryButton.label === 'Try Again' && <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />}
              {primaryButton.label}
              {primaryButton.label === 'Back to Home' && <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />}
            </Button>
          </div>

          {/* Helpful Suggestions */}
          <div
            className={`mt-12 sm:mt-16 transition-all duration-1000 delay-1000 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-4 sm:mb-6">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-xs sm:text-sm font-medium text-cyan-300">What you can do</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mx-auto">
              <div className="p-3 sm:p-4 rounded-xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                <p className="text-xs sm:text-sm text-neutral-400">Check the URL for typos</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                <p className="text-xs sm:text-sm text-neutral-400">Go back to the previous page</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all">
                <p className="text-xs sm:text-sm text-neutral-400">Return to the homepage</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative py-8 border-t border-white/5 bg-neutral-900/30">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-neutral-500">
            Need help? <Link href="/contact" className="text-cyan-400 hover:text-cyan-300 transition-colors">Contact Support</Link>
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  )
}
