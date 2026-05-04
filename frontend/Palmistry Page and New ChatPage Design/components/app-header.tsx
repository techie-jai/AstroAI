"use client"

import { Sparkles } from "lucide-react"
import Link from "next/link"

interface AppHeaderProps {
  userEmail?: string
}

export function AppHeader({ userEmail = "user@example.com" }: AppHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-30">
      <Link href="/dashboard" className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-accent" />
        <span className="text-lg font-semibold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
          Kendraa.ai
        </span>
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{userEmail}</span>
      </div>
    </header>
  )
}
