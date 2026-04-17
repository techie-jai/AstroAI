import React, { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { Heart, Download, MessageCircle, Share2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg">No matching data found</p>
        </div>
      </div>
    )
  }

  const verdict = matchData.overall_verdict
  const verdictColors = {
    'Excellent': 'from-green-600 to-green-700',
    'Good': 'from-blue-600 to-blue-700',
    'Average': 'from-yellow-600 to-yellow-700',
    'Poor': 'from-red-600 to-red-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/kundli-matching')}
          className="flex items-center gap-2 text-indigo-300 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Matching
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {matchData.boy_name} & {matchData.girl_name}
          </h1>
          <p className="text-indigo-200">Kundli Compatibility Analysis</p>
        </div>

        {/* Quick Score Card */}
        <div className={`bg-gradient-to-r ${verdictColors[verdict.verdict as keyof typeof verdictColors]} rounded-lg p-8 mb-8 border border-opacity-30 border-white`}>
          <div className="text-center">
            <div className="text-6xl font-bold text-white mb-2">
              {matchData.total_score}/{matchData.max_score}
            </div>
            <div className="text-2xl font-semibold text-white mb-4">{verdict.verdict} Match</div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mb-4">
              <div
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${verdict.percentage}%` }}
              ></div>
            </div>
            <p className="text-white text-lg">{verdict.message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => setShowFullResults(!showFullResults)}
            className="bg-indigo-700 hover:bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Heart size={20} />
            {showFullResults ? 'Hide' : 'View'} Full Results
          </button>
          <button
            onClick={downloadResults}
            className="bg-purple-700 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <Download size={20} />
            Download Results
          </button>
          <button
            onClick={startAIAnalysis}
            className="bg-pink-700 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} />
            AI Analysis
          </button>
        </div>

        {/* Full Results Section */}
        {showFullResults && (
          <div className="space-y-8">
            {/* Ashtakoota Scores */}
            <div className="bg-indigo-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-indigo-700">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Heart size={24} className="text-red-500" />
                Ashtakoota Scores (8 Compatibility Factors)
              </h2>

              <div className="space-y-4">
                {matchData.ashtakoota_scores.map((score: any, idx: number) => (
                  <div key={idx} className="bg-indigo-900 bg-opacity-50 rounded-lg p-4 border border-indigo-700">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{score.name}</h3>
                        <p className="text-indigo-300 text-sm">{score.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-indigo-300">
                          {score.score}/{score.max_score}
                        </div>
                      </div>
                    </div>
                    
                    {/* Score Bar */}
                    <div className="w-full bg-indigo-950 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all"
                        style={{ width: `${(score.score / score.max_score) * 100}%` }}
                      ></div>
                    </div>

                    <p className="text-indigo-200 text-sm">{score.interpretation}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Naalu Porutham Checks */}
            <div className="bg-indigo-800 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-indigo-700">
              <h2 className="text-2xl font-bold text-white mb-6">Naalu Porutham (4 Additional Checks)</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchData.naalu_porutham_checks.map((check: any, idx: number) => (
                  <div key={idx} className={`rounded-lg p-4 border-2 ${
                    check.status
                      ? 'bg-green-900 bg-opacity-30 border-green-700'
                      : 'bg-red-900 bg-opacity-30 border-red-700'
                  }`}>
                    <div className="flex items-start gap-3">
                      {check.status ? (
                        <CheckCircle size={24} className="text-green-500 flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle size={24} className="text-red-500 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <h3 className={`font-semibold ${check.status ? 'text-green-300' : 'text-red-300'}`}>
                          {check.name}
                        </h3>
                        <p className="text-indigo-200 text-sm mt-1">{check.description}</p>
                        <p className="text-indigo-300 text-xs mt-2 italic">{check.importance}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Method Info */}
            <div className="bg-indigo-900 bg-opacity-30 border border-indigo-700 rounded-lg p-4 text-indigo-200 text-sm">
              <p><strong>Method:</strong> {matchData.method} Indian Style</p>
              <p><strong>Calculated:</strong> {new Date(matchData.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Summary Box */}
        {!showFullResults && (
          <div className="bg-indigo-900 bg-opacity-50 backdrop-blur rounded-lg p-6 border border-indigo-700">
            <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-300">
                  {matchData.ashtakoota_scores.length}
                </div>
                <p className="text-indigo-200 text-sm">Compatibility Factors</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-300">
                  {matchData.naalu_porutham_checks.filter((c: any) => c.status).length}/4
                </div>
                <p className="text-indigo-200 text-sm">Additional Checks Passed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-300">
                  {matchData.method}
                </div>
                <p className="text-indigo-200 text-sm">Method Used</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-300">
                  {verdict.percentage}%
                </div>
                <p className="text-indigo-200 text-sm">Compatibility</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
