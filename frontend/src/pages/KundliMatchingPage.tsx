import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, ArrowRight, Calendar, Clock, MapPin, User } from 'lucide-react'
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

const PersonFormComponent = ({ 
  data, 
  onChange, 
  title,
  citySuggestions,
  showSuggestions,
  onShowSuggestions,
  onCitySelect,
  onPlaceSearch
}: { 
  data: PersonData
  onChange: (field: keyof PersonData, value: any) => void
  title: string
  citySuggestions: CityData[]
  showSuggestions: boolean
  onShowSuggestions: (show: boolean) => void
  onCitySelect: (city: CityData) => void
  onPlaceSearch: (query: string) => void
}) => {
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onShowSuggestions])

  const handlePlaceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onChange('place_name', value)
    onPlaceSearch(value)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">
            <User size={16} className="inline mr-2" />
            Full Name
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Enter full name"
            className="w-full px-4 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Place */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">
            <MapPin size={16} className="inline mr-2" />
            Place of Birth
          </label>
          <div className="relative" ref={suggestionsRef}>
            <input
              type="text"
              value={data.place_name}
              onChange={handlePlaceChange}
              onFocus={() => data.place_name.length > 1 && onShowSuggestions(true)}
              placeholder="e.g., Mumbai, IN"
              className="w-full px-4 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-indigo-500"
            />
            {showSuggestions && citySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-indigo-900 border border-indigo-700 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {citySuggestions.map((city, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onCitySelect(city)}
                    className="w-full text-left px-4 py-2 hover:bg-indigo-800 text-indigo-100 transition border-b border-indigo-700 last:border-b-0"
                  >
                    <div className="font-medium">{city.name}</div>
                    <div className="text-xs text-indigo-300">{city.country}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">Latitude</label>
          <input
            type="number"
            step="0.0001"
            value={data.latitude}
            onChange={(e) => onChange('latitude', parseFloat(e.target.value))}
            placeholder="e.g., 19.0760"
            className="w-full px-4 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">Longitude</label>
          <input
            type="number"
            step="0.0001"
            value={data.longitude}
            onChange={(e) => onChange('longitude', parseFloat(e.target.value))}
            placeholder="e.g., 72.8777"
            className="w-full px-4 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">Timezone Offset (hours)</label>
          <input
            type="number"
            step="0.5"
            value={data.timezone_offset}
            onChange={(e) => onChange('timezone_offset', parseFloat(e.target.value))}
            placeholder="e.g., 5.5"
            className="w-full px-4 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white placeholder-indigo-400 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">
            <Calendar size={16} className="inline mr-2" />
            Date of Birth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="1900"
              max="2100"
              value={data.year}
              onChange={(e) => onChange('year', parseInt(e.target.value))}
              placeholder="YYYY"
              className="w-full px-2 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <select
              value={data.month}
              onChange={(e) => onChange('month', parseInt(e.target.value))}
              className="w-full px-2 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              max="31"
              value={data.day}
              onChange={(e) => onChange('day', parseInt(e.target.value))}
              placeholder="DD"
              className="w-full px-2 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Time of Birth */}
        <div>
          <label className="block text-sm font-medium text-indigo-200 mb-2">
            <Clock size={16} className="inline mr-2" />
            Time of Birth
          </label>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              min="0"
              max="23"
              value={data.hour}
              onChange={(e) => onChange('hour', parseInt(e.target.value))}
              placeholder="HH"
              className="w-full px-2 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={data.minute}
              onChange={(e) => onChange('minute', parseInt(e.target.value))}
              placeholder="MM"
              className="w-full px-2 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
            <input
              type="number"
              min="0"
              max="59"
              value={data.second}
              onChange={(e) => onChange('second', parseInt(e.target.value))}
              placeholder="SS"
              className="w-full px-2 py-2 bg-indigo-900 border border-indigo-700 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function KundliMatchingPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuthStore()
  const [step, setStep] = useState(1)
  const [method, setMethod] = useState('North')
  const [loading, setLoading] = useState(false)
  
  // City suggestions state
  const [boyCitySuggestions, setBoyCitySuggestions] = useState<CityData[]>([])
  const [girlCitySuggestions, setGirlCitySuggestions] = useState<CityData[]>([])
  const [showBoySuggestions, setShowBoySuggestions] = useState(false)
  const [showGirlSuggestions, setShowGirlSuggestions] = useState(false)

  // Check authentication
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error('Please login to access kundli matching')
      navigate('/login')
    }
  }, [user, authLoading, navigate])

  const [boyData, setBoyData] = useState<PersonData>({
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

  const [girlData, setGirlData] = useState<PersonData>({
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

  const handleBoyChange = (field: keyof PersonData, value: any) => {
    setBoyData(prev => ({ ...prev, [field]: value } as PersonData))
  }

  const handleGirlChange = (field: keyof PersonData, value: any) => {
    setGirlData(prev => ({ ...prev, [field]: value } as PersonData))
  }

  const selectBoyCity = (city: CityData) => {
    setBoyData(prev => ({
      ...prev,
      place_name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone_offset: city.timezone
    }))
    setShowBoySuggestions(false)
  }

  const selectGirlCity = (city: CityData) => {
    setGirlData(prev => ({
      ...prev,
      place_name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone_offset: city.timezone
    }))
    setShowGirlSuggestions(false)
  }

  const handleBoyPlaceSearch = async (query: string) => {
    if (query.trim() && query.length > 1) {
      const suggestions = await searchCities(query)
      setBoyCitySuggestions(suggestions)
      setShowBoySuggestions(suggestions.length > 0)
    } else {
      setShowBoySuggestions(false)
    }
  }

  const handleGirlPlaceSearch = async (query: string) => {
    if (query.trim() && query.length > 1) {
      const suggestions = await searchCities(query)
      setGirlCitySuggestions(suggestions)
      setShowGirlSuggestions(suggestions.length > 0)
    } else {
      setShowGirlSuggestions(false)
    }
  }

  const validateStep = () => {
    if (step === 1) {
      if (!boyData.name || !boyData.place_name) {
        toast.error('Please fill all boy details')
        return false
      }
    } else if (step === 2) {
      if (!girlData.name || !girlData.place_name) {
        toast.error('Please fill all girl details')
        return false
      }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!validateStep()) return

    setLoading(true)
    try {
      const response = await apiClient.post('/kundli-matching/calculate', {
        boy_data: boyData,
        girl_data: girlData,
        method: method
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
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Heart size={40} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Kundli Matching</h1>
          <p className="text-indigo-200">Find compatibility between two birth charts</p>
        </div>

        {/* Method Selection */}
        <div className="bg-indigo-800 bg-opacity-50 backdrop-blur rounded-lg p-6 mb-8 border border-indigo-700">
          <h3 className="text-lg font-semibold text-white mb-4">Select Matching Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {METHODS.map(m => (
              <button
                key={m.value}
                onClick={() => setMethod(m.value)}
                className={`p-4 rounded-lg border-2 transition ${
                  method === m.value
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'bg-indigo-900 border-indigo-700 text-indigo-200 hover:border-indigo-500'
                }`}
              >
                <div className="font-semibold">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-indigo-800 bg-opacity-50 backdrop-blur rounded-lg p-8 border border-indigo-700">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-700 text-indigo-300'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-indigo-600' : 'bg-indigo-700'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-indigo-700 text-indigo-300'
            }`}>
              2
            </div>
          </div>

          {/* Form Content */}
          {step === 1 ? (
            <PersonFormComponent 
              data={boyData} 
              onChange={handleBoyChange} 
              title="Boy's Details"
              citySuggestions={boyCitySuggestions}
              showSuggestions={showBoySuggestions}
              onShowSuggestions={setShowBoySuggestions}
              onCitySelect={selectBoyCity}
              onPlaceSearch={handleBoyPlaceSearch}
            />
          ) : (
            <PersonFormComponent 
              data={girlData} 
              onChange={handleGirlChange} 
              title="Girl's Details"
              citySuggestions={girlCitySuggestions}
              showSuggestions={showGirlSuggestions}
              onShowSuggestions={setShowGirlSuggestions}
              onCitySelect={selectGirlCity}
              onPlaceSearch={handleGirlPlaceSearch}
            />
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="flex-1 px-6 py-3 bg-indigo-700 hover:bg-indigo-600 text-white rounded-lg font-semibold transition"
              >
                Back
              </button>
            )}
            
            {step === 1 ? (
              <button
                onClick={() => {
                  if (validateStep()) setStep(2)
                }}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Calculating...
                  </>
                ) : (
                  <>
                    <Heart size={20} />
                    Match Now
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg p-4 text-blue-100 text-sm">
          <p className="font-semibold mb-2">💡 Tip:</p>
          <p>For accurate results, provide exact birth time and place. If you don't know exact coordinates, enter the city name and we'll use standard coordinates.</p>
        </div>
      </div>
    </div>
  )
}
