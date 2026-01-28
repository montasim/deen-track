'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { ArrowRight, Lock, Star, Trophy, TrendingUp, Users } from 'lucide-react'
import { ReactNode } from 'react'

export interface AuthPromptFeature {
    icon: LucideIcon
    text: string
}

export interface AuthPromptProps {
    /**
     * Title displayed at the top of the card
     */
    title: string

    /**
     * Description text explaining why auth is required
     */
    description: string

    /**
     * Icon to display in the circle above the title
     * @default Lock
     */
    icon?: LucideIcon

    /**
     * Features to display at the bottom of the card
     * @default [{ icon: Star, text: 'বিনামূল্যে শুরু করুন' }, { icon: Trophy, text: 'পুরস্কার জিতুন' }, { icon: Users, text: 'সম্প্রদায়ের সাথে যোগ দিন' }]
     */
    features?: AuthPromptFeature[]

    /**
     * Children to render as blurred background content
     */
    children: ReactNode
}

const defaultFeatures: AuthPromptFeature[] = [
    { icon: Star, text: 'বিনামূল্যে শুরু করুন' },
    { icon: Trophy, text: 'পুরস্কার জিতুন' },
    { icon: Users, text: 'সম্প্রদায়ের সাথে যোগ দিন' },
]

export function AuthPrompt({
    title,
    description,
    icon: Icon = Lock,
    features = defaultFeatures,
    children,
}: AuthPromptProps) {
    return (
        <>
            {/* Background Content - Blurred */}
            <div className="blur-sm pointer-events-none select-none">
                {children}
            </div>

            {/* Overlay */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-neutral-950/60 backdrop-blur-sm">
                {/* Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/10 to-violet-600/20 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
                    <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 bottom-0 right-0 animate-pulse delay-1000" />
                </div>

                <Card className="relative max-w-2xl w-full bg-neutral-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                    {/* Gradient border effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-600/10 to-violet-600/20 opacity-50" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />

                    <CardContent className="relative p-12 text-center">
                        {/* Icon */}
                        <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 mb-8">
                            <Icon className="w-16 h-16 text-cyan-400" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-black text-white mb-4">{title}</h2>

                        {/* Description */}
                        <p className="text-lg text-neutral-400 mb-8 max-w-md mx-auto leading-relaxed">
                            {description}
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-base px-6 py-3 h-auto font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all w-full sm:w-auto"
                            >
                                <Link href="/auth/sign-in" className="gap-2">
                                    লগইন করুন
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/5 hover:border-white/30 text-base px-6 py-3 h-auto backdrop-blur-sm w-full sm:w-auto"
                            >
                                <Link href="/sign-up">অ্যাকাউন্ট তৈরি করুন</Link>
                            </Button>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-neutral-400">
                            {features.map((feature, index) => {
                                const FeatureIcon = feature.icon
                                return (
                                    <div key={index} className="flex items-center gap-2">
                                        <FeatureIcon className="w-4 h-4 text-yellow-400" />
                                        <span>{feature.text}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
