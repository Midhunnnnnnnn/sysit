// Simple in-memory cache with localStorage backup
const cache = {
    _memoryCache: new Map(),
    _useLocalStorage: true,
  
    get(key) {
      // Check memory cache first
      if (this._memoryCache.has(key)) {
        return this._memoryCache.get(key);
      }
  
      // Fallback to localStorage if enabled
      if (this._useLocalStorage && typeof window !== 'undefined') {
        try {
          const item = localStorage.getItem(`tripCache:${key}`);
          if (item) {
            const parsed = JSON.parse(item);
            this._memoryCache.set(key, parsed); // Populate memory cache
            return parsed;
          }
        } catch (e) {
          console.warn('Failed to read from localStorage', e);
          this._useLocalStorage = false;
        }
      }
      return null;
    },
  
    set(key, value) {
      this._memoryCache.set(key, value);
      
      if (this._useLocalStorage && typeof window !== 'undefined') {
        try {
          localStorage.setItem(`tripCache:${key}`, JSON.stringify(value));
        } catch (e) {
          console.warn('Failed to write to localStorage', e);
          this._useLocalStorage = false;
        }
      }
    },
  
    clear() {
      this._memoryCache.clear();
      if (this._useLocalStorage && typeof window !== 'undefined') {
        Object.keys(localStorage)
          .filter(key => key.startsWith('tripCache:'))
          .forEach(key => localStorage.removeItem(key));
      }
    }
  };
  
  export default cache;