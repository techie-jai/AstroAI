"use client"

import { useState, useRef, useCallback } from "react"
import { AppShell } from "@/components/app-shell"
import { PalmistryUpload } from "@/components/palmistry/palmistry-upload"
import { PalmistryResults } from "@/components/palmistry/palmistry-results"
import { PalmistryScanning } from "@/components/palmistry/palmistry-scanning"

export type PalmistryState = "upload" | "scanning" | "results"

export interface PalmLine {
  name: string
  description: string
  meaning: string
  strength: "strong" | "moderate" | "faint"
}

export interface PalmMount {
  name: string
  planet: string
  description: string
  prominence: "prominent" | "normal" | "flat"
}

export interface PalmistryData {
  imageUrl: string
  dominantHand: "left" | "right"
  handShape: string
  lines: PalmLine[]
  mounts: PalmMount[]
  overallReading: string
  lifeAreas: {
    love: { title: string; description: string; score: number }
    career: { title: string; description: string; score: number }
    health: { title: string; description: string; score: number }
    wealth: { title: string; description: string; score: number }
  }
  kundliCorrelations?: {
    planet: string
    palmReading: string
    kundliReading: string
    verdict: string
  }[]
}

export default function PalmistryPage() {
  const [state, setState] = useState<PalmistryState>("upload")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [palmistryData, setPalmistryData] = useState<PalmistryData | null>(null)

  const handleImageUpload = useCallback((imageUrl: string) => {
    setUploadedImage(imageUrl)
    setState("scanning")
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockData: PalmistryData = {
        imageUrl,
        dominantHand: "right",
        handShape: "Square (Earth Hand)",
        lines: [
          {
            name: "Heart Line",
            description: "Long and curved, starting from under the index finger",
            meaning: "Deep emotional capacity with strong romantic inclinations. You form lasting bonds and value emotional security in relationships.",
            strength: "strong"
          },
          {
            name: "Head Line",
            description: "Straight and clear, extending across the palm",
            meaning: "Analytical mind with practical thinking abilities. You approach problems methodically and value logic over emotion in decisions.",
            strength: "strong"
          },
          {
            name: "Life Line",
            description: "Deep and curved, encircling the thumb mount",
            meaning: "Strong vitality and enthusiasm for life. You have good physical stamina and resilience through challenges.",
            strength: "moderate"
          },
          {
            name: "Fate Line",
            description: "Clear line running from wrist towards middle finger",
            meaning: "Strong sense of purpose and career direction. External forces and destiny play a significant role in your life path.",
            strength: "moderate"
          },
          {
            name: "Sun Line",
            description: "Faint line running parallel to fate line",
            meaning: "Potential for recognition and success in creative endeavors. Fame and public appreciation may come in later life.",
            strength: "faint"
          }
        ],
        mounts: [
          {
            name: "Mount of Jupiter",
            planet: "Jupiter",
            description: "Located under the index finger",
            prominence: "prominent"
          },
          {
            name: "Mount of Saturn",
            planet: "Saturn",
            description: "Located under the middle finger",
            prominence: "normal"
          },
          {
            name: "Mount of Apollo",
            planet: "Sun",
            description: "Located under the ring finger",
            prominence: "prominent"
          },
          {
            name: "Mount of Mercury",
            planet: "Mercury",
            description: "Located under the little finger",
            prominence: "normal"
          },
          {
            name: "Mount of Venus",
            planet: "Venus",
            description: "Located at the base of thumb",
            prominence: "prominent"
          },
          {
            name: "Mount of Moon",
            planet: "Moon",
            description: "Located on the outer edge of palm",
            prominence: "normal"
          },
          {
            name: "Mount of Mars",
            planet: "Mars",
            description: "Located in the center of palm",
            prominence: "flat"
          }
        ],
        overallReading: "Your palm reveals a balanced individual with strong emotional intelligence and analytical capabilities. The prominent Jupiter mount indicates natural leadership qualities, while the well-developed Venus mount suggests a loving and artistic nature. Your life line shows good vitality, and the clear fate line indicates a defined life purpose. The combination suggests success in careers that blend creativity with structure.",
        lifeAreas: {
          love: {
            title: "Love & Relationships",
            description: "Your heart line indicates deep emotional capacity. You form lasting bonds and seek meaningful connections. Romance flourishes when you feel secure.",
            score: 85
          },
          career: {
            title: "Career & Ambition",
            description: "Strong fate line combined with Jupiter mount prominence suggests leadership potential. Success comes through structured approach and persistence.",
            score: 78
          },
          health: {
            title: "Health & Vitality",
            description: "Your life line shows good stamina and resilience. Focus on maintaining balance between work and rest for optimal wellbeing.",
            score: 72
          },
          wealth: {
            title: "Wealth & Prosperity",
            description: "Mercury mount development indicates good business acumen. Financial success is achievable through careful planning and strategic investments.",
            score: 68
          }
        },
        kundliCorrelations: [
          {
            planet: "Jupiter (Guru)",
            palmReading: "Prominent Jupiter Mount indicating strong leadership and wisdom.",
            kundliReading: "Jupiter is in the 10th House, supporting career authority.",
            verdict: "Your hand and chart both strongly agree on your leadership potential."
          },
          {
            planet: "Venus (Shukra)",
            palmReading: "Well-developed Venus mount showing artistic sensibilities and love nature.",
            kundliReading: "Venus in 7th House indicates harmonious relationships.",
            verdict: "Both readings confirm your capacity for deep, lasting love."
          },
          {
            planet: "Mercury (Budha)",
            palmReading: "Normal Mercury mount with clear communication lines.",
            kundliReading: "Mercury in 3rd House enhances communication skills.",
            verdict: "Agreement on strong verbal and analytical abilities."
          }
        ]
      }
      
      setPalmistryData(mockData)
      setState("results")
    }, 3000)
  }, [])

  const handleReset = useCallback(() => {
    setState("upload")
    setUploadedImage(null)
    setPalmistryData(null)
  }, [])

  return (
    <AppShell>
      {state === "upload" && (
        <PalmistryUpload onImageUpload={handleImageUpload} />
      )}
      {state === "scanning" && uploadedImage && (
        <PalmistryScanning imageUrl={uploadedImage} />
      )}
      {state === "results" && palmistryData && (
        <PalmistryResults data={palmistryData} onReset={handleReset} />
      )}
    </AppShell>
  )
}
