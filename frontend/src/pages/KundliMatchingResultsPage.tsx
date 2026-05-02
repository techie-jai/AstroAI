import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Download, MessageCircle, ArrowLeft, CheckCircle, XCircle, Sparkles, Star, TrendingUp, Flame } from 'lucide-react'
import toast from 'react-hot-toast'

function OrbitingPlanets() {
  const planets = [
    { name: 'Sun', size: 20, orbit: 60, duration: 20, color: 'from-yellow-400 to-orange-500' },
    { name: 'Moon', size: 12, orbit: 90, duration: 15, color: 'from-gray-300 to-gray-400' },
    { name: 'Mars', size: 10, orbit: 120, duration: 25, color: 'from-red-500 to-red-600' },
    { name: 'Jupiter', size: 16, orbit: 150, duration: 35, color: 'from-yellow-500 to-amber-600' },
    { name: 'Saturn', size: 14, orbit: 180, duration: 45, color: 'from-purple-400 to-purple-600' },
  ]

  return (
    <div className="relative w-full h-[400px] flex items-center justify-center">
      <div className="absolute w-24 h-24 rounded-full bg-gradient-to-br from-pink-500 to-red-500 opacity-30 blur-2xl animate-pulse-glow" />
      <div className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center z-10 glow-magenta">
        <Heart className="w-8 h-8 text-white fill-white" />
      </div>
      {planets.map((p, i) => (
        <div
          key={`orbit-${i}`}
          className="absolute rounded-full border border-pink-500/20"
          style={{ width: `${p.orbit * 2}px`, height: `${p.orbit * 2}px` }}
        />
      ))}
      {planets.map((p, i) => (
        <div
          key={p.name}
          className="absolute animate-orbit"
          style={{
            '--orbit-radius': `${p.orbit}px`,
            '--orbit-duration': `${p.duration}s`,
            animationDelay: `${i * -5}s`,
          } as React.CSSProperties}
        >
          <div
            className={`rounded-full bg-gradient-to-br ${p.color} shadow-lg`}
            style={{ width: `${p.size}px`, height: `${p.size}px` }}
            title={p.name}
          />
        </div>
      ))}
    </div>
  )
}

export default function KundliMatchingResultsPage() {
  const { matchId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [matchData, setMatchData] = useState<any>(location.state?.matchData || null)
  const [loading, setLoading] = useState(!matchData)
  const [showFullResults, setShowFullResults] = useState(false)

  useEffect(() => {
    if (!matchData && matchId) {
      fetchMatchResult()
    }
  }, [matchId, matchData])

  const fetchMatchResult = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch(`/api/kundli-matching/result/${matchId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (!response.ok) throw new Error('Failed to fetch result')
      const data = await response.json()
      setMatchData(data.data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to load matching result')
      navigate('/kundli-matching')
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = async () => {
    try {
      const dataStr = JSON.stringify(matchData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `kundli_matching_${matchData.boy_name}_${matchData.girl_name}.json`
      link.click()
      toast.success('Results downloaded!')
    } catch (error) {
      toast.error('Failed to download results')
    }
  }

  const startAIAnalysis = () => {
    navigate(`/chat/${matchId}`, {
      state: {
        matchData: matchData,
        type: 'kundli_matching'
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-lg">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground text-lg">No matching data found</p>
        </div>
      </div>
    )
  }

  const verdict = matchData.overall_verdict
  const verdictGradients = {
    'Excellent': 'from-green-600 to-emerald-600',
    'Good': 'from-blue-600 to-cyan-600',
    'Average': 'from-yellow-600 to-amber-600',
    'Poor': 'from-red-600 to-pink-600'
  }

  const verdictColors = {
    'Excellent': 'text-green-400',
    'Good': 'text-blue-400',
    'Average': 'text-yellow-400',
    'Poor': 'text-red-400'
  }

  return (
    <div className="relative space-y-8 min-h-screen pb-8 px-4 sm:px-6">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-pink-400/30 rounded-full animate-twinkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/kundli-matching')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Matching
        </button>

        {/* Header with Orbiting Planets */}
        <div className="relative mb-12">
          <OrbitingPlanets />
          <div className="text-center mt-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-600 to-red-600 flex items-center justify-center glow-magenta animate-float">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">
                  {matchData.boy_name} & {matchData.girl_name}
                </h1>
                <p className="text-muted-foreground">Kundli Compatibility Analysis</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Score Card */}
        <div className={`relative cosmic-card rounded-2xl overflow-hidden mb-8`}>
          <div className={`h-1 bg-gradient-to-r ${verdictGradients[verdict.verdict as keyof typeof verdictGradients]}`} />
          <div className="p-8 md:p-12">
            <div className="text-center space-y-6">
              <div className="space-y-2">
                <div className={`text-7xl font-bold ${verdictColors[verdict.verdict as keyof typeof verdictColors]}`}>
                  {matchData.total_score}/{matchData.max_score}
                </div>
                <div className="text-3xl font-bold text-foreground">{verdict.verdict} Match</div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-secondary/50 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${verdictGradients[verdict.verdict as keyof typeof verdictGradients]} transition-all duration-1000`}
                    style={{ width: `${verdict.percentage}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">{verdict.percentage}% Compatibility</p>
              </div>

              <p className="text-lg text-foreground leading-relaxed max-w-2xl mx-auto">{verdict.message}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowFullResults(!showFullResults)}
            className="cosmic-card rounded-xl px-6 py-3 font-semibold transition-all hover:bg-purple-500/10 flex items-center justify-center gap-2 text-foreground hover:text-purple-300"
          >
            <Heart size={20} />
            {showFullResults ? 'Hide' : 'View'} Full Results
          </button>
          <button
            onClick={downloadResults}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold transition-all glow-cyan flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Results
          </button>
          <button
            onClick={startAIAnalysis}
            className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-500 hover:to-red-500 text-white px-6 py-3 rounded-xl font-semibold transition-all glow-magenta flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            AI Analysis
          </button>
        </div>

        {/* Summary Stats */}
        <div className="cosmic-card rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            Quick Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Compatibility Factors</p>
              <p className="text-3xl font-bold text-cyan-400">{matchData.ashtakoota_scores.length}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Checks Passed</p>
              <p className="text-3xl font-bold text-green-400">
                {matchData.naalu_porutham_checks.filter((c: any) => c.status).length}/4
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Method Used</p>
              <p className="text-2xl font-bold text-pink-400">{matchData.method}</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-sm uppercase tracking-wider">Overall Score</p>
              <p className="text-3xl font-bold text-purple-400">{verdict.percentage}%</p>
            </div>
          </div>
        </div>

        {/* Full Results Section */}
        {showFullResults && (
          <div className="space-y-8">
            {/* Ashtakoota Scores */}
            <div className="cosmic-card rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500" />
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Flame className="w-6 h-6 text-orange-400" />
                  Ashtakoota Scores (8 Compatibility Factors)
                </h2>

                <div className="space-y-4">
                  {matchData.ashtakoota_scores.map((score: any, idx: number) => (
                    <div key={idx} className="cosmic-card rounded-xl p-4 hover:bg-purple-500/10 transition-all">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{score.name}</h3>
                          <p className="text-muted-foreground text-sm">{score.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-cyan-400">
                            {score.score}/{score.max_score}
                          </div>
                        </div>
                      </div>

                      {/* Score Bar */}
                      <div className="w-full bg-secondary/50 rounded-full h-2 mb-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                          style={{ width: `${(score.score / score.max_score) * 100}%` }}
                        />
                      </div>

                      <p className="text-muted-foreground text-sm">{score.interpretation}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Naalu Porutham Checks */}
            <div className="cosmic-card rounded-2xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />
              <div className="p-6 md:p-8">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-400" />
                  Naalu Porutham (4 Additional Checks)
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {matchData.naalu_porutham_checks.map((check: any, idx: number) => (
                    <div
                      key={idx}
                      className={`cosmic-card rounded-xl p-4 border-l-4 ${
                        check.status
                          ? 'border-l-green-500 hover:bg-green-500/5'
                          : 'border-l-red-500 hover:bg-red-500/5'
                      } transition-all`}
                    >
                      <div className="flex items-start gap-3">
                        {check.status ? (
                          <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle size={24} className="text-red-400 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <h3 className={`font-semibold ${check.status ? 'text-green-300' : 'text-red-300'}`}>
                            {check.name}
                          </h3>
                          <p className="text-muted-foreground text-sm mt-1">{check.description}</p>
                          <p className="text-muted-foreground text-xs mt-2 italic">{check.importance}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Method Info */}
            <div className="cosmic-card rounded-2xl p-6 border-l-4 border-l-purple-500">
              <div className="space-y-2">
                <p className="text-foreground">
                  <strong className="text-purple-300">Method:</strong> {matchData.method} Indian Style
                </p>
                <p className="text-foreground">
                  <strong className="text-purple-300">Calculated:</strong> {new Date(matchData.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
