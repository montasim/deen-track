'use client'

import React, { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode
}

export default function AuthLayout({ children }: Props) {
  const [siteName, setSiteName] = useState('CampaignHub')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Fetch site name from public API
    fetch('/api/public/site/settings')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.siteName) {
          setSiteName(data.data.siteName)
        }
      })
      .catch(console.error)
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Content */}
      <div className="relative">
        {/* Auth Forms Container */}
        <div className="container mx-auto max-w-7xl px-6 pb-16">
          <div className="max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
