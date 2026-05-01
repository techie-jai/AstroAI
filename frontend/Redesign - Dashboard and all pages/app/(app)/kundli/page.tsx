"use client"

import { Plus, Calendar, Clock, MapPin, Eye, MessageCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
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
  },
  {
    id: 2,
    name: "Aditya Sharma",
    birthDate: "1998-05-07",
    birthTime: "02:05",
    place: "Mumbai",
    generatedAt: "2026-04-14",
  },
  {
    id: 3,
    name: "aoud",
    birthDate: "2026-01-01",
    birthTime: "12:00",
    place: "Santiago Ixtaltepec, Mexico, Me",
    generatedAt: "2026-04-14",
  },
  {
    id: 4,
    name: "qefqAkshay Patel",
    birthDate: "2007-05-08",
    birthTime: "20:58",
    place: "Kolkata",
    generatedAt: "2026-04-14",
  },
  {
    id: 5,
    name: "23112Neha Verma",
    birthDate: "1995-04-22",
    birthTime: "20:23",
    place: "Kolkata",
    generatedAt: "2026-04-14",
  },
  {
    id: 6,
    name: "Aditya Malhotra",
    birthDate: "1966-01-01",
    birthTime: "15:30",
    place: "Delhi",
    generatedAt: "2026-04-14",
  },
]

export default function KundliPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Your Kundlis</h1>
          <p className="text-muted-foreground mt-1">View and manage your generated kundlis</p>
        </div>
        <Link href="/dashboard">
          <Button className="bg-primary hover:bg-primary/90 glow-purple gap-2">
            <Plus className="w-4 h-4" />
            Generate New
          </Button>
        </Link>
      </div>

      {/* Kundli grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kundlis.map((kundli) => (
          <Card key={kundli.id} className="bg-card/50 border-border backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-colors">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <h3 className="text-xl font-bold text-white">{kundli.name}</h3>
            </div>
            
            <CardContent className="p-4 space-y-4">
              {/* Birth details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Birth Date</span>
                  <span className="ml-auto text-foreground font-medium">{kundli.birthDate}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Birth Time</span>
                  <span className="ml-auto text-foreground font-medium">{kundli.birthTime}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Place</span>
                  <span className="ml-auto text-foreground font-medium truncate max-w-[120px]">{kundli.place}</span>
                </div>
              </div>

              {/* Generated date */}
              <p className="text-xs text-muted-foreground">
                Generated: {kundli.generatedAt}
              </p>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-primary hover:bg-primary/90 gap-2">
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Link href="/chat" className="flex-1">
                  <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/10 gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
