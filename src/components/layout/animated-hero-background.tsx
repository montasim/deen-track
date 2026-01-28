export function AnimatedHeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-[800px] h-[800px] bg-gradient-to-br from-cyan-500/20 via-blue-600/15 to-violet-500/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 top-0 left-1/2 animate-pulse" />
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-violet-500/15 via-purple-600/10 to-pink-500/15 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 bottom-0 right-0 animate-pulse delay-1000" />
    </div>
  )
}
