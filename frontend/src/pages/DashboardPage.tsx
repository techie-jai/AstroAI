import React from 'react'
import { Link } from 'react-router-dom'
import { Star, Zap, Clock, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

export default function DashboardPage() {
  const { user } = useAuthStore()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.displayName || user?.email}!</h1>
          <p className="text-gray-600 mt-2">Explore your astrological profile and generate personalized insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Calculations</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <TrendingUp className="text-indigo-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Charts Generated</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Star className="text-purple-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Analyses Completed</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Zap className="text-yellow-600" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Subscription</p>
                <p className="text-2xl font-bold text-indigo-600">Free</p>
              </div>
              <Clock className="text-blue-600" size={32} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start</h2>
              <div className="space-y-4">
                <p className="text-gray-600">
                  Generate your personalized kundli (birth chart) and get AI-powered astrological insights.
                </p>
                <Link
                  to="/generate"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Generate Kundli Now
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📊 20 Divisional Charts</h3>
                  <p className="text-gray-600 text-sm">Generate all major divisional charts (D1, D9, D10, etc.)</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">🤖 AI Analysis</h3>
                  <p className="text-gray-600 text-sm">Get intelligent insights powered by Google Gemini</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">📈 Detailed Reports</h3>
                  <p className="text-gray-600 text-sm">Export comprehensive PDF reports with analysis</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">💾 Cloud Storage</h3>
                  <p className="text-gray-600 text-sm">All your calculations saved securely in the cloud</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
              <p className="text-indigo-100 mb-6">No calculations yet. Start by generating your first kundli!</p>
              <Link
                to="/history"
                className="inline-block bg-white text-indigo-600 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-50 transition"
              >
                View History
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow p-8 mt-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h2>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>✓ Accurate Vedic calculations</li>
                <li>✓ AI-powered interpretations</li>
                <li>✓ Secure cloud storage</li>
                <li>✓ 24/7 availability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
