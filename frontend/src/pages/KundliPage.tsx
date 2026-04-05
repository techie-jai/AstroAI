import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, MapPin, Clock } from 'lucide-react'
import { api } from '../services/api'
import toast from 'react-hot-toast'

interface BirthData {
  name: string
  place_name: string
  year: number
  month: number
  day: number
  hour: number
  minute: number
}

interface Calculation {
  calculation_id: string
  kundli_id: string
  birth_data?: BirthData
  result_summary?: {
    kundli_id: string
    generated_at: string
  }
  created_at?: string
}

export default function KundliPage() {
  const [calculations, setCalculations] = useState<Calculation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCalculations = async () => {
      try {
        setLoading(true)
        const response = await api.getUserCalculations()
        setCalculations(response.data.calculations || [])
      } catch (error) {
        console.error('Failed to fetch calculations:', error)
        toast.error('Failed to load kundlis')
      } finally {
        setLoading(false)
      }
    }

    fetchCalculations()
  }, [])

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    if (typeof date === 'string') return date.split('T')[0]
    if (date.toDate) return date.toDate().toLocaleDateString()
    return 'N/A'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Your Kundlis</h1>
            <p className="text-gray-600 mt-2">View and manage your generated kundlis</p>
          </div>
          <Link
            to="/generate"
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            <Plus size={20} />
            <span>Generate New</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : calculations.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-6">No kundlis generated yet</p>
            <Link
              to="/generate"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              Generate Your First Kundli
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculations.map((calc) => {
              const birthData = calc.birth_data
              const kundliId = calc.result_summary?.kundli_id || calc.kundli_id
              const generatedAt = calc.result_summary?.generated_at || calc.created_at
              
              return (
                <div key={calc.calculation_id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                    <h3 className="text-xl font-bold">{birthData?.name || 'Kundli'}</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Calendar size={18} className="text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Birth Date</p>
                        <p className="font-semibold">
                          {birthData ? `${birthData.year}-${String(birthData.month).padStart(2, '0')}-${String(birthData.day).padStart(2, '0')}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-700">
                      <Clock size={18} className="text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Birth Time</p>
                        <p className="font-semibold">
                          {birthData ? `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}` : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 text-gray-700">
                      <MapPin size={18} className="text-indigo-600" />
                      <div>
                        <p className="text-sm text-gray-500">Place</p>
                        <p className="font-semibold">{birthData?.place_name || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-4">
                        Generated: {formatDate(generatedAt)}
                      </p>
                      
                      <div className="flex space-x-2">
                        <Link
                          to={`/results/${kundliId}`}
                          className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition"
                        >
                          View
                        </Link>
                        <Link
                          to={`/chat/${kundliId}`}
                          className="flex-1 text-center bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition"
                        >
                          Chat
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
