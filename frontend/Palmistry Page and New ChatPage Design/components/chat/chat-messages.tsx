"use client"

import { useEffect, useRef } from "react"
import type { Message } from "@/app/chat/page"
import type { Science } from "@/components/chat/science-toggle"
import { cn } from "@/lib/utils"
import { Sparkles, User, Hand, Hash, Layers } from "lucide-react"

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
}

const scienceIcons: Record<string, React.ReactNode> = {
  astrology: <Sparkles className="h-3 w-3" />,
  palmistry: <Hand className="h-3 w-3" />,
  numerology: <Hash className="h-3 w-3" />,
  all: <Layers className="h-3 w-3" />,
}

const scienceColors: Record<string, string> = {
  astrology: "text-accent bg-accent/20",
  palmistry: "text-pink-400 bg-pink-400/20",
  numerology: "text-cyan-400 bg-cyan-400/20",
  all: "text-green-400 bg-green-400/20",
}

export function ChatMessages({ messages, isLoading }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex gap-3",
            message.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          {message.role === "assistant" && (
            <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-pink-400 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
          )}

          <div
            className={cn(
              "max-w-2xl",
              message.role === "user" ? "order-first" : ""
            )}
          >
            {message.role === "assistant" && (
              <div className="flex items-center gap-2 mb-1.5">
                <span className="font-semibold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
                  Kendraa AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                  Triple-verified
                </span>
              </div>
            )}

            <div
              className={cn(
                "rounded-2xl px-4 py-3",
                message.role === "user"
                  ? "bg-gradient-to-r from-primary to-pink-500 text-white"
                  : "bg-card border border-border"
              )}
            >
              {/* Science tags for user messages */}
              {message.role === "user" && message.sciences && message.sciences.length > 0 && (
                <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-white/20">
                  {message.sciences.map((science) => (
                    <span
                      key={science}
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-white/20 text-white"
                    >
                      {scienceIcons[science]}
                      <span className="capitalize">{science}</span>
                    </span>
                  ))}
                </div>
              )}

              <p className={cn(
                "text-sm leading-relaxed whitespace-pre-wrap",
                message.role === "user" ? "text-white" : "text-foreground"
              )}>
                {message.content}
              </p>
            </div>

            <div 
              className={cn(
                "text-xs text-muted-foreground mt-1.5",
                message.role === "user" ? "text-right" : "text-left"
              )}
              suppressHydrationWarning
            >
              {formatTime(message.timestamp)}
            </div>
          </div>

          {message.role === "user" && (
            <div className="shrink-0 w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-pink-400 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-muted-foreground">Analyzing your cosmic profile...</span>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}
