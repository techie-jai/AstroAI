import { Activity, Cpu, HardDrive, Zap } from 'lucide-react'

interface Metric {
  label: string
  value: string | number
  unit?: string
  icon: React.ReactNode
  color: string
}

interface MetricsPanelProps {
  metrics: Metric[]
  isLoading?: boolean
}

export function MetricsPanel({ metrics, isLoading = false }: MetricsPanelProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-24 bg-slate-700/30 rounded-lg"></div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {metrics.map((metric, idx) => (
        <div key={idx} className={`bg-gradient-to-br ${metric.color} border border-slate-700/50 rounded-lg p-4`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">{metric.label}</span>
            <div className="text-slate-500">{metric.icon}</div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{metric.value}</span>
            {metric.unit && <span className="text-xs text-slate-400">{metric.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}
