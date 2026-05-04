"use client"

import { cn } from "@/lib/utils"
import { Sparkles, Hand, Hash, Layers } from "lucide-react"

export type Science = "astrology" | "palmistry" | "numerology" | "all"

interface ScienceToggleProps {
  selected: Science[]
  onChange: (sciences: Science[]) => void
}

const sciences: { id: Science; label: string; icon: React.ReactNode; color: string }[] = [
  { 
    id: "astrology", 
    label: "Astrology", 
    icon: <Sparkles className="h-3.5 w-3.5" />,
    color: "text-accent bg-accent/20 border-accent/50 hover:bg-accent/30"
  },
  { 
    id: "palmistry", 
    label: "Palmistry", 
    icon: <Hand className="h-3.5 w-3.5" />,
    color: "text-pink-400 bg-pink-400/20 border-pink-400/50 hover:bg-pink-400/30"
  },
  { 
    id: "numerology", 
    label: "Numerology", 
    icon: <Hash className="h-3.5 w-3.5" />,
    color: "text-cyan-400 bg-cyan-400/20 border-cyan-400/50 hover:bg-cyan-400/30"
  },
  { 
    id: "all", 
    label: "All", 
    icon: <Layers className="h-3.5 w-3.5" />,
    color: "text-green-400 bg-green-400/20 border-green-400/50 hover:bg-green-400/30"
  },
]

export function ScienceToggle({ selected, onChange }: ScienceToggleProps) {
  const handleToggle = (science: Science) => {
    if (science === "all") {
      // Toggle all
      if (selected.includes("all")) {
        onChange(["astrology"])
      } else {
        onChange(["all"])
      }
    } else {
      // If "all" is selected, switch to just this science
      if (selected.includes("all")) {
        onChange([science])
        return
      }

      // Toggle individual science
      if (selected.includes(science)) {
        // Don't allow deselecting the last one
        if (selected.length > 1) {
          onChange(selected.filter((s) => s !== science))
        }
      } else {
        // Check if selecting this would mean all three are selected
        const newSelection = [...selected, science]
        const nonAllSciences = newSelection.filter(s => s !== "all")
        if (nonAllSciences.length === 3) {
          onChange(["all"])
        } else {
          onChange(newSelection)
        }
      }
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-muted-foreground mr-1">Mode:</span>
      {sciences.map((science) => {
        const isSelected = selected.includes(science.id) || 
          (science.id !== "all" && selected.includes("all"))
        
        return (
          <button
            key={science.id}
            onClick={() => handleToggle(science.id)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium border transition-all",
              isSelected
                ? science.color
                : "text-muted-foreground bg-secondary/50 border-border hover:bg-secondary"
            )}
          >
            {science.icon}
            <span className="hidden sm:inline">{science.label}</span>
          </button>
        )
      })}
    </div>
  )
}
