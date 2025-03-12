import { Link } from 'react-router-dom'
import { Title } from '../../Title'
import { Button } from '../../Button/Button'
import PS2Logo3DModel from '../../PS2Logo3D'

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-20">
      <div className="flex items-center justify-between w-full space-x-8">
        <div className="max-w-2xl">
          <Title
            titleHasMainPageTitle
            title='Potencialize Seus Jogos com Código de Qualidade'
            aditionalTitle='Inspire, Contribua, Evolua'
            description='Seja parte de uma comunidade de desenvolvedores dedicados a criar os melhores jogos PS2. Compartilhe, edite e aprenda com snippets de código úteis para cada cenário.'
          />
          <Link to="/collection">
            <Button color='primary' variant='contained'>Comece Agora</Button>
          </Link>
        </div>

        <div className="flex-shrink-0 w-fit">
          <PS2Logo3DModel />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
