"use client"

import { useState } from "react"
import { Calendar, AlertTriangle, Info, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const kundlis = [
  { id: "1", name: "Neha Verma" },
  { id: "2", name: "Aditya Sharma" },
  { id: "3", name: "aoud" },
]

const doshaStats = [
  { label: "Total Doshas", value: 8, color: "text-purple-400" },
  { label: "Severe", value: 0, color: "text-red-400" },
  { label: "Moderate", value: 0, color: "text-amber-400" },
  { label: "Mild", value: 8, color: "text-purple-400" },
]

const dashas = [
  {
    name: "Mahadasha: Jupiter",
    period: "Sep 2014 - Sep 2030",
    progress: 72.6,
    endsIn: "4 Years, 4 Months, 23 Days",
  },
  {
    name: "Antardasha: Moon",
    period: "Jan 2026 - May 2027",
    progress: 20.5,
    endsIn: "1 Year, 21 Days",
  },
]

const doshas = [
  { name: "Mangal Dosha", description: "Not present in this chart.", present: false },
  { name: "Kaal Sarp Dosha", description: "Not present in this chart.", present: false },
  { name: "Pitra Dosha", description: "Not present in this chart.", present: false },
  { name: "Guru Chandal Dosha", description: "Not present in this chart.", present: false },
  { name: "Kemadruma Dosha", description: "Not present in this chart.", present: false },
]

export default function DoshaAnalysisPage() {
  const [selectedKundli, setSelectedKundli] = useState("1")
  const [majorDoshasOpen, setMajorDoshasOpen] = useState(true)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dosha & Dasha Analysis</h1>
        <p className="text-muted-foreground mt-1">Comprehensive astrological analysis of your kundli</p>
      </div>

      {/* Kundli selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Kundli</label>
        <Select value={selectedKundli} onValueChange={setSelectedKundli}>
          <SelectTrigger className="w-full max-w-md bg-input border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {kundlis.map((kundli) => (
              <SelectItem key={kundli.id} value={kundli.id}>
                {kundli.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {doshaStats.map((stat) => (
          <Card key={stat.label} className="bg-card/50 border-border backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <p className={cn("text-4xl font-bold", stat.color)}>{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current Planetary Periods */}
      <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-primary/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Calendar className="w-5 h-5" />
            Current Planetary Periods (Dashas)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {dashas.map((dasha) => (
            <div key={dasha.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary">{dasha.name}</h4>
                  <p className="text-sm text-muted-foreground">{dasha.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Ends in</p>
                  <p className="text-sm font-medium text-primary">{dasha.endsIn}</p>
                </div>
              </div>
              <Progress value={dasha.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">{dasha.progress}% complete</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* What This Means */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Info className="w-5 h-5 text-amber-400" />
            What This Means
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-400">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Dusthana Period - Be cautious with expenses and health. Hidden enemies may surface.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-amber-500/5 border border-border">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">
                  <AlertTriangle className="w-4 h-4 inline mr-1 text-amber-400" />
                  Dusthana Period (6th/8th/12th House Lord)
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  This period is ruled by the lord of a dusthana (difficult) house. Be cautious with finances, health, and be aware of potential obstacles. Stay vigilant.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Major Doshas */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader
          className="cursor-pointer"
          onClick={() => setMajorDoshasOpen(!majorDoshasOpen)}
        >
          <CardTitle className="flex items-center justify-between text-foreground">
            <span>Major Doshas</span>
            {majorDoshasOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </CardTitle>
        </CardHeader>
        {majorDoshasOpen && (
          <CardContent className="space-y-4">
            {doshas.map((dosha) => (
              <div
                key={dosha.name}
                className={cn(
                  "p-4 rounded-lg border",
                  dosha.present
                    ? "bg-red-500/10 border-red-500/30"
                    : "bg-amber-500/5 border-border"
                )}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-pink-400">{dosha.name}</h4>
                    <p className="text-sm text-muted-foreground">{dosha.description}</p>
                  </div>
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      dosha.present
                        ? "bg-red-500/20 text-red-400"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {dosha.present ? "PRESENT" : "NOT PRESENT"}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
