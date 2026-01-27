'use client'

import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CampaignsTopbar } from '@/components/layout/campaigns-topbar'

export default function CampaignsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [scrollY, setScrollY] = useState(0)
  const [siteName, setSiteName] = useState('CampaignHub')

  useEffect(() => {
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

      {/* Main Content */}
      <main className="relative">{children}</main>

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
                মজার সব ক্যাম্পেইন আর আকর্ষণীয় পুরষ্কারের মাধ্যমে আপনার প্রতিটি চ্যালেঞ্জকে রূপ দিন সাফল্যে।
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
    </div>
  )
}
