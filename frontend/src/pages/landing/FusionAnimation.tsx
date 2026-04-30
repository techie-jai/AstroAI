import React from 'react'
import { Sparkles } from 'lucide-react'

export function FusionAnimation() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-3xl text-center mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-4">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-indigo-400">Ancient Wisdom Unified</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-white">Three Sciences, </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
              One Powerful AI
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            We combine the wisdom of Astrology, Palmistry, and Numerology into a unified AI system
            for the most comprehensive cosmic analysis ever created.
          </p>
        </div>

        {/* Fusion Animation Container */}
        <div className="relative flex items-center justify-center">
          <div className="relative h-[400px] w-full max-w-4xl sm:h-[500px]">

            {/* Central Fusion Point */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* Outer pulse ring */}
              <div className="absolute -inset-16 rounded-full border-2 border-indigo-500/20 animate-pulse-glow" />
              <div className="absolute -inset-12 rounded-full border border-purple-500/30 animate-pulse-glow" style={{ animationDelay: '0.5s' }} />
              <div className="absolute -inset-8 rounded-full border border-indigo-500/40 animate-pulse-glow" style={{ animationDelay: '1s' }} />

              {/* Center orb */}
              <div className="relative h-24 w-24 sm:h-32 sm:w-32">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 animate-rotate-slow opacity-80 blur-sm" />
                <div className="absolute inset-2 rounded-full bg-slate-950/80 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    AI
                  </span>
                </div>
              </div>
            </div>

            {/* Astrology Orb - Top */}
            <div className="absolute left-1/2 top-4 -translate-x-1/2">
              <div className="relative">
                {/* Connection line with glow */}
                <div className="absolute left-1/2 top-full h-24 sm:h-32 w-px bg-gradient-to-b from-indigo-500/80 to-transparent -translate-x-1/2 animate-glow-border" style={{ boxShadow: '0 0 10px rgba(99, 102, 241, 0.8)' }} />

                {/* Orb */}
                <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-full border-2 border-indigo-500/50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center glow-border" style={{ boxShadow: '0 0 20px rgba(99, 102, 241, 0.6)' }}>
                  <span className="text-3xl sm:text-4xl">🪐</span>
                  <span className="text-xs sm:text-sm font-medium text-indigo-300 mt-1">Astrology</span>
                </div>

                {/* Orbiting symbols around astrology */}
                <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: '15s' }}>
                  {['♈', '♉', '♊', '♋'].map((symbol, i) => {
                    const angle = (i * 90 - 45) * (Math.PI / 180)
                    const radius = 55
                    const x = 50 + radius * Math.cos(angle)
                    const y = 50 + radius * Math.sin(angle)
                    return (
                      <span
                        key={symbol}
                        className="absolute text-sm text-indigo-400/70"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {symbol}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Palmistry Orb - Bottom Left */}
            <div className="absolute bottom-8 left-8 sm:left-16 lg:left-24">
              <div className="relative">
                {/* Connection line with glow */}
                <div
                  className="absolute right-0 bottom-full h-20 sm:h-28 w-px origin-bottom bg-gradient-to-t from-purple-500/80 to-transparent animate-glow-border"
                  style={{ transform: 'rotate(45deg) translateX(50%)', boxShadow: '0 0 10px rgba(168, 85, 247, 0.8)' }}
                />

                {/* Orb */}
                <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-full border-2 border-purple-500/50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center" style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}>
                  <span className="text-3xl sm:text-4xl">🖐️</span>
                  <span className="text-xs sm:text-sm font-medium text-purple-300 mt-1">Palmistry</span>
                </div>

                {/* Palm lines animation */}
                <svg className="absolute inset-0 w-full h-full animate-pulse-glow" viewBox="0 0 100 100">
                  <path
                    d="M 20 60 Q 50 40 80 55"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.4)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                  <path
                    d="M 25 75 Q 50 60 75 72"
                    fill="none"
                    stroke="rgba(168, 85, 247, 0.3)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>

            {/* Numerology Orb - Bottom Right */}
            <div className="absolute bottom-8 right-8 sm:right-16 lg:right-24">
              <div className="relative">
                {/* Connection line with glow */}
                <div
                  className="absolute left-0 bottom-full h-20 sm:h-28 w-px origin-bottom bg-gradient-to-t from-cyan-500/80 to-transparent animate-glow-border"
                  style={{ transform: 'rotate(-45deg) translateX(-50%)', boxShadow: '0 0 10px rgba(34, 211, 238, 0.8)' }}
                />

                {/* Orb */}
                <div className="relative h-20 w-20 sm:h-28 sm:w-28 rounded-full border-2 border-cyan-500/50 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center" style={{ boxShadow: '0 0 20px rgba(34, 211, 238, 0.6)' }}>
                  <span className="text-3xl sm:text-4xl">🔢</span>
                  <span className="text-xs sm:text-sm font-medium text-cyan-300 mt-1">Numerology</span>
                </div>

                {/* Orbiting numbers */}
                <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: '12s', animationDirection: 'reverse' }}>
                  {['1', '7', '9', '3'].map((num, i) => {
                    const angle = (i * 90 - 45) * (Math.PI / 180)
                    const radius = 55
                    const x = 50 + radius * Math.cos(angle)
                    const y = 50 + radius * Math.sin(angle)
                    return (
                      <span
                        key={num}
                        className="absolute text-sm font-bold text-cyan-400/70"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        {num}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Energy particles flowing to center */}
            {[...Array(20)].map((_, i) => {
              const startAngle = (i / 20) * 360
              const startRadius = 180 + Math.random() * 50
              return (
                <div
                  key={i}
                  className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
                  style={{
                    background:
                      i % 3 === 0
                        ? 'rgba(99, 102, 241, 0.8)'
                        : i % 3 === 1
                          ? 'rgba(168, 85, 247, 0.8)'
                          : 'rgba(34, 211, 238, 0.8)',
                    animation: `flow-to-center 3s ease-in-out infinite`,
                    animationDelay: `${(i / 20) * 3}s`,
                    transform: `translate(-50%, -50%) rotate(${startAngle}deg) translateY(-${startRadius}px)`,
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Description Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-indigo-500/30 bg-slate-900/30 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🪐</span>
              <h3 className="text-lg font-semibold text-white">Vedic Astrology</h3>
            </div>
            <p className="text-sm text-slate-400">
              Ancient planetary wisdom analyzing your birth chart, dashas, and cosmic influences.
            </p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-slate-900/30 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🖐️</span>
              <h3 className="text-lg font-semibold text-white">AI Palmistry</h3>
            </div>
            <p className="text-sm text-slate-400">
              Advanced image analysis of your palm lines revealing life path and potential.
            </p>
          </div>
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/30 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🔢</span>
              <h3 className="text-lg font-semibold text-white">Numerology</h3>
            </div>
            <p className="text-sm text-slate-400">
              Sacred number analysis from your birth date and name revealing hidden patterns.
            </p>
          </div>
        </div>
      </div>

      {/* CSS for flow animation - defined in index.css */}
    </section>
  )
}
