/**
 * Caching Debug Script
 * Run this in browser console to diagnose caching issues
 * 
 * Usage:
 * 1. Open browser DevTools (F12)
 * 2. Go to Console tab
 * 3. Paste this entire script and press Enter
 * 4. Call functions like: CachingDebug.analyzeCache()
 */

export const CachingDebug: any = {
  /**
   * Analyze current cache state
   */
  analyzeCache: () => {
    console.log('='.repeat(80))
    console.log('CACHE ANALYSIS REPORT')
    console.log('='.repeat(80))
    
    // 1. SessionStorage
    console.log('\n1. SESSION STORAGE:')
    console.log('   Keys:', Object.keys(sessionStorage))
    console.log('   Size:', JSON.stringify(sessionStorage).length, 'bytes')
    Object.entries(sessionStorage).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value.substring(0, 100)}...`)
    })
    
    // 2. LocalStorage
    console.log('\n2. LOCAL STORAGE:')
    console.log('   Keys:', Object.keys(localStorage))
    console.log('   Size:', JSON.stringify(localStorage).length, 'bytes')
    Object.entries(localStorage).forEach(([key, value]) => {
      console.log(`   - ${key}: ${value.substring(0, 100)}...`)
    })
    
    // 3. IndexedDB
    console.log('\n3. INDEXED DB:')
    if (window.indexedDB && window.indexedDB.databases) {
      window.indexedDB.databases().then(dbs => {
        console.log('   Databases:', dbs)
        dbs.forEach(db => {
          console.log(`   - ${db.name}`)
        })
      })
    } else {
      console.log('   IndexedDB not available or databases() not supported')
    }
    
    // 4. Memory
    console.log('\n4. MEMORY:')
    if ((performance as any).memory) {
      const mem = (performance as any).memory
      console.log('   Used JS Heap:', (mem.usedJSHeapSize / 1048576).toFixed(2), 'MB')
      console.log('   Total JS Heap:', (mem.totalJSHeapSize / 1048576).toFixed(2), 'MB')
      console.log('   JS Heap Limit:', (mem.jsHeapSizeLimit / 1048576).toFixed(2), 'MB')
    } else {
      console.log('   Memory API not available')
    }
    
    // 5. Network Cache
    console.log('\n5. NETWORK CACHE:')
    console.log('   Check DevTools Network tab for:')
    console.log('   - Response headers: Cache-Control, Pragma, Expires')
    console.log('   - Request headers: Cache-Control')
    console.log('   - Size column: "from cache" vs "from network"')
    
    console.log('\n' + '='.repeat(80))
  },
  
  /**
   * Monitor cache changes in real-time
   */
  monitorCacheChanges: () => {
    console.log('[CACHE_DEBUG] Starting real-time cache monitoring...')
    
    // Monitor storage changes
    window.addEventListener('storage', (event: StorageEvent) => {
      console.log('[CACHE_DEBUG] Storage event:', {
        key: event.key,
        oldValue: event.oldValue?.substring(0, 50),
        newValue: event.newValue?.substring(0, 50),
        storageArea: event.storageArea === localStorage ? 'localStorage' : 'sessionStorage',
        url: event.url,
      })
    })
    
    // Monitor memory changes
    const perfMemory = (performance as any).memory
    if (perfMemory) {
      const initialMemory = perfMemory.usedJSHeapSize
      setInterval(() => {
        const currentMemory = (performance as any).memory.usedJSHeapSize
        const delta = currentMemory - initialMemory
        console.log('[CACHE_DEBUG] Memory delta:', (delta / 1048576).toFixed(2), 'MB')
      }, 5000)
    }
    
    console.log('[CACHE_DEBUG] Monitoring started. Check console for events.')
  },
  
  /**
   * Test API response caching
   */
  testAPIResponseCaching: async () => {
    console.log('[CACHE_DEBUG] Testing API response caching...')
    
    const testUrl = '/api/kundli/test-kundli-id'
    
    // First request
    console.log('[CACHE_DEBUG] Making first request...')
    const response1 = await fetch(testUrl)
    const headers1 = {
      'cache-control': response1.headers.get('cache-control'),
      'pragma': response1.headers.get('pragma'),
      'expires': response1.headers.get('expires'),
    }
    console.log('[CACHE_DEBUG] First response headers:', headers1)
    console.log('[CACHE_DEBUG] First response size:', response1.headers.get('content-length'), 'bytes')
    
    // Second request (should be from cache if caching enabled)
    console.log('[CACHE_DEBUG] Making second request (immediately)...')
    const response2 = await fetch(testUrl)
    const headers2 = {
      'cache-control': response2.headers.get('cache-control'),
      'pragma': response2.headers.get('pragma'),
      'expires': response2.headers.get('expires'),
    }
    console.log('[CACHE_DEBUG] Second response headers:', headers2)
    console.log('[CACHE_DEBUG] Second response size:', response2.headers.get('content-length'), 'bytes')
    
    // Compare
    const isCached = response1.headers.get('cache-control') === response2.headers.get('cache-control')
    console.log('[CACHE_DEBUG] Responses identical:', isCached)
  },
  
  /**
   * Clear all caches and verify
   */
  clearAllAndVerify: () => {
    console.log('[CACHE_DEBUG] Clearing all caches...')
    
    // Clear sessionStorage
    sessionStorage.clear()
    console.log('[CACHE_DEBUG] SessionStorage cleared')
    
    // Clear localStorage (except auth)
    const keysToRemove = Object.keys(localStorage).filter(k => 
      !k.includes('firebaseToken') && !k.includes('firebase')
    )
    keysToRemove.forEach(key => {
      localStorage.removeItem(key)
      console.log('[CACHE_DEBUG] Removed localStorage key:', key)
    })
    
    // Clear IndexedDB
    if (window.indexedDB && window.indexedDB.databases) {
      window.indexedDB.databases().then(dbs => {
        dbs.forEach(db => {
          window.indexedDB.deleteDatabase(db.name)
          console.log('[CACHE_DEBUG] Deleted IndexedDB:', db.name)
        })
      })
    }
    
    // Verify
    console.log('[CACHE_DEBUG] Verification:')
    console.log('   SessionStorage empty:', Object.keys(sessionStorage).length === 0)
    console.log('   LocalStorage (except auth) empty:', 
      Object.keys(localStorage).filter(k => !k.includes('firebaseToken')).length === 0)
    
    console.log('[CACHE_DEBUG] Cache clear complete')
  },
  
  /**
   * Simulate kundli generation and check for stale data
   */
  simulateKundliGeneration: async (kundliId: string) => {
    console.log('[CACHE_DEBUG] Simulating kundli generation for:', kundliId)
    
    // Clear caches first
    this.clearAllAndVerify()
    
    // Fetch kundli
    console.log('[CACHE_DEBUG] Fetching kundli...')
    try {
      const response = await fetch(`/api/kundli/${kundliId}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        }
      })
      
      const data = await response.json()
      console.log('[CACHE_DEBUG] Kundli data received:')
      console.log('   Name:', data.birth_data.name)
      console.log('   Place:', data.birth_data.place)
      console.log('   Date:', data.birth_data.date)
      console.log('   Time:', data.birth_data.time)
      console.log('   Horoscope info keys:', Object.keys(data.horoscope_info || {}).length)
      
      return data
    } catch (error) {
      console.error('[CACHE_DEBUG] Error fetching kundli:', error)
    }
  },
  
  /**
   * Check browser cache headers
   */
  checkBrowserCacheHeaders: () => {
    console.log('[CACHE_DEBUG] Checking browser cache headers...')
    
    // Create a test request
    const request = new Request('/api/kundli/test', {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    })
    
    console.log('[CACHE_DEBUG] Request headers:')
    request.headers.forEach((value, key) => {
      console.log(`   ${key}: ${value}`)
    })
  },
  
  /**
   * Export cache data for analysis
   */
  exportCacheData: () => {
    const sessionData: any = {}
    const localData: any = {}
    
    // Convert Storage objects to plain objects
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i)
      if (key) sessionData[key] = sessionStorage.getItem(key)
    }
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) localData[key] = localStorage.getItem(key)
    }
    
    const data = {
      timestamp: new Date().toISOString(),
      sessionStorage: sessionData,
      localStorage: localData,
      memory: (performance as any).memory ? {
        usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
        totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
        jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
      } : null,
    }
    
    console.log('[CACHE_DEBUG] Cache data exported:')
    console.log(JSON.stringify(data, null, 2))
    
    return data
  },
}

// Make it globally available
(window as any).CachingDebug = CachingDebug

console.log('[CACHE_DEBUG] CachingDebug loaded. Available commands:')
console.log('  - CachingDebug.analyzeCache()')
console.log('  - CachingDebug.monitorCacheChanges()')
console.log('  - CachingDebug.testAPIResponseCaching()')
console.log('  - CachingDebug.clearAllAndVerify()')
console.log('  - CachingDebug.simulateKundliGeneration("kundli-id")')
console.log('  - CachingDebug.checkBrowserCacheHeaders()')
console.log('  - CachingDebug.exportCacheData()')
