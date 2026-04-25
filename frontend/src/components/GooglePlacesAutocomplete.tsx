import React, { useEffect, useRef, useState } from 'react'
import { loadGoogleMaps, isGoogleMapsLoaded, getPlaceDetails } from '../utils/googleMapsLoader'
import { CityData, searchCities } from '../data/cities'
import { Search, AlertCircle } from 'lucide-react'

interface GooglePlacesAutocompleteProps {
  value: string
  onChange: (value: string) => void
  onSelect: (place: CityData) => void
  placeholder?: string
  disabled?: boolean
}

const truncateText = (text: string, maxLength: number = 80): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

interface AutocompletePrediction {
  place_id: string
  description: string
  main_text: string
  secondary_text?: string
  csvData?: CityData
}

export const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Search for a city, hospital, landmark...',
  disabled = false,
}) => {
  const [predictions, setPredictions] = useState<AutocompletePrediction[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [googleMapsReady, setGoogleMapsReady] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autocompleteServiceRef = useRef<any>(null)
  const sessionTokenRef = useRef<any>(null)

  useEffect(() => {
    const initGoogleMaps = async () => {
      try {
        await loadGoogleMaps()
        if (isGoogleMapsLoaded()) {
          autocompleteServiceRef.current = new window.google!.maps.places.AutocompleteService()
          sessionTokenRef.current = new window.google!.maps.places.AutocompleteSessionToken()
          setGoogleMapsReady(true)
          setError(null)
        }
      } catch (err) {
        console.error('[GooglePlaces] Failed to load Google Maps:', err)
        setError('Google Maps not available. Using fallback search.')
        setGoogleMapsReady(false)
      }
    }

    initGoogleMaps()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowPredictions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)

    if (!inputValue.trim() || inputValue.length < 2) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    setLoading(true)
    setError(null)
    
    try {
      // Try Google Maps first if available
      if (googleMapsReady && autocompleteServiceRef.current) {
        try {
          console.log('[GooglePlaces] Trying Google Maps API for:', inputValue)
          const response = await autocompleteServiceRef.current.getPlacePredictions({
            input: inputValue,
            sessionToken: sessionTokenRef.current,
            types: ['geocode', 'establishment'],
          })

          if (response.predictions && response.predictions.length > 0) {
            console.log('[GooglePlaces] Got Google Maps predictions:', response.predictions.length)
            setPredictions(response.predictions)
            setShowPredictions(true)
            setLoading(false)
            return
          }
        } catch (googleErr) {
          console.warn('[GooglePlaces] Google Maps API error, falling back to CSV:', googleErr)
        }
      }

      // Fallback to CSV search
      console.log('[GooglePlaces] Using CSV search for:', inputValue)
      const csvResults = await searchCities(inputValue)
      
      console.log('[GooglePlaces] CSV search returned:', csvResults?.length || 0, 'results')
      
      if (csvResults && csvResults.length > 0) {
        // Convert CSV results to prediction format for display
        const csvPredictions = csvResults.map((city, idx) => {
          const mainText = city.city && city.city.trim() ? city.city : (city.name && city.name.trim() ? city.name : 'Unknown')
          const secondaryText = city.country && city.country.trim() ? city.country : ''
          
          console.log(`[GooglePlaces] Converting city ${idx}:`, { city: city.city, name: city.name, mainText, secondaryText })
          
          return {
            place_id: `csv_${idx}_${mainText}`,
            description: city.name || mainText,
            main_text: mainText,
            secondary_text: secondaryText,
            csvData: city, // Store the full city data
          }
        })
        
        console.log('[GooglePlaces] Showing', csvPredictions.length, 'CSV predictions')
        console.log('[GooglePlaces] First prediction:', csvPredictions[0])
        setPredictions(csvPredictions)
        setShowPredictions(true)
        setError(googleMapsReady ? null : 'Using CSV database')
      } else {
        console.log('[GooglePlaces] No results found')
        setPredictions([])
        setShowPredictions(true)
        setError('No locations found')
      }
    } catch (err) {
      console.error('[GooglePlaces] Error fetching suggestions:', err)
      setError('Error fetching suggestions')
      setPredictions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectPrediction = async (prediction: AutocompletePrediction) => {
    try {
      setLoading(true)

      // Check if this is CSV data
      if (prediction.csvData) {
        // Use CSV data directly
        onSelect(prediction.csvData)
        onChange(prediction.csvData.name)
        setShowPredictions(false)
        setPredictions([])
        return
      }

      // Otherwise, fetch from Google Places
      const details = await getPlaceDetails(prediction.place_id)

      const cityData: CityData = {
        name: details.formatted_address,
        city: details.name,
        country: '',
        latitude: details.latitude,
        longitude: details.longitude,
        timezone: 5.5,
        timezone_name: 'UTC+05:30',
      }

      onSelect(cityData)
      onChange(details.formatted_address)
      setShowPredictions(false)
      setPredictions([])

      if (sessionTokenRef.current) {
        sessionTokenRef.current = new window.google!.maps.places.AutocompleteSessionToken()
      }
    } catch (err) {
      console.error('[GooglePlaces] Error selecting place:', err)
      setError('Failed to get location details')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative" title={value}>
        <Search className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => value.trim() && predictions.length > 0 && setShowPredictions(true)}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed overflow-hidden text-ellipsis"
          title={value}
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>

      {error && (
        <div className={`mt-2 flex items-center gap-2 text-sm p-2 rounded ${
          error.includes('CSV') ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50'
        }`}>
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {showPredictions && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {predictions.length > 0 ? (
            predictions.map((prediction, idx) => {
              console.log(`[GooglePlaces] Rendering prediction ${idx}:`, prediction.main_text, prediction.secondary_text)
              return (
                <button
                  key={prediction.place_id}
                  type="button"
                  onClick={() => handleSelectPrediction(prediction)}
                  className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition border-b border-gray-100 last:border-b-0 text-gray-900"
                >
                  <div className="font-medium text-gray-900">{prediction.main_text || prediction.description}</div>
                  {prediction.secondary_text && (
                    <div className="text-xs text-gray-600">{prediction.secondary_text}</div>
                  )}
                </button>
              )
            })
          ) : (
            <div className="p-4 text-center text-gray-500">
              {loading ? 'Searching...' : 'No locations found'}
            </div>
          )}
        </div>
      )}

      {!googleMapsReady && (
        <p className="text-xs text-gray-500 mt-1">
          Note: Google Maps not available. Manual coordinate entry required.
        </p>
      )}
    </div>
  )
}
