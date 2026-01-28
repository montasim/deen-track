'use client'

import { useEffect, useState } from 'react'

export function PageBackground() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#33333308_1px,transparent_1px),linear-gradient(to_bottom,#33333308_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Animated Gradient Orbs */}
      <div
        className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/30 via-blue-600/20 to-violet-600/30 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
        style={{
          left: '20%',
          top: '10%',
          transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)`,
        }}
      />
      <div
        className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-violet-500/25 via-purple-600/20 to-pink-500/25 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
        style={{
          right: '15%',
          bottom: '20%',
          transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.12}px)`,
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] bg-gradient-to-bl from-emerald-500/20 via-teal-600/15 to-cyan-500/20 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-1000 ease-out"
        style={{
          left: '50%',
          top: '50%',
          transform: `translate(${-scrollY * 0.05}px, ${-scrollY * 0.05}px)`,
        }}
      />
    </div>
  )
}
