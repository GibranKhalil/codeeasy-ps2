import HeroSection from '../ui/components/home/HeroSection'
import EngineSection from '../ui/components/home/EngineSection'
import CommunitySection from '../ui/components/home/CommunitySection'
import ContributeSection from '../ui/components/home/ContributeSection'

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