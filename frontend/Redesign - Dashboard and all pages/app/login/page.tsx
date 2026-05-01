"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Starfield background */}
      <div className="fixed inset-0 starfield opacity-40 pointer-events-none" />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-pink-500/15 rounded-full blur-[120px]" />
      </div>

      {/* Login card */}
      <div className="relative w-full max-w-md mx-4">
        <div className="p-8 rounded-2xl border border-border bg-card/80 backdrop-blur-xl shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              <Sparkles className="w-12 h-12 text-amber-400" />
              <div className="absolute inset-0 animate-pulse">
                <Sparkles className="w-12 h-12 text-purple-400 opacity-50" />
              </div>
            </div>
            <h1 className="text-3xl font-bold gradient-text-purple">Kendraa.ai</h1>
            <p className="text-muted-foreground mt-2">Vedic Astrology Meets AI</p>
          </div>

          {/* Sign in text */}
          <p className="text-center text-muted-foreground mb-6">
            Sign in with your Google account to get started
          </p>

          {/* Google sign in button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 glow-purple gap-3 h-12 text-base"
            onClick={() => window.location.href = '/dashboard'}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
          </div>

          {/* Terms */}
          <p className="text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="#" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Bottom text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Generate accurate astrological charts and get AI-powered insights
        </p>
      </div>
    </div>
  )
}
