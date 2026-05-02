"use client"

import { useState } from "react"
import { Heart, User, MapPin, Calendar, Clock, ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

// Floating hearts animation
function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${5 + i * 8}%`,
            top: `${10 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + i * 0.5}s`,
          }}
        >
          <Heart 
            className={cn(
              "text-pink-400",
              i % 3 === 0 ? "w-6 h-6" : i % 2 === 0 ? "w-4 h-4" : "w-5 h-5"
            )} 
            fill="currentColor"
          />
        </div>
      ))}
    </div>
  )
}

export default function KundliMatchingPage() {
  const [matchingMethod, setMatchingMethod] = useState<"north" | "south">("north")
  const [step, setStep] = useState(1)
  const [boyDetails, setBoyDetails] = useState({
    fullName: "",
    placeOfBirth: "",
    latitude: "0",
    longitude: "0",
    timezoneOffset: "0",
    year: "2000",
    month: "January",
    day: "1",
    hour: "12",
    minute: "0",
  })
  const [girlDetails, setGirlDetails] = useState({
    fullName: "",
    placeOfBirth: "",
    latitude: "0",
    longitude: "0",
    timezoneOffset: "0",
    year: "2000",
    month: "January",
    day: "1",
    hour: "12",
    minute: "0",
  })

  const currentDetails = step === 1 ? boyDetails : girlDetails
  const setCurrentDetails = step === 1 ? setBoyDetails : setGirlDetails
  const personLabel = step === 1 ? "Boy" : "Girl"

  return (
    <div className="relative space-y-8 max-w-4xl mx-auto min-h-screen pb-8">
      {/* Background effects */}
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <FloatingHearts />

      {/* Header */}
      <div className="relative text-center space-y-4 py-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-red-500/30 blur-3xl rounded-full" />
          <Heart className="relative w-16 h-16 text-pink-500 mx-auto animate-pulse-glow" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">Kundli Matching</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Find compatibility between two birth charts
          <Star className="w-4 h-4 text-amber-400" />
        </p>
      </div>

      {/* Matching method selection */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-pink-500 via-red-500 to-pink-500" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-red-500/20 border border-pink-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Select Matching Method</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              className={cn(
                "relative h-16 rounded-xl font-medium text-base transition-all duration-300 overflow-hidden group",
                matchingMethod === "north"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-purple"
                  : "cosmic-card hover:bg-purple-500/10 text-foreground"
              )}
              onClick={() => setMatchingMethod("north")}
            >
              {matchingMethod === "north" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              <span className="relative">North Indian (Ashtakoota)</span>
            </button>
            <button
              className={cn(
                "relative h-16 rounded-xl font-medium text-base transition-all duration-300 overflow-hidden group",
                matchingMethod === "south"
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-purple"
                  : "cosmic-card hover:bg-purple-500/10 text-foreground"
              )}
              onClick={() => setMatchingMethod("south")}
            >
              {matchingMethod === "south" && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              )}
              <span className="relative">South Indian (Tamil)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500",
                step === 1
                  ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white glow-cyan scale-110"
                  : "bg-secondary/50 text-muted-foreground"
              )}
            >
              1
            </div>
            <div className="flex-1 h-1 max-w-[200px] bg-secondary/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500",
                step === 2
                  ? "bg-gradient-to-br from-pink-500 to-red-500 text-white glow-magenta scale-110"
                  : "bg-secondary/50 text-muted-foreground"
              )}
            >
              2
            </div>
          </div>

          {/* Person details */}
          <div className="flex items-center gap-3 mb-6">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              step === 1 
                ? "bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-500/30"
                : "bg-gradient-to-br from-pink-500/30 to-red-500/20 border border-pink-500/30"
            )}>
              <User className={cn("w-5 h-5", step === 1 ? "text-cyan-400" : "text-pink-400")} />
            </div>
            <h3 className="text-xl font-bold text-foreground">{personLabel}&apos;s Details</h3>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground font-medium">
                <User className="w-4 h-4 text-purple-400" />
                Full Name
              </Label>
              <Input
                placeholder="Enter full name"
                value={currentDetails.fullName}
                onChange={(e) => setCurrentDetails({ ...currentDetails, fullName: e.target.value })}
                className="bg-secondary/50 border-border focus:border-purple-500/50"
              />
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground font-medium">
                <MapPin className="w-4 h-4 text-pink-400" />
                Place of Birth
              </Label>
              <Input
                placeholder="e.g., Mumbai, IN"
                value={currentDetails.placeOfBirth}
                onChange={(e) => setCurrentDetails({ ...currentDetails, placeOfBirth: e.target.value })}
                className="bg-secondary/50 border-border focus:border-purple-500/50"
              />
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Latitude</Label>
              <Input
                type="number"
                value={currentDetails.latitude}
                onChange={(e) => setCurrentDetails({ ...currentDetails, latitude: e.target.value })}
                className="bg-secondary/50 border-border focus:border-purple-500/50"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Longitude</Label>
              <Input
                type="number"
                value={currentDetails.longitude}
                onChange={(e) => setCurrentDetails({ ...currentDetails, longitude: e.target.value })}
                className="bg-secondary/50 border-border focus:border-purple-500/50"
              />
            </div>

            {/* Timezone Offset */}
            <div className="space-y-2">
              <Label className="text-foreground font-medium">Timezone Offset (hours)</Label>
              <Input
                type="number"
                value={currentDetails.timezoneOffset}
                onChange={(e) => setCurrentDetails({ ...currentDetails, timezoneOffset: e.target.value })}
                className="bg-secondary/50 border-border focus:border-purple-500/50"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground font-medium">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Date of Birth
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Year"
                  value={currentDetails.year}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, year: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-purple-500/50 w-24"
                />
                <Select
                  value={currentDetails.month}
                  onValueChange={(value) => setCurrentDetails({ ...currentDetails, month: value })}
                >
                  <SelectTrigger className="bg-secondary/50 border-border focus:border-purple-500/50 flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  placeholder="Day"
                  min="1"
                  max="31"
                  value={currentDetails.day}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, day: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-purple-500/50 w-16"
                />
              </div>
            </div>

            {/* Time of Birth */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                Time of Birth
              </Label>
              <div className="flex gap-2 max-w-xs">
                <Input
                  type="number"
                  placeholder="Hour"
                  min="0"
                  max="23"
                  value={currentDetails.hour}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, hour: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-purple-500/50"
                />
                <span className="flex items-center text-2xl text-muted-foreground">:</span>
                <Input
                  type="number"
                  placeholder="Minute"
                  min="0"
                  max="59"
                  value={currentDetails.minute}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, minute: e.target.value })}
                  className="bg-secondary/50 border-border focus:border-purple-500/50"
                />
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 gap-2"
              onClick={() => setStep(1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step === 1 ? (
              <Button
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 glow-cyan gap-2 px-6"
                onClick={() => setStep(2)}
              >
                Next: Girl&apos;s Details
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 glow-magenta gap-2 px-8 py-3 h-auto text-lg font-semibold">
                <Heart className="w-5 h-5" fill="currentColor" />
                Find Match
                <Sparkles className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Info card */}
      <div className="relative cosmic-card rounded-2xl p-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">About Kundli Matching</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kundli matching, also known as Kundali Milan, is an ancient Vedic practice to assess the compatibility 
              of two individuals based on their birth charts. The Ashtakoota system evaluates 8 key aspects (Gunas) 
              with a maximum score of 36 points. A score above 18 is considered favorable for marriage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
