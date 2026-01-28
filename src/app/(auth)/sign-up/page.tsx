'use client'

import { useState, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'
import { ROUTES } from '@/lib/routes/client-routes'
import SignUpForm from './components/sign-up-form'
import { useEffect } from 'react'

function SignUpContent() {
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
              নতুন অ্যাকাউন্ট খুলুন 🎉
            </h1>
            <p className='text-sm text-muted-foreground'>
              শুরু করতে তথ্য দিন <br />
              আমাদের সাথে যুক্ত হোন, যাত্রা শুরু করুন! 🚀
            </p>
          </div>
          <SignUpForm />
          <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
            অ্যাকাউন্ট খুললে আপনি আমাদের{' '}
            <a
              href={ROUTES.terms.href}
              className='underline underline-offset-4 hover:text-primary'
            >
              শর্তাবলী
            </a>{' '}
            এবং{' '}
            <a
              href={ROUTES.privacy.href}
              className='underline underline-offset-4 hover:text-primary'
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
