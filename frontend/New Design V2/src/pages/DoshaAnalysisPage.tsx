import { useState } from "react"
import { Calendar, AlertTriangle, Info, ChevronDown, ChevronUp, Sparkles, Shield, Activity } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

const kundlis = [{ id: "1", name: "Neha Verma" }, { id: "2", name: "Aditya Sharma" }, { id: "3", name: "aoud" }]
const doshaStats = [
  { label: "Total Doshas", value: 8, color: "from-purple-500 to-pink-500", icon: Activity },
  { label: "Severe", value: 0, color: "from-red-500 to-orange-500", icon: AlertTriangle },
  { label: "Moderate", value: 0, color: "from-amber-500 to-yellow-500", icon: Info },
  { label: "Mild", value: 8, color: "from-green-500 to-emerald-500", icon: Shield },
]
const dashas = [
  { name: "Mahadasha: Jupiter", planet: "Jupiter", period: "Sep 2014 - Sep 2030", progress: 72.6, endsIn: "4 Years, 4 Months, 23 Days", color: "from-amber-500 to-orange-500" },
  { name: "Antardasha: Moon", planet: "Moon", period: "Jan 2026 - May 2027", progress: 20.5, endsIn: "1 Year, 21 Days", color: "from-gray-300 to-gray-500" },
]
const doshas = [
  { name: "Mangal Dosha", description: "Not present in this chart.", present: false },
  { name: "Kaal Sarp Dosha", description: "Not present in this chart.", present: false },
  { name: "Pitra Dosha", description: "Not present in this chart.", present: false },
  { name: "Guru Chandal Dosha", description: "Not present in this chart.", present: false },
  { name: "Kemadruma Dosha", description: "Not present in this chart.", present: false },
]

function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="absolute rounded-full animate-float opacity-30" style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 25}%`, width: `${60 + i * 10}px`, height: `${60 + i * 10}px`, background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(139, 92, 246, 0.3)' : 'rgba(6, 182, 212, 0.2)'}, transparent)`, animationDelay: `${i * 0.5}s`, animationDuration: `${5 + i}s` }} />
      ))}
    </div>
  )
}

export default function DoshaAnalysisPage() {
  const [selectedKundli, setSelectedKundli] = useState("1")
  const [majorDoshasOpen, setMajorDoshasOpen] = useState(true)

  return (
    <div className="relative space-y-8 min-h-screen">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <FloatingOrbs />

      <div className="relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center glow-purple animate-float">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">Dosha & Dasha Analysis</h1>
            <p className="text-muted-foreground flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400" />Comprehensive astrological analysis of your kundli</p>
          </div>
        </div>
      </div>

      <div className="relative space-y-2">
        <label className="text-sm font-medium text-foreground">Select Kundli</label>
        <Select value={selectedKundli} onValueChange={setSelectedKundli}>
          <SelectTrigger className="w-full max-w-md bg-secondary/50 border-purple-500/30 focus:border-purple-500/50"><SelectValue /></SelectTrigger>
          <SelectContent className="bg-card border-border">{kundlis.map((k) => (<SelectItem key={k.id} value={k.id}>{k.name}</SelectItem>))}</SelectContent>
        </Select>
      </div>

      <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
        {doshaStats.map((stat, i) => (
          <div key={stat.label} className="cosmic-card rounded-xl p-6 text-center group hover:scale-[1.02] transition-all duration-300" style={{ animationDelay: `${i * 0.1}s` }}>
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} mx-auto mb-3 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all`}><stat.icon className="w-6 h-6 text-white" /></div>
            <p className="text-4xl font-bold text-foreground group-hover:gradient-text-purple transition-all">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 border border-purple-500/30 flex items-center justify-center"><Calendar className="w-5 h-5 text-purple-400" /></div>
            <h2 className="text-xl font-bold text-foreground">Current Planetary Periods (Dashas)</h2>
          </div>
          <div className="space-y-8">
            {dashas.map((dasha) => (
              <div key={dasha.name} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${dasha.color} flex items-center justify-center shadow-lg`}><span className="text-xs font-bold text-white">{dasha.planet.slice(0, 2)}</span></div>
                    <div><h4 className="font-semibold text-purple-300 text-glow-purple">{dasha.name}</h4><p className="text-sm text-muted-foreground">{dasha.period}</p></div>
                  </div>
                  <div className="text-right"><p className="text-xs text-muted-foreground">Ends in</p><p className="text-sm font-medium text-cyan-400">{dasha.endsIn}</p></div>
                </div>
                <div className="relative"><Progress value={dasha.progress} className="h-3 bg-secondary/50" /><div className="absolute top-0 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${dasha.progress}%` }} /></div>
                <p className="text-xs text-muted-foreground">{dasha.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/30 to-orange-500/20 border border-amber-500/30 flex items-center justify-center animate-pulse-glow"><Info className="w-5 h-5 text-amber-400" /></div>
            <h2 className="text-xl font-bold text-foreground">What This Means</h2>
          </div>
          <div className="space-y-4">
            <div className="p-5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 neon-border-gold">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0"><AlertTriangle className="w-5 h-5 text-amber-400" /></div>
                <p className="font-semibold text-amber-400 text-glow-gold">Dusthana Period - Be cautious with expenses and health. Hidden enemies may surface.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-pink-500 to-red-500" />
        <div className="p-6 cursor-pointer hover:bg-purple-500/5 transition-colors" onClick={() => setMajorDoshasOpen(!majorDoshasOpen)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-red-500/20 border border-pink-500/30 flex items-center justify-center"><Shield className="w-5 h-5 text-pink-400" /></div>
              <h2 className="text-xl font-bold text-foreground">Major Doshas</h2>
            </div>
            {majorDoshasOpen ? <ChevronUp className="w-6 h-6 text-muted-foreground" /> : <ChevronDown className="w-6 h-6 text-muted-foreground" />}
          </div>
        </div>
        {majorDoshasOpen && (
          <div className="px-6 pb-6 space-y-4">
            {doshas.map((dosha, i) => (
              <div key={dosha.name} className={cn("p-5 rounded-xl border transition-all duration-300 hover:scale-[1.01] group", dosha.present ? "bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30 neon-border-gold" : "cosmic-card hover:bg-purple-500/5")} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", dosha.present ? "bg-red-500/20 border border-red-500/30" : "bg-green-500/20 border border-green-500/30")}>
                      {dosha.present ? <AlertTriangle className="w-6 h-6 text-red-400" /> : <Shield className="w-6 h-6 text-green-400" />}
                    </div>
                    <div><h4 className="font-semibold text-pink-300 group-hover:text-pink-200 transition-colors">{dosha.name}</h4><p className="text-sm text-muted-foreground">{dosha.description}</p></div>
                  </div>
                  <span className={cn("px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider", dosha.present ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30")}>{dosha.present ? "Present" : "Not Present"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
