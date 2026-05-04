"use client"

import { useEffect, useState } from "react"
import { Hand, Sparkles } from "lucide-react"

interface PalmistryScanningProps {
  imageUrl: string
}

const scanningSteps = [
  "Detecting palm boundaries...",
  "Analyzing major lines...",
  "Mapping planetary mounts...",
  "Interpreting line patterns...",
  "Cross-referencing with Vedic palmistry...",
  "Generating your reading..."
]

export function PalmistryScanning({ imageUrl }: PalmistryScanningProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < scanningSteps.length - 1) {
          return prev + 1
        }
        clearInterval(stepInterval)
        return prev
      })
    }, 500)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1
        }
        clearInterval(progressInterval)
        return 100
      })
    }, 30)

    return () => {
      clearInterval(stepInterval)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-xl bg-primary/20 glow-pink animate-pulse">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-pink-400 to-primary bg-clip-text text-transparent">
            Analyzing Your Palm
          </h1>
        </div>
        <p className="text-muted-foreground">
          Please wait while our AI analyzes your palm features
        </p>
      </div>

      {/* Image with scanning effect */}
      <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
        <img
          src={imageUrl}
          alt="Palm being analyzed"
          className="w-full h-auto max-h-96 object-contain mx-auto"
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Scanning line */}
          <div 
            className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent scan-animation"
            style={{ top: `${(progress % 100)}%` }}
          />
          
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-20">
            <svg width="100%" height="100%" className="text-cyan-400">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          {/* Corner brackets */}
          <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 rounded-tl" />
          <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-cyan-400 rounded-tr" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-400 rounded-bl" />
          <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 rounded-br" />
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-primary transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-cyan-400 font-medium">
            {scanningSteps[currentStep]}
          </span>
          <span className="text-muted-foreground">{progress}%</span>
        </div>
      </div>

      {/* Analysis steps */}
      <div className="grid grid-cols-2 gap-3">
        {scanningSteps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
              index <= currentStep
                ? "border-cyan-500/50 bg-cyan-500/10 text-foreground"
                : "border-border bg-card text-muted-foreground"
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${
              index < currentStep 
                ? "bg-green-500" 
                : index === currentStep 
                  ? "bg-cyan-400 animate-pulse" 
                  : "bg-muted"
            }`} />
            <span className="text-sm">{step.replace("...", "")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
