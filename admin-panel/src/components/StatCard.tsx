import { ReactNode } from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: number
  trendLabel?: string
  color: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan'
}

const colorClasses = {
  blue: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  green: 'from-green-500/20 to-green-600/20 border-green-500/30',
  purple: 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
  orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
  cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30'
}

const textColors = {
  blue: 'text-blue-400',
  green: 'text-green-400',
  purple: 'text-purple-400',
  orange: 'text-orange-400',
  pink: 'text-pink-400',
  cyan: 'text-cyan-400'
}

export function StatCard({ title, value, icon, trend, trendLabel, color }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6 backdrop-blur-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{title}</p>
          <p className="text-3xl font-bold text-white mb-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center gap-1">
              {trend >= 0 ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
              <span className={trend >= 0 ? 'text-green-400' : 'text-red-400'} style={{ fontSize: '0.875rem' }}>
                {trend >= 0 ? '+' : ''}{trend}% {trendLabel || 'from last month'}
              </span>
            </div>
          )}
        </div>
        <div className={`${textColors[color]} opacity-60`}>
          {icon}
        </div>
      </div>
    </div>
  )
}
