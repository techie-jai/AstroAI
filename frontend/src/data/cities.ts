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
    const response = await fetch(`/api/cities/search?query=${encodeURIComponent(query)}`)
    if (!response.ok) {
      console.error('Failed to search cities:', response.statusText)
      return []
    }
    return await response.json()
  } catch (error) {
    console.error('Error searching cities:', error)
    return []
  }
}
