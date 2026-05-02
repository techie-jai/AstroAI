"use client"

import { useState, useRef, useEffect } from "react"
import { AppShell } from "@/components/app-shell"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatMessages } from "@/components/chat/chat-messages"
import { ChatInput } from "@/components/chat/chat-input"
import { ScienceToggle, type Science } from "@/components/chat/science-toggle"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sciences?: Science[]
}

export interface ChatSession {
  id: string
  title: string
  date: string
  messages: Message[]
}

const mockKundliData = {
  name: "adva",
  birthDate: "2000-1-1",
  birthTime: "12:00",
  birthPlace: "New Delhi",
}

const initialMessage: Message = {
  id: "1",
  role: "assistant",
  content: "Namaste! I'm your personal Vedic astrology guide. I've loaded your kundli and I'm ready to answer any questions about your astrological profile. Ask me anything about your personality, career, relationships, or life path!",
  timestamp: new Date(),
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSciences, setSelectedSciences] = useState<Science[]>(["astrology"])
  const [previousChats, setPreviousChats] = useState<ChatSession[]>([
    { id: "1", title: "adva", date: "5/1/2026", messages: [] },
  ])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  const quickQuestions = [
    "What are my key personality traits?",
    "What career path suits me best?",
    "How is my love life this year?",
    "What are my lucky numbers?",
  ]

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      sciences: selectedSciences,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const scienceContext = selectedSciences.includes("all")
        ? "all three sciences (Astrology, Palmistry, and Numerology)"
        : selectedSciences.join(", ")

      let response = ""

      if (selectedSciences.includes("all")) {
        response = `Based on my comprehensive analysis using Astrology, Palmistry, and Numerology:\n\n**Astrological Perspective:**\nYour birth chart shows ${content.toLowerCase().includes("career") ? "strong 10th house placements indicating leadership potential" : "favorable planetary alignments for personal growth"}.\n\n**Palmistry Insights:**\nYour palm lines suggest ${content.toLowerCase().includes("love") ? "deep emotional capacity with a strong heart line" : "analytical thinking with a clear head line"}.\n\n**Numerological Analysis:**\nYour life path number indicates ${content.toLowerCase().includes("personality") ? "a natural inclination towards creativity and expression" : "cycles of opportunity approaching in the near future"}.\n\n**Combined Verdict:**\nAll three sciences align in suggesting that you have significant potential. Trust your intuition as you move forward.`
      } else if (selectedSciences.includes("palmistry")) {
        response = `Based on your palm analysis:\n\nYour ${content.toLowerCase().includes("love") ? "heart line shows deep emotional capacity and a caring nature. The curve indicates romantic inclinations and the ability to form lasting bonds" : "lines reveal interesting patterns. Your head line suggests analytical abilities, while your fate line indicates a strong sense of purpose"}.\n\nWould you like me to cross-reference this with your Kundli for deeper insights?`
      } else if (selectedSciences.includes("numerology")) {
        response = `Based on numerological analysis:\n\nYour birth date (${mockKundliData.birthDate}) gives you a Life Path Number that suggests ${content.toLowerCase().includes("career") ? "success in fields requiring creativity and communication. Numbers 3, 6, and 9 are particularly favorable for you" : "a journey of personal growth and self-discovery. This year brings opportunities aligned with your core numbers"}.\n\nWould you like me to combine this with astrological insights?`
      } else {
        response = `Based on your Vedic birth chart:\n\n${content.toLowerCase().includes("personality") ? "Your Sun sign and Moon sign combination creates a unique blend of traits. You possess natural leadership abilities combined with emotional depth" : content.toLowerCase().includes("career") ? "Your 10th house lord and its planetary aspects suggest success in fields requiring analytical skills and communication. The current dasha period is favorable for career growth" : content.toLowerCase().includes("love") ? "Venus in your chart indicates a loving and harmonious nature. The 7th house aspects suggest meaningful partnerships, with the current transit favoring relationship development" : "Your chart reveals interesting planetary placements. The current planetary periods suggest a time of growth and opportunity"}.\n\nWould you like more specific details about any aspect?`
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        sciences: selectedSciences,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleNewChat = () => {
    setMessages([initialMessage])
    setCurrentChatId(null)
  }

  const handleSelectChat = (chatId: string) => {
    setCurrentChatId(chatId)
    // In a real app, load the chat messages here
  }

  return (
    <AppShell>
      <div className="flex h-[calc(100vh-8rem)] -m-6">
        {/* Sidebar */}
        <ChatSidebar
          kundliData={mockKundliData}
          previousChats={previousChats}
          currentChatId={currentChatId}
          quickQuestions={quickQuestions}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          onQuickQuestion={handleSendMessage}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat Header with Science Toggle */}
          <div className="h-16 border-b border-border px-6 flex items-center justify-between bg-card/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-pink-400 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">K</span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <span className="font-semibold bg-gradient-to-r from-primary to-pink-400 bg-clip-text text-transparent">
                  Kendraa.ai
                </span>
              </div>
              <span className="text-xs text-green-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                AI Online
              </span>
            </div>
            
            {/* Science Toggle */}
            <ScienceToggle
              selected={selectedSciences}
              onChange={setSelectedSciences}
            />
          </div>

          {/* Messages Area */}
          <ChatMessages messages={messages} isLoading={isLoading} />

          {/* Input Area */}
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            selectedSciences={selectedSciences}
          />
        </div>
      </div>
    </AppShell>
  )
}
