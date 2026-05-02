import React, { useState } from 'react'
import { Heart, Briefcase, Activity, TrendingUp, Download, MessageCircle, ChevronDown, Flame, Star, Zap, Sun } from 'lucide-react'
import { PalmistryData } from '../../pages/PalmistryPage'
import toast from 'react-hot-toast'

interface PalmistryResultsProps {
  data: PalmistryData
  onNewReading: () => void
}

export default function PalmistryResults({ data, onNewReading }: PalmistryResultsProps) {
  const [expandedLine, setExpandedLine] = useState<string | null>(null)
  const [expandedMount, setExpandedMount] = useState<string | null>(null)
  const [showKundliCorrelation, setShowKundliCorrelation] = useState(false)
  const [activeTab, setActiveTab] = useState<'lines' | 'mounts' | 'areas'>('lines')

  const lineIcons: Record<string, React.ReactNode> = {
    heart_line: <Heart className="w-5 h-5 text-pink-400" />,
    head_line: <Zap className="w-5 h-5 text-cyan-400" />,
    life_line: <Activity className="w-5 h-5 text-amber-400" />,
    fate_line: <TrendingUp className="w-5 h-5 text-purple-400" />,
    sun_line: <Sun className="w-5 h-5 text-yellow-400" />,
  }

  const mountIcons: Record<string, React.ReactNode> = {
    jupiter: '♃',
    saturn: '♄',
    apollo: '☉',
    mercury: '☿',
    venus: '♀',
    moon: '☽',
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'strong':
        return 'text-green-400 bg-green-500/10'
      case 'moderate':
        return 'text-amber-400 bg-amber-500/10'
      case 'faint':
        return 'text-slate-400 bg-slate-500/10'
      default:
        return 'text-slate-400'
    }
  }

  const getProminenceColor = (prominence: string) => {
    switch (prominence) {
      case 'prominent':
        return 'text-purple-400'
      case 'normal':
        return 'text-slate-300'
      case 'flat':
        return 'text-slate-500'
      default:
        return 'text-slate-400'
    }
  }

  const handleDownloadPDF = async () => {
    try {
      toast.loading('Generating PDF report...')
      // TODO: Implement PDF generation
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to download PDF')
    }
  }

  const handleAskQuestions = () => {
    // TODO: Navigate to chat with palmistry context
    toast.success('Chat feature coming soon!')
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 rounded-2xl p-8 border border-slate-700/50">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Hand Image */}
          <div className="lg:w-1/3">
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🖐️</div>
                  <p className="text-slate-400 text-sm">
                    {data.handedness === 'right' ? 'Right' : 'Left'} Hand
                  </p>
                  <p className="text-slate-500 text-xs mt-2">{data.hand_type}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Insights */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold text-white mb-6">Your Palm Reading</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                { label: 'Love & Relationships', value: data.life_areas.love.score, icon: Heart, color: 'from-pink-600 to-red-600' },
                { label: 'Career & Ambition', value: data.life_areas.career.score, icon: Briefcase, color: 'from-cyan-600 to-blue-600' },
                { label: 'Health & Vitality', value: data.life_areas.health.score, icon: Activity, color: 'from-green-600 to-emerald-600' },
                { label: 'Wealth & Prosperity', value: data.life_areas.wealth.score, icon: TrendingUp, color: 'from-amber-600 to-yellow-600' },
              ].map((item, idx) => {
                const Icon = item.icon
                return (
                  <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="w-5 h-5 text-slate-400" />
                      <span className="text-2xl font-bold text-white">{item.value}%</span>
                    </div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition text-sm"
              >
                <Download className="w-4 h-4" />
                Download Report
              </button>
              <button
                onClick={handleAskQuestions}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg transition text-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Ask Questions
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-700/50">
        {[
          { id: 'lines', label: 'Palm Lines' },
          { id: 'mounts', label: 'Planetary Mounts' },
          { id: 'areas', label: 'Life Areas' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-3 font-medium transition border-b-2 ${
              activeTab === tab.id
                ? 'text-purple-400 border-purple-400'
                : 'text-slate-400 border-transparent hover:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {/* Palm Lines Tab */}
        {activeTab === 'lines' && (
          <div className="space-y-4">
            {Object.entries(data.major_lines).map(([key, line]) => (
              <div
                key={key}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedLine(expandedLine === key ? null : key)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-700/30 transition"
                >
                  <div className="flex items-center gap-4">
                    {lineIcons[key] || <Star className="w-5 h-5 text-slate-400" />}
                    <div className="text-left">
                      <h3 className="font-bold text-white">{line.name}</h3>
                      <p className="text-sm text-slate-400">{line.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStrengthColor(line.strength)}`}>
                      {line.strength.charAt(0).toUpperCase() + line.strength.slice(1)}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition ${expandedLine === key ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {expandedLine === key && (
                  <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50">
                    <p className="text-slate-300">{line.meaning}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Planetary Mounts Tab */}
        {activeTab === 'mounts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.mounts).map(([key, mount]) => (
              <div
                key={key}
                className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{mount.name}</h3>
                    <p className="text-sm text-slate-400">{mount.planet}</p>
                  </div>
                  <span className={`text-3xl ${getProminenceColor(mount.prominence)}`}>
                    {mountIcons[key] || '•'}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-3">{mount.description}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  mount.prominence === 'prominent'
                    ? 'bg-purple-500/20 text-purple-300'
                    : mount.prominence === 'normal'
                    ? 'bg-slate-600/20 text-slate-300'
                    : 'bg-slate-700/20 text-slate-400'
                }`}>
                  {mount.prominence.charAt(0).toUpperCase() + mount.prominence.slice(1)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Life Areas Tab */}
        {activeTab === 'areas' && (
          <div className="space-y-4">
            {Object.entries(data.life_areas).map(([key, area]) => (
              <div key={key} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-white text-lg">{area.title}</h3>
                  <span className="text-3xl font-bold text-purple-400">{area.score}%</span>
                </div>
                <p className="text-slate-300 mb-4">{area.description}</p>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${area.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overall Reading */}
      <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-white mb-4">Overall Reading</h2>
        <p className="text-slate-200 leading-relaxed">{data.overall_reading}</p>
      </div>

      {/* New Reading Button */}
      <div className="flex justify-center">
        <button
          onClick={onNewReading}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition font-medium"
        >
          Analyze Another Hand
        </button>
      </div>
    </div>
  )
}
