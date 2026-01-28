'use client'

import { HTMLAttributes, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/context/auth-context'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
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
import { Turnstile } from '@/components/ui/turnstile'

type UserAuthFormProps = HTMLAttributes<HTMLDivElement> & {
  onStepChange?: (step: 'email' | 'password', email?: string) => void
}

// Step 1: Email validation schema
const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'ইমেইল দিন' })
    .email({ message: 'সঠিক ইমেইল ঠিকানা দিন' }),
})

// Step 2: Password validation schema
const passwordSchema = z.object({
  password: z
    .string()
    .min(1, {
      message: 'পাসওয়ার্ড দিন',
    }),
})

export function UserAuthForm({ className, onStepChange }: UserAuthFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refreshUser } = useAuth()
  const turnstileRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [email, setEmail] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  })

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '' },
  })

  // Step 1: Check if email exists
  async function onEmailSubmit(data: z.infer<typeof emailSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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

      if (result.exists) {
        // Email exists - proceed to password step
        setEmail(data.email)
        setStep('password')
        onStepChange?.('password', data.email)
        toast({
          title: 'অ্যাকাউন্ট পাওয়া গেছে!',
          description: 'পাসওয়ার্ড দিন লগইন করতে',
        })
      } else {
        // Email doesn't exist - redirect to sign-up with pre-filled email
        toast({
          title: 'নতুন অ্যাকাউন্ট!',
          description: 'অ্যাকাউন্ট নেই, নতুন বানাতে নিচ্ছেন...',
        })
        // Redirect to sign-up with email as query parameter
        router.push(`/sign-up?email=${encodeURIComponent(data.email)}`)
      }
    } catch (error) {
      console.error('Check email error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: Login with password
  async function onPasswordSubmit(data: z.infer<typeof passwordSchema>) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password: data.password,
          turnstileToken,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'লগইন হয়নি',
          description: result.error || 'পাসওয়ার্ড ভুল হয়েছে',
        })
        return
      }

      // Success - show success message and redirect based on role
      toast({
        title: 'স্বাগতম!',
        description: 'লগইন সফল হয়েছে',
      })

      // Refresh user context to get the latest user data
      await refreshUser()

      // Redirect based on user role
      if (result.user?.role === 'USER') {
        router.push('/campaigns') // Regular users go to campaigns page
      } else if (result.user?.role === 'ADMIN' || result.user?.role === 'SUPER_ADMIN') {
        router.push('/dashboard') // Admins go to dashboard
      } else {
        router.push('/dashboard') // Default to dashboard
      }
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const goBackToEmail = () => {
    setStep('email')
    onStepChange?.('email')
    passwordForm.reset()
  }

  // Social login handler
  async function handleSocialLogin(provider: 'google' | 'github') {
    setIsLoading(true)
    try {
      // Get redirect and connect parameters from current URL
      const urlParams = new URLSearchParams(window.location.search)
      const redirect = urlParams.get('redirect')
      const connect = urlParams.get('connect')

      // Redirect to OAuth endpoint
      const response = await fetch(`/api/auth/oauth/${provider}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ redirect, connect }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast({
          variant: 'destructive',
          title: 'OAuth সমস্যা',
          description: result.error || 'আবার চেষ্টা করুন',
        })
        return
      }

      // Redirect to OAuth provider
      window.location.href = result.url
    } catch (error) {
      console.error('OAuth error:', error)
      toast({
        variant: 'destructive',
        title: 'সমস্যা হয়েছে',
        description: 'আবার চেষ্টা করুন',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-trigger OAuth flow if 'connect' parameter is present
  useEffect(() => {
    const connect = searchParams.get('connect')
    if (connect && (connect === 'google' || connect === 'github') && !isLoading) {
      // Auto-trigger the OAuth flow
      handleSocialLogin(connect as 'google' | 'github')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Render Step 1: Email Input
  if (step === 'email') {
    return (
      <div className={cn('grid gap-4', className)}>
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
              <Button className='mt-4 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25' disabled={isLoading}>
                {isLoading ? 'চেক হচ্ছে...' : 'এগিয়ে যান'}
              </Button>

              <div className='relative my-4'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-white/10' />
                </div>
                <div className='relative flex justify-center text-xs uppercase'>
                  <span className='bg-neutral-900 px-2 text-neutral-500'>
                    অথবা চালু করুন
                  </span>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <Button
                  variant='outline'
                  className='border-white/10 hover:bg-white/5 hover:border-white/20 text-white w-full'
                  type='button'
                  disabled={isLoading}
                  onClick={() => handleSocialLogin('google')}
                >
                  <IconBrandGoogle className='h-4 w-4 mr-2' /> Google
                </Button>
                <Button
                  variant='outline'
                  className='border-white/10 hover:bg-white/5 hover:border-white/20 text-white w-full'
                  type='button'
                  disabled={isLoading}
                  onClick={() => handleSocialLogin('github')}
                >
                  <IconBrandGithub className='h-4 w-4 mr-2' /> GitHub
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    )
  }

  // Render Step 2: Password Input
  return (
    <div className={cn('grid gap-4', className)}>
      <div className='mb-4 sr-only'>
        <p className='text-sm text-muted-foreground'>
          Welcome back, <strong>{email}</strong>
        </p>
      </div>
      <Form {...passwordForm}>
        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
          <div className='grid gap-2'>
            <FormField
              control={passwordForm.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel className="text-neutral-300">পাসওয়ার্ড</FormLabel>
                    <Link
                      href={`/forgot-password?email=${encodeURIComponent(email)}`}
                      className='text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors'
                    >
                      পাসওয়ার্ড ভুলে গেছেন?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='আপনার পাসওয়ার্ড দিন' className="border-white/10 bg-neutral-900/60 focus:border-cyan-500/50 focus:ring-cyan-500/20" {...field} />
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
              {isLoading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
            </Button>
            <Button
              type='button'
              variant='ghost'
              onClick={goBackToEmail}
              className='mt-3 w-full text-neutral-400 hover:text-white hover:bg-white/5'
            >
              ইমেইলে ফিরে যান
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
