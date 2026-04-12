import apiClient from '../services/api'

export interface CityData {
  name: string
  city: string
  country: string
  latitude: number
  longitude: number
  timezone: number
  timezone_name: string
}

export const searchCities = async (query: string): Promise<CityData[]> => {
  if (!query.trim()) return []
  
  try {
    const response = await apiClient.get('/cities/search', { params: { query } })
    return response.data
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}
