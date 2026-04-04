import React from 'react'
import { LucideIcon } from 'lucide-react'

interface InsightCardProps {
  title: string
  description: string
  icon: LucideIcon
  color: 'indigo' | 'purple' | 'blue' | 'green' | 'orange' | 'pink'
  actionLabel?: string
  onAction?: () => void
}

const colorClasses = {
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-900',
  purple: 'bg-purple-50 border-purple-200 text-purple-900',
  blue: 'bg-blue-50 border-blue-200 text-blue-900',
  green: 'bg-green-50 border-green-200 text-green-900',
  orange: 'bg-orange-50 border-orange-200 text-orange-900',
  pink: 'bg-pink-50 border-pink-200 text-pink-900',
}

const iconColorClasses = {
  indigo: 'text-indigo-600',
  purple: 'text-purple-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  pink: 'text-pink-600',
}

export default function InsightCard({
  title,
  description,
  icon: Icon,
  color,
  actionLabel,
  onAction,
}: InsightCardProps) {
  return (
    <div className={`rounded-lg border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-start space-x-4">
        <Icon size={28} className={`flex-shrink-0 ${iconColorClasses[color]}`} />
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{title}</h3>
          <p className="text-sm leading-relaxed mb-4">{description}</p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`text-sm font-semibold px-3 py-1 rounded transition ${
                color === 'indigo'
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : color === 'purple'
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : color === 'blue'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : color === 'green'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : color === 'orange'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-pink-600 hover:bg-pink-700 text-white'
              }`}
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
