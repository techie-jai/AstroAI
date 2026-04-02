import React from 'react'
import { useParams } from 'react-router-dom'

export default function ResultsPage() {
  const { kundliId } = useParams()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kundli Results</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <p className="text-gray-600">Kundli ID: {kundliId}</p>
          <p className="text-gray-600 mt-4">Results will be displayed here once generated.</p>
        </div>
      </div>
    </div>
  )
}
