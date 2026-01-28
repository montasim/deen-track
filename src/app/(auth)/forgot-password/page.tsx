'use client'

import { useState, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'
import ForgotForm from './components/forgot-password-form'
import Link from 'next/link'
import { useEffect } from 'react'
import { PageBackground } from '@/components/layout/page-background'

function ForgotPasswordContent() {
  const [siteName, setSiteName] = useState('CampaignHub')

  useEffect(() => {
    fetch('/api/public/site/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.siteName) {
          setSiteName(data.data.siteName)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white relative">
      <PageBackground />
      <div className="relative container mx-auto max-w-7xl px-6 pt-12 pb-24 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto p-8 bg-neutral-900/40 backdrop-blur-xl border-white/10">
          <div className='mb-4 flex items-center justify-center gap-2 mb-6'>
            <BookOpen className="w-8 h-8 text-cyan-400" />
            <h1 className='text-2xl font-bold text-white'>{siteName}</h1>
          </div>
          <div className='flex flex-col space-y-2 text-left mb-6'>
            <h1 className='text-2xl font-bold tracking-tight text-white'>
              পাসওযার্ড ভুলে গেছেন?
            </h1>
            <p className='text-sm text-neutral-400'>
              কোনো সমস্যা নেই! রিসেট লিংক পাঠাবো <br />
              ইমেইল দিলেই হবে
            </p>
          </div>
          <ForgotForm />
          <p className='mt-6 px-8 text-center text-sm text-neutral-400'>
            পাসওযার্ড মনে আছে?{' '}
            <Link
              href={ROUTES.signIn.href}
              className='text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors'
            >
              লগইন করুন
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function ForgotPassword() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  )
}
