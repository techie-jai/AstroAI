"use client"

import { ArrowRight, Play, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ZodiacWheel } from "./zodiac-wheel"

export function LandingHero() {
  return (
    <section className="relative py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
              <span className="text-amber-400 text-lg">&#10024;</span>
              <span className="text-sm font-medium text-foreground">AI-Powered Astrology</span>
            </div>
            
            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-foreground">3 Cosmic</span>
                <br />
                <span className="gradient-text-purple text-glow-purple">Knowledge</span>
                <br />
                <span className="gradient-text-purple text-glow-purple">Systems</span>
                <br />
                <span className="text-foreground">One Advanced AI</span>
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                Welcome to Kendraa.ai. Central Hub for all your Astrology, Palmistry and
                Numerology needs. Our advanced AI allows you to harness the power of
                these ancient wisdom systems and cross reference them for accurate
                predictions and deeper insights.
              </p>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple gap-2 px-8">
                  Start Your Journey
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-card">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>
            
            {/* Social proof */}
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 border-2 border-background"
                  />
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Trusted by <span className="text-foreground font-semibold">50,000+</span> cosmic explorers
                </p>
              </div>
            </div>
          </div>
          
          {/* Right content - Zodiac Wheel */}
          <div className="relative flex items-center justify-center">
            <ZodiacWheel />
          </div>
        </div>
      </div>
    </section>
  )
}
