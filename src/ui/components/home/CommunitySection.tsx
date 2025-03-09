
import { Link } from 'react-router-dom'
import PS2Console3DModel from '../PS2Console3D'
import { Title } from '../Title'
import { Button } from '../Button'
import { CommunitySectionCard } from './CommunitySectionCard'

const CommunitySection = () => {
  const communities = [
    {
      name: 'PS2DEV',
      description: 'Discord para dúvidas sobre o PS2 em geral.',
      image: '/images/discord/ps2dev.png'
    },
    {
      name: 'Cuphead PS2',
      description: 'Discord para dúvidas sobre o CupHead para PS2.',
      image: '/images/discord/cuphead.png'
    },
    {
      name: 'Athena PS2 System',
      description: 'Discord para dúvidas sobre o AthenaENV.',
      image: '/images/discord/athena.png'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <Title 
            aditionalTitle="Colaboração entre Comunidades para Código de Qualidade" 
            title="Seu Código, Revisado Por quem Conhece o Console"
            description="Membros de todas as comunidades de desenvolvimento de jogos para PS2 contribuem diariamente com a revisão e publicação de snippets aqui" />
          <Link
            to="/snippets"
          >
            <Button className='mt-2'>
              Ver Snippets
            </Button>
          </Link>
          <div className="flex-shrink-0 w-fit">
          <PS2Console3DModel />
          </div>
        </div>
        
        <ul className="flex flex-wrap gap-4 h-full">
          {communities.map((community, index) => (
            <li className={`${
              index === 0 ? "w-full" : "w-full md:w-[calc(50%-8px)]"
            }`} key={index}>
              <CommunitySectionCard {...community} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default CommunitySection