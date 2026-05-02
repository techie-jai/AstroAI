"use client"

import { useState } from "react"
import { 
  Calendar, Clock, MapPin, Sparkles, Star, Sun, Moon, 
  Download, MessageCircle, ChevronDown, ChevronUp, Zap,
  Globe, ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Sample kundli data
const kundliData = {
  name: "Neha Verma",
  birthDate: "2000-01-01",
  birthTime: "12:00",
  latitude: 28.6139,
  longitude: 77.2090,
  place: "New Delhi, India",
  
  panchanga: {
    tithi: "Krishna Ekadashi",
    nakshatra: "Swati",
    yoga: "Sukarma",
    karana: "Bava",
    vaara: "Saturday"
  },
  
  ayanamsa: {
    name: "True Chitra Paksha",
    value: 23.8399943472118
  },
  
  planets: [
    { name: "Sun", sign: "Sagittarius", house: 10, nakshatra: "Purva Ashadha", degree: 15.5, color: "planet-sun" },
    { name: "Moon", sign: "Libra", house: 8, nakshatra: "Swati", degree: 22.3, color: "planet-moon" },
    { name: "Mars", sign: "Aquarius", house: 12, nakshatra: "Shatabhisha", degree: 8.7, color: "planet-mars" },
    { name: "Mercury", sign: "Sagittarius", house: 10, nakshatra: "Mula", degree: 3.2, color: "planet-mercury" },
    { name: "Jupiter", sign: "Aries", house: 2, nakshatra: "Ashwini", degree: 12.8, color: "planet-jupiter" },
    { name: "Venus", sign: "Scorpio", house: 9, nakshatra: "Anuradha", degree: 18.4, color: "planet-venus" },
    { name: "Saturn", sign: "Aries", house: 2, nakshatra: "Bharani", degree: 5.1, color: "planet-saturn" },
    { name: "Rahu", sign: "Cancer", house: 5, nakshatra: "Pushya", degree: 27.9, color: "planet-rahu" },
    { name: "Ketu", sign: "Capricorn", house: 11, nakshatra: "Shravana", degree: 27.9, color: "planet-ketu" },
  ],
  
  additionalData: {
    house1Sign: "Pisces",
    house1Lord: "Jupiter",
    house2Sign: "Aries",
    house2Lord: "Mars",
    jupiterSign: "Aries",
  }
}

// Orbiting planets component
function OrbitingPlanets() {
  const planets = [
    { name: "Sun", size: 20, orbit: 60, duration: 20, color: "from-yellow-400 to-orange-500" },
    { name: "Moon", size: 12, orbit: 90, duration: 15, color: "from-gray-300 to-gray-400" },
    { name: "Mars", size: 10, orbit: 120, duration: 25, color: "from-red-500 to-red-600" },
    { name: "Jupiter", size: 16, orbit: 150, duration: 35, color: "from-yellow-500 to-amber-600" },
    { name: "Saturn", size: 14, orbit: 180, duration: 45, color: "from-purple-400 to-purple-600" },
  ]
  
  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      {/* Central glow */}
      <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 opacity-30 blur-2xl animate-pulse-glow" />
      
      {/* Center logo */}
      <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center z-10 glow-purple">
        <Sparkles className="w-8 h-8 text-white" />
      </div>
      
      {/* Orbit rings */}
      {planets.map((planet, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full border border-purple-500/20"
          style={{
            width: `${planet.orbit * 2}px`,
            height: `${planet.orbit * 2}px`,
          }}
        />
      ))}
      
      {/* Planets */}
      {planets.map((planet, i) => (
        <div
          key={planet.name}
          className="absolute animate-orbit"
          style={{
            '--orbit-radius': `${planet.orbit}px`,
            '--orbit-duration': `${planet.duration}s`,
            animationDelay: `${i * -5}s`,
          } as React.CSSProperties}
        >
          <div 
            className={`rounded-full bg-gradient-to-br ${planet.color} shadow-lg`}
            style={{ width: `${planet.size}px`, height: `${planet.size}px` }}
            title={planet.name}
          />
        </div>
      ))}
    </div>
  )
}

// Section card component
function SectionCard({ 
  title, 
  icon: Icon, 
  children, 
  gradient = "from-purple-500/20 to-transparent",
  collapsible = false
}: { 
  title: string
  icon: React.ElementType
  children: React.ReactNode
  gradient?: string
  collapsible?: boolean
}) {
  const [isOpen, setIsOpen] = useState(true)
  
  return (
    <div className="cosmic-card rounded-2xl overflow-hidden">
      {/* Glowing top bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      
      <div 
        className={`flex items-center justify-between p-5 ${collapsible ? 'cursor-pointer hover:bg-purple-500/5' : ''}`}
        onClick={() => collapsible && setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        {collapsible && (
          isOpen ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </div>
      
      {isOpen && (
        <div className="px-5 pb-5">
          {children}
        </div>
      )}
    </div>
  )
}

// Data item component
function DataItem({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="relative pl-3 border-l-2 border-purple-500/30">
      <p className="text-xs text-muted-foreground uppercase tracking-wider">{label}</p>
      <p className={`font-semibold ${accent ? 'text-cyan-400' : 'text-foreground'}`}>{value}</p>
    </div>
  )
}

// Planet card component
function PlanetCard({ planet }: { planet: typeof kundliData.planets[0] }) {
  return (
    <div className="group cosmic-card rounded-xl p-4 hover:bg-purple-500/10 transition-all duration-300">
      <div className="flex items-start gap-4">
        {/* Planet icon */}
        <div className="relative">
          <div className={`w-12 h-12 rounded-full ${planet.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
            <span className="text-xs font-bold text-white">{planet.name.slice(0, 2)}</span>
          </div>
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-full ${planet.color} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`} />
        </div>
        
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-purple-300 group-hover:text-purple-200 transition-colors">
            {planet.name}
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Sign:</span>
              <span className="ml-2 text-foreground">{planet.sign}</span>
            </div>
            <div>
              <span className="text-muted-foreground">House:</span>
              <span className="ml-2 text-cyan-400">{planet.house}</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground">Nakshatra:</span>
              <span className="ml-2 text-foreground">{planet.nakshatra}</span>
            </div>
          </div>
        </div>
        
        {/* Degree badge */}
        <div className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs font-mono text-purple-300">
          {planet.degree.toFixed(1)}°
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <div className="relative space-y-8 min-h-screen pb-8">
      {/* Background effects */}
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />
      
      {/* Floating stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
                <Star className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">
                  Kundli Results
                </h1>
                <p className="text-muted-foreground">
                  Birth Chart Analysis for <span className="text-cyan-400">{kundliData.name}</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 gap-2 glow-cyan">
              <Download className="w-4 h-4" />
              Download PDF
            </Button>
            <Link href="/chat">
              <Button variant="outline" className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 gap-2">
                <MessageCircle className="w-4 h-4" />
                Chat with AI
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Orbiting planets visualization */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-transparent" />
        <OrbitingPlanets />
        <div className="absolute bottom-4 left-4 right-4 text-center">
          <p className="text-sm text-muted-foreground">Interactive Planetary Visualization</p>
        </div>
      </div>

      {/* Birth Information */}
      <SectionCard title="Birth Information" icon={Calendar} gradient="from-cyan-500/50 to-purple-500/30">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DataItem label="Name" value={kundliData.name} />
          <DataItem label="Place of Birth" value={kundliData.place} />
          <DataItem label="Date" value={kundliData.birthDate} />
          <DataItem label="Time" value={kundliData.birthTime} accent />
          <DataItem label="Latitude" value={kundliData.latitude.toString()} />
          <DataItem label="Longitude" value={kundliData.longitude.toString()} />
        </div>
      </SectionCard>

      {/* Panchanga */}
      <SectionCard title="Panchanga (Astrological Calendar)" icon={Calendar} gradient="from-purple-500/50 to-pink-500/30">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(kundliData.panchanga).map(([key, value]) => (
            <div key={key} className="cosmic-card rounded-xl p-4 text-center hover:bg-purple-500/10 transition-colors">
              <p className="text-xs text-purple-400 uppercase tracking-wider mb-1">{key}</p>
              <p className="font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Ayanamsa */}
      <SectionCard title="Ayanamsa (Precession Correction)" icon={Globe} gradient="from-pink-500/50 to-purple-500/30">
        <div className="grid md:grid-cols-2 gap-6">
          <DataItem label="Name" value={kundliData.ayanamsa.name} />
          <DataItem label="Value" value={kundliData.ayanamsa.value.toString()} accent />
        </div>
      </SectionCard>

      {/* Houses and Planetary Positions */}
      <SectionCard title="Houses and Planetary Positions" icon={Sun} gradient="from-yellow-500/50 to-orange-500/30" collapsible>
        <div className="grid md:grid-cols-2 gap-4">
          {kundliData.planets.map((planet) => (
            <PlanetCard key={planet.name} planet={planet} />
          ))}
        </div>
      </SectionCard>

      {/* Additional Astrological Data */}
      <SectionCard title="Additional Astrological Data" icon={Sparkles} gradient="from-cyan-500/50 to-blue-500/30" collapsible>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(kundliData.additionalData).map(([key, value]) => {
            const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
            return (
              <div key={key} className="cosmic-card rounded-xl p-4 hover:bg-purple-500/10 transition-colors">
                <DataItem label={formattedKey} value={value} />
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* AI Analysis CTA */}
      <div className="cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
        <div className="p-6 bg-gradient-to-r from-purple-900/40 to-cyan-900/20">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center glow-purple animate-pulse-glow">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold gradient-text-purple mb-2">AI Astrological Analysis</h3>
              <p className="text-muted-foreground mb-4">
                Get a comprehensive AI-powered analysis of your kundli using advanced algorithms that cross-reference 
                Palmistry, Numerology, and Astrology for accurate predictions.
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 gap-2 glow-purple text-lg px-6 py-3 h-auto">
                <Zap className="w-5 h-5" />
                Generate AI Analysis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Download & Chat Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="cosmic-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Download className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-bold text-foreground">Download Results</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Download a professional PDF report of your complete kundli analysis.
          </p>
          <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 gap-2">
            <Download className="w-4 h-4" />
            Download PDF Report
          </Button>
        </div>
        
        <div className="cosmic-card rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageCircle className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-bold text-foreground">Chat About Kundli</h3>
          </div>
          <p className="text-muted-foreground mb-4">
            Ask questions about your kundli and get personalized AI-powered insights.
          </p>
          <Link href="/chat">
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 gap-2">
              <MessageCircle className="w-4 h-4" />
              Start Chat Session
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
