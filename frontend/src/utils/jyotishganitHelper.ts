/**
 * Helper utilities for working with Jyotishganit data structure
 * Converts Jyotishganit data format to UI-friendly format
 */

export interface HoroscopeInfo {
  [key: string]: any
}

export interface PlanetInfo {
  name: string
  sign: string
  house: number
  nakshatra: string
  degree?: number
  longitude?: number
  latitude?: number
}

export interface HouseInfo {
  number: number
  sign: string
  lord: string
  planets: PlanetInfo[]
}

export interface JyotishganitKundli {
  horoscope_info: HoroscopeInfo
  birth_details?: any
  metadata?: any
  jyotishganit_json?: any
}

/**
 * Extract planet information from horoscope_info
 * Looks for keys like: sun_sign, sun_house, sun_nakshatra, sun_degree, sun_longitude, sun_latitude, etc.
 */
export function extractPlanets(horoscopeInfo: HoroscopeInfo): PlanetInfo[] {
  const planets: PlanetInfo[] = []
  const planetNames = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu']
  
  console.log('[EXTRACT_PLANETS] Starting planet extraction from horoscope_info')
  console.log('[EXTRACT_PLANETS] Available keys:', Object.keys(horoscopeInfo).filter(k => k.includes('_degree') || k.includes('_longitude')))
  
  for (const planetName of planetNames) {
    const sign = horoscopeInfo[`${planetName}_sign`]
    const house = horoscopeInfo[`${planetName}_house`]
    const nakshatra = horoscopeInfo[`${planetName}_nakshatra`]
    // Try both singular and plural forms for degree
    const degree = horoscopeInfo[`${planetName}_degree`] || horoscopeInfo[`${planetName}_degrees`]
    const longitude = horoscopeInfo[`${planetName}_longitude`]
    const latitude = horoscopeInfo[`${planetName}_latitude`]
    
    if (sign || house || nakshatra) {
      const planetData = {
        name: planetName.charAt(0).toUpperCase() + planetName.slice(1),
        sign: sign || 'N/A',
        house: house || 0,
        nakshatra: nakshatra || 'N/A',
        degree: degree !== undefined && degree !== null ? parseFloat(degree) : undefined,
        longitude: longitude !== undefined && longitude !== null ? parseFloat(longitude) : undefined,
        latitude: latitude !== undefined && latitude !== null ? parseFloat(latitude) : undefined
      }
      
      if (planetData.degree !== undefined) {
        console.log(`[EXTRACT_PLANETS] ✓ ${planetData.name}: degree=${planetData.degree}`)
      } else if (planetData.longitude !== undefined) {
        console.log(`[EXTRACT_PLANETS] ✓ ${planetData.name}: longitude=${planetData.longitude} (no degree found)`)
      } else {
        console.log(`[EXTRACT_PLANETS] ✗ ${planetData.name}: NO DEGREE/LONGITUDE DATA`)
      }
      
      planets.push(planetData)
    }
  }
  
  console.log('[EXTRACT_PLANETS] Extraction complete. Total planets:', planets.length)
  return planets
}

/**
 * Extract house information from horoscope_info
 * Looks for keys like: house_1_sign, house_1_lord, etc.
 */
export function extractHouses(horoscopeInfo: HoroscopeInfo): HouseInfo[] {
  const houses: HouseInfo[] = []
  
  for (let i = 1; i <= 12; i++) {
    const sign = horoscopeInfo[`house_${i}_sign`]
    const lord = horoscopeInfo[`house_${i}_lord`]
    
    if (sign || lord) {
      houses.push({
        number: i,
        sign: sign || 'N/A',
        lord: lord || 'N/A',
        planets: []
      })
    }
  }
  
  return houses
}

/**
 * Extract panchanga information from horoscope_info
 */
export function extractPanchanga(horoscopeInfo: HoroscopeInfo) {
  return {
    tithi: horoscopeInfo['tithi'] || 'N/A',
    nakshatra: horoscopeInfo['nakshatra'] || 'N/A',
    yoga: horoscopeInfo['yoga'] || 'N/A',
    karana: horoscopeInfo['karana'] || 'N/A',
    vaara: horoscopeInfo['vaara'] || 'N/A'
  }
}

/**
 * Extract ayanamsa information from horoscope_info
 */
export function extractAyanamsa(horoscopeInfo: HoroscopeInfo) {
  return {
    name: horoscopeInfo['ayanamsa_name'] || 'N/A',
    value: horoscopeInfo['ayanamsa_value'] || 0
  }
}

/**
 * Format horoscope_info key for display
 * Converts snake_case to Title Case
 */
export function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Filter horoscope_info to get displayable items
 * Excludes internal keys and complex objects
 */
export function getDisplayableItems(horoscopeInfo: HoroscopeInfo, limit: number = 12): Array<[string, string]> {
  return Object.entries(horoscopeInfo)
    .filter(([key, value]) => {
      // Skip internal keys
      if (key.startsWith('_')) return false
      // Skip complex objects (only show simple values)
      if (typeof value === 'object' && value !== null) return false
      return true
    })
    .slice(0, limit)
    .map(([key, value]) => [key, String(value)])
}

/**
 * Get summary of astrological data
 */
export function getAstrologicalSummary(horoscopeInfo: HoroscopeInfo) {
  const panchanga = extractPanchanga(horoscopeInfo)
  const ayanamsa = extractAyanamsa(horoscopeInfo)
  const planets = extractPlanets(horoscopeInfo)
  const houses = extractHouses(horoscopeInfo)
  
  return {
    panchanga,
    ayanamsa,
    planets,
    houses,
    totalDataPoints: Object.keys(horoscopeInfo).length
  }
}
