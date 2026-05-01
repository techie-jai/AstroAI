"use client"

import { useState } from "react"
import { Send, Plus, ChevronUp, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/kendraa/logo"

const previousChats = [
  { id: 1, name: "adva", date: "5/1/2026", active: true },
  { id: 2, name: "Neha Verma", date: "4/14/2026", active: false },
  { id: 3, name: "Aditya Sharma", date: "4/14/2026", active: false },
]

const quickQuestions = [
  "What are my key personality traits?",
  "What career path suits me best?",
  "How is my love life this year?",
]

interface Message {
  id: number
  type: "user" | "ai"
  content: string
  timestamp: string
}

const initialMessages: Message[] = [
  {
    id: 1,
    type: "ai",
    content: "Namaste! I'm your personal Vedic astrology guide. I've loaded your kundli and I'm ready to answer any questions about your astrological profile. Ask me anything about your personality, career, relationships, or life path!",
    timestamp: "09:45 PM",
  },
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [selectedKundli, setSelectedKundli] = useState(previousChats[0])

  const handleSend = () => {
    if (!inputValue.trim()) return

    const newMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, newMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: `Based on your kundli analysis, "${inputValue}" is an interesting question. According to your planetary positions, your Jupiter is favorably placed which indicates growth and prosperity in this area. Your Sun sign suggests strong leadership qualities that will help you navigate challenges ahead.`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-6">
      {/* Left sidebar */}
      <div className="w-64 border-r border-border bg-card/30 flex flex-col">
        {/* New Chat button */}
        <div className="p-4">
          <Button className="w-full bg-green-600 hover:bg-green-700 gap-2">
            <Sparkles className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Kundli info */}
        <div className="px-4 py-2 border-b border-border">
          <h2 className="text-lg font-bold text-foreground mb-4">Your Kundli</h2>
          
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
              <p className="text-foreground font-medium">{selectedKundli.name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Date</p>
              <p className="text-foreground font-medium">2000-1-1</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Time</p>
              <p className="text-foreground font-medium">12:0</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Place</p>
              <div className="w-full h-px bg-border mt-1" />
            </div>
          </div>
        </div>

        {/* Previous chats */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Previous Chats</h3>
          <div className="space-y-1">
            {previousChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedKundli(chat)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  chat.active
                    ? "bg-primary/20 border-l-2 border-primary"
                    : "hover:bg-muted"
                )}
              >
                <p className="font-medium text-foreground text-sm">{chat.name}</p>
                <p className="text-xs text-muted-foreground">{chat.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick questions */}
        <div className="p-4 border-t border-border">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Quick Questions</h3>
          <div className="space-y-1">
            {quickQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => setInputValue(question)}
                className="w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors truncate"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* New Kundli button */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" className="w-full gap-2 border-border">
            <Plus className="w-4 h-4" />
            New Kundli
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
          <Logo size="sm" />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-3xl",
                message.type === "user" ? "ml-auto" : ""
              )}
            >
              <div
                className={cn(
                  "p-4 rounded-xl",
                  message.type === "user"
                    ? "bg-primary/20 border border-primary/30"
                    : "bg-card border border-border"
                )}
              >
                <p className="text-foreground leading-relaxed">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-2">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2 max-w-3xl mx-auto">
            <Input
              placeholder="Ask about your cosmic journey..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 bg-input border-border"
            />
            <Button
              onClick={handleSend}
              className="bg-primary hover:bg-primary/90"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
