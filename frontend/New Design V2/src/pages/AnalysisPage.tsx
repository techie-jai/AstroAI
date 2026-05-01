import { Link } from "react-router-dom"
import { FileText, Eye, Download, Sparkles, Star, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const analyses = [
  { id: 1, name: "Neha Verma", birthDate: "1986-02-08", place: "Bangalore", generatedAt: "2026-04-14", insights: 24 },
  { id: 2, name: "Aditya Sharma", birthDate: "1998-05-07", place: "Mumbai", generatedAt: "2026-04-14", insights: 18 },
  { id: 3, name: "aoud", birthDate: "2026-01-01", place: "Santiago Ixtaltepec, Mexico", generatedAt: "2026-04-14", insights: 21 },
  { id: 4, name: "qefqAkshay Patel", birthDate: "2007-05-08", place: "Kolkata", generatedAt: "2026-04-14", insights: 16 },
  { id: 5, name: "23112Neha Verma", birthDate: "1995-04-22", place: "Kolkata", generatedAt: "2026-04-14", insights: 22 },
]

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="absolute rounded-full animate-float" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, width: `${2 + Math.random() * 3}px`, height: `${2 + Math.random() * 3}px`, background: i % 2 === 0 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)', animationDelay: `${Math.random() * 4}s`, animationDuration: `${4 + Math.random() * 3}s` }} />
      ))}
    </div>
  )
}

export default function AnalysisPage() {
  return (
    <div className="relative space-y-8 min-h-screen">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <FloatingParticles />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-pulse-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">AI Analysis</h1>
        </div>
        <p className="text-muted-foreground flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          View and download your generated analyses
        </p>
      </div>

      <div className="relative cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-purple-500 via-cyan-500 to-pink-500" />
        <div className="divide-y divide-border/30">
          {analyses.map((analysis, index) => (
            <div key={analysis.id} className="group flex items-center justify-between p-5 hover:bg-purple-500/5 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 flex items-center justify-center group-hover:border-purple-400/50 transition-all duration-300">
                    <FileText className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-background flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground group-hover:text-purple-300 transition-colors">{analysis.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {analysis.birthDate} <span className="w-1 h-1 rounded-full bg-muted-foreground/50" /> {analysis.place}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground/60">Generated: {analysis.generatedAt}</span>
                    <span className="flex items-center gap-1 text-xs text-cyan-400">
                      <Star className="w-3 h-3 fill-current" />{analysis.insights} insights
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Link to={`/results/${analysis.id}`}>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 gap-2 font-medium transition-all duration-300 hover:scale-105">
                    <Eye className="w-4 h-4" />View
                  </Button>
                </Link>
                <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 gap-2 font-medium transition-all duration-300 hover:scale-105">
                  <Download className="w-4 h-4" />Download
                </Button>
              </div>
            </div>
          ))}
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>
    </div>
  )
}
