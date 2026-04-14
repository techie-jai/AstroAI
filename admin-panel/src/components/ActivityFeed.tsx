import { User, Clock, Mail } from 'lucide-react'

interface Activity {
  id: string
  user: string
  email: string
  action: string
  timestamp: string
}

interface ActivityFeedProps {
  activities: Activity[]
  isLoading?: boolean
}

export function ActivityFeed({ activities, isLoading = false }: ActivityFeedProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse h-12 bg-slate-700/30 rounded-lg"></div>
        ))}
      </div>
    )
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <User className="w-12 h-12 text-slate-600 mx-auto mb-3 opacity-50" />
        <p className="text-slate-400">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3 p-3 bg-slate-700/20 rounded-lg hover:bg-slate-700/40 transition">
          <div className="flex-shrink-0 mt-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{activity.user}</p>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              {activity.email}
            </p>
            <p className="text-xs text-slate-500 mt-1">{activity.action}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <p className="text-xs text-slate-500 flex items-center gap-1 whitespace-nowrap">
              <Clock className="w-3 h-3" />
              {activity.timestamp}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
