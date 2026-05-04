"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  Plus,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  Zap,
  ChevronUp,
  ChevronDown,
  User,
} from "lucide-react"
import { useState } from "react"
import type { ChatSession } from "@/app/chat/page"

interface ChatSidebarProps {
  kundliData: {
    name: string
    birthDate: string
    birthTime: string
    birthPlace: string
  }
  previousChats: ChatSession[]
  currentChatId: string | null
  quickQuestions: string[]
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  onQuickQuestion: (question: string) => void
}

export function ChatSidebar({
  kundliData,
  previousChats,
  currentChatId,
  quickQuestions,
  onNewChat,
  onSelectChat,
  onQuickQuestion,
}: ChatSidebarProps) {
  const [showChats, setShowChats] = useState(true)

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="font-semibold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
            Kendraa.ai
          </span>
        </div>
        <Button 
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Kundli Info */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-primary mb-3">Your Kundli</h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-accent/20">
              <User className="h-3.5 w-3.5 text-accent" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">NAME</span>
              <span className="text-foreground font-medium">{kundliData.name}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-cyan-400/20">
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">BIRTH DATE</span>
              <span className="text-cyan-400 font-medium">{kundliData.birthDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-green-400/20">
              <Clock className="h-3.5 w-3.5 text-green-400" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">BIRTH TIME</span>
              <span className="text-green-400 font-medium">{kundliData.birthTime}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="p-1.5 rounded-lg bg-pink-400/20">
              <MapPin className="h-3.5 w-3.5 text-pink-400" />
            </div>
            <div>
              <span className="text-xs text-muted-foreground block">BIRTH PLACE</span>
              <span className="text-foreground font-medium">{kundliData.birthPlace}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Chats */}
      <div className="flex-1 overflow-y-auto">
        <button
          onClick={() => setShowChats(!showChats)}
          className="w-full px-4 py-2 flex items-center justify-between text-sm text-muted-foreground hover:bg-secondary/50"
        >
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            PREVIOUS CHATS
          </span>
          {showChats ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {showChats && (
          <div className="px-2 pb-2">
            {previousChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  currentChatId === chat.id
                    ? "bg-primary/20 text-primary"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <div className="font-medium">{chat.title}</div>
                <div className="text-xs text-muted-foreground">{chat.date}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quick Questions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Zap className="h-4 w-4 text-accent" />
          <span>QUICK QUESTIONS</span>
        </div>
        <div className="space-y-1.5">
          {quickQuestions.map((question) => (
            <button
              key={question}
              onClick={() => onQuickQuestion(question)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      {/* New Kundli Button */}
      <div className="p-4 border-t border-border">
        <Button variant="outline" className="w-full border-border">
          <Plus className="h-4 w-4 mr-2" />
          New Kundli
        </Button>
      </div>
    </div>
  )
}
