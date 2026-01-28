import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { AnimatedHeroBackground } from './animated-hero-background'

export interface PageHeaderProps {
  /**
   * Badge icon component (from lucide-react)
   */
  badgeIcon?: LucideIcon
  /**
   * Badge text
   */
  badgeText?: string
  /**
   * Badge color scheme (defaults to cyan)
   */
  badgeColor?: 'cyan' | 'emerald' | 'violet' | 'amber' | 'rose'
  /**
   * Main title - can be a string or React node for complex gradients
   */
  title: ReactNode
  /**
   * Description/subtitle text
   */
  description?: string
  /**
   * Optional actions/buttons to display below description
   */
  actions?: ReactNode
  /**
   * Extra content to display at the bottom (e.g., effective date badge)
   */
  extraContent?: ReactNode
  /**
   * Additional CSS classes for the section
   */
  className?: string
  /**
   * Padding for the section (defaults to pt-20)
   */
  padding?: 'pt-20' | 'py-24' | 'py-32'
}

const badgeColors = {
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-300',
    border: 'border-cyan-500/30',
    icon: 'text-cyan-400',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-300',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-300',
    border: 'border-violet-500/30',
    icon: 'text-violet-400',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-300',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-300',
    border: 'border-rose-500/30',
    icon: 'text-rose-400',
  },
}

export function PageHeader({
  badgeIcon: BadgeIcon,
  badgeText,
  badgeColor = 'cyan',
  title,
  description,
  actions,
  extraContent,
  className,
  padding = 'pt-20',
}: PageHeaderProps) {
  const colors = badgeColors[badgeColor]

  return (
    <section
      className={cn(
        'relative border-b border-white/5 bg-neutral-900/30 backdrop-blur-xl overflow-x-hidden my-10 py-10',
        padding,
        className
      )}
    >
      {/* Animated Background */}
      <AnimatedHeroBackground />

      <div className="relative container mx-auto max-w-7xl px-6 overflow-visible">
        <div className="max-w-5xl mx-auto text-center space-y-6 overflow-visible">
          {/* Badge */}
          {badgeText && BadgeIcon && (
            <div className={cn('inline-flex items-center gap-2 px-4 py-2 rounded-full', colors.bg, colors.border)}>
              <BadgeIcon className={cn('w-4 h-4', colors.icon)} />
              <span className={cn('text-sm font-medium', colors.text)}>{badgeText}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold tracking-normal break-words leading-relaxed py-2">
            {title}
          </h1>

          {/* Description */}
          {description && (
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              {description}
            </p>
          )}

          {/* Actions/Buttons */}
          {actions && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {actions}
            </div>
          )}

          {/* Extra Content */}
          {extraContent && (
            <div className="mt-8">
              {extraContent}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
