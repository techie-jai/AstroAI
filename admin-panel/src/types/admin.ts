export interface AdminUser {
  uid: string
  email: string
  is_admin: boolean
}

export interface User {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: 'user' | 'admin'
  isBlocked: boolean
  createdAt: string
  lastLogin?: string
  tokenUsage: {
    total: number
    monthly: number
    lastReset?: string
  }
  kundliCount: number
  subscription?: string
  blockedAt?: string
}

export interface Kundli {
  id: string
  userId: string
  userName: string
  userEmail: string
  name: string
  birthData: {
    name: string
    place_name: string
    latitude: number
    longitude: number
    timezone_offset: number
    year: number
    month: number
    day: number
    hour: number
    minute: number
  }
  generatedAt: string
  analysis?: string
  pdfGenerated?: boolean
  horoscope_info?: Record<string, any>
}

export interface Analytics {
  totalUsers: number
  activeUsers: number
  totalKundlis: number
  totalTokensUsed: number
  averageKundlisPerUser: number
  timestamp: string
}

export interface UserGrowth {
  date: string
  newUsers: number
  totalUsers: number
}

export interface UsageAnalytics {
  usage: {
    kundliGeneration: number
    analysis: number
    chat: number
    pdfDownload: number
  }
  percentages: Record<string, number>
  total: number
}

export interface TokenAnalytics {
  totalTokensUsed: number
  topUsers: Array<{
    userId: string
    userName: string
    tokensUsed: number
    monthlyUsage: number
  }>
  averagePerUser: number
  allUsers: Array<{
    userId: string
    userName: string
    tokensUsed: number
    monthlyUsage: number
  }>
}

export interface SystemHealth {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  metrics?: {
    totalUsers: number
    totalKundlis: number
    databaseStatus: string
    apiStatus: string
  }
  error?: string
}

export interface AdminLog {
  id: string
  action: string
  targetUserId?: string
  adminId?: string
  details: Record<string, any>
  timestamp: string
  ipAddress: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}
