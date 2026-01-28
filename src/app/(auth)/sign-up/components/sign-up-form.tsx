'use client'

import { HTMLAttributes, useState, Suspense, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconBrandFacebook, IconBrandGithub } from '@tabler/icons-react'
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
import { Loader2, Mail } from 'lucide-react'

import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import { useEffect } from 'react'
import { ROUTES } from '@/lib/routes/client-routes'

type SignUpFormProps = HTMLAttributes<HTMLDivElement>

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

// Step 3: Account details
const detailsSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: 'নাম দিন' })
      .max(100, { message: 'নাম খুব বড় হয়ে গেছে' }),
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

const Header = () => null // Header is now handled by the parent component

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const turnstileRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'otp' | 'details'>('email')
  const [email, setEmail] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [otpExpiresAt, setOtpExpiresAt] = useState<string>('')
  const [showResend, setShowResend] = useState(false)
  const [resendSuccessful, setResendSuccessful] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [otpCode, setOtpCode] = useState('')

  // Get prefilled data from query parameters
  const prefilledEmail = searchParams?.get('email') || ''
  const inviteToken = searchParams?.get('token') || ''

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: prefilledEmail },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  })

  const detailsForm = useForm<z.infer<typeof detailsSchema>>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      name: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  })

  // Step 1: Send OTP
  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, inviteToken, turnstileToken }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error === 'INVITE_USED') {
          setShowResend(true)
          toast({
            variant: 'destructive',
            title: 'আমন্ত্রণ মেয়াদ শেষ',
            description: 'এই আমন্ত্রণ লিংকটি আর কাজ করে না',
          })
        } else if (result.error?.toLowerCase().includes('already exists')) {
          // Redirect to sign-in page if email already exists
          toast({
            title: 'অ্যাকাউন্ট আছে!',
            description: 'এই ইমেইলে অ্যাকাউন্ট আছে, লগইনে নিচ্ছেন...',
          })
          setTimeout(() => {
            router.push(ROUTES.signIn.href)
          }, 1500)
        } else {
          toast({
            variant: 'destructive',
            title: 'সমস্যা হয়েছে',
            description: result.error || 'আবার চেষ্টা করুন',
          })
        }
        return
      }

      setEmail(data.email)
      setOtpExpiresAt(result.expiresAt)

      if (result.sessionCreated) {
        detailsForm.reset({
          name: '',
          password: '',
          confirmPassword: '',
        })
        setStep('details')
        toast({
          title: 'ঠিক আছে!',
          description: 'এখন আপনার তথ্য দিন',
        })
      } else {
        setStep('otp')
        toast({
          title: 'OTP পাঠানো হয়েছে',
          description: 'ইমেইল চেক করুন',
        })
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-submit if email is prefilled
  useEffect(() => {
    if (prefilledEmail && !isLoading) {
      setEmail(prefilledEmail)
      // Auto-submit to send OTP
      onEmailSubmit({ email: prefilledEmail })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilledEmail])

  // Step 2: Verify OTP
  async function onOtpSubmit(otpCode: string) {
    setIsVerifyingOtp(true)
    setOtpError('')

    try {
      const response = await fetch('/api/auth/register/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: otpCode }),
      })

      const result = await response.json()

      if (!response.ok) {
        setOtpError(result.error || 'OTP ভুল হয়েছে')
        toast({
          variant: 'destructive',
          title: 'ভুল OTP',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      detailsForm.reset({
        name: '',
        password: '',
        confirmPassword: '',
      })
      setStep('details')

      toast({
        title: 'সঠিক!',
        description: 'এখন আপনার তথ্য পূরণ করুন',
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

  // Resend OTP
  async function handleResendOtp() {
    setIsSendingOtp(true)
    setOtpError('')

    try {
      const response = await fetch('/api/auth/register/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, inviteToken }),
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

      setOtpExpiresAt(result.expiresAt)
      toast({
        title: 'OTP পাঠানো হয়েছে',
        description: 'ইমেইল চেক করুন',
      })
    } catch (error) {
      console.error('Send OTP error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsSendingOtp(false)
    }
  }

  // Step 3: Create Account
  async function onDetailsSubmit(data: z.infer<typeof detailsSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: data.name,
          password: data.password,
          inviteToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'অ্যাকাউন্ট বানানো যায়নি',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      toast({
        title: 'সফল!',
        description: 'অ্যাকাউন্ট তৈরি হয়ে গেছে',
      })

      router.push(ROUTES.settings.href)
      router.refresh()
    } catch (error) {
      console.error('Create account error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Render Resend State
  if (showResend) {
    // Show success state after resend
    if (resendSuccessful) {
      return (
        <div className={cn('grid gap-4', className)} {...props}>
          <div className='mb-2 flex flex-col space-y-2 text-left'>
            <h1 className='text-lg font-semibold tracking-tight'>
              আমন্ত্রণ পাঠানো হয়েছে!
            </h1>
            <p className='text-sm text-green-600'>
              নতুন আমন্ত্রণ লিংক পাঠানো হয়েছে।
            </p>
            <p className='text-sm text-muted-foreground'>
              ইমেইল ইনবক্স (এবং স্প্যাম ফোল্ডার) চেক করুন।
              লিংকটি ২৪ ঘণ্টার জন্য বৈধ থাকবে।
            </p>
          </div>
          <div className=''>
            <p className='text-xs text-muted-foreground mb-4'>
              ইমেইল পাননি? স্প্যাম ফোল্ডার চেক করুন।
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setShowResend(false)
                setResendSuccessful(false)
              }}
            >
              সাইন-আপে ফিরে যান
            </Button>
          </div>
        </div>
      )
    }

    // Show resend option
    return (
      <div className={cn('grid gap-4', className)} {...props}>
        <div className='mb-2 flex flex-col space-y-2 text-left'>
          <h1 className='text-lg font-semibold tracking-tight'>
            অ্যাকাউন্ট বানান
          </h1>
          <p className='text-sm text-destructive'>এই আমন্ত্রণ লিংকটি আর কাজ করে না।</p>
          <p className='text-sm text-muted-foreground'>
            নতুন আমন্ত্রণ চান?
          </p>
        </div>
        <Button
          className="w-full"
          onClick={async () => {
            setIsLoading(true)
            try {
              const res = await fetch('/api/auth/invite/resend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: inviteToken }),
              })
              const data = await res.json()
              if (res.ok) {
                setResendSuccessful(true)
                toast({
                  title: 'আমন্ত্রণ পাঠানো হয়েছে!',
                  description: 'ইমেইল চেক করুন',
                })
              } else {
                toast({
                  variant: 'destructive',
                  title: 'সমস্যা হয়েছে',
                  description: data.error,
                })
              }
            } catch (e) {
              toast({ variant: 'destructive', title: 'সমস্যা হয়েছে', description: 'আবার চেষ্টা করুন' })
            } finally {
              setIsLoading(false)
            }
          }}
          disabled={isLoading}
        >
          {isLoading ? 'পাঠানো হচ্ছে...' : 'আবার পাঠান'}
        </Button>
      </div>
    )
  }

  // Render Step 1: Email Input
  if (step === 'email') {
    return (
      <div className={cn('grid gap-4', className)} {...props}>
        <Header />
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
                {isLoading ? 'পাঠানো হচ্ছে...' : 'এগিয়ে যান'}
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
        <Header />
        <div className='mb-4'>
          <p className='text-sm text-neutral-400'>
            আমরা একটি ৬ ডিজিটের কোড পাঠিয়েছি <span className="text-cyan-400 font-semibold">{email}</span> ঠিকানায়
          </p>
        </div>

        <Card className={cn('bg-neutral-900/60 backdrop-blur-xl border-white/10', otpError ? 'border-red-500' : '')}>
          <CardContent className='pt-6 space-y-4'>
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
              onResend={handleResendOtp}
              isResending={isSendingOtp}
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

  // Render Step 3: Account Details
  return (
    <div className={cn('grid gap-4', className)} {...props}>
      <Header />
      <Form {...detailsForm}>
        <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} key="details-form">
          <div className='grid gap-2'>
            <FormField
              control={detailsForm.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className="text-neutral-300">নাম</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='আপনার নাম'
                      autoComplete='name'
                      className="border-white/10 bg-neutral-900/60 focus:border-cyan-500/50 focus:ring-cyan-500/20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={detailsForm.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel className="text-neutral-300">পাসওয়ার্ড</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' className="border-white/10 bg-neutral-900/60 focus:border-cyan-500/50 focus:ring-cyan-500/20" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={detailsForm.control}
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
              {isLoading ? 'তৈরি হচ্ছে...' : 'অ্যাকাউন্ট তৈরি করুন'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

// Wrapper component with Suspense boundary for useSearchParams
function SignUpFormWithSearchParams(props: SignUpFormProps) {
  return (
    <Suspense fallback={<div className="grid gap-4">Loading...</div>}>
      <SignUpForm {...props} />
    </Suspense>
  )
}

export default SignUpFormWithSearchParams
