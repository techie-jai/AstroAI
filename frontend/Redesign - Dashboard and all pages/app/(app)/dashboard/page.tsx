"use client"

import { useState } from "react"
import { TrendingUp, Star, Zap, Clock, Check, MessageCircle, Sparkles, BarChart3, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

const stats = [
  { label: "Total Kundlis", value: "12", icon: TrendingUp, color: "text-foreground" },
  { label: "Latest Kundli", value: "Neha Verma", icon: Star, color: "text-amber-400" },
  { label: "With Analysis", value: "3", icon: Zap, color: "text-amber-400" },
  { label: "Subscription", value: "Free", icon: Clock, color: "text-cyan-400" },
]

const features = [
  "Accurate Vedic calculations",
  "AI-powered insights",
  "Chat with your kundli",
  "Download PDF reports",
]

export default function DashboardPage() {
  const [formData, setFormData] = useState({
    name: "",
    placeOfBirth: "",
    latitude: "0",
    longitude: "0",
    timezoneOffset: "5.5",
    year: "2026",
    month: "1",
    day: "1",
    hour: "12",
    minute: "0",
  })

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome, Lemniscate Lab!</h1>
        <p className="text-muted-foreground mt-1">Your personalized astrological dashboard</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="bg-card/50 border-border backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Generate New Kundli Form */}
        <div className="lg:col-span-2">
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-foreground">Generate New Kundli</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Name</Label>
                <Input
                  id="name"
                  placeholder="Your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              {/* Place of Birth */}
              <div className="space-y-2">
                <Label htmlFor="place" className="text-foreground">Place of Birth</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="place"
                    placeholder="Search for a city, hospital, landmark..."
                    value={formData.placeOfBirth}
                    onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                    className="bg-input border-border pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Powered by Google Maps. Search for exact locations to get high-precision coordinates.
                </p>
              </div>

              {/* Latitude & Longitude */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-foreground">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-foreground">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Timezone Offset */}
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-foreground">Timezone Offset (UTC)</Label>
                <Input
                  id="timezone"
                  type="number"
                  step="0.5"
                  value={formData.timezoneOffset}
                  onChange={(e) => setFormData({ ...formData, timezoneOffset: e.target.value })}
                  className="bg-input border-border"
                />
              </div>

              {/* Date of Birth */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-foreground">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-foreground">Month</Label>
                  <Input
                    id="month"
                    type="number"
                    min="1"
                    max="12"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="day" className="text-foreground">Day</Label>
                  <Input
                    id="day"
                    type="number"
                    min="1"
                    max="31"
                    value={formData.day}
                    onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              {/* Time of Birth */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hour" className="text-foreground">Hour</Label>
                  <Input
                    id="hour"
                    type="number"
                    min="0"
                    max="23"
                    value={formData.hour}
                    onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minute" className="text-foreground">Minute</Label>
                  <Input
                    id="minute"
                    type="number"
                    min="0"
                    max="59"
                    value={formData.minute}
                    onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 glow-purple">
                Generate Kundli
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-primary/30">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10">
                  <MessageCircle className="w-4 h-4" />
                  Live Chat
                </Button>
              </Link>
              <Link href="/chat">
                <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10">
                  <Sparkles className="w-4 h-4" />
                  Chat with AI
                </Button>
              </Link>
              <Link href="/analysis">
                <Button variant="outline" className="w-full justify-start gap-2 border-primary/30 hover:bg-primary/10">
                  <BarChart3 className="w-4 h-4" />
                  View Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Features */}
          <Card className="bg-card/50 border-border backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
