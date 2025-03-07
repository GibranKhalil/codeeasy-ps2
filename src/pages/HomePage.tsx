import HeroSection from '../ui/components/HeroSection'
import EngineSection from '../ui/components/EngineSection'
import CommunitySection from '../ui/components/CommunitySection'
import ContributeSection from '../ui/components/ContributeSection'

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