/**
 * Cache Manager - Comprehensive cache clearing and debugging utilities
 * Handles browser cache, localStorage, sessionStorage, and memory caches
 */

export class CacheManager {
  /**
   * Clear all caches comprehensively
   */
  static clearAllCaches(): void {
    console.log('[CACHE_MANAGER] Starting comprehensive cache clear...')
    
    // 1. Clear sessionStorage
    try {
      console.log('[CACHE_MANAGER] Clearing sessionStorage...')
      const sessionKeys = Object.keys(sessionStorage)
      console.log('[CACHE_MANAGER] SessionStorage keys before clear:', sessionKeys)
      sessionStorage.clear()
      console.log('[CACHE_MANAGER] SessionStorage cleared')
    } catch (error) {
      console.error('[CACHE_MANAGER] Error clearing sessionStorage:', error)
    }
    
    // 2. Clear localStorage (except auth token)
    try {
      console.log('[CACHE_MANAGER] Clearing localStorage (except auth)...')
      const localKeys = Object.keys(localStorage)
      console.log('[CACHE_MANAGER] LocalStorage keys before clear:', localKeys)
      
      const keysToRemove = localKeys.filter(key => 
        !key.includes('firebaseToken') && // Keep auth token
        !key.includes('firebase') // Keep other firebase auth data
      )
      
      keysToRemove.forEach(key => {
        console.log('[CACHE_MANAGER] Removing localStorage key:', key)
        localStorage.removeItem(key)
      })
      
      console.log('[CACHE_MANAGER] LocalStorage cleared (except auth)')
    } catch (error) {
      console.error('[CACHE_MANAGER] Error clearing localStorage:', error)
    }
    
    // 3. Clear IndexedDB (if used)
    try {
      console.log('[CACHE_MANAGER] Checking IndexedDB...')
      if (window.indexedDB) {
        // Try to clear IndexedDB databases
        if (window.indexedDB.databases) {
          window.indexedDB.databases().then(dbs => {
            console.log('[CACHE_MANAGER] IndexedDB databases:', dbs)
            dbs.forEach(db => {
              console.log('[CACHE_MANAGER] Deleting IndexedDB:', db.name)
              window.indexedDB.deleteDatabase(db.name)
            })
          }).catch(error => {
            console.error('[CACHE_MANAGER] Error listing IndexedDB databases:', error)
          })
        }
      }
    } catch (error) {
      console.error('[CACHE_MANAGER] Error clearing IndexedDB:', error)
    }
    
    // 4. Clear browser cache via meta tags
    this.addCacheControlMeta()
    
    // 5. Force garbage collection (if available)
    if ((window as any).gc) {
      console.log('[CACHE_MANAGER] Running garbage collection...')
      ;(window as any).gc()
    }
    
    console.log('[CACHE_MANAGER] Cache clear complete')
  }
  
  /**
   * Add cache-control meta tags to page
   */
  static addCacheControlMeta(): void {
    console.log('[CACHE_MANAGER] Adding cache-control meta tags...')
    
    // Remove existing cache-control meta tags
    const existingMetas = document.querySelectorAll('meta[http-equiv="Cache-Control"]')
    existingMetas.forEach(meta => meta.remove())
    
    // Add new cache-control meta tags
    const metaTags = [
      { 'http-equiv': 'Cache-Control', 'content': 'no-cache, no-store, must-revalidate' },
      { 'http-equiv': 'Pragma', 'content': 'no-cache' },
      { 'http-equiv': 'Expires', 'content': '0' },
    ]
    
    metaTags.forEach(attrs => {
      const meta = document.createElement('meta')
      Object.entries(attrs).forEach(([key, value]) => {
        meta.setAttribute(key, value)
      })
      document.head.appendChild(meta)
      console.log('[CACHE_MANAGER] Added meta tag:', attrs)
    })
  }
  
  /**
   * Invalidate browser cache by reloading page with cache-busting
   */
  static reloadPageWithCacheBust(): void {
    console.log('[CACHE_MANAGER] Reloading page with cache bust...')
    
    // Add timestamp to URL to force reload
    const timestamp = Date.now()
    const currentUrl = window.location.href
    const separator = currentUrl.includes('?') ? '&' : '?'
    const newUrl = `${currentUrl}${separator}_cache_bust=${timestamp}`
    
    console.log('[CACHE_MANAGER] Reloading from:', newUrl)
    window.location.href = newUrl
  }
  
  /**
   * Get cache statistics
   */
  static getCacheStats(): object {
    const stats = {
      sessionStorageSize: JSON.stringify(sessionStorage).length,
      localStorageSize: JSON.stringify(localStorage).length,
      sessionStorageKeys: Object.keys(sessionStorage),
      localStorageKeys: Object.keys(localStorage),
      timestamp: new Date().toISOString(),
    }
    
    console.log('[CACHE_MANAGER] Cache stats:', stats)
    return stats
  }
  
  /**
   * Monitor cache changes
   */
  static monitorCacheChanges(): void {
    console.log('[CACHE_MANAGER] Starting cache change monitoring...')
    
    // Monitor localStorage changes
    window.addEventListener('storage', (event) => {
      console.log('[CACHE_MANAGER] Storage event detected:', {
        key: event.key,
        oldValue: event.oldValue?.substring(0, 50),
        newValue: event.newValue?.substring(0, 50),
        url: event.url,
      })
    })
    
    // Monitor memory usage (if available)
    if ((performance as any).memory) {
      setInterval(() => {
        const memory = (performance as any).memory
        console.log('[CACHE_MANAGER] Memory usage:', {
          usedJSHeapSize: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
          totalJSHeapSize: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
          jsHeapSizeLimit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
        })
      }, 5000)
    }
  }
  
  /**
   * Clear specific cache key
   */
  static clearCacheKey(key: string): void {
    console.log('[CACHE_MANAGER] Clearing cache key:', key)
    
    try {
      localStorage.removeItem(key)
      sessionStorage.removeItem(key)
      console.log('[CACHE_MANAGER] Cache key cleared:', key)
    } catch (error) {
      console.error('[CACHE_MANAGER] Error clearing cache key:', error)
    }
  }
  
  /**
   * Verify cache is actually cleared
   */
  static verifyCacheCleared(): boolean {
    const sessionEmpty = Object.keys(sessionStorage).length === 0
    const localEmpty = Object.keys(localStorage).filter(k => 
      !k.includes('firebaseToken') && !k.includes('firebase')
    ).length === 0
    
    const result = sessionEmpty && localEmpty
    console.log('[CACHE_MANAGER] Cache verification:', {
      sessionStorageEmpty: sessionEmpty,
      localStorageEmpty: localEmpty,
      allClear: result,
    })
    
    return result
  }
}

export default CacheManager
