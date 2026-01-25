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
              Create your account
            </h1>
            <p className='text-sm text-muted-foreground'>
              Enter your details to get started <br />
              Join our community and start your journey
            </p>
          </div>
          <SignUpForm />
          <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
            By creating an account, you agree to our{' '}
            <a
              href={ROUTES.terms.href}
              className='underline underline-offset-4 hover:text-primary'
            >
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href={ROUTES.privacy.href}
              className='underline underline-offset-4 hover:text-primary'
            >
              Privacy Policy
            </a>
            .
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
