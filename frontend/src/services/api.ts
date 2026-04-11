import axios from 'axios'

// Determine API base URL based on current domain
const getApiBaseUrl = () => {
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  
  console.log('[API] Current hostname:', hostname)
  console.log('[API] Current protocol:', protocol)
  console.log('[API] Current port:', port)
  
  // For production domain (kendraa.ai), use api subdomain
  if (hostname.includes('kendraa.ai')) {
    const url = `${protocol}//api.kendraa.ai/api`
    console.log('[API] Detected production domain, using api subdomain:', url)
    return url
  }
  
  // For localhost, use localhost:8000
  if (hostname === 'localhost') {
    const url = `${protocol}//localhost:8000/api`
    console.log('[API] Detected localhost, using localhost:8000:', url)
    return url
  }
  
  // For 127.0.0.1 (including browser preview proxies), use localhost:8000 instead
  // This allows browser preview to reach the local Docker backend
  if (hostname === '127.0.0.1') {
    const url = `${protocol}//localhost:8000/api`
    console.log('[API] Detected 127.0.0.1 (browser preview), using localhost:8000:', url)
    return url
  }
  
  // Fallback: use localhost:8000
  const url = `${protocol}//localhost:8000/api`
  console.log('[API] Using fallback localhost:8000:', url)
  return url
}

const API_BASE_URL = getApiBaseUrl()
console.log('[API] Final API_BASE_URL:', API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Cache-busting headers
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
})

// Request interceptor to add Firebase token and cache-busting to every request
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
  
  // Add cache-busting query parameter for GET requests
  if (config.method === 'get') {
    config.params = config.params || {}
    config.params._t = Date.now() // Timestamp to bust cache
    console.log('[API] Added cache-busting timestamp:', config.params._t)
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
  getUserCalculations: () =>
    apiClient.get('/user/calculations'),
  loadUserSession: () =>
    apiClient.get('/user/load-session'),

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
  downloadAnalysis: (kundliId: string) =>
    apiClient.get(`/analysis/download/${kundliId}`, { responseType: 'arraybuffer' }),
  analyzeKundli: (kundliId: string) =>
    apiClient.post('/analysis/generate', {
      kundli_id: kundliId,
      analysis_type: 'comprehensive',
    }),
  downloadKundliPDF: (kundliId: string) =>
    apiClient.get(`/kundli/download/${kundliId}`, { responseType: 'arraybuffer' }),
  downloadAnalysisPDF: (kundliId: string) =>
    apiClient.get(`/analysis/download/${kundliId}`, { responseType: 'arraybuffer' }),
  downloadKundliZip: (kundliId: string) =>
    apiClient.get(`/kundli/download-zip/${kundliId}`, { responseType: 'arraybuffer' }),

  // Dashboard & Insights
  getDashboardInsights: (kundliId?: string, forceRefresh?: boolean) =>
    apiClient.get('/dashboard/insights', { params: { kundli_id: kundliId, force_refresh: forceRefresh } }),
  getUserInsights: (kundliId: string) =>
    apiClient.get(`/insights/${kundliId}`),

  // Chat
  sendChatMessage: (kundliId: string, message: string, chatHistory?: any[]) =>
    apiClient.post('/chat/message', {
      kundli_id: kundliId,
      user_message: message,
      chat_history: chatHistory || [],
    }),
  sendKundliChatMessage: (kundliData: Record<string, any>, message: string, chatHistory?: any[]) =>
    apiClient.post('/chat/message-with-kundli', {
      kundli_data: kundliData,
      user_message: message,
      chat_history: chatHistory || [],
    }),
  getChatHistory: (kundliId: string) =>
    apiClient.get(`/chat/history/${kundliId}`),

  // LiveChat
  generateLivechatKundli: (birthData: Record<string, any>) =>
    apiClient.post('/livechat/generate-kundli', {
      birth_data: birthData,
    }),
  sendLivechatMessage: (kundliData: Record<string, any>, message: string, chatHistory?: any[]) =>
    apiClient.post('/livechat/message', {
      kundli_data: kundliData,
      user_message: message,
      chat_history: chatHistory || [],
    }),

  // Cities
  searchCities: (query: string) =>
    apiClient.get('/cities/search', { params: { query } }),

  // Bot Services
  sendKundliWhatsApp: (phoneNumber: string, kundliData: Record<string, any>, birthData: Record<string, any>) =>
    apiClient.post('/bot/send-kundli-whatsapp', {
      phone_number: phoneNumber,
      kundli_data: kundliData,
      birth_data: birthData,
    }),
  sendKundliTelegram: (chatId: string, kundliData: Record<string, any>, birthData: Record<string, any>) =>
    apiClient.post('/bot/send-kundli-telegram', {
      chat_id: chatId,
      kundli_data: kundliData,
      birth_data: birthData,
    }),
  getBotUser: (platform: string, phoneNumber: string) =>
    apiClient.get(`/bot/user/${platform}/${phoneNumber}`),
  getBotSession: (userId: string) =>
    apiClient.get(`/bot/session/${userId}`),
  deleteBotSession: (userId: string) =>
    apiClient.delete(`/bot/session/${userId}`),
  getBotUserKundlis: (platform: string, phoneNumber: string) =>
    apiClient.get(`/bot/kundlis/${platform}/${phoneNumber}`),
  getBotStats: (platform?: string) =>
    apiClient.get('/bot/stats', { params: { platform } }),
}

export default apiClient
