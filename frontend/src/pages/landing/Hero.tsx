import React from 'react'
import { ArrowRight, Star, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

// 12 Rashis (Zodiac Signs) with accurate Unicode symbols
const rashis = [
  { name: 'Aries', symbol: '♈', hindi: 'मेष' },
  { name: 'Taurus', symbol: '♉', hindi: 'वृषभ' },
  { name: 'Gemini', symbol: '♊', hindi: 'मिथुन' },
  { name: 'Cancer', symbol: '♋', hindi: 'कर्क' },
  { name: 'Leo', symbol: '♌', hindi: 'सिंह' },
  { name: 'Virgo', symbol: '♍', hindi: 'कन्या' },
  { name: 'Libra', symbol: '♎', hindi: 'तुला' },
  { name: 'Scorpio', symbol: '♏', hindi: 'वृश्चिक' },
  { name: 'Sagittarius', symbol: '♐', hindi: 'धनु' },
  { name: 'Capricorn', symbol: '♑', hindi: 'मकर' },
  { name: 'Aquarius', symbol: '♒', hindi: 'कुंभ' },
  { name: 'Pisces', symbol: '♓', hindi: 'मीन' },
]

// 9 Planets (Navagraha) with symbols and colors
const planets = [
  { name: 'Sun', symbol: '☉', hindi: 'सूर्य', color: '#FFD700' },
  { name: 'Moon', symbol: '☽', hindi: 'चंद्र', color: '#E0E0E0' },
  { name: 'Mars', symbol: '♂', hindi: 'मंगल', color: '#FF4444' },
  { name: 'Mercury', symbol: '☿', hindi: 'बुध', color: '#4DD0E1' },
  { name: 'Jupiter', symbol: '♃', hindi: 'गुरु', color: '#FFB74D' },
  { name: 'Venus', symbol: '♀', hindi: 'शुक्र', color: '#FF69B4' },
  { name: 'Saturn', symbol: '♄', hindi: 'शनि', color: '#A9A9A9' },
  { name: 'Rahu', symbol: '☊', hindi: 'राहु', color: '#8B4513' },
  { name: 'Ketu', symbol: '☋', hindi: 'केतु', color: '#DA70D6' },
]

export function Hero() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleStartJourney = () => {
    if (user) {
      navigate('/generate')
    } else {
      navigate('/login')
    }
  }

  return (
    <section className="relative min-h-screen overflow-hidden pt-20 sm:pt-24 lg:pt-32 bg-black">
      {/* Cosmic Background */}
      <div className="absolute inset-0 stars-bg opacity-40" />

      {/* Gradient Orbs - High Quality */}
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/15 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/3 right-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl animate-pulse-glow" style={{ animationDelay: '3s' }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-8 py-12 text-center lg:flex-row lg:text-left">
          {/* Text Content */}
          <div className="flex flex-1 flex-col items-center gap-6 lg:items-start animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium text-indigo-300">AI-Powered Astrology</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-white">3 Cosmic</span>
              <br />
              <span className="bg-clip-text text-transparent animate-glow-text" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
                Knowledge Systems
              </span>
              <br />
              <span className="text-white">One Advance AI</span>
            </h1>

            {/* Subheadline */}
            <p className="max-w-xl text-base sm:text-lg text-slate-300 leading-relaxed">
              Welcome To Kendraa.ai. Central Hub for all your Astrology, Palmistry and Numerology needs. Our advance AI allows you to harness the power of these ancient wisdom systems and cross reference them for accurate predictions and deeper insights.   
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              <button
                onClick={handleStartJourney}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-6 sm:px-8 py-3 sm:py-4 text-base font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all glow-button"
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800/40 hover:bg-slate-800/60 px-6 sm:px-8 py-3 sm:py-4 text-base font-semibold text-white transition-all"
              >
                Watch Demo
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-slate-900 bg-gradient-to-br from-indigo-500/60 to-purple-500/60"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-400">
                  Trusted by <span className="text-white font-semibold">50,000+</span> cosmic explorers
                </p>
              </div>
            </div>
          </div>

          {/* Advanced Zodiac Wheel with Kundli */}
          <div className="relative flex flex-1 items-center justify-center">
            <div className="relative h-72 w-72 sm:h-96 sm:w-96 lg:h-[480px] lg:w-[480px]">
              {/* Outermost Ring - 12 Rashis rotating clockwise */}
              <div className="absolute inset-0 animate-rotate-slow" style={{ animationDuration: '80s' }}>
                {rashis.map((rashi, index) => {
                  const angle = (index * 30 - 90) * (Math.PI / 180)
                  const radius = 48
                  const x = 50 + radius * Math.cos(angle)
                  const y = 50 + radius * Math.sin(angle)
                  return (
                    <div
                      key={rashi.name}
                      className="absolute flex flex-col items-center transition-all hover:scale-125 cursor-pointer group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <span
                        className="text-2xl sm:text-3xl lg:text-4xl text-indigo-300 group-hover:text-indigo-200 transition-colors font-bold"
                        style={{
                          filter: 'drop-shadow(0 0 12px rgba(99, 102, 241, 0.8))',
                          animation: `rotate-slow-reverse 80s linear infinite`,
                        }}
                      >
                        {rashi.symbol}
                      </span>
                      <span className="text-xs text-slate-400 group-hover:text-slate-300 mt-1 transition-colors">
                        {rashi.name}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Outer glow ring */}
              <div className="absolute inset-4 rounded-full border border-indigo-400/40 glow-border" />

              {/* Second Ring - 9 Planets rotating counter-clockwise */}
              <div className="absolute inset-12 sm:inset-16 lg:inset-20" style={{ animation: 'rotate-slow-reverse 50s linear infinite' }}>
                {planets.map((planet, index) => {
                  const angle = (index * 40 - 90) * (Math.PI / 180)
                  const radius = 46
                  const x = 50 + radius * Math.cos(angle)
                  const y = 50 + radius * Math.sin(angle)
                  return (
                    <div
                      key={planet.name}
                      className="absolute flex flex-col items-center transition-all hover:scale-150 cursor-pointer group"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="relative">
                        <span
                          className="text-lg sm:text-xl lg:text-2xl font-bold"
                          style={{
                            color: planet.color,
                            filter: `drop-shadow(0 0 12px ${planet.color})`,
                            animation: 'rotate-slow 50s linear infinite',
                          }}
                        >
                          {planet.symbol}
                        </span>
                        <div
                          className="absolute inset-0 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                          style={{ backgroundColor: planet.color }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 group-hover:text-slate-300 mt-1 transition-colors">
                        {planet.name}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Planet orbit ring */}
              <div className="absolute inset-12 sm:inset-16 lg:inset-20 rounded-full border border-purple-400/30" />

              {/* Inner Ring - subtle rotation */}
              <div className="absolute inset-24 sm:inset-28 lg:inset-32 rounded-full border border-indigo-400/50 animate-rotate-slow" style={{ animationDuration: '30s' }} />

              {/* Center Glow */}
              <div className="absolute inset-28 sm:inset-32 lg:inset-36 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-indigo-500/20 blur-2xl animate-pulse-glow" />

              {/* Kundli (Birth Chart) in Center */}
              <div className="absolute inset-28 sm:inset-32 lg:inset-36 flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Kundli Diamond Shape with High Quality Rendering */}
                  <svg viewBox="0 0 100 100" className="w-full h-full animate-float" style={{ filter: 'drop-shadow(0 0 20px rgba(99, 102, 241, 0.6))' }}>
                    {/* Outer square rotated 45 degrees (diamond) */}
                    <rect
                      x="15"
                      y="15"
                      width="70"
                      height="70"
                      transform="rotate(45 50 50)"
                      fill="none"
                      stroke="rgba(99, 102, 241, 0.8)"
                      strokeWidth="1.5"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Inner square */}
                    <rect
                      x="25"
                      y="25"
                      width="50"
                      height="50"
                      fill="none"
                      stroke="rgba(168, 85, 247, 0.6)"
                      strokeWidth="0.8"
                      vectorEffect="non-scaling-stroke"
                    />
                    {/* Diagonal lines creating the 12 houses */}
                    <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(99, 102, 241, 0.4)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    <line x1="25" y1="25" x2="75" y2="75" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    <line x1="75" y1="25" x2="25" y2="75" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
                    {/* Cross lines to complete kundli structure */}
                    <line x1="25" y1="50" x2="50" y2="25" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="25" x2="75" y2="50" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                    <line x1="75" y1="50" x2="50" y2="75" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                    <line x1="50" y1="75" x2="25" y2="50" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
                    {/* Center glow circle */}
                    <circle cx="50" cy="50" r="8" fill="url(#centerGlow)" />
                    <defs>
                      <radialGradient id="centerGlow">
                        <stop offset="0%" stopColor="rgba(99, 102, 241, 1)" />
                        <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
                      </radialGradient>
                    </defs>
                  </svg>
                  {/* Central sparkle icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-300 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Ambient particles */}
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-1.5 w-1.5 rounded-full bg-indigo-400/70"
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                    animation: `pulse-glow ${2 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                    boxShadow: '0 0 8px rgba(99, 102, 241, 0.8)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
