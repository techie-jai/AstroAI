"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  Hand,
  Heart,
  Brain,
  Activity,
  TrendingUp,
  Sparkles,
  RefreshCw,
  MessageCircle,
  Download,
  ChevronDown,
  ChevronUp,
  Check,
  Zap,
  Calendar,
  Star,
  Sun,
  Moon,
  Target,
  Flame,
  Shield,
  Eye,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
} from "recharts"

// ============================================================================
// TYPES
// ============================================================================

export interface PalmLine {
  name: string
  strength: "strong" | "moderate" | "faint"
  description: string
  details: string
}

export interface PlanetaryMount {
  name: string
  planet: string
  prominence: "prominent" | "normal" | "flat"
  location: string
  meaning: string
}

export interface LifeArea {
  title: string
  score: number
  description: string
}

export interface PalmistryData {
  id: string
  dominantHand: "right" | "left"
  handShape: string
  imageUrl: string
  overallReading: string
  lines: PalmLine[]
  mounts: PlanetaryMount[]
  lifeAreas: {
    love: LifeArea
    career: LifeArea
    health: LifeArea
    wealth: LifeArea
  }
  createdAt: string
}

interface PalmistryResultsProps {
  data: PalmistryData
  palmReadings?: PalmReading[]
  onReset: () => void
  onSelectReading?: (id: string) => void
}

interface PalmReading {
  id: string
  date: string
  hand: string
  type: string
}

// ============================================================================
// MOCK DATA
// ============================================================================

const mockPalmReadings: PalmReading[] = [
  { id: "PALM-2026-001", date: "2026-05-01", hand: "Right", type: "Square" },
  { id: "PALM-2026-002", date: "2026-04-28", hand: "Left", type: "Air" },
  { id: "PALM-2026-003", date: "2026-04-15", hand: "Right", type: "Water" },
]

// ============================================================================
// CONSTANTS
// ============================================================================

const lineIcons: Record<string, React.ReactNode> = {
  "Heart Line": <Heart className="h-5 w-5" />,
  "Head Line": <Brain className="h-5 w-5" />,
  "Life Line": <Activity className="h-5 w-5" />,
  "Fate Line": <TrendingUp className="h-5 w-5" />,
  "Sun Line": <Sun className="h-5 w-5" />,
}

const strengthColors = {
  strong: { 
    text: "text-emerald-400", 
    bg: "bg-emerald-500/20", 
    border: "border-emerald-500/50", 
    glow: "shadow-[0_0_15px_rgba(16,185,129,0.3)]",
    color: "#10b981"
  },
  moderate: { 
    text: "text-amber-400", 
    bg: "bg-amber-500/20", 
    border: "border-amber-500/50", 
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.3)]",
    color: "#f59e0b"
  },
  faint: { 
    text: "text-rose-400", 
    bg: "bg-rose-500/20", 
    border: "border-rose-500/50", 
    glow: "shadow-[0_0_15px_rgba(244,63,94,0.3)]",
    color: "#f43f5e"
  },
}

const prominenceColors = {
  prominent: { text: "text-emerald-400", bg: "bg-emerald-500/20", color: "#10b981" },
  normal: { text: "text-cyan-400", bg: "bg-cyan-500/20", color: "#06b6d4" },
  flat: { text: "text-rose-400", bg: "bg-rose-500/20", color: "#f43f5e" },
}

const planetColors: Record<string, string> = {
  Jupiter: "#f97316",
  Saturn: "#6366f1",
  Sun: "#eab308",
  Mercury: "#22c55e",
  Venus: "#ec4899",
  Moon: "#94a3b8",
  Mars: "#ef4444",
}

const lifeAreaColors = ["#ec4899", "#06b6d4", "#22c55e", "#f59e0b"]
const lifeAreaIcons = [Heart, Target, Activity, Zap]

// ============================================================================
// UTILITY COMPONENTS
// ============================================================================

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

// Custom Progress Bar Component
function ProgressBar({ 
  value, 
  color = "#ec4899",
  className = "" 
}: { 
  value: number
  color?: string
  className?: string 
}) {
  return (
    <div className={`h-1.5 w-full bg-white/10 rounded-full overflow-hidden ${className}`}>
      <div 
        className="h-full rounded-full transition-all duration-1000 ease-out"
        style={{ 
          width: `${value}%`, 
          backgroundColor: color,
          boxShadow: `0 0 10px ${color}80`
        }}
      />
    </div>
  )
}

// Custom Select Dropdown Component
function SelectDropdown({
  value,
  options,
  onChange,
  placeholder = "Select option"
}: {
  value: string
  options: PalmReading[]
  onChange: (value: string) => void
  placeholder?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selected = options.find(opt => opt.id === value)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2 w-[220px] px-3 py-2.5 bg-gray-900/80 border border-white/10 rounded-xl text-sm hover:border-purple-500/50 transition-all"
      >
        <div className="flex items-center gap-2 truncate">
          <Calendar className="h-4 w-4 text-purple-400 flex-shrink-0" />
          {selected ? (
            <span className="text-white truncate">{selected.id}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-2 w-full bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-1.5 max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange(option.id)
                    setIsOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all",
                    option.id === value
                      ? "bg-purple-500/20 text-purple-300"
                      : "hover:bg-white/5 text-gray-300"
                  )}
                >
                  <div>
                    <p className="font-mono text-xs text-purple-400">{option.id}</p>
                    <p className="text-xs text-gray-500">{option.date} • {option.hand} • {option.type}</p>
                  </div>
                  {option.id === value && <Check className="h-4 w-4 text-purple-400" />}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Tab Component
function Tabs({
  tabs,
  activeTab,
  onChange
}: {
  tabs: { id: string; label: string; icon: React.ReactNode }[]
  activeTab: string
  onChange: (id: string) => void
}) {
  return (
    <div className="flex bg-gray-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all",
            activeTab === tab.id
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          )}
        >
          {tab.icon}
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// CHART COMPONENTS
// ============================================================================

// Orbiting Planets Component
function OrbitingPlanets({ mounts }: { mounts: PlanetaryMount[] }) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)

  return (
    <div className="relative w-full aspect-square max-w-[280px] mx-auto">
      {/* Center glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-xl opacity-50 animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <Hand className="h-8 w-8 text-white" />
          </div>
        </div>
      </div>

      {/* Orbit rings with glow */}
      {[1, 2, 3].map((ring) => (
        <div
          key={ring}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div
            className="rounded-full border border-purple-500/20"
            style={{
              width: `${ring * 28 + 35}%`,
              height: `${ring * 28 + 35}%`,
              boxShadow: "0 0 10px rgba(168, 85, 247, 0.1)"
            }}
          />
        </div>
      ))}

      {/* Orbiting planets */}
      {mounts.slice(0, 7).map((mount, index) => {
        const orbitRadius = 38 + (index % 3) * 32
        const duration = 20 + index * 8
        const startAngle = (index / 7) * 360
        
        return (
          <div
            key={mount.name}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              animation: `spin-orbit ${duration}s linear infinite`,
              animationDelay: `-${(index / 7) * duration}s`,
            }}
          >
            <div
              className="pointer-events-auto"
              style={{
                transform: `translateX(${orbitRadius}px)`,
              }}
            >
              <div
                className={cn(
                  "relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all duration-300 hover:scale-125",
                  mount.prominence === "prominent" && "ring-2 ring-white/40"
                )}
                style={{
                  backgroundColor: planetColors[mount.planet] || "#8b5cf6",
                  boxShadow: `0 0 20px ${planetColors[mount.planet]}60`,
                  animation: `counter-spin ${duration}s linear infinite`,
                  animationDelay: `-${(index / 7) * duration}s`,
                }}
                onMouseEnter={() => setHoveredPlanet(mount.name)}
                onMouseLeave={() => setHoveredPlanet(null)}
              >
                <span className="text-white font-bold">{mount.planet.charAt(0)}</span>
                
                {/* Tooltip */}
                {hoveredPlanet === mount.name && (
                  <div 
                    className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-2 text-xs whitespace-nowrap z-50"
                    style={{ animation: "none" }}
                  >
                    <p className="text-white font-semibold">{mount.name}</p>
                    <p className={prominenceColors[mount.prominence].text}>{mount.prominence}</p>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 border-r border-b border-white/20 rotate-45" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-purple-400/60"
          style={{
            left: `${15 + Math.random() * 70}%`,
            top: `${15 + Math.random() * 70}%`,
            animation: `float-particle ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}

      {/* CSS Animations */}
      <style>{`
        @keyframes spin-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes float-particle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
          50% { transform: translateY(-15px) scale(1.5); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

// Life Areas Radar Chart
function LifeAreasRadarChart({ lifeAreas }: { lifeAreas: PalmistryData["lifeAreas"] }) {
  const data = [
    { subject: "Love", score: lifeAreas.love.score, fullMark: 100 },
    { subject: "Career", score: lifeAreas.career.score, fullMark: 100 },
    { subject: "Health", score: lifeAreas.health.score, fullMark: 100 },
    { subject: "Wealth", score: lifeAreas.wealth.score, fullMark: 100 },
  ]

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <defs>
            <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#9ca3af", fontSize: 12 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: "#6b7280", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="url(#radarGradient)"
            fill="url(#radarGradient)"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 17, 27, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.5)"
            }}
            labelStyle={{ color: "#fff" }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Line Strength Radial Chart
function LineStrengthChart({ lines }: { lines: PalmLine[] }) {
  const data = lines.map((line) => ({
    name: line.name.replace(" Line", ""),
    value: line.strength === "strong" ? 95 : line.strength === "moderate" ? 65 : 35,
    fill: strengthColors[line.strength].color,
  }))

  return (
    <div className="w-full h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="25%"
          outerRadius="90%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Legend
            iconSize={8}
            layout="horizontal"
            verticalAlign="bottom"
            wrapperStyle={{ fontSize: "11px", color: "#9ca3af" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 17, 27, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            }}
            formatter={(value) => [`${value}%`, "Strength"]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Mount Prominence Radial Chart
function MountProminenceChart({ mounts }: { mounts: PlanetaryMount[] }) {
  const data = mounts.map((mount) => ({
    name: mount.planet,
    value: mount.prominence === "prominent" ? 100 : mount.prominence === "normal" ? 60 : 25,
    fill: planetColors[mount.planet] || "#8b5cf6",
  }))

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="20%"
          outerRadius="85%"
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(17, 17, 27, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
            }}
            formatter={(value, name) => [`${value}%`, name]}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Score Ring Component
function ScoreRing({ score, label, color, size = 100 }: { score: number; label: string; color: string; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 10px ${color}80)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-white">{score}%</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 mt-2 text-center">{label}</span>
    </div>
  )
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PalmistryResults({ 
  data, 
  palmReadings = mockPalmReadings,
  onReset,
  onSelectReading 
}: PalmistryResultsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("lines")
  const [expandedLine, setExpandedLine] = useState<string | null>(null)
  const [selectedPalmId, setSelectedPalmId] = useState(palmReadings[0]?.id || "")

  const overallScore = useMemo(() => {
    const { love, career, health, wealth } = data.lifeAreas
    return Math.round((love.score + career.score + health.score + wealth.score) / 4)
  }, [data.lifeAreas])

  const handleSelectReading = (id: string) => {
    setSelectedPalmId(id)
    onSelectReading?.(id)
  }

  const tabs = [
    { id: "lines", label: "Palm Lines", icon: <Activity className="h-4 w-4" /> },
    { id: "mounts", label: "Planetary Mounts", icon: <Star className="h-4 w-4" /> },
    { id: "areas", label: "Life Areas", icon: <Heart className="h-4 w-4" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/10 to-gray-950 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================================================================ */}
        {/* HEADER WITH PALM ID SELECTOR */}
        {/* ================================================================ */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 animate-pulse" />
              <div className="relative p-4 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/30">
                <Hand className="h-10 w-10 text-purple-300" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-amber-400 bg-clip-text text-transparent animate-gradient">
                Your Palm Reading
              </h1>
              <p className="text-gray-400 flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30">
                  {data.dominantHand === "right" ? "Right" : "Left"} Hand
                </span>
                <span className="text-gray-600">|</span>
                <span>{data.handShape}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Palm ID Dropdown */}
            <SelectDropdown
              value={selectedPalmId}
              options={palmReadings}
              onChange={handleSelectReading}
              placeholder="Select Palm Reading"
            />

            <button
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/80 border border-white/10 rounded-xl text-sm text-gray-300 hover:border-purple-500/50 hover:text-white transition-all"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">New Reading</span>
            </button>
            
            <button
              onClick={() => router.push("/chat")}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-sm text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <MessageCircle className="h-4 w-4" />
              Chat About Reading
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* STATS CARDS ROW */}
        {/* ================================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(data.lifeAreas).map(([key, area], index) => {
            const Icon = lifeAreaIcons[index]
            const color = lifeAreaColors[index]
            
            return (
              <div
                key={key}
                className="group relative rounded-2xl bg-gray-900/50 backdrop-blur-sm border border-white/10 p-4 hover:border-purple-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ ["--glow-color" as string]: color }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl"
                  style={{ backgroundColor: `${color}20` }}
                />
                
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </div>
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
                  />
                </div>
                
                <h3 className="text-sm font-medium text-gray-400 mb-1">{area.title}</h3>
                
                <div className="flex items-end justify-between gap-2">
                  <span
                    className="text-3xl font-bold"
                    style={{ color, textShadow: `0 0 20px ${color}60` }}
                  >
                    {area.score}%
                  </span>
                  <div className="flex-1 max-w-[60px]">
                    <ProgressBar value={area.score} color={color} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ================================================================ */}
        {/* MAIN CONTENT GRID */}
        {/* ================================================================ */}
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN - Palm Image & Orbiting Planets */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Palm Image with Glow */}
            <div className="relative rounded-2xl border border-white/10 bg-gray-900/50 overflow-hidden group">
              <div className="relative aspect-square">
                <img
                  src={data.imageUrl || "/placeholder.svg"}
                  alt="Your palm"
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
                
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Scan lines */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent"
                      style={{
                        top: `${25 + i * 15}%`,
                        animation: `scan-line 3s ease-in-out infinite`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Status badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-300 font-medium">Analyzed</span>
                </div>
              </div>
            </div>

            {/* Orbiting Planets Visualization */}
            <div className="rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm p-5">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Star className="h-4 w-4 text-purple-400" />
                </div>
                Planetary Influence Map
              </h3>
              <OrbitingPlanets mounts={data.mounts} />
              <p className="text-center text-xs text-gray-500 mt-3">Hover over planets for details</p>
            </div>

            {/* Overall Reading Card */}
            <div className="relative rounded-2xl border border-purple-500/30 bg-gradient-to-br from-gray-900/80 to-purple-900/20 p-5 overflow-hidden">
              {/* Pulse glow */}
              <div className="absolute inset-0 bg-purple-500/5 animate-pulse" />
              
              <div className="relative">
                <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-amber-400" />
                  </div>
                  Overall Reading
                </h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-4">
                  {data.overallReading}
                </p>
                <div className="flex justify-center">
                  <ScoreRing score={overallScore} label="Overall Score" color="#ec4899" size={110} />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Detailed Analysis */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Life Areas Radar */}
              <div className="rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm p-5">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Target className="h-4 w-4 text-cyan-400" />
                  </div>
                  Life Areas Overview
                </h3>
                <LifeAreasRadarChart lifeAreas={data.lifeAreas} />
              </div>

              {/* Line Strength Chart */}
              <div className="rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm p-5">
                <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-emerald-400" />
                  </div>
                  Line Strength Analysis
                </h3>
                <LineStrengthChart lines={data.lines} />
              </div>
            </div>

            {/* Tabs Section */}
            <div className="space-y-4">
              <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

              {/* Palm Lines Tab */}
              {activeTab === "lines" && (
                <div className="space-y-3">
                  {data.lines.map((line) => (
                    <div
                      key={line.name}
                      className={cn(
                        "rounded-xl border bg-gray-900/50 backdrop-blur-sm overflow-hidden transition-all",
                        expandedLine === line.name
                          ? `${strengthColors[line.strength].border} ${strengthColors[line.strength].glow}`
                          : "border-white/10 hover:border-purple-500/30"
                      )}
                    >
                      <button
                        onClick={() => setExpandedLine(expandedLine === line.name ? null : line.name)}
                        className="w-full p-4 flex items-center gap-4"
                      >
                        <div className={cn(
                          "w-11 h-11 rounded-xl flex items-center justify-center",
                          strengthColors[line.strength].bg
                        )}>
                          <span className={strengthColors[line.strength].text}>
                            {lineIcons[line.name] || <Activity className="h-5 w-5" />}
                          </span>
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="text-white font-medium">{line.name}</h4>
                          <p className="text-gray-400 text-sm truncate">{line.description}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-xs font-medium capitalize",
                          strengthColors[line.strength].bg,
                          strengthColors[line.strength].text
                        )}>
                          {line.strength}
                        </span>
                        {expandedLine === line.name ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </button>

                      {expandedLine === line.name && (
                        <div className="px-4 pb-4 border-t border-white/10">
                          <div className="pt-4 space-y-3">
                            <p className="text-gray-300 text-sm leading-relaxed">{line.details}</p>
                            <div>
                              <p className="text-xs text-gray-500 mb-1.5">Line Strength</p>
                              <ProgressBar 
                                value={line.strength === "strong" ? 100 : line.strength === "moderate" ? 66 : 33} 
                                color={strengthColors[line.strength].color}
                                className="h-2"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Planetary Mounts Tab */}
              {activeTab === "mounts" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-gray-900/50 backdrop-blur-sm p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <Moon className="h-4 w-4 text-purple-400" />
                      </div>
                      Mount Prominence Chart
                    </h3>
                    <MountProminenceChart mounts={data.mounts} />
                  </div>
                  
                  <div className="grid sm:grid-cols-2 gap-3">
                    {data.mounts.map((mount) => (
                      <div
                        key={mount.name}
                        className="rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur-sm p-4 hover:border-purple-500/30 transition-all group"
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                            style={{ 
                              backgroundColor: `${planetColors[mount.planet]}20`,
                              boxShadow: `0 0 20px ${planetColors[mount.planet]}30`,
                            }}
                          >
                            <span 
                              className="text-lg font-bold"
                              style={{ color: planetColors[mount.planet] }}
                            >
                              {mount.planet.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h4 className="text-white font-medium truncate">{mount.name}</h4>
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-xs font-medium capitalize border flex-shrink-0",
                                prominenceColors[mount.prominence].bg,
                                prominenceColors[mount.prominence].text,
                                `border-${prominenceColors[mount.prominence].color}/30`
                              )}>
                                {mount.prominence}
                              </span>
                            </div>
                            <p className="text-sm" style={{ color: planetColors[mount.planet] }}>{mount.planet}</p>
                            <p className="text-gray-500 text-xs mt-1">{mount.location}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Life Areas Tab */}
              {activeTab === "areas" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Object.entries(data.lifeAreas).map(([key, area], index) => {
                    const color = lifeAreaColors[index]
                    const Icon = lifeAreaIcons[index]
                    
                    return (
                      <div
                        key={key}
                        className="rounded-xl border border-white/10 bg-gray-900/50 backdrop-blur-sm p-5 hover:border-purple-500/30 transition-all"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <ScoreRing score={area.score} label="" color={color} size={80} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${color}20` }}
                              >
                                <Icon className="h-4 w-4" style={{ color }} />
                              </div>
                              <h4 className="text-white font-semibold">{area.title}</h4>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{area.description}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================ */}
        {/* BOTTOM ACTION BAR */}
        {/* ================================================================ */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gray-900/80 border border-white/10 rounded-xl text-white hover:border-purple-500/50 transition-all">
            <Download className="h-5 w-5" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={() => router.push("/chat")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <MessageCircle className="h-5 w-5" />
            <span>Ask Questions</span>
          </button>
        </div>
      </div>

      {/* Global CSS Animations */}
      <style>{`
        @keyframes scan-line {
          0%, 100% { opacity: 0; transform: translateY(0); }
          50% { opacity: 1; transform: translateY(20px); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
      `}</style>
    </div>
  )
}

export default PalmistryResults
