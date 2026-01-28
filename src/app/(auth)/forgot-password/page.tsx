'use client'

import { useState, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'
import ForgotForm from './components/forgot-password-form'
import Link from 'next/link'
import { useEffect } from 'react'

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
    <div className='container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0'>
      <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8'>
        <div className='mb-4 flex items-center justify-center gap-2'>
          <BookOpen />
          <h1 className='text-xl font-medium'>{siteName}</h1>
        </div>
        <Card className='m-4 p-4'>
          <div className='flex flex-col space-y-2 text-left mb-4'>
            <h1 className='text-xl font-semibold tracking-tight'>
              পাসওয়ার্ড ভুলে গেছেন? 🤔
            </h1>
            <p className='text-sm text-muted-foreground'>
              কোনো সমস্যা নেই! রিসেট লিংক পাঠাবো <br />
              ইমেইল দিলেই হবে 😊
            </p>
          </div>
          <ForgotForm />
          <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
            পাসওয়ার্ড মনে আছে?{' '}
            <Link
              href={ROUTES.signIn.href}
              className='underline underline-offset-4 hover:text-primary'
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
