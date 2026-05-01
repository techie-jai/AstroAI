"use client"

import { useState } from "react"
import { Send, Plus, ChevronUp, Sparkles, Calendar, Clock, MapPin, Star, MessageCircle, Zap } from "lucide-react"
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
  "What are my lucky numbers?",
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
  const [selectedChat, setSelectedChat] = useState(previousChats[0])
  const [isTyping, setIsTyping] = useState(false)

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
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "ai",
        content: `Based on your kundli analysis, "${inputValue}" is an interesting question. According to your planetary positions, your Jupiter is favorably placed which indicates growth and prosperity in this area. Your Sun sign suggests strong leadership qualities that will help you navigate challenges ahead.`,
        timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] -m-6 overflow-hidden">
      {/* Left sidebar */}
      <div className="w-72 border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
        {/* New Chat button */}
        <div className="p-4">
          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 glow-cyan gap-2 font-semibold">
            <Sparkles className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {/* Kundli info */}
        <div className="px-4 py-3 border-b border-border/50">
          <h2 className="text-lg font-bold gradient-text-purple mb-4">Your Kundli</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                <Star className="w-4 h-4 text-purple-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Name</p>
                <p className="text-foreground font-medium">{selectedChat.name}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Date</p>
                <p className="text-foreground font-medium">2000-1-1</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                <Clock className="w-4 h-4 text-pink-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Time</p>
                <p className="text-cyan-400 font-medium">12:00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Birth Place</p>
                <p className="text-foreground font-medium">New Delhi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Previous chats */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <MessageCircle className="w-3 h-3" />
            Previous Chats
          </h3>
          <div className="space-y-2">
            {previousChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all duration-300",
                  chat.id === selectedChat.id
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/10 border-l-2 border-purple-500 glow-purple"
                    : "hover:bg-purple-500/10 border-l-2 border-transparent"
                )}
              >
                <p className="font-medium text-foreground text-sm">{chat.name}</p>
                <p className="text-xs text-muted-foreground">{chat.date}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick questions */}
        <div className="p-4 border-t border-border/50">
          <h3 className="text-xs text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-400" />
            Quick Questions
          </h3>
          <div className="space-y-2">
            {quickQuestions.map((question, i) => (
              <button
                key={i}
                onClick={() => setInputValue(question)}
                className="w-full text-left p-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-purple-500/10 rounded-lg transition-all duration-200 truncate border border-transparent hover:border-purple-500/20"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* New Kundli button */}
        <div className="p-4 border-t border-border/50">
          <Button variant="outline" className="w-full gap-2 border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20">
            <Plus className="w-4 h-4" />
            New Kundli
          </Button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col relative">
        {/* Background effects */}
        <div className="absolute inset-0 cosmic-gradient-bg opacity-10 pointer-events-none" />
        
        {/* Chat header */}
        <div className="relative flex items-center gap-3 p-4 border-b border-border/50 backdrop-blur-sm">
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
          <Logo size="sm" />
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">AI Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300",
                message.type === "user" ? "ml-auto" : ""
              )}
            >
              <div
                className={cn(
                  "p-5 rounded-2xl transition-all",
                  message.type === "user"
                    ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                    : "cosmic-card"
                )}
              >
                {message.type === "ai" && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold gradient-text-purple">Kendraa AI</span>
                    <span className="text-xs text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                      Triple-verified
                    </span>
                  </div>
                )}
                <p className="text-foreground leading-relaxed">{message.content}</p>
                <p className="text-xs text-muted-foreground mt-3">{message.timestamp}</p>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="max-w-3xl animate-in fade-in">
              <div className="cosmic-card p-5 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="relative p-4 border-t border-border/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 max-w-3xl mx-auto">
            <div className="relative flex-1">
              <Input
                placeholder="Ask about your cosmic journey..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-secondary/50 border-purple-500/30 focus:border-purple-500/50 focus:ring-purple-500/20 pr-12 h-12 text-base"
              />
              <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400/50" />
            </div>
            <Button
              onClick={handleSend}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 glow-purple h-12 w-12"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
