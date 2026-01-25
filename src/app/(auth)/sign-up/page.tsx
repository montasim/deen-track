'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AuthLayout from '@/components/auth-layout'
import SignUpForm from './components/sign-up-form'
import { ROUTES } from '@/lib/routes/client-routes'
import { Shield } from 'lucide-react'

export default function SignUp() {
  return (
    <AuthLayout>
      <div className="space-y-6">

        {/* Main Card */}
        <Card className="relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-600/0 to-violet-500/0 pointer-events-none" />
          <CardContent className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-3">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Join the Community
                </span>
              </h1>
              <p className="text-base text-neutral-400 leading-relaxed">
                Start your journey with us today
              </p>
            </div>

            {/* Form */}
            <SignUpForm />

            {/* Terms */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="px-2 text-center text-xs text-neutral-500 leading-relaxed">
                By creating an account, you agree to our{' '}
                <Link
                  href={ROUTES.terms.href}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href={ROUTES.privacy.href}
                  className="text-cyan-400 hover:text-cyan-300 underline underline-offset-4 transition-colors"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <p className="text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link
            href={ROUTES.signIn.href}
            className="font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  )
}
