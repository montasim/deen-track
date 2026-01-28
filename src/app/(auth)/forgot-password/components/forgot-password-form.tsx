'use client'

import { HTMLAttributes, useEffect, useState, Suspense, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { OtpInput, ResendButton } from '@/components/ui/otp-input'
import { Card, CardContent } from '@/components/ui/card'
import { Turnstile } from '@/components/ui/turnstile'
import { Loader2 } from 'lucide-react'

type ForgotFormProps = HTMLAttributes<HTMLDivElement>

// Step 1: Email input
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'ইমেইল দিন' })
    .email({ message: 'সঠিক ইমেইল ঠিকানা দিন' }),
})

// Step 2: OTP input
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, { message: 'OTP ৬ ডিজিটের হতে হবে' })
    .max(6, { message: 'OTP ৬ ডিজিটের হতে হবে' })
    .regex(/^\d+$/, { message: 'শুধুমাত্র সংখ্যা দিন' }),
})

// Step 3: New password
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: 'পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে' })
      .regex(/[A-Z]/, { message: 'বড় হাতের অক্ষর থাকতে হবে' })
      .regex(/[a-z]/, { message: 'ছোট হাতের অক্ষর থাকতে হবে' })
      .regex(/[0-9]/, { message: 'সংখ্যা থাকতে হবে' })
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        { message: 'বিশেষ অক্ষর থাকতে হবে' }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "পাসওয়ার্ড মিলছে না",
    path: ['confirmPassword'],
  })

export function ForgotForm({ className, ...props }: ForgotFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const turnstileRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [otpError, setOtpError] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  // Check for email in URL parameters and prefill it
  useEffect(() => {
    const emailFromUrl = searchParams?.get('email')
    if (emailFromUrl) {
      setEmail(emailFromUrl)
      emailForm.setValue('email', emailFromUrl)
    }
  }, [searchParams, emailForm])

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  // Step 1: Send Reset OTP
  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/password-reset/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, turnstileToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'সমস্যা হয়েছে',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      setEmail(data.email)
      setStep('otp')

      toast({
        title: 'কোড পাঠানো হয়েছে 📧',
        description: result.message || 'ইমেইল চেক করুন',
      })
    } catch (error) {
      console.error('Send reset OTP error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP functionality
  async function onResendOtp() {
    setIsResending(true)

    try {
      const response = await fetch('/api/auth/password-reset/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'সমস্যা হয়েছে',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      toast({
        title: 'আবার কোড পাঠানো হয়েছে 📧',
        description: result.message || 'ইমেইল চেক করুন',
      })
    } catch (error) {
      console.error('Resend OTP error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsResending(false)
    }
  }

  // Step 2: Verify OTP
  async function onOtpSubmit(otpCode: string) {
    setIsVerifyingOtp(true)
    setOtpError('')

    try {
      const response = await fetch('/api/auth/password-reset/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const result = await response.json()

      if (!response.ok) {
        setOtpError(result.error || 'ভুল কোড')
        toast({
          variant: 'destructive',
          title: 'ভুল কোড ❌',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      setStep('password')

      toast({
        title: 'সঠিক! ✅',
        description: 'নতুন পাসওয়ার্ড দিন',
      })
    } catch (error) {
      console.error('Verify OTP error:', error)
      setOtpError('সমস্যা হয়েছে, আবার চেষ্টা করুন')
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  // Step 3: Set New Password
  async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'সমস্যা হয়েছে',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      toast({
        title: 'সফল! 🎉',
        description: 'পাসওয়ার্ড রিসেট হয়েছে, নতুন পাসওয়ার্ড দিয়ে লগইন করুন',
      })

      router.push('/auth/sign-in')
    } catch (error) {
      console.error('Reset password error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Render Step 1: Email Input
  if (step === 'email') {
    return (
      <div className={cn('grid gap-4', className)} {...props}>
        <Form {...emailForm}>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
            <div className='grid gap-2'>
              <FormField
                control={emailForm.control}
                name='email'
                render={({ field }) => (
                  <FormItem className='space-y-1'>
                    <FormLabel className="text-neutral-300">ইমেইল</FormLabel>
                    <FormControl>
                      <Input placeholder='your@email.com' className="border-white/10 bg-neutral-900/60 focus:border-cyan-500/50 focus:ring-cyan-500/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex justify-start'>
                <Turnstile
                  ref={turnstileRef}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    setTurnstileToken(null)
                    toast({
                      variant: 'destructive',
                      title: 'CAPTCHA ব্যর্থ হয়েছে',
                      description: 'আবার চেষ্টা করুন',
                    })
                  }}
                  onExpire={() => {
                    setTurnstileToken(null)
                    toast({
                      variant: 'destructive',
                      title: 'CAPTCHA মেয়াদ শেষ',
                      description: 'আবার চেষ্টা করুন',
                    })
                  }}
                />
              </div>
              <Button className='mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25' disabled={isLoading || !turnstileToken}>
                {isLoading ? 'পাঠানো হচ্ছে...' : 'রিসেট কোড পাঠান'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  // Render Step 2: OTP Verification
  if (step === 'otp') {
    return (
      <div className={cn('grid gap-4', className)} {...props}>
        <div>
          <p className='text-sm text-neutral-400'>
            আমরা একটি ৬ ডিজিটের কোড পাঠিয়েছি <span className="text-cyan-400 font-semibold">{email}</span> ঠিকানায় 📧
          </p>
        </div>

        <Card className={cn('bg-neutral-900/60 backdrop-blur-xl border-white/10', otpError ? 'border-red-500' : '')}>
          <CardContent className='p-4 space-y-4'>
            <div className='flex justify-center'>
              <OtpInput
                length={6}
                onComplete={onOtpSubmit}
                error={!!otpError}
                disabled={isVerifyingOtp}
              />
            </div>

            {otpError && (
              <p className='text-sm text-red-400 text-center'>{otpError}</p>
            )}

            <ResendButton
              onResend={onResendOtp}
              isResending={isResending}
              cooldown={60}
            />

            {isVerifyingOtp && (
              <div className='flex items-center justify-center gap-2 text-sm text-muted-foreground'>
                <Loader2 className='h-4 w-4 animate-spin' />
                যাচাই হচ্ছে...
              </div>
            )}
          </CardContent>
        </Card>

        <Button
          type='button'
          variant='ghost'
          onClick={() => setStep('email')}
          className='w-full text-neutral-400 hover:text-white hover:bg-white/5'
        >
          ইমেইলে ফিরে যান
        </Button>
      </div>
    )
  }

  // Render Step 3: New Password
  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={passwordForm.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className="text-neutral-300">নতুন পাসওয়ার্ড</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' className="border-white/10 bg-neutral-900/60 focus:border-cyan-500/50 focus:ring-cyan-500/20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={passwordForm.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className="text-neutral-300">পাসওয়ার্ড আবার দিন</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' className="border-white/10 bg-neutral-900/60 focus:border-cyan-500/50 focus:ring-cyan-500/20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25' disabled={isLoading}>
              {isLoading ? 'রিসেট হচ্ছে...' : 'পাসওয়ার্ড রিসেট করুন'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// Wrapper component with Suspense boundary for useSearchParams
function ForgotFormWithSearchParams(props: ForgotFormProps) {
  return (
    <Suspense fallback={<div className="grid gap-4">Loading...</div>}>
      <ForgotForm {...props} />
    </Suspense>
  )
}

export default ForgotFormWithSearchParams
