import React from 'react'
import { Button } from '../../components/Button'
import { logEvent } from '../../utils/analytics'

interface HeroSectionProps {
  onPostJob: () => void
  onJoinPro: () => void
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onPostJob,
  onJoinPro,
}) => {
  const handlePostJob = () => {
    logEvent('cta_click', { source: 'hero_homeowner' })
    onPostJob()
  }

  const handleJoinPro = () => {
    logEvent('cta_click', { source: 'hero_contractor' })
    onJoinPro()
  }

  return (
    <section className="bg-base px-4 py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2">
        {/* Text Block */}
        <div className="space-y-5 text-center md:text-left">
          <h1 className="text-4xl font-bold leading-tight text-gray-900">
            Skip the hassle.{' '}
            <span className="text-primary">
              Get quotes from trusted tradespeople
            </span>{' '}
            near you.
          </h1>

          <p className="text-lg text-gray-700">
            Whether it’s plumbing, electrical, or home upgrades — we’ll connect
            you with licensed, verified professionals in under a minute.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 md:justify-start">
            ⭐ 4.9 average from 1,400+ Nova Scotia homeowners
            <span className="mx-2 hidden h-4 w-px bg-gray-300 md:inline-block" />
            <img src="/logo-google.png" alt="Google reviews" className="h-6" />
            <img src="/logo-facebook.png" alt="Facebook reviews" className="h-6" />
            <img src="/logo-houzz.png" alt="Houzz reviews" className="h-6" />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="primary"
              onClick={handlePostJob}
              aria-label="Get Free Quotes"
              className="w-full sm:w-auto"
            >
              Get Free Quotes
            </Button>
            <Button
              variant="outline"
              onClick={handleJoinPro}
              aria-label="Join as Pro"
              className="w-full sm:w-auto"
            >
              Join as Pro
            </Button>
          </div>

          <p className="mt-2 text-xs text-gray-500">
            No sign-up needed for quotes. Contractor sign-up is free.
          </p>
        </div>

        {/* Illustration */}
        <img
          src="/images/hero-working-pro.png"
          alt="Local contractor at work"
          className="hidden w-full rounded-lg object-cover shadow-md md:block"
        />
      </div>
    </section>
  )
}

export default HeroSection
