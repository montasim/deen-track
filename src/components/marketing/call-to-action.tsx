import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface CallToActionProps {
  /**
   * Icon component to display above the title (from lucide-react)
   */
  icon?: LucideIcon
  /**
   * Optional badge text
   */
  badgeText?: string
  /**
   * Badge color scheme (defaults to cyan)
   */
  badgeColor?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose'
  /**
   * Main title/heading
   */
  title: string
  /**
   * Description/subtitle text
   */
  description: string
  /**
   * Primary button href
   */
  primaryButtonHref: string
  /**
   * Primary button text
   */
  primaryButtonText: string
  /**
   * Optional icon for primary button
   */
  primaryButtonIcon?: LucideIcon
  /**
   * Optional secondary button href
   */
  secondaryButtonHref?: string
  /**
   * Optional secondary button text
   */
  secondaryButtonText?: string
  /**
   * Optional icon for secondary button
   */
  secondaryButtonIcon?: LucideIcon
  /**
   * Optional extra content to display below buttons (e.g., benefits list)
   */
  extraContent?: ReactNode
  /**
   * Additional CSS classes for the section
   */
  className?: string
  /**
   * Background color variant (defaults to neutral-900/20)
   */
  background?: 'neutral' | 'transparent'
}

const badgeColors = {
  cyan: {
    bg: 'bg-cyan-500/20',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
  },
  emerald: {
    bg: 'bg-emerald-500/20',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
  },
  violet: {
    bg: 'bg-violet-500/20',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
  },
  amber: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
  },
  rose: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
  },
}

export function CallToAction({
  icon: Icon,
  badgeText,
  badgeColor = 'cyan',
  title,
  description,
  primaryButtonHref,
  primaryButtonText,
  primaryButtonIcon: PrimaryButtonIcon,
  secondaryButtonHref,
  secondaryButtonText,
  secondaryButtonIcon: SecondaryButtonIcon,
  extraContent,
  className,
  background = 'neutral',
}: CallToActionProps) {
  const colors = badgeColors[badgeColor]
  const bgClass = background === 'neutral' ? 'bg-neutral-900/20' : ''

  return (
    <div className={`border-t border-white/5 ${bgClass} ${className}`}>
      <div className="container mx-auto max-w-5xl px-6 py-20 lg:py-24">
        <Card className="relative overflow-hidden bg-neutral-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all duration-500">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:48px_48px]" />

          {/* Animated Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-600/5 to-violet-500/10" />

          <CardContent className="relative p-12 lg:p-16 text-center">
            {/* Optional Icon */}
            {Icon && (
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25 mb-6">
                <Icon className="w-10 h-12 text-white" />
              </div>
            )}

            {/* Optional Badge */}
            {badgeText && (
              <Badge className="mb-6 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border-cyan-500/30">
                {badgeText}
              </Badge>
            )}

            {/* Title */}
            <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-6">
              {title}
            </h2>

            {/* Description */}
            <p className="text-base text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Button
                asChild
                size="default"
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-sm px-6 py-5 h-auto font-semibold shadow-lg shadow-cyan-500/25"
              >
                <Link href={primaryButtonHref} className="gap-2">
                  {primaryButtonText}
                  {PrimaryButtonIcon && <PrimaryButtonIcon className="w-4 h-4" />}
                </Link>
              </Button>

              {secondaryButtonHref && secondaryButtonText && (
                <Button
                  asChild
                  size="default"
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/5 text-sm px-6 py-5 h-auto backdrop-blur-sm"
                >
                  <Link href={secondaryButtonHref} className="gap-2">
                    {secondaryButtonText}
                    {SecondaryButtonIcon && <SecondaryButtonIcon className="w-4 h-4" />}
                  </Link>
                </Button>
              )}
            </div>

            {/* Extra Content */}
            {extraContent && <div>{extraContent}</div>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
