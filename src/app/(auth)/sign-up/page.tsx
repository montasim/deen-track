'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'
import SignUpForm from './components/sign-up-form'
import { PageBackground } from '@/components/layout/page-background'
import { useAuth } from '@/context/auth-context'

function SignUpContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [siteName, setSiteName] = useState('CampaignHub')

  // Redirect authenticated users to campaigns page
  useEffect(() => {
    if (user) {
      router.push('/campaigns')
    }
  }, [user, router])

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
              নতুন অ্যাকাউন্ট খুলুন
            </h1>
            <p className='text-sm text-neutral-400'>
              শুরু করতে তথ্য দিন <br />
              আমাদের সাথে যুক্ত হোন, যাত্রা শুরু করুন!
            </p>
          </div>
          <SignUpForm />
          <p className='mt-6 px-8 text-center text-sm text-neutral-400'>
            অ্যাকাউন্ট খুললে আপনি আমাদের{' '}
            <a
              href={ROUTES.terms.href}
              className='text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors'
            >
              শর্তাবলী
            </a>{' '}
            এবং{' '}
            <a
              href={ROUTES.privacy.href}
              className='text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors'
            >
              গোপনীয়তা নীতি
            </a>
            মেনে চলতে সম্মত হচ্ছেন।
          </p>
        </Card>
      </div>
    </div>
  )
}

export default function SignUp() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <SignUpContent />
    </Suspense>
  )
}
