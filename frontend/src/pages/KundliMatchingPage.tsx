import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ArrowRight, Calendar, Clock, MapPin, User, Sparkles, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { searchCities, CityData } from '../data/cities'
import apiClient from '../services/api'
import { useAuthStore } from '../store/authStore'

interface PersonData {
  name: string
  place_name: string
  latitude: number
  longitude: number
  timezone_offset: number
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const METHODS = [
  { value: 'North', label: 'North Indian (Ashtakoota)' },
  { value: 'South', label: 'South Indian (Tamil)' }
]

function FloatingHearts() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float opacity-20"
          style={{
            left: `${5 + i * 8}%`,
            top: `${10 + (i % 4) * 20}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${4 + i * 0.5}s`
          }}
        >
          <Heart
            className={`${
              i % 3 === 0 ? 'w-6 h-6' : i % 2 === 0 ? 'w-4 h-4' : 'w-5 h-5'
            } text-pink-400`}
            fill="currentColor"
          />
        </div>
      ))}
    </div>
  )
}

export default function KundliMatchingPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuthStore()
  const [matchingMethod, setMatchingMethod] = useState<'North' | 'South'>('North')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // City suggestions state
  const [boyCitySuggestions, setBoyCitySuggestions] = useState<CityData[]>([])
  const [girlCitySuggestions, setGirlCitySuggestions] = useState<CityData[]>([])
  const [showBoySuggestions, setShowBoySuggestions] = useState(false)
  const [showGirlSuggestions, setShowGirlSuggestions] = useState(false)
  const boySuggestionsRef = useRef<HTMLDivElement>(null)
  const girlSuggestionsRef = useRef<HTMLDivElement>(null)

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to access kundli matching')
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  // Handle click outside suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boySuggestionsRef.current && !boySuggestionsRef.current.contains(event.target as Node)) {
        setShowBoySuggestions(false)
      }
      if (girlSuggestionsRef.current && !girlSuggestionsRef.current.contains(event.target as Node)) {
        setShowGirlSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const [boyDetails, setBoyDetails] = useState<PersonData>({
    name: '',
    place_name: '',
    latitude: 0,
    longitude: 0,
    timezone_offset: 0,
    year: 2000,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    second: 0
  })

  const [girlDetails, setGirlDetails] = useState<PersonData>({
    name: '',
    place_name: '',
    latitude: 0,
    longitude: 0,
    timezone_offset: 0,
    year: 2000,
    month: 1,
    day: 1,
    hour: 12,
    minute: 0,
    second: 0
  })

  const currentDetails = step === 1 ? boyDetails : girlDetails
  const setCurrentDetails = step === 1 ? setBoyDetails : setGirlDetails
  const personLabel = step === 1 ? 'Boy' : 'Girl'
  const citySuggestions = step === 1 ? boyCitySuggestions : girlCitySuggestions
  const showSuggestions = step === 1 ? showBoySuggestions : showGirlSuggestions
  const suggestionsRef = step === 1 ? boySuggestionsRef : girlSuggestionsRef

  const handleCitySelect = (city: CityData) => {
    setCurrentDetails(prev => ({
      ...prev,
      place_name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone_offset: city.timezone
    }))
    if (step === 1) {
      setShowBoySuggestions(false)
    } else {
      setShowGirlSuggestions(false)
    }
  }

  const handlePlaceSearch = async (query: string) => {
    if (query.trim() && query.length > 1) {
      const suggestions = await searchCities(query)
      if (step === 1) {
        setBoyCitySuggestions(suggestions)
        setShowBoySuggestions(suggestions.length > 0)
      } else {
        setGirlCitySuggestions(suggestions)
        setShowGirlSuggestions(suggestions.length > 0)
      }
    } else {
      if (step === 1) {
        setShowBoySuggestions(false)
      } else {
        setShowGirlSuggestions(false)
      }
    }
  }

  const validateStep = () => {
    if (!currentDetails.name || !currentDetails.place_name) {
      toast.error(`Please fill all ${personLabel.toLowerCase()}'s details`)
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      const response = await apiClient.post('/kundli-matching/calculate', {
        boy_data: boyDetails,
        girl_data: girlDetails,
        method: matchingMethod
      })

      toast.success('Matching calculated successfully!')

      navigate(`/kundli-matching/results/${response.data.match_id}`, {
        state: { matchData: response.data }
      })
    } catch (error: any) {
      console.error('Error:', error)
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to calculate matching'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Show loading while auth is being verified
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative space-y-8 max-w-4xl mx-auto min-h-screen pb-8 px-4 sm:px-6">
      <div className="fixed inset-0 cosmic-gradient-bg opacity-20 pointer-events-none" />
      <FloatingHearts />

      {/* Header */}
      <div className="relative text-center space-y-4 py-8">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-red-500/30 blur-3xl rounded-full" />
          <Heart className="relative w-16 h-16 text-pink-500 mx-auto animate-pulse-glow" fill="currentColor" />
        </div>
        <h1 className="text-4xl font-bold gradient-text-purple text-glow-purple">Kundli Matching</h1>
        <p className="text-muted-foreground flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-amber-400" />
          Find compatibility between two birth charts
          <Star className="w-4 h-4 text-amber-400" />
        </p>
      </div>

      {/* Method Selection */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-pink-500 via-red-500 to-pink-500" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/30 to-red-500/20 border border-pink-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-pink-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Select Matching Method</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {METHODS.map(m => (
              <button
                key={m.value}
                onClick={() => setMatchingMethod(m.value as 'North' | 'South')}
                className={`relative h-16 rounded-xl font-medium text-base transition-all duration-300 overflow-hidden group ${
                  matchingMethod === m.value
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white glow-purple'
                    : 'cosmic-card hover:bg-purple-500/10 text-foreground'
                }`}
              >
                <span className="relative">{m.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="relative cosmic-card rounded-2xl overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500" />
        <div className="p-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                step === 1
                  ? 'bg-gradient-to-br from-cyan-500 to-blue-500 text-white glow-cyan scale-110'
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              1
            </div>
            <div className="flex-1 h-1 max-w-[200px] bg-secondary/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-pink-500 transition-all duration-500"
                style={{ width: step === 1 ? '50%' : '100%' }}
              />
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-500 ${
                step === 2
                  ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white glow-magenta scale-110'
                  : 'bg-secondary/50 text-muted-foreground'
              }`}
            >
              2
            </div>
          </div>

          {/* Person Details Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                step === 1
                  ? 'bg-gradient-to-br from-cyan-500/30 to-blue-500/20 border border-cyan-500/30'
                  : 'bg-gradient-to-br from-pink-500/30 to-red-500/20 border border-pink-500/30'
              }`}
            >
              <User className={`w-5 h-5 ${step === 1 ? 'text-cyan-400' : 'text-pink-400'}`} />
            </div>
            <h3 className="text-xl font-bold text-foreground">{personLabel}'s Details</h3>
          </div>

          {/* Form Fields */}
          <div className="grid md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-foreground font-medium">
                <User className="w-4 h-4 text-purple-400" />
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter full name"
                value={currentDetails.name}
                onChange={(e) => setCurrentDetails({ ...currentDetails, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Place of Birth */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-foreground font-medium">
                <MapPin className="w-4 h-4 text-pink-400" />
                Place of Birth
              </label>
              <div className="relative" ref={suggestionsRef}>
                <input
                  type="text"
                  placeholder="e.g., Mumbai, IN"
                  value={currentDetails.place_name}
                  onChange={(e) => {
                    setCurrentDetails({ ...currentDetails, place_name: e.target.value })
                    handlePlaceSearch(e.target.value)
                  }}
                  onFocus={() => currentDetails.place_name.length > 1 && (step === 1 ? setShowBoySuggestions(true) : setShowGirlSuggestions(true))}
                  className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                {showSuggestions && citySuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {citySuggestions.map((city, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className="w-full text-left px-4 py-2 hover:bg-secondary/50 text-foreground transition border-b border-border last:border-b-0"
                      >
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-muted-foreground">{city.country}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Latitude */}
            <div className="space-y-2">
              <label className="text-foreground font-medium">Latitude</label>
              <input
                type="number"
                value={currentDetails.latitude}
                onChange={(e) => setCurrentDetails({ ...currentDetails, latitude: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Longitude */}
            <div className="space-y-2">
              <label className="text-foreground font-medium">Longitude</label>
              <input
                type="number"
                value={currentDetails.longitude}
                onChange={(e) => setCurrentDetails({ ...currentDetails, longitude: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Timezone Offset */}
            <div className="space-y-2">
              <label className="text-foreground font-medium">Timezone Offset (hours)</label>
              <input
                type="number"
                value={currentDetails.timezone_offset}
                onChange={(e) => setCurrentDetails({ ...currentDetails, timezone_offset: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-foreground font-medium">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Date of Birth
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Year"
                  value={currentDetails.year}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, year: parseInt(e.target.value) })}
                  className="w-24 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <select
                  value={currentDetails.month}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, month: parseInt(e.target.value) })}
                  className="flex-1 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                >
                  {MONTHS.map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Day"
                  min="1"
                  max="31"
                  value={currentDetails.day}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, day: parseInt(e.target.value) })}
                  className="w-16 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>

            {/* Time of Birth */}
            <div className="space-y-2 md:col-span-2">
              <label className="flex items-center gap-2 text-foreground font-medium">
                <Clock className="w-4 h-4 text-amber-400" />
                Time of Birth
              </label>
              <div className="flex gap-2 max-w-xs">
                <input
                  type="number"
                  placeholder="Hour"
                  min="0"
                  max="23"
                  value={currentDetails.hour}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, hour: parseInt(e.target.value) })}
                  className="flex-1 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
                <span className="flex items-center text-2xl text-muted-foreground">:</span>
                <input
                  type="number"
                  placeholder="Minute"
                  min="0"
                  max="59"
                  value={currentDetails.minute}
                  onChange={(e) => setCurrentDetails({ ...currentDetails, minute: parseInt(e.target.value) })}
                  className="flex-1 px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 gap-4">
            <button
              onClick={() => setStep(1)}
              disabled={step === 1}
              className="px-6 py-2.5 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-foreground rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Previous
            </button>
            {step === 1 ? (
              <button
                onClick={() => {
                  if (validateStep()) setStep(2)
                }}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 glow-cyan text-white rounded-lg font-medium px-6 py-2.5 transition-all flex items-center gap-2"
              >
                Next: Girl's Details
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 glow-magenta text-white rounded-lg font-medium px-8 py-2.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5" fill="currentColor" />
                    Find Match
                    <Sparkles className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="relative cosmic-card rounded-2xl p-6 bg-gradient-to-r from-pink-900/20 to-purple-900/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/30 to-purple-500/20 border border-pink-500/30 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-pink-400" fill="currentColor" />
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">About Kundli Matching</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Kundli matching, also known as Kundali Milan, is an ancient Vedic practice to assess the compatibility of two individuals based on their birth charts. The Ashtakoota system evaluates 8 key aspects (Gunas) with a maximum score of 36 points. A score above 18 is considered favorable for marriage.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
