declare global {
  interface Window {
    google?: any
  }
}

interface ImportMetaEnv {
  VITE_GOOGLE_MAPS_API_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

let googleMapsLoaded = false
let googleMapsPromise: Promise<void> | null = null

export const loadGoogleMaps = (): Promise<void> => {
  if (googleMapsLoaded) {
    console.log('[GoogleMaps] Already loaded, returning cached promise')
    return Promise.resolve()
  }

  if (googleMapsPromise) {
    console.log('[GoogleMaps] Loading in progress, returning existing promise')
    return googleMapsPromise
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const apiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY

    console.log('[GoogleMaps] API Key present:', !!apiKey)
    console.log('[GoogleMaps] Environment keys:', Object.keys(import.meta.env as any).filter(k => k.includes('GOOGLE') || k.includes('VITE')))

    if (!apiKey) {
      console.warn('[GoogleMaps] API key not found in environment variables. Google Places Autocomplete will be unavailable.')
      reject(new Error('Google Maps API key not configured'))
      return
    }

    console.log('[GoogleMaps] Loading Google Maps API with key:', apiKey.substring(0, 10) + '...')
    
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true

    script.onload = () => {
      googleMapsLoaded = true
      console.log('[GoogleMaps] Google Maps API loaded successfully')
      console.log('[GoogleMaps] window.google available:', !!window.google)
      resolve()
    }

    script.onerror = (error) => {
      console.error('[GoogleMaps] Failed to load Google Maps API:', error)
      reject(new Error('Failed to load Google Maps API'))
    }

    console.log('[GoogleMaps] Appending script to head')
    document.head.appendChild(script)
  })

  return googleMapsPromise
}

export const isGoogleMapsLoaded = (): boolean => {
  return !!(googleMapsLoaded && typeof window !== 'undefined' && window.google?.maps?.places)
}

export interface PlacePrediction {
  place_id: string
  description: string
  main_text: string
  secondary_text?: string
}

export interface PlaceDetails {
  formatted_address: string
  latitude: number
  longitude: number
  name: string
}

export const getPlaceDetails = (placeId: string): Promise<PlaceDetails> => {
  return new Promise((resolve, reject) => {
    if (!isGoogleMapsLoaded()) {
      reject(new Error('Google Maps not loaded'))
      return
    }

    const service = new window.google!.maps.places.PlacesService(document.createElement('div'))

    service.getDetails(
      {
        placeId,
        fields: ['formatted_address', 'geometry', 'name'],
      },
      (place, status) => {
        if (status === 'OK' && place && place.geometry?.location) {
          resolve({
            formatted_address: place.formatted_address || '',
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
            name: place.name || '',
          })
        } else {
          reject(new Error(`Failed to get place details: ${status}`))
        }
      }
    )
  })
}
