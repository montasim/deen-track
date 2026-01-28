'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { UserAuthForm } from '../components/user-auth-form'
import { ROUTES } from '@/lib/routes/client-routes'
import { PageBackground } from '@/components/layout/page-background'
import { useAuth } from '@/context/auth-context'

function SignInContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [authStep, setAuthStep] = useState<'email' | 'password'>('email')
  const [userEmail, setUserEmail] = useState('')

  // Redirect authenticated users to campaigns page
  useEffect(() => {
    if (user) {
      router.push('/campaigns')
    }
  }, [user, router])

  const handleStepChange = (step: 'email' | 'password', email?: string) => {
    setAuthStep(step)
    if (email) setUserEmail(email)
  }

  return (
    <div className="bg-neutral-950 text-white relative">
      <PageBackground />
      <div className="relative container mx-auto max-w-7xl flex items-center justify-center">
        <div className="w-full max-w-md mx-auto p-8 bg-neutral-900/40 backdrop-blur-xl border-white/10">
          <div className='flex flex-col space-y-2 text-left mb-6'>
            <h1 className='text-2xl font-bold tracking-tight text-white'>
              {authStep === 'email' ? 'স্বাগতম!' : 'আবার দেখা হলো!'}
            </h1>
            <p className='text-sm text-neutral-400'>
              {authStep === 'email' ? (
                <>
                  ইমেইল দিন শুরু করতে <br />
                  আপনার অ্যাকাউন্ট আছে কিনা আমরা দেখে নেবো
                </>
              ) : (
                <>
                  পাসওটার্ড দিন এগিয়ে যেতে <br />
                  স্বাগতম, <strong className="text-white">{userEmail}</strong>
                </>
              )}
            </p>
          </div>
          <UserAuthForm onStepChange={handleStepChange} />
          <p className='mt-6 px-8 text-center text-sm text-neutral-400'>
            লগইন করলে আপনি আমাদের{' '}
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
        </div>
      </div>
    </div>
  )
}

export default function SignIn() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center">Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
