import React from 'react'
import HeroSection from '../components/HeroSection'
import EngineSection from '../components/EngineSection'
import CommunitySection from '../components/CommunitySection'
import ContributeSection from '../components/ContributeSection'

const HomePage = () => {
  return (
    <main className="flex-1">
      <HeroSection />
      <EngineSection />
      <CommunitySection />
      <ContributeSection />
    </main>
  )
}

export default HomePage