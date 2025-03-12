import HeroSection from '../ui/components/pages/home/HeroSection'
import EngineSection from '../ui/components/pages/home/EngineSection/EngineSection'
import CommunitySection from '../ui/components/pages/home/CommunitySection'
import ContributeSection from '../ui/components/pages/home/ContributeSection'

const HomePage = () => {
  return (
    <main className="flex-1 mx-auto">
      <HeroSection />
      <EngineSection />
      <CommunitySection />
      <ContributeSection />
    </main>
  )
}

export default HomePage