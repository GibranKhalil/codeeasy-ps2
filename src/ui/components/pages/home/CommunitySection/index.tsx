import { Link } from 'react-router-dom'
import { CommunitySectionCard } from './card'
import { Title } from '../../../Title'
import { Button } from '../../../Button/Button'
import PS2Console3DModel from '../../../PS2Console3D'

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
    <section className="w-full px-4 sm:px-6 lg:px-24 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <div>
          <Title
            aditionalTitle="Colaboração entre Comunidades para Código de Qualidade"
            title="Seu Código, Revisado Por quem Conhece o Console"
            description="Membros de todas as comunidades de desenvolvimento de jogos para PS2 contribuem diariamente com a revisão e publicação de snippets aqui" />
          <div className='w-fit'>
            <Link className='w-fit' to="/collection">
              <Button variant='contained' color='primary' className='mt-2'>
                Ver Snippets
              </Button>
            </Link>
          </div>
          <div className="flex-shrink-0 w-fit">
            <PS2Console3DModel />
          </div>
        </div>

        <ul className="flex flex-wrap gap-4 h-full">
          {communities.map((community, index) => (
            <li className={`${index === 0 ? "w-full" : "w-full md:w-[calc(50%-8px)]"
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