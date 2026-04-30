import React from 'react'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function CTA() {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handleGetStarted = () => {
    if (user) {
      navigate('/generate')
    } else {
      navigate('/login')
    }
  }

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent" />

      {/* Gradient Orbs */}
      <div className="absolute top-1/2 left-1/4 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl -translate-y-1/2 animate-pulse-glow" />
      <div className="absolute top-1/2 right-1/4 h-96 w-96 rounded-full bg-purple-500/15 blur-3xl -translate-y-1/2 animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-indigo-600/10 p-8 sm:p-12 lg:p-16 backdrop-blur-sm overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-purple-500/10 to-indigo-500/0 pointer-events-none" />

          {/* Content */}
          <div className="relative text-center animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/40 bg-indigo-400/10 px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-indigo-300" />
              <span className="text-sm font-medium text-indigo-300">Ready to Begin?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Ready to Discover What the
              <br />
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
                Stars Have Written
              </span>
              {' '}for You?
            </h2>

            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of cosmic explorers who have unlocked their potential with AI-powered astrology. Your first reading is completely free.
            </p>

            {/* Features */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 mb-10">
              {[
                'No credit card required',
                'Instant chart analysis',
                'Cancel anytime',
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-slate-300 animate-slide-up"
                  style={{ animationDelay: `${0.2 + index * 0.1}s` }}
                >
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-sm sm:text-base">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-semibold text-white hover:from-indigo-500 hover:to-purple-500 transition-all glow-button"
              >
                Get Your Free Reading
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#pricing"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800/40 hover:bg-slate-800/60 px-8 py-4 text-base font-semibold text-white transition-all"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
