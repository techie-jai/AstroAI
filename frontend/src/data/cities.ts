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
    console.error('[Cities] Error searching cities via CSV fallback:', error)
    return []
  }
}

export const normalizeGooglePlaceToCity = (place: any): CityData => {
  return {
    name: place.formatted_address || place.name || '',
    city: place.name || '',
    country: place.country || '',
    latitude: place.latitude || 0,
    longitude: place.longitude || 0,
    timezone: place.timezone || 5.5,
    timezone_name: place.timezone_name || 'UTC+05:30',
  }
}
