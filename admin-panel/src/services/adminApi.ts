import axios, { AxiosInstance } from 'axios'
import { User, Kundli, Analytics, UserGrowth, UsageAnalytics, TokenAnalytics, SystemHealth } from '../types/admin'

const env = import.meta.env as any
const API_URL = env.VITE_ADMIN_API_URL || 'http://localhost:8000'

class AdminApiService {
  private api: AxiosInstance
  private token: string | null = null

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.api.interceptors.request.use((config: any) => {
      if (this.token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${this.token}`
      }
      return config
    })

    this.api.interceptors.response.use(
      (response: any) => response,
      (error: any) => {
        if (error.response?.status === 401) {
          this.token = null
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  setToken(token: string) {
    this.token = token
  }

  clearToken() {
    this.token = null
  }

  async verifyToken(): Promise<any> {
    return this.api.post('/api/admin/auth/verify')
  }

  async getUsers(limit: number = 50, offset: number = 0, search: string = '', filters: any = {}) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      search
    })

    if (filters.role) params.append('role', filters.role)
    if (filters.isBlocked !== undefined) params.append('isBlocked', filters.isBlocked.toString())

    return this.api.get(`/api/admin/users?${params.toString()}`)
  }

  async getUserDetail(userId: string): Promise<User> {
    const response = await this.api.get(`/api/admin/users/${userId}`)
    return response.data
  }

  async updateUser(userId: string, updates: Partial<User>) {
    return this.api.put(`/api/admin/users/${userId}`, updates)
  }

  async blockUser(userId: string, block: boolean = true) {
    return this.api.post(`/api/admin/users/${userId}/block?block=${block}`)
  }

  async deleteUser(userId: string) {
    return this.api.delete(`/api/admin/users/${userId}`)
  }

  async resetPassword(userId: string) {
    return this.api.post(`/api/admin/users/${userId}/reset-password`)
  }

  async getKundlis(limit: number = 50, offset: number = 0, filters: any = {}) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })

    if (filters.userId) params.append('user_id', filters.userId)
    if (filters.hasAnalysis !== undefined) params.append('hasAnalysis', filters.hasAnalysis.toString())

    return this.api.get(`/api/admin/kundlis?${params.toString()}`)
  }

  async getKundliDetail(userId: string, kundliId: string): Promise<Kundli> {
    const response = await this.api.get(`/api/admin/kundlis/${userId}/${kundliId}`)
    return response.data
  }

  async deleteKundli(userId: string, kundliId: string) {
    return this.api.delete(`/api/admin/kundlis/${userId}/${kundliId}`)
  }

  async getAnalyticsOverview(): Promise<Analytics> {
    const response = await this.api.get('/api/admin/analytics/overview')
    return response.data
  }

  async getUserGrowth(days: number = 30): Promise<UserGrowth[]> {
    const response = await this.api.get(`/api/admin/analytics/user-growth?days=${days}`)
    return response.data.data
  }

  async getUsageAnalytics(): Promise<UsageAnalytics> {
    const response = await this.api.get('/api/admin/analytics/usage')
    return response.data
  }

  async getTokenAnalytics(): Promise<TokenAnalytics> {
    const response = await this.api.get('/api/admin/analytics/tokens')
    return response.data
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await this.api.get('/api/admin/system/health')
    return response.data
  }

  async getAdminLogs(limit: number = 100, offset: number = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString()
    })
    return this.api.get(`/api/admin/logs?${params.toString()}`)
  }
}

export const adminApi = new AdminApiService()
