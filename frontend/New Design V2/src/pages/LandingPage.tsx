import { Link } from "react-router-dom"
import { ArrowRight, Play, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/common/Logo"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Starfield background */}
      <div className="fixed inset-0 starfield opacity-40 pointer-events-none" />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px]" />
      </div>
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2"><Logo size="md" /></Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">How It Works</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link to="/login"><Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sign In</Button></Link>
            <Link to="/login"><Button className="bg-primary hover:bg-primary/90 glow-purple">Get Started</Button></Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <main className="relative">
        <section className="relative py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-foreground">AI-Powered Astrology</span>
                </div>
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="text-foreground">3 Cosmic</span><br />
                    <span className="gradient-text-purple text-glow-purple">Knowledge</span><br />
                    <span className="gradient-text-purple text-glow-purple">Systems</span><br />
                    <span className="text-foreground">One Advanced AI</span>
                  </h1>
                  <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                    Welcome to Kendraa.ai. Central Hub for all your Astrology, Palmistry and Numerology needs. 
                    Our advanced AI allows you to harness the power of these ancient wisdom systems and cross 
                    reference them for accurate predictions and deeper insights.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Link to="/login">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 glow-purple gap-2 px-8">
                      Start Your Journey
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="gap-2 border-border hover:bg-card">
                    <Play className="h-4 w-4" />
                    Watch Demo
                  </Button>
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 border-2 border-background" />
                    ))}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trusted by <span className="text-foreground font-semibold">50,000+</span> cosmic explorers
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Zodiac Wheel placeholder */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-[400px] h-[400px] lg:w-[500px] lg:h-[500px]">
                  <div className="absolute inset-0 rounded-full bg-purple-500/20 blur-3xl animate-pulse-glow" />
                  <div className="absolute inset-0 rounded-full border-2 border-purple-500/30" />
                  <div className="absolute inset-8 rounded-full border border-purple-500/20" />
                  <div className="absolute inset-16 rounded-full border border-cyan-500/20" />
                  <div className="absolute inset-24 rounded-full border border-purple-500/20" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-cyan-400 animate-pulse-glow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Kendraa.ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
