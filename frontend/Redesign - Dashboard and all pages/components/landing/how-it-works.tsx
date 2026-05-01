"use client"

import { ClipboardList, Bot, GitCompare, FileCheck, Check, Sparkles } from "lucide-react"

const steps = [
  {
    icon: ClipboardList,
    title: "Collect",
    description: "3 Sources",
  },
  {
    icon: Bot,
    title: "Analyze",
    description: "AI Algorithms",
  },
  {
    icon: GitCompare,
    title: "Cross-Check",
    description: "Validate",
  },
  {
    icon: FileCheck,
    title: "Format",
    description: "Deliver",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        {/* Agentic AI Engine Card */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="relative p-8 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">
                  <span className="gradient-text-purple text-glow-purple">AGENTIC AI ENGINE</span>
                </h2>
                <p className="text-sm text-muted-foreground">Specialized Cross-Reference Intelligence</p>
              </div>
            </div>

            {/* Process steps */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="p-4 rounded-xl border border-border bg-card/50 text-center hover:border-primary/30 transition-colors"
                >
                  <step.icon className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center mb-16">
          <div className="w-px h-16 bg-gradient-to-b from-border via-primary to-border relative">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[12px] border-t-primary" />
          </div>
        </div>

        {/* AI Response Example */}
        <div className="max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl border border-border bg-card/30 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-foreground">Kendraa AI</span>
                  <span className="text-xs text-pink-400 font-medium">Triple-verified response</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  Based on your{" "}
                  <span className="text-purple-400 font-medium">planetary alignments</span>,{" "}
                  <span className="text-pink-400 font-medium">palm reading</span>, and{" "}
                  <span className="text-cyan-400 font-medium">life path number</span>, all
                  three sciences indicate a highly favorable period ahead. The convergence of
                  these insights suggests strong positive energy in your query area.
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-purple-400/30 text-xs text-purple-400">
                    <Check className="w-3 h-3" /> Astro
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-pink-400/30 text-xs text-pink-400">
                    <Check className="w-3 h-3" /> Palm
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-cyan-400/30 text-xs text-cyan-400">
                    <Check className="w-3 h-3" /> Numero
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400" />
                    100% confidence
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
