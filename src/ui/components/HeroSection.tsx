
import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="flex items-center justify-between">
        <div className="max-w-2xl">
          <p className="text-primary-blue mb-4">Inspire, Contribua, Evolua</p>
          <h1 className="text-5xl font-bold text-light-gray mb-6">
            Potencialize Seus Jogos com Código de Qualidade
          </h1>
          <p className="text-neutral-gray mb-8">
            Seja parte de uma comunidade de desenvolvedores dedicados a criar os
            melhores jogos PS2. Compartilhe, edite e aprenda com snippets de código úteis
            para cada cenário.
          </p>
          <Link
            to="/colecao"
            className="inline-block bg-primary-blue text-light-gray px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Comece Agora
          </Link>
        </div>
        <div className="hidden lg:block">
          <img
            src="https://raw.githubusercontent.com/pscommunity2023/assets/main/ps-logo-large.png"
            alt="PlayStation Logo"
            className="w-96"
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection