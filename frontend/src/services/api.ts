import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('firebaseToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
