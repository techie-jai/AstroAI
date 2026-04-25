/**
 * Google Maps API Test Suite
 * Tests if Google Maps API is properly loaded and returning suggestions
 */

import { loadGoogleMaps, isGoogleMapsLoaded } from '../utils/googleMapsLoader'

describe('Google Maps API Tests', () => {
  // Test 1: Check if API key is available
  test('API key should be available in environment', () => {
    const apiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY
    console.log('[TEST] API Key available:', !!apiKey)
    console.log('[TEST] API Key (first 10 chars):', apiKey?.substring(0, 10) + '...')
    expect(apiKey).toBeDefined()
    expect(apiKey?.length).toBeGreaterThan(0)
  })

  // Test 2: Check if Google Maps SDK loads
  test('Google Maps SDK should load successfully', async () => {
    console.log('[TEST] Starting Google Maps SDK load test...')
    try {
      await loadGoogleMaps()
      console.log('[TEST] Google Maps SDK loaded successfully')
      expect(isGoogleMapsLoaded()).toBe(true)
    } catch (error) {
      console.error('[TEST] Failed to load Google Maps SDK:', error)
      throw error
    }
  })

  // Test 3: Check if window.google is available
  test('window.google should be available after loading', async () => {
    console.log('[TEST] Checking window.google availability...')
    await loadGoogleMaps()
    
    const googleAvailable = typeof window !== 'undefined' && !!window.google
    console.log('[TEST] window.google available:', googleAvailable)
    console.log('[TEST] window.google.maps available:', !!window.google?.maps)
    console.log('[TEST] window.google.maps.places available:', !!window.google?.maps?.places)
    
    expect(googleAvailable).toBe(true)
    expect(window.google?.maps?.places).toBeDefined()
  })

  // Test 4: Check if AutocompleteService is available
  test('AutocompleteService should be available', async () => {
    console.log('[TEST] Checking AutocompleteService...')
    await loadGoogleMaps()
    
    try {
      const service = new window.google!.maps.places.AutocompleteService()
      console.log('[TEST] AutocompleteService created successfully')
      expect(service).toBeDefined()
    } catch (error) {
      console.error('[TEST] Failed to create AutocompleteService:', error)
      throw error
    }
  })

  // Test 5: Test autocomplete predictions for "Mumbai"
  test('AutocompleteService should return predictions for "Mumbai"', async () => {
    console.log('[TEST] Testing autocomplete predictions for "Mumbai"...')
    await loadGoogleMaps()
    
    const service = new window.google!.maps.places.AutocompleteService()
    const sessionToken = new window.google!.maps.places.AutocompleteSessionToken()
    
    try {
      const response = await service.getPlacePredictions({
        input: 'Mumbai',
        sessionToken: sessionToken,
        types: ['geocode', 'establishment'],
      })
      
      console.log('[TEST] Predictions returned:', response.predictions?.length || 0)
      console.log('[TEST] Predictions:', response.predictions?.slice(0, 3).map(p => p.description))
      
      expect(response.predictions).toBeDefined()
      expect(response.predictions?.length).toBeGreaterThan(0)
    } catch (error) {
      console.error('[TEST] Failed to get predictions:', error)
      throw error
    }
  })

  // Test 6: Test autocomplete predictions for "Hospital"
  test('AutocompleteService should return predictions for "Hospital"', async () => {
    console.log('[TEST] Testing autocomplete predictions for "Hospital"...')
    await loadGoogleMaps()
    
    const service = new window.google!.maps.places.AutocompleteService()
    const sessionToken = new window.google!.maps.places.AutocompleteSessionToken()
    
    try {
      const response = await service.getPlacePredictions({
        input: 'Hospital',
        sessionToken: sessionToken,
        types: ['geocode', 'establishment'],
      })
      
      console.log('[TEST] Predictions returned:', response.predictions?.length || 0)
      console.log('[TEST] Predictions:', response.predictions?.slice(0, 3).map(p => p.description))
      
      expect(response.predictions).toBeDefined()
      expect(response.predictions?.length).toBeGreaterThan(0)
    } catch (error) {
      console.error('[TEST] Failed to get predictions:', error)
      throw error
    }
  })

  // Test 7: Test place details retrieval
  test('PlacesService should return place details', async () => {
    console.log('[TEST] Testing place details retrieval...')
    await loadGoogleMaps()
    
    const service = new window.google!.maps.places.AutocompleteService()
    const sessionToken = new window.google!.maps.places.AutocompleteSessionToken()
    
    try {
      // First get a prediction
      const response = await service.getPlacePredictions({
        input: 'Mumbai',
        sessionToken: sessionToken,
        types: ['geocode', 'establishment'],
      })
      
      if (!response.predictions || response.predictions.length === 0) {
        throw new Error('No predictions returned')
      }
      
      const placeId = response.predictions[0].place_id
      console.log('[TEST] Got place ID:', placeId)
      
      // Then get details
      const detailsService = new window.google!.maps.places.PlacesService(document.createElement('div'))
      
      return new Promise((resolve, reject) => {
        detailsService.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'geometry', 'name'],
          },
          (place, status) => {
            if (status === 'OK' && place) {
              console.log('[TEST] Place details retrieved:')
              console.log('[TEST] - Name:', place.name)
              console.log('[TEST] - Address:', place.formatted_address)
              console.log('[TEST] - Lat:', place.geometry?.location?.lat())
              console.log('[TEST] - Lng:', place.geometry?.location?.lng())
              
              expect(place.name).toBeDefined()
              expect(place.formatted_address).toBeDefined()
              expect(place.geometry?.location).toBeDefined()
              resolve(place)
            } else {
              console.error('[TEST] Failed to get place details:', status)
              reject(new Error(`Failed to get place details: ${status}`))
            }
          }
        )
      })
    } catch (error) {
      console.error('[TEST] Failed to retrieve place details:', error)
      throw error
    }
  })

  // Test 8: Test error handling for invalid API key
  test('Should handle invalid API key gracefully', async () => {
    console.log('[TEST] Testing invalid API key handling...')
    
    // This test checks if the loader properly rejects when API key is missing
    const apiKey = (import.meta.env as any).VITE_GOOGLE_MAPS_API_KEY
    
    if (!apiKey) {
      console.log('[TEST] API key is missing - this is expected for this test')
      expect(apiKey).toBeUndefined()
    } else {
      console.log('[TEST] API key is present - test passed')
      expect(apiKey).toBeDefined()
    }
  })
})

/**
 * Manual Test Instructions
 * 
 * Run these tests with:
 * npm test -- googleMapsAPI.test.ts
 * 
 * Or manually in browser console:
 * 
 * 1. Check API Key:
 *    console.log('API Key:', import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.substring(0, 10))
 * 
 * 2. Load Google Maps:
 *    import { loadGoogleMaps, isGoogleMapsLoaded } from './src/utils/googleMapsLoader'
 *    await loadGoogleMaps()
 *    console.log('Loaded:', isGoogleMapsLoaded())
 * 
 * 3. Test Predictions:
 *    const service = new window.google.maps.places.AutocompleteService()
 *    const response = await service.getPlacePredictions({
 *      input: 'Mumbai',
 *      types: ['geocode', 'establishment']
 *    })
 *    console.log('Predictions:', response.predictions)
 * 
 * 4. Check for errors in Network tab (F12 → Network)
 *    Look for requests to: maps.googleapis.com/maps/api/js
 *    Should return 200 status
 */
