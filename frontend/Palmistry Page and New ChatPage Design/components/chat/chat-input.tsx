"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Send, Sparkles, Hand, Hash, Layers } from "lucide-react"
import type { Science } from "@/components/chat/science-toggle"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  selectedSciences: Science[]
}

const scienceLabels: Record<Science, { icon: React.ReactNode; label: string }> = {
  astrology: { icon: <Sparkles className="h-3 w-3" />, label: "Astrology" },
  palmistry: { icon: <Hand className="h-3 w-3" />, label: "Palmistry" },
  numerology: { icon: <Hash className="h-3 w-3" />, label: "Numerology" },
  all: { icon: <Layers className="h-3 w-3" />, label: "All Sciences" },
}

export function ChatInput({ onSendMessage, isLoading, selectedSciences }: ChatInputProps) {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const getPlaceholder = () => {
    if (selectedSciences.includes("all")) {
      return "Ask about your cosmic journey (using all sciences)..."
    }
    if (selectedSciences.length === 1) {
      return `Ask about your ${selectedSciences[0]} reading...`
    }
    return "Ask about your cosmic journey..."
  }

  return (
    <div className="border-t border-border bg-card/50 p-4">
      {/* Active sciences indicator */}
      <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
        <span>Answering with:</span>
        {selectedSciences.map((science) => (
          <span
            key={science}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary"
          >
            {scienceLabels[science].icon}
            {scienceLabels[science].label}
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={getPlaceholder()}
            disabled={isLoading}
            className="w-full px-4 py-3 pr-12 rounded-xl bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <Button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 p-0"
        >
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </div>
  )
}
