"use client"

import { GitCompare, Bot, Shield } from "lucide-react"

const features = [
  {
    icon: GitCompare,
    title: "Triple Verification",
    description: "Every insight cross-checked across 3 ancient sciences",
    color: "purple",
  },
  {
    icon: Bot,
    title: "Agentic AI",
    description: "Specialized AI agent trained on millions of readings",
    color: "cyan",
  },
  {
    icon: Shield,
    title: "100% Accuracy",
    description: "Cross-reference validation ensures reliable results",
    color: "pink",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-foreground">Why Choose</span>{" "}
            <span className="gradient-text-purple text-glow-purple">Kendraa.ai</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            The only platform that combines three ancient sciences with modern AI for unparalleled insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-xl border border-border bg-card/30 backdrop-blur-sm hover:border-primary/30 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center ${
                    feature.color === "purple"
                      ? "bg-purple-500/20 border border-purple-500/30"
                      : feature.color === "cyan"
                      ? "bg-cyan-500/20 border border-cyan-500/30"
                      : "bg-pink-500/20 border border-pink-500/30"
                  }`}
                >
                  <feature.icon
                    className={`w-6 h-6 ${
                      feature.color === "purple"
                        ? "text-purple-400"
                        : feature.color === "cyan"
                        ? "text-cyan-400"
                        : "text-pink-400"
                    }`}
                  />
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
