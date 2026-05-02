import React, { useState } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export function Pricing() {
  const [isYearly, setIsYearly] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuthStore()

  const handlePricingClick = () => {
    if (user) {
      navigate('/generate')
    } else {
      navigate('/login')
    }
  }

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for curious souls beginning their cosmic journey',
      price: isYearly ? 0 : 0,
      period: 'forever',
      icon: '✨',
      features: [
        'Basic birth chart analysis',
        'Daily horoscope',
        'Sun sign compatibility',
        'Weekly transit overview',
        'Community access',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      name: 'Cosmic',
      description: 'For seekers ready to dive deeper into their cosmic blueprint',
      price: isYearly ? 228 : 19,
      period: isYearly ? 'year' : 'month',
      savings: isYearly ? 'Save 20%' : null,
      icon: '🌙',
      features: [
        'Everything in Starter',
        'Full natal chart interpretation',
        'Real-time transit alerts',
        'Detailed compatibility reports',
        'Monthly forecast reports',
        'Personalized remedies',
        'AI chat consultations (50/mo)',
        'Numerology basics',
      ],
      cta: 'Go Cosmic',
      highlighted: true,
    },
    {
      name: 'Celestial',
      description: 'Ultimate cosmic mastery for the dedicated astrologer',
      price: isYearly ? 588 : 49,
      period: isYearly ? 'year' : 'month',
      savings: isYearly ? 'Save 20%' : null,
      icon: '👑',
      features: [
        'Everything in Cosmic',
        'Unlimited AI consultations',
        'Advanced Vedic analysis',
        'Palmistry AI readings',
        'Full numerology suite',
        'Dasha analysis',
        'Muhurta finder',
        'Family chart analysis',
        'Yearly prediction reports',
        'Priority support',
        'Custom chart themes',
        'API access',
      ],
      cta: 'Unlock Celestial',
      highlighted: false,
    },
  ]

  return (
    <section id="pricing" className="relative py-16 sm:py-20 lg:py-28 overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0 stars-bg opacity-20" />
      <div className="absolute top-1/2 left-0 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl -translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 animate-slide-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-4 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <span className="text-sm font-medium text-indigo-300">Simple Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Choose Your
            <br />
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #8952ec 0%, #a78bfa 50%, #c084fc 100%)' }}>
              Cosmic Path
            </span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Start free and upgrade as you explore the depths of your celestial journey
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm font-medium ${!isYearly ? 'text-white' : 'text-slate-400'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className="relative inline-flex h-8 w-14 items-center rounded-full bg-slate-700 transition-colors hover:bg-slate-600"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  isYearly ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isYearly ? 'text-white' : 'text-slate-400'}`}>
              Yearly
            </span>
            {isYearly && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-green-500/20 border border-green-500/50 px-3 py-1 text-xs font-semibold text-green-300">
                Save 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`group animate-slide-up relative ${plan.highlighted ? 'md:scale-105' : ''}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Highlighted badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div
                className={`relative h-full rounded-2xl border transition-all duration-300 backdrop-blur-sm overflow-hidden ${
                  plan.highlighted
                    ? 'border-indigo-500/60 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 shadow-2xl'
                    : 'border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 hover:border-indigo-500/50'
                }`}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  plan.highlighted
                    ? 'from-indigo-500/20 via-purple-500/10 to-indigo-500/20'
                    : 'from-indigo-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-indigo-500/10'
                } transition-all duration-300 pointer-events-none` } />

                {/* Content */}
                <div className="relative p-8 sm:p-10">
                  {/* Icon and Name */}
                  <div className="mb-6">
                    <div className="text-4xl mb-3">{plan.icon}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-sm text-slate-400">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-slate-400">/{plan.period}</span>
                    </div>
                    {plan.savings && (
                      <p className="text-sm text-green-400 mt-2">{plan.savings}</p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handlePricingClick}
                    className={`w-full py-3 rounded-lg font-semibold transition-all mb-8 ${
                      plan.highlighted
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white glow-button'
                        : 'bg-slate-800/60 hover:bg-slate-800 text-white border border-slate-700/50 hover:border-indigo-500/50'
                    }`}
                  >
                    {plan.cta}
                  </button>

                  {/* Features */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 sm:mt-20 pt-12 sm:pt-16 border-t border-slate-700/50">
          <div className="text-center mb-12 animate-slide-up">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h3>
            <p className="text-slate-400">
              Have questions? We have answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {[
              {
                q: 'Can I upgrade or downgrade anytime?',
                a: 'Yes! You can change your plan at any time. Changes take effect on your next billing cycle.',
              },
              {
                q: 'Is there a free trial?',
                a: 'Absolutely! Start with our free Starter plan and upgrade whenever you\'re ready.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and digital wallets for your convenience.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes, cancel your subscription anytime with no questions asked. No hidden fees.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-6 hover:border-indigo-500/50 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h4 className="font-semibold text-white mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
