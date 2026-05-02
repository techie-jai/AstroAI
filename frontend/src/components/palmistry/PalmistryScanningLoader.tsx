import React, { useState, useEffect } from 'react'
import { Hand, CheckCircle } from 'lucide-react'

export default function PalmistryScanningLoader() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { label: 'Detecting palm boundaries', icon: '🔍' },
    { label: 'Analyzing major lines', icon: '📍' },
    { label: 'Mapping planetary mounts', icon: '🪐' },
    { label: 'Interpreting line patterns', icon: '✨' },
    { label: 'Cross-referencing with Vedic palmistry', icon: '🕉️' },
    { label: 'Generating your reading', icon: '📖' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 100
        const increment = Math.random() * 15 + 5
        return Math.min(prev + increment, 95)
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const stepIndex = Math.floor((progress / 100) * steps.length)
    setCurrentStep(Math.min(stepIndex, steps.length - 1))
  }, [progress])

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Hand className="w-24 h-24 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 animate-pulse">
                <div className="w-24 h-24 border-4 border-purple-400/30 rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Analyzing Your Palm</h1>
          <p className="text-slate-400">Please wait while our AI analyzes your palm features</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-right text-sm text-slate-400">{Math.round(progress)}%</div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-lg transition ${
                index < currentStep
                  ? 'bg-green-500/10 border border-green-500/30'
                  : index === currentStep
                  ? 'bg-purple-500/10 border border-purple-500/30'
                  : 'bg-slate-800/30 border border-slate-700/30'
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center">
                {index < currentStep ? (
                  <CheckCircle className="w-6 h-6 text-green-400" />
                ) : index === currentStep ? (
                  <div className="w-6 h-6 rounded-full border-2 border-purple-400 border-t-transparent animate-spin"></div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-700"></div>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    index <= currentStep ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
              </div>
              <span className="text-xl">{step.icon}</span>
            </div>
          ))}
        </div>

        {/* Animated Dots */}
        <div className="flex justify-center gap-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}
