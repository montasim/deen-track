'use client'

import { useState, Suspense } from 'react'
import { Card } from '@/components/ui/card'
import { UserAuthForm } from '../components/user-auth-form'
import { ROUTES } from '@/lib/routes/client-routes'

function SignInContent() {
    const [authStep, setAuthStep] = useState<'email' | 'password'>('email')
    const [userEmail, setUserEmail] = useState('')

    const handleStepChange = (step: 'email' | 'password', email?: string) => {
        setAuthStep(step)
        if (email) setUserEmail(email)
    }

    return (
        <Card className='m-4 p-4'>
            <div className='flex flex-col space-y-2 text-left mb-4'>
                <h1 className='text-xl font-semibold tracking-tight'>
                    {authStep === 'email' ? 'স্বাগতম! 👋' : 'আবার দেখা হলো!'}
                </h1>
                <p className='text-sm text-muted-foreground'>
                    {authStep === 'email' ? (
                        <>
                            ইমেইল দিন শুরু করতে <br />
                            আপনার অ্যাকাউন্ট আছে কিনা আমরা দেখে নেবো 😊
                        </>
                    ) : (
                        <>
                            পাসওয়ার্ড দিন এগিয়ে যেতে <br />
                            স্বাগতম, <strong>{userEmail}</strong> 🎉
                        </>
                    )}
                </p>
            </div>
            <UserAuthForm onStepChange={handleStepChange} />
            <p className='mt-4 px-8 text-center text-sm text-muted-foreground'>
                লগইন করলে আপনি আমাদের{' '}
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
    )
}

export default function SignIn() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
            <SignInContent />
        </Suspense>
    )
}