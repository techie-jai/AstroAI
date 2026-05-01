"use client"

import { Check, MessageCircle, Sparkles } from "lucide-react"

export function TripleScience() {
  return (
    <section id="triple-science" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-foreground">Triple-Science</span>{" "}
            <span className="gradient-text-purple text-glow-purple">Agentic AI Engine</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Your question flows through three ancient sciences simultaneously. Our specialized AI agent
            cross-references, analyzes, and validates insights from Astrology, Palmistry, and Numerology to
            deliver the most accurate guidance ever created.
          </p>
        </div>

        {/* Flow visualization */}
        <div className="max-w-4xl mx-auto">
          {/* User question */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl border border-border bg-card/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-xs text-muted-foreground">You ask:</p>
                <p className="font-semibold text-foreground">What career path suits me best?</p>
              </div>
            </div>
          </div>

          {/* Connecting line */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-12 bg-gradient-to-b from-border to-primary/50" />
          </div>

          {/* Distributing badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Distributing to 3 Sciences</span>
            </div>
          </div>

          {/* Three science cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Palmistry */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-xl border border-pink-500/30 bg-card/50 backdrop-blur-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-xs font-medium text-pink-400">
                    <Check className="w-3 h-3" /> Insight Ready
                  </span>
                </div>
                
                <div className="flex justify-center mb-4 mt-4">
                  <div className="w-20 h-24 border-2 border-pink-400/50 rounded-t-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2C6 2 4 8 4 12c0 4 2 8 8 10 6-2 8-6 8-10 0-4-2-10-8-10z" />
                      <path d="M12 2v20" />
                      <path d="M4 12h16" />
                      <path d="M7 7c2 2 5 3 5 3s3-1 5-3" />
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center text-pink-400 mb-1">Palmistry</h3>
                <p className="text-sm text-center text-muted-foreground mb-3">Life, Heart & Fate Lines</p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-pink-400">
                  <Check className="w-4 h-4" />
                  <span>Heart line strong</span>
                </div>
              </div>
            </div>

            {/* Astrology */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-xl border border-amber-500/30 bg-card/50 backdrop-blur-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-xs font-medium text-amber-400">
                    <Check className="w-3 h-3" /> Insight Ready
                  </span>
                </div>
                
                <div className="flex justify-center mb-4 mt-4">
                  <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-amber-400/50" />
                    <div className="absolute inset-4 rounded-full bg-amber-400 flex items-center justify-center">
                      <span className="text-background text-lg">☉</span>
                    </div>
                    {/* Small zodiac symbols around */}
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-xs text-amber-400">♈</span>
                    <span className="absolute top-1/2 -right-1 -translate-y-1/2 text-xs text-amber-400">♋</span>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-xs text-amber-400">♎</span>
                    <span className="absolute top-1/2 -left-1 -translate-y-1/2 text-xs text-amber-400">♑</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center text-amber-400 mb-1">Astrology</h3>
                <p className="text-sm text-center text-muted-foreground mb-3">Planetary Positions</p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-amber-400">
                  <Check className="w-4 h-4" />
                  <span>Venus favorable</span>
                </div>
              </div>
            </div>

            {/* Numerology */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative p-6 rounded-xl border border-cyan-500/30 bg-card/50 backdrop-blur-sm">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs font-medium text-cyan-400">
                    <Check className="w-3 h-3" /> Insight Ready
                  </span>
                </div>
                
                <div className="flex justify-center mb-4 mt-4">
                  <div className="grid grid-cols-3 gap-1">
                    {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((num, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded flex items-center justify-center text-sm font-bold ${
                          [1, 2, 4, 5].includes(i) ? "bg-cyan-400/30 text-cyan-400" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-center text-cyan-400 mb-1">Numerology</h3>
                <p className="text-sm text-center text-muted-foreground mb-3">Destiny Numbers</p>
                
                <div className="flex items-center justify-center gap-2 text-sm text-cyan-400">
                  <Check className="w-4 h-4" />
                  <span>Life path: 7</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connecting lines */}
          <div className="flex justify-center mb-4">
            <div className="w-px h-12 bg-gradient-to-b from-primary/50 to-border" />
          </div>

          {/* Merging badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-500/30">
              <Sparkles className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-medium text-pink-400">Merging Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
