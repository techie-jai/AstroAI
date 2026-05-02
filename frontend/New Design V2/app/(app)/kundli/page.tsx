"use client"

import { Plus, Calendar, Clock, MapPin, Eye, MessageCircle, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const kundlis = [
  {
    id: 1,
    name: "Neha Verma",
    birthDate: "1986-02-08",
    birthTime: "16:53",
    place: "Bangalore",
    generatedAt: "2026-04-14",
    sunSign: "Aquarius",
    moonSign: "Libra",
  },
  {
    id: 2,
    name: "Aditya Sharma",
    birthDate: "1998-05-07",
    birthTime: "02:05",
    place: "Mumbai",
    generatedAt: "2026-04-14",
    sunSign: "Taurus",
    moonSign: "Scorpio",
  },
  {
    id: 3,
    name: "aoud",
    birthDate: "2026-01-01",
    birthTime: "12:00",
    place: "Santiago Ixtaltepec, Mexico",
    generatedAt: "2026-04-14",
    sunSign: "Capricorn",
    moonSign: "Pisces",
  },
  {
    id: 4,
    name: "qefqAkshay Patel",
    birthDate: "2007-05-08",
    birthTime: "20:58",
    place: "Kolkata",
    generatedAt: "2026-04-14",
    sunSign: "Taurus",
    moonSign: "Leo",
  },
  {
    id: 5,
    name: "23112Neha Verma",
    birthDate: "1995-04-22",
    birthTime: "20:23",
    place: "Kolkata",
    generatedAt: "2026-04-14",
    sunSign: "Taurus",
    moonSign: "Cancer",
  },
  {
    id: 6,
    name: "Aditya Malhotra",
    birthDate: "1966-01-01",
    birthTime: "15:30",
    place: "Delhi",
    generatedAt: "2026-04-14",
    sunSign: "Capricorn",
    moonSign: "Aries",
  },
]

// Floating stars background component
function FloatingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function KundliPage() {
  return (
    <div className="relative space-y-8 min-h-screen">
      {/* Background effects */}
      <div className="fixed inset-0 cosmic-gradient-bg opacity-30 pointer-events-none" />
      <FloatingStars />
      
      {/* Header */}
      <div className="relative flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">
            Your Kundlis
          </h1>
          <p className="text-muted-foreground mt-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            View and manage your generated kundlis
          </p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 glow-purple gap-2 font-semibold transition-all duration-300 hover:scale-105">
            <Plus className="w-4 h-4" />
            Generate New
          </Button>
        </Link>
      </div>

      {/* Kundli grid */}
      <div className="relative grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kundlis.map((kundli, index) => (
          <div
            key={kundli.id}
            className="group cosmic-card rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Header with animated gradient */}
            <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 p-5 overflow-hidden">
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative flex items-center justify-between">
                <h3 className="text-xl font-bold text-white text-glow-purple">{kundli.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300 animate-pulse-glow" />
                </div>
              </div>
              
              {/* Sun/Moon signs */}
              <div className="relative mt-2 flex items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full planet-sun" />
                  {kundli.sunSign}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full planet-moon" />
                  {kundli.moonSign}
                </span>
              </div>
            </div>
            
            <div className="p-5 space-y-4 bg-gradient-to-b from-transparent to-purple-950/20">
              {/* Birth details */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center group-hover/item:bg-purple-500/30 transition-colors">
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-muted-foreground">Birth Date</span>
                  <span className="ml-auto text-foreground font-medium">{kundli.birthDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center group-hover/item:bg-cyan-500/30 transition-colors">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-muted-foreground">Birth Time</span>
                  <span className="ml-auto text-foreground font-medium">{kundli.birthTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm group/item">
                  <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center group-hover/item:bg-pink-500/30 transition-colors">
                    <MapPin className="w-4 h-4 text-pink-400" />
                  </div>
                  <span className="text-muted-foreground">Place</span>
                  <span className="ml-auto text-foreground font-medium truncate max-w-[140px]">{kundli.place}</span>
                </div>
              </div>

              {/* Generated date */}
              <p className="text-xs text-muted-foreground/60 border-t border-border/50 pt-3">
                Generated: {kundli.generatedAt}
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <Link href={`/results/${kundli.id}`} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 gap-2 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25">
                    <Eye className="w-4 h-4" />
                    View
                  </Button>
                </Link>
                <Link href="/chat" className="flex-1">
                  <Button variant="outline" className="w-full border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 hover:border-purple-400/50 gap-2 font-medium transition-all duration-300">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
