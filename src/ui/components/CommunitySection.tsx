
import { Link } from 'react-router-dom'

const CommunitySection = () => {
  const communities = [
    {
      name: 'PS2DEV',
      description: 'Discord para dúvidas sobre o PS2 em geral.',
      image: 'https://raw.githubusercontent.com/pscommunity2023/assets/main/ps2dev-logo.png'
    },
    {
      name: 'Cuphead PS2',
      description: 'Discord para dúvidas sobre o CupHead para PS2.',
      image: 'https://raw.githubusercontent.com/pscommunity2023/assets/main/cuphead-logo.png'
    },
    {
      name: 'Athena PS2 System',
      description: 'Discord para dúvidas sobre o AthenaFW.',
      image: 'https://raw.githubusercontent.com/pscommunity2023/assets/main/athena-logo.png'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <p className="text-primary-blue mb-4">Colaboração entre Comunidades para Código de Qualidade</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-light-gray mb-8">
            Seu Código, Revisado<br />
            Por quem Conhece o<br />
            Console
          </h2>
          <Link
            to="/snippets"
            className="inline-block bg-primary-blue text-light-gray px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Snippets
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {communities.map((community) => (
            <div key={community.name} className="bg-dark-secondary p-6 rounded-lg">
              <div className="flex items-center space-x-4">
                <img src={community.image} alt={community.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h3 className="text-light-gray font-semibold">{community.name}</h3>
                  <p className="text-neutral-gray text-sm">{community.description}</p>
                </div>
                <button className="ml-auto bg-primary-blue text-light-gray px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                  Acessar Canal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CommunitySection