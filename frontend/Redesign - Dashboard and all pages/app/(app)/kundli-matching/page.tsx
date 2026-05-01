"use client"

import { useState } from "react"
import { Heart, User, MapPin, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
]

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
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-4">
        <Heart className="w-12 h-12 text-pink-400 mx-auto" />
        <h1 className="text-3xl font-bold text-foreground">Kundli Matching</h1>
        <p className="text-muted-foreground">Find compatibility between two birth charts</p>
      </div>

      {/* Matching method selection */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-foreground">Select Matching Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className={cn(
                "h-14 text-base transition-all",
                matchingMethod === "north"
                  ? "bg-primary text-primary-foreground border-primary glow-purple"
                  : "border-border hover:bg-muted"
              )}
              onClick={() => setMatchingMethod("north")}
            >
              North Indian (Ashtakoota)
            </Button>
            <Button
              variant="outline"
              className={cn(
                "h-14 text-base transition-all",
                matchingMethod === "south"
                  ? "bg-primary text-primary-foreground border-primary glow-purple"
                  : "border-border hover:bg-muted"
              )}
              onClick={() => setMatchingMethod("south")}
            >
              South Indian (Tamil)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <Card className="bg-card/50 border-border backdrop-blur-sm">
        <CardContent className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step === 1
                  ? "bg-primary text-primary-foreground glow-purple"
                  : "bg-muted text-muted-foreground"
              )}
            >
              1
            </div>
            <div className="flex-1 h-px bg-border max-w-xs" />
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all",
                step === 2
                  ? "bg-primary text-primary-foreground glow-purple"
                  : "bg-muted text-muted-foreground"
              )}
            >
              2
            </div>
          </div>

          {/* Person details */}
          <h3 className="text-xl font-bold text-foreground mb-6">{personLabel}&apos;s Details</h3>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                placeholder="Enter full name"
                value={currentDetails.fullName}
                onChange={(e) => setCurrentDetails({ ...currentDetails, fullName: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground">
                <MapPin className="w-4 h-4" />
                Place of Birth
              </Label>
              <Input
                placeholder="e.g., Mumbai, IN"
                value={currentDetails.placeOfBirth}
                onChange={(e) => setCurrentDetails({ ...currentDetails, placeOfBirth: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <Label className="text-foreground">Latitude</Label>
              <Input
                type="number"
                value={currentDetails.latitude}
                onChange={(e) => setCurrentDetails({ ...currentDetails, latitude: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <Label className="text-foreground">Longitude</Label>
              <Input
                type="number"
                value={currentDetails.longitude}
                onChange={(e) => setCurrentDetails({ ...currentDetails, longitude: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            {/* Timezone Offset */}
            <div className="space-y-2">
              <Label className="text-foreground">Timezone Offset (hours)</Label>
              <Input
                type="number"
                value={currentDetails.timezoneOffset}
                onChange={(e) => setCurrentDetails({ ...currentDetails, timezoneOffset: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Year"
                  value={currentDetails.year}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, year: e.target.value })}
                  className="bg-input border-border w-24"
                />
                <Select
                  value={currentDetails.month}
                  onValueChange={(value) => setCurrentDetails({ ...currentDetails, month: value })}
                >
                  <SelectTrigger className="bg-input border-border flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
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
                  className="bg-input border-border w-16"
                />
              </div>
            </div>

            {/* Time of Birth */}
            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-foreground">
                <Clock className="w-4 h-4" />
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
                  className="bg-input border-border"
                />
                <span className="flex items-center text-muted-foreground">:</span>
                <Input
                  type="number"
                  placeholder="Minute"
                  min="0"
                  max="59"
                  value={currentDetails.minute}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, minute: e.target.value })}
                  className="bg-input border-border"
                />
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              className="border-border"
              onClick={() => setStep(1)}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step === 1 ? (
              <Button
                className="bg-primary hover:bg-primary/90 glow-purple"
                onClick={() => setStep(2)}
              >
                Next: Girl&apos;s Details
              </Button>
            ) : (
              <Button className="bg-pink-500 hover:bg-pink-600 glow-magenta">
                Find Match
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
