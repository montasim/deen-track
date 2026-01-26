'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Trophy, User, LogOut, LayoutDashboard, Settings, Home } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getProxiedImageUrl } from '@/lib/image-proxy'
import { getUserInitials } from '@/lib/utils/user'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/context/auth-context'

interface CampaignsTopbarProps {
  siteName: string
}

export function CampaignsTopbar({ siteName }: CampaignsTopbarProps) {
  const { user, logout, isLoading } = useAuth()

  // Get proxied avatar URL for Google Drive images
  const avatarUrl = useMemo(() => {
    const rawUrl = user?.avatar ?? (user as any)?.directAvatarUrl ?? undefined
    return rawUrl ? (getProxiedImageUrl(rawUrl) || rawUrl) : undefined
  }, [user?.avatar, (user as any)?.directAvatarUrl])

  const handleLogout = async () => {
    await logout()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-neutral-950/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center overflow-hidden shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-all">
              <Trophy className="w-5 h-5 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-neutral-300 bg-clip-text text-transparent">
              {siteName}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/campaigns"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Campaigns
            </Link>
            <Link
              href="/leaderboard"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Leaderboard
            </Link>
            {user && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && (
              <Link
                href="/my-progress"
                className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
              >
                My Progress
              </Link>
            )}
            <Link
              href="/sponsors"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Sponsors
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {isLoading ? (
              /* Show skeleton buttons during loading */
              <>
                <Skeleton className="h-9 w-20 bg-white/10" />
                <Skeleton className="h-9 w-24 bg-white/10" />
              </>
            ) : user ? (
              /* User is logged in - show profile dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-8 w-8 border-2 border-cyan-500/30">
                      <AvatarImage src={avatarUrl} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-xs font-semibold">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                      <p className="text-xs leading-none text-neutral-400">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Home</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* User is not logged in - show sign in/up buttons */
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-neutral-400 hover:text-white hover:bg-white/5"
                >
                  <Link href="/auth/sign-in">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
                >
                  <Link href="/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
