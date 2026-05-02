import React from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
import toast from 'react-hot-toast'
import { searchCities, CityData } from '../data/cities'
import { GooglePlacesAutocomplete } from '../components/GooglePlacesAutocomplete'
import { Sparkles, Loader, MessageCircle, ChevronDown } from 'lucide-react'

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

interface Kundli {
  kundli_id: string
  name: string
  birth_date: string
}

export default function GeneratorPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState(generateRandomBirthData())
  const [kundlis, setKundlis] = React.useState<Kundli[]>([])
  const [selectedKundliId, setSelectedKundliId] = React.useState<string>('')
  const [loadingKundlis, setLoadingKundlis] = React.useState(false)
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    if (name !== 'place_name') {
      setFormData(prev => ({
        ...prev,
        [name]: value === '' ? '' : isNaN(Number(value)) ? value : Number(value)
      }))
    }
  }

  const handlePlaceChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      place_name: value
    }))
  }

  const selectPlace = (place: CityData) => {
    setFormData(prev => ({
      ...prev,
      place_name: place.name,
      latitude: place.latitude,
      longitude: place.longitude,
      timezone_offset: place.timezone
    }))
  }

  // Fetch user's kundlis on mount
  React.useEffect(() => {
    const fetchKundlis = async () => {
      setLoadingKundlis(true)
      try {
        const response = await api.getUserCalculations()
        const calculations = response.data.calculations || []
        const formattedKundlis: Kundli[] = calculations.map((calc: any) => {
          const birthData = calc.birth_data || {}
          const name = birthData.name || 'Kundli'
          const birthDate = birthData.year 
            ? `${birthData.year}-${String(birthData.month || 1).padStart(2, '0')}-${String(birthData.day || 1).padStart(2, '0')}`
            : 'N/A'
          return {
            kundli_id: calc.kundli_id,
            name: name,
            birth_date: birthDate
          }
        })
        setKundlis(formattedKundlis)
        console.log('[GeneratorPage] Fetched kundlis:', formattedKundlis)
      } catch (error: any) {
        console.error('Failed to fetch kundlis:', error)
      } finally {
        setLoadingKundlis(false)
      }
    }
    fetchKundlis()
  }, [])

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

  const handleStartChat = () => {
    if (!selectedKundliId) {
      toast.error('Please select a kundli to chat about')
      return
    }
    navigate(`/chat/${selectedKundliId}`)
  }


  return (
    <div className="min-h-screen bg-slate-950 py-12 relative overflow-hidden">
      {/* Cosmic gradient background */}
      <div className="absolute inset-0 cosmic-gradient-bg opacity-10 pointer-events-none" />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center animate-float">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Generate Kundli</h1>
          </div>
          <p className="text-slate-300 text-lg">Enter your birth details to generate your personalized kundli</p>
        </div>

        {/* Chat with Existing Kundli Section */}
        {kundlis.length > 0 && (
          <div className="cosmic-card p-6 rounded-2xl border border-cyan-500/20 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Chat About Existing Kundli</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">Don't want to generate a new one? Select an existing kundli and start chatting about it.</p>
            
            <div className="space-y-3">
              {/* Dropdown */}
              <div className="relative z-20">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-cyan-500/30 rounded-lg text-slate-100 text-left flex items-center justify-between hover:border-cyan-500/50 transition-all duration-200"
                >
                  <span className="text-slate-100">
                    {selectedKundliId 
                      ? kundlis.find(k => k.kundli_id === selectedKundliId)?.name 
                      : 'Select a kundli...'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform flex-shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-cyan-500/30 rounded-lg shadow-2xl z-50 max-h-48 overflow-y-auto"
                    style={{ backgroundColor: '#0f172a', borderColor: 'rgba(34, 211, 238, 0.3)' }}
                  >
                    {loadingKundlis ? (
                      <div className="p-4 text-center" style={{ color: '#cbd5e1' }}>
                        <Loader className="w-4 h-4 animate-spin inline-block" />
                      </div>
                    ) : kundlis.length === 0 ? (
                      <div className="p-4 text-center text-sm" style={{ color: '#cbd5e1' }}>No kundlis found</div>
                    ) : (
                      kundlis.map((kundli) => (
                        <div
                          key={kundli.kundli_id}
                          onClick={() => {
                            setSelectedKundliId(kundli.kundli_id)
                            setDropdownOpen(false)
                          }}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            borderBottom: '1px solid rgba(30, 41, 59, 0.5)',
                            cursor: 'pointer',
                            backgroundColor: selectedKundliId === kundli.kundli_id ? 'rgba(34, 211, 238, 0.2)' : 'transparent',
                            borderLeft: selectedKundliId === kundli.kundli_id ? '2px solid #22d3ee' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            if (selectedKundliId !== kundli.kundli_id) {
                              e.currentTarget.style.backgroundColor = 'rgba(34, 211, 238, 0.1)'
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (selectedKundliId !== kundli.kundli_id) {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }
                          }}
                        >
                          <p style={{ fontWeight: '500', color: '#f1f5f9', margin: 0 }}>{kundli.name}</p>
                          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', margin: 0 }}>{kundli.birth_date}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Chat Button */}
              <button
                onClick={handleStartChat}
                disabled={!selectedKundliId || loadingKundlis}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Start Chatting</span>
              </button>
            </div>
          </div>
        )}

        {/* Divider */}
        {kundlis.length > 0 && (
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
            <span className="text-slate-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          </div>
        )}

        {/* Form Card */}
        <div className="cosmic-card p-8 rounded-2xl border border-purple-500/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                placeholder="Your full name"
              />
            </div>

            {/* Place of Birth */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Place of Birth</label>
              <GooglePlacesAutocomplete
                value={formData.place_name}
                onChange={handlePlaceChange}
                onSelect={selectPlace}
                placeholder="Search for a city, hospital, landmark..."
              />
              <p className="text-xs text-slate-500 mt-2">Powered by Google Maps. Search for exact locations to get high-precision coordinates.</p>
            </div>

            {/* Latitude & Longitude */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Latitude</label>
                <input
                  type="number"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Longitude</label>
                <input
                  type="number"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  step="0.0001"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Timezone Offset */}
            <div>
              <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Timezone Offset (UTC)</label>
              <input
                type="number"
                name="timezone_offset"
                value={formData.timezone_offset}
                onChange={handleChange}
                step="0.5"
                className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Month</label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  min="1"
                  max="12"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Day</label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Time Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Hour (24h)</label>
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleChange}
                  min="0"
                  max="23"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 uppercase tracking-wider mb-3 font-semibold">Minute</label>
                <input
                  type="number"
                  name="minute"
                  value={formData.minute}
                  onChange={handleChange}
                  min="0"
                  max="59"
                  className="w-full px-4 py-3 bg-slate-900/50 border border-purple-500/30 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-200"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 glow-purple disabled:glow-none"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating your cosmic chart...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Generate Kundli</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="cosmic-card p-4 rounded-xl border border-purple-500/20">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Accurate Birth Time</p>
            <p className="text-sm text-slate-300">Provide the most accurate birth time possible for precise astrological calculations</p>
          </div>
          <div className="cosmic-card p-4 rounded-xl border border-cyan-500/20">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Exact Location</p>
            <p className="text-sm text-slate-300">Use Google Maps to find your exact birth location for high-precision coordinates</p>
          </div>
          <div className="cosmic-card p-4 rounded-xl border border-pink-500/20">
            <p className="text-xs text-slate-400 uppercase tracking-wider mb-2 font-semibold">Vedic Accuracy</p>
            <p className="text-sm text-slate-300">Our calculations follow traditional Vedic astrology principles for authentic results</p>
          </div>
        </div>
      </div>
    </div>
  )
}
