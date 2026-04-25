/**
 * Google Maps API Console Test
 * 
 * Copy and paste these functions into browser console (F12) to test Google Maps API
 * 
 * Usage:
 * 1. Open http://localhost:3000/generator in browser
 * 2. Press F12 to open DevTools
 * 3. Go to Console tab
 * 4. Copy and paste the test functions below
 * 5. Run: testGoogleMapsAPI()
 */

// Test 1: Check API Key
function testAPIKey() {
  console.log('=== TEST 1: API Key ===')
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  console.log('API Key present:', !!apiKey)
  console.log('API Key (first 15 chars):', apiKey?.substring(0, 15) + '...')
  console.log('API Key length:', apiKey?.length)
  
  if (!apiKey) {
    console.error('❌ FAILED: API key not found')
    return false
  }
  console.log('✅ PASSED: API key is available')
  return true
}

// Test 2: Check if Google Maps SDK is loaded
function testGoogleMapsLoaded() {
  console.log('\n=== TEST 2: Google Maps SDK Loaded ===')
  const googleAvailable = typeof window !== 'undefined' && !!window.google
  console.log('window.google available:', googleAvailable)
  console.log('window.google.maps available:', !!window.google?.maps)
  console.log('window.google.maps.places available:', !!window.google?.maps?.places)
  
  if (!googleAvailable) {
    console.error('❌ FAILED: Google Maps SDK not loaded')
    return false
  }
  console.log('✅ PASSED: Google Maps SDK is loaded')
  return true
}

// Test 3: Check AutocompleteService
function testAutocompleteService() {
  console.log('\n=== TEST 3: AutocompleteService ===')
  
  if (!window.google?.maps?.places) {
    console.error('❌ FAILED: Google Maps not loaded')
    return false
  }
  
  try {
    const service = new window.google.maps.places.AutocompleteService()
    console.log('AutocompleteService created:', !!service)
    console.log('✅ PASSED: AutocompleteService is available')
    return true
  } catch (error) {
    console.error('❌ FAILED: Could not create AutocompleteService:', error)
    return false
  }
}

// Test 4: Test predictions for "Mumbai"
async function testMumbaiPredictions() {
  console.log('\n=== TEST 4: Predictions for "Mumbai" ===')
  
  if (!window.google?.maps?.places) {
    console.error('❌ FAILED: Google Maps not loaded')
    return false
  }
  
  try {
    const service = new window.google.maps.places.AutocompleteService()
    const sessionToken = new window.google.maps.places.AutocompleteSessionToken()
    
    console.log('Requesting predictions...')
    const response = await service.getPlacePredictions({
      input: 'Mumbai',
      sessionToken: sessionToken,
      types: ['geocode', 'establishment'],
    })
    
    console.log('Predictions returned:', response.predictions?.length || 0)
    
    if (response.predictions && response.predictions.length > 0) {
      console.log('First 3 predictions:')
      response.predictions.slice(0, 3).forEach((pred, idx) => {
        console.log(`  ${idx + 1}. ${pred.description}`)
      })
      console.log('✅ PASSED: Got predictions for "Mumbai"')
      return true
    } else {
      console.error('❌ FAILED: No predictions returned')
      return false
    }
  } catch (error) {
    console.error('❌ FAILED: Error getting predictions:', error)
    return false
  }
}

// Test 5: Test predictions for "Hospital"
async function testHospitalPredictions() {
  console.log('\n=== TEST 5: Predictions for "Hospital" ===')
  
  if (!window.google?.maps?.places) {
    console.error('❌ FAILED: Google Maps not loaded')
    return false
  }
  
  try {
    const service = new window.google.maps.places.AutocompleteService()
    const sessionToken = new window.google.maps.places.AutocompleteSessionToken()
    
    console.log('Requesting predictions...')
    const response = await service.getPlacePredictions({
      input: 'Hospital',
      sessionToken: sessionToken,
      types: ['geocode', 'establishment'],
    })
    
    console.log('Predictions returned:', response.predictions?.length || 0)
    
    if (response.predictions && response.predictions.length > 0) {
      console.log('First 3 predictions:')
      response.predictions.slice(0, 3).forEach((pred, idx) => {
        console.log(`  ${idx + 1}. ${pred.description}`)
      })
      console.log('✅ PASSED: Got predictions for "Hospital"')
      return true
    } else {
      console.error('❌ FAILED: No predictions returned')
      return false
    }
  } catch (error) {
    console.error('❌ FAILED: Error getting predictions:', error)
    return false
  }
}

// Test 6: Test place details
async function testPlaceDetails() {
  console.log('\n=== TEST 6: Place Details ===')
  
  if (!window.google?.maps?.places) {
    console.error('❌ FAILED: Google Maps not loaded')
    return false
  }
  
  try {
    const service = new window.google.maps.places.AutocompleteService()
    const sessionToken = new window.google.maps.places.AutocompleteSessionToken()
    
    // Get a prediction first
    console.log('Getting prediction...')
    const response = await service.getPlacePredictions({
      input: 'Mumbai',
      sessionToken: sessionToken,
      types: ['geocode', 'establishment'],
    })
    
    if (!response.predictions || response.predictions.length === 0) {
      console.error('❌ FAILED: No predictions to get details for')
      return false
    }
    
    const placeId = response.predictions[0].place_id
    console.log('Got place ID:', placeId)
    
    // Get details
    const detailsService = new window.google.maps.places.PlacesService(document.createElement('div'))
    
    return new Promise((resolve) => {
      detailsService.getDetails(
        {
          placeId,
          fields: ['formatted_address', 'geometry', 'name'],
        },
        (place, status) => {
          if (status === 'OK' && place) {
            console.log('Place details:')
            console.log('  Name:', place.name)
            console.log('  Address:', place.formatted_address)
            console.log('  Latitude:', place.geometry?.location?.lat())
            console.log('  Longitude:', place.geometry?.location?.lng())
            console.log('✅ PASSED: Got place details')
            resolve(true)
          } else {
            console.error('❌ FAILED: Could not get place details:', status)
            resolve(false)
          }
        }
      )
    })
  } catch (error) {
    console.error('❌ FAILED: Error getting place details:', error)
    return false
  }
}

// Test 7: Test CSV endpoint
async function testCSVEndpoint() {
  console.log('\n=== TEST 7: CSV Endpoint ===')
  
  try {
    console.log('Testing /api/cities/search?query=Mumbai')
    const response = await fetch('/api/cities/search?query=Mumbai')
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      console.error('❌ FAILED: CSV endpoint returned status', response.status)
      return false
    }
    
    const data = await response.json()
    console.log('Results returned:', data?.length || 0)
    
    if (data && data.length > 0) {
      console.log('First 3 results:')
      data.slice(0, 3).forEach((city, idx) => {
        console.log(`  ${idx + 1}. ${city.name} (${city.city}, ${city.country})`)
        console.log(`     Lat: ${city.latitude}, Lng: ${city.longitude}`)
      })
      console.log('✅ PASSED: CSV endpoint working')
      return true
    } else {
      console.error('❌ FAILED: CSV endpoint returned no results')
      return false
    }
  } catch (error) {
    console.error('❌ FAILED: Error testing CSV endpoint:', error)
    return false
  }
}

// Main test runner
async function testGoogleMapsAPI() {
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║     GOOGLE MAPS API TEST SUITE                         ║')
  console.log('╚════════════════════════════════════════════════════════╝')
  
  const results = {
    apiKey: testAPIKey(),
    googleMapsLoaded: testGoogleMapsLoaded(),
    autocompleteService: testAutocompleteService(),
  }
  
  // Only run async tests if basic tests pass
  if (results.googleMapsLoaded) {
    results.mumbaiPredictions = await testMumbaiPredictions()
    results.hospitalPredictions = await testHospitalPredictions()
    results.placeDetails = await testPlaceDetails()
  }
  
  results.csvEndpoint = await testCSVEndpoint()
  
  // Summary
  console.log('\n╔════════════════════════════════════════════════════════╗')
  console.log('║                    TEST SUMMARY                        ║')
  console.log('╚════════════════════════════════════════════════════════╝')
  
  const passed = Object.values(results).filter(r => r === true).length
  const total = Object.keys(results).length
  
  console.log(`\nTests Passed: ${passed}/${total}`)
  console.log('\nResults:')
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED'
    console.log(`  ${status}: ${test}`)
  })
  
  if (passed === total) {
    console.log('\n🎉 ALL TESTS PASSED!')
    console.log('Google Maps API is working correctly.')
  } else {
    console.log('\n⚠️  SOME TESTS FAILED')
    console.log('Check the errors above for details.')
  }
  
  return results
}

// Quick test for just predictions
async function quickTestPredictions() {
  console.log('=== QUICK PREDICTIONS TEST ===')
  
  if (!window.google?.maps?.places) {
    console.error('Google Maps not loaded. Try testGoogleMapsAPI() first.')
    return
  }
  
  const service = new window.google.maps.places.AutocompleteService()
  const sessionToken = new window.google.maps.places.AutocompleteSessionToken()
  
  const queries = ['Mumbai', 'Delhi', 'Hospital', 'Airport', 'New York']
  
  for (const query of queries) {
    try {
      const response = await service.getPlacePredictions({
        input: query,
        sessionToken: sessionToken,
        types: ['geocode', 'establishment'],
      })
      console.log(`"${query}": ${response.predictions?.length || 0} results`)
    } catch (error) {
      console.error(`"${query}": ERROR -`, error.message)
    }
  }
}

// Export for use
window.testGoogleMapsAPI = testGoogleMapsAPI
window.quickTestPredictions = quickTestPredictions

console.log('✅ Test functions loaded. Run: testGoogleMapsAPI()')
