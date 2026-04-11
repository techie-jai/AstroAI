import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { searchCities, CityData } from '../data/cities'

const generateRandomBirthData = () => {
  const firstNames = ['Arjun', 'Priya', 'Rohan', 'Ananya', 'Vikram', 'Neha', 'Aditya', 'Pooja', 'Rahul', 'Divya', 'Sanjay', 'Kavya', 'Nikhil', 'Shreya', 'Akshay']
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Verma', 'Reddy', 'Iyer', 'Nair', 'Bhat', 'Desai', 'Rao', 'Chopra', 'Malhotra', 'Joshi']
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lon: 72.8777, tz: 5.5 },
    { name: 'Delhi', lat: 28.7041, lon: 77.1025, tz: 5.5 },
    { name: 'Bangalore', lat: 12.9716, lon: 77.5946, tz: 5.5 },
    { name: 'Hyderabad', lat: 17.3850, lon: 78.4867, tz: 5.5 },
    { name: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 5.5 },
    { name: 'Kolkata', lat: 22.5726, lon: 88.3639, tz: 5.5 },
    { name: 'Pune', lat: 18.5204, lon: 73.8567, tz: 5.5 },
    { name: 'Ahmedabad', lat: 23.0225, lon: 72.5714, tz: 5.5 },
  ]

  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  const randomCity = cities[Math.floor(Math.random() * cities.length)]
  const randomYear = Math.floor(Math.random() * (2010 - 1960 + 1)) + 1960
  const randomMonth = Math.floor(Math.random() * 12) + 1
  const randomDay = Math.floor(Math.random() * 28) + 1
  const randomHour = Math.floor(Math.random() * 24)
  const randomMinute = Math.floor(Math.random() * 60)

  return {
    name: `${randomFirstName} ${randomLastName}`,
    place_name: randomCity.name,
    latitude: randomCity.lat,
    longitude: randomCity.lon,
    timezone_offset: randomCity.tz,
    year: randomYear,
    month: randomMonth,
    day: randomDay,
    hour: randomHour,
    minute: randomMinute,
  }
}

export default function GeneratorPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [citySuggestions, setCitySuggestions] = React.useState<CityData[]>([])
  const [searchLoading, setSearchLoading] = React.useState(false)
  const suggestionsRef = React.useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = React.useState(generateRandomBirthData())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name !== 'place_name') {
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(Number(value)) ? value : Number(value)
      }))
    }
  }

  const handlePlaceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData(prev => ({
      ...prev,
      place_name: value
    }))
    
    if (value.trim() && value.length > 1) {
      setSearchLoading(true)
      const suggestions = await searchCities(value)
      setCitySuggestions(suggestions)
      setShowSuggestions(true)
      setSearchLoading(false)
    } else {
      setShowSuggestions(false)
    }
  }

  const selectCity = (city: CityData) => {
    setFormData(prev => ({
      ...prev,
      place_name: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone_offset: city.timezone
    }))
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await api.generateKundli(formData)
      toast.success('Kundli generated successfully!')
      navigate(`/completion/${response.data.kundli_id}`)
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.error || error?.message || 'Failed to generate kundli'
      toast.error(errorMessage)
      console.error('Kundli generation error:', {
        status: error?.response?.status,
        statusText: error?.response?.statusText,
        data: error?.response?.data,
        message: error?.message,
        fullError: error
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Generate Kundli</h1>
          <p className="text-gray-600 mb-8">Enter your birth details to generate your personalized kundli</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Place of Birth</label>
              <div className="relative" ref={suggestionsRef}>
                <input
                  type="text"
                  name="place_name"
                  value={formData.place_name}
                  onChange={handlePlaceChange}
                  onFocus={() => formData.place_name.trim() && setShowSuggestions(true)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Start typing city name..."
                  autoComplete="off"
                />
                {showSuggestions && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-4 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        <span className="ml-2">Searching cities...</span>
                      </div>
                    ) : citySuggestions.length > 0 ? (
                      citySuggestions.map((city) => (
                        <button
                          key={city.name}
                          type="button"
                          onClick={() => selectCity(city)}
                          className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">{city.name}</div>
                          <div className="text-xs text-gray-500">
                            {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)} | UTC{city.timezone > 0 ? '+' : ''}{city.timezone}
                          </div>
                        </button>
                      ))
                    ) : formData.place_name.trim() ? (
                      <div className="p-4 text-center text-gray-500">
                        No cities found
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Tip: Start typing a city name to see suggestions from thousands of cities</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timezone Offset (UTC)</label>
              <input
                type="number"
                name="timezone_offset"
                value={formData.timezone_offset}
                onChange={handleChange}
                step="0.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hour (24h)</label>
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  min="0"
                  max="23"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
                <input
                  type="number"
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Generating...</span>
                </>
              ) : (
                <span>Generate Kundli</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
