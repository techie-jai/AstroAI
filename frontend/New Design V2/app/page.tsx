import { LandingHero } from "@/components/landing/hero"
import { LandingNav } from "@/components/landing/nav"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { TripleScience } from "@/components/landing/triple-science"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 starfield opacity-40 pointer-events-none" />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-magenta-500/5 rounded-full blur-[80px]" />
      </div>
      
      <LandingNav />
      <main className="relative">
        <LandingHero />
        <TripleScience />
        <HowItWorks />
        <Features />
      </main>
      <Footer />
    </div>
  )
}
