import React from 'react'
import { FileText, Orbit, Sparkles, ArrowRight } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Enter Your Birth Details',
    description:
      'Share your birth date, time, and location. Our AI needs these celestial coordinates to map your unique cosmic signature.',
  },
  {
    number: '02',
    icon: Orbit,
    title: 'AI Analyzes Your Chart',
    description:
      'Our advanced AI processes planetary positions, aspects, and transits to decode the intricate patterns of your natal chart.',
  },
  {
    number: '03',
    icon: Sparkles,
    title: 'Receive Personalized Guidance',
    description:
      'Get detailed insights about your personality, life path, relationships, and optimal timing for important decisions.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950/50 to-slate-950" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-4">
            <Orbit className="h-4 w-4 text-indigo-400" />
            <span className="text-sm text-indigo-400">Simple Process</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="text-white">How </span>
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
              Kendraa.ai
            </span>
            <span className="text-white"> Works</span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Discover your cosmic blueprint in three simple steps
          </p>
        </div>

        {/* Steps Timeline */}
        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="group relative">
                {/* Connector Line (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-16 hidden h-px w-full bg-gradient-to-r from-indigo-500/50 via-indigo-500/20 to-transparent lg:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Step Number Badge */}
                  <div className="mb-6 text-sm font-medium text-indigo-400/60">
                    {step.number}
                  </div>

                  {/* Icon Circle */}
                  <div className="relative mb-6">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-500/30 bg-slate-900/60 transition-all duration-300 group-hover:border-indigo-500/60 group-hover:glow-border">
                      <Icon className="h-10 w-10 text-indigo-400 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-indigo-500/20 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Arrow (between items, mobile only) */}
                  {index < steps.length - 1 && (
                    <div className="my-4 flex items-center justify-center lg:hidden">
                      <ArrowRight className="h-6 w-6 rotate-90 text-indigo-500/40" />
                    </div>
                  )}

                  {/* Content */}
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="max-w-xs text-slate-400">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
