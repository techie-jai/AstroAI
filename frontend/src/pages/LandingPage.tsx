import React from 'react'
import {
  Header,
  Hero,
  HowItWorks,
  FeaturesGrid,
  ExtendedFeatures,
  FusionAnimation,
  AIAstrologer,
  Pricing,
  AuthSection,
  CTA,
  Footer,
} from './landing'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-black">
      <Header />
      <Hero />
      <HowItWorks />
      <FeaturesGrid />
      <FusionAnimation />
      <ExtendedFeatures />
      <AIAstrologer />
      <Pricing />
      <AuthSection />
      <CTA />
      <Footer />
    </main>
  )
}
