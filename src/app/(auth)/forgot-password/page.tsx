'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import AuthLayout from '@/components/auth-layout'
import ForgotForm from './components/forgot-password-form'
import { ROUTES } from '@/lib/routes/client-routes'
import { KeyRound } from 'lucide-react'

export default function ForgotPassword() {
  return (
    <AuthLayout>
      <div className="space-y-6">
        {/* Hero Badge */}
        <div className="text-center">
          <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
            <KeyRound className="w-3 h-3 mr-2" />
            Reset Password
          </Badge>
        </div>

        {/* Main Card */}
        <Card className="relative bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
          {/* Animated Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-600/0 to-violet-500/0 pointer-events-none" />
          <CardContent className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-white mb-3">
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text text-transparent">
                  Forgot Password?
                </span>
              </h1>
              <p className="text-base text-neutral-400 leading-relaxed">
                No worries! We'll send you a reset link
              </p>
            </div>

            {/* Form */}
            <ForgotForm />
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <p className="text-center text-sm text-neutral-400">
          Remember your password?{' '}
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
