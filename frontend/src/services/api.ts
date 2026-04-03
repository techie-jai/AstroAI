import axios from 'axios'

const API_BASE_URL = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add Firebase token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebaseToken')
  console.log('[API] Request to:', config.url)
  console.log('[API] Token from localStorage:', token ? `${token.substring(0, 50)}...` : 'NOT FOUND')
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('[API] Authorization header set:', config.headers.Authorization ? 'YES' : 'NO')
  } else {
    console.error('[API] ERROR: No Firebase token in localStorage!')
  }
  
  return config
}, (error) => {
  console.error('[API] Request interceptor error:', error)
  return Promise.reject(error)
})

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API] Response:', response.status, response.statusText)
    return response
  },
  async (error) => {
    console.error('[API] Error Response:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    })
    
    // If 401, try to refresh token and retry
    if (error.response?.status === 401) {
      console.warn('[API] Got 401, attempting to refresh token...')
      try {
        const { useAuthStore } = await import('../store/authStore')
        const refreshToken = useAuthStore.getState().refreshToken
        const newToken = await refreshToken()
        
        if (newToken) {
          console.log('[API] Token refreshed, retrying request...')
          error.config.headers.Authorization = `Bearer ${newToken}`
          return apiClient(error.config)
        }
      } catch (refreshError) {
        console.error('[API] Token refresh failed:', refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

export const api = {
  // Auth
  verifyToken: (token: string) =>
    apiClient.post('/auth/verify-token', { token }),
  createProfile: (token: string, displayName?: string) =>
    apiClient.post('/auth/create-profile', { token, display_name: displayName }),

  // User
  getUserProfile: () => apiClient.get('/user/profile'),
  updateUserProfile: (data: Record<string, any>) =>
    apiClient.put('/user/profile', data),

  // Kundli
  generateKundli: (birthData: Record<string, any>, chartTypes?: string[]) =>
    apiClient.post('/kundli/generate', {
      birth_data: birthData,
      include_charts: true,
      chart_types: chartTypes || ['D1', 'D7', 'D9', 'D10'],
    }),
  getKundli: (kundliId: string) =>
    apiClient.get(`/kundli/${kundliId}`),

  // Charts
  generateCharts: (birthData: Record<string, any>, chartTypes?: string[]) =>
    apiClient.post('/charts/generate', {
      birth_data: birthData,
      chart_types: chartTypes || ['D1', 'D7', 'D9', 'D10'],
    }),
  getAvailableCharts: () =>
    apiClient.get('/charts/available'),

  // Calculations
  getCalculationHistory: (limit?: number) =>
    apiClient.get('/calculations/history', { params: { limit } }),

  // Planet & House queries
  getPlanetPosition: (chartType: string, planetName: string, birthData: Record<string, any>) =>
    apiClient.get(`/planet/${chartType}/${planetName}`, { params: birthData }),
  getPlanetsInHouse: (chartType: string, houseNumber: number, birthData: Record<string, any>) =>
    apiClient.get(`/house/${chartType}/${houseNumber}`, { params: birthData }),

  // Analysis
  generateAnalysis: (kundliId: string, analysisType?: string) =>
    apiClient.post('/analysis/generate', {
      kundli_id: kundliId,
      analysis_type: analysisType || 'comprehensive',
    }),
}

export default apiClient
