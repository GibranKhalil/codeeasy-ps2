
import { Link } from 'react-router-dom'
import { Title } from '../Title'
import { EngineSectionCard } from './EngineSectionCard'
import { Button } from '../Button'

const EngineSection = () => {
  const steps = [
    {
      title: 'Explore a Coleção de Snippets',
      description: 'Explore nossa vasta coleção de snippets, onde você encontrará soluções de código para diversos cenários no desenvolvimento de jogos PS2.'
    },
    {
      title: 'Utilize Filtros e Busque pelo Snippet Ideal',
      description: 'Aplique filtros por engine, linguagem ou categoria para encontrar exatamente o que você precisa. Nossa plataforma garante que você não perca tempo na busca.'
    },
    {
      title: 'Incorpore o Snippet no Seu Jogo',
      description: 'Uma vez encontrado o snippet, copie para visualizar o código completo. Confira a documentação e exemplos de implementação para garantir que ele atenda às suas necessidades.'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 py-20">
      <header className='w-full flex justify-center'>
      <div className='w-9/12'>
      <Title
      align='center'
      title={<h2 className='text-5xl font-bold text-light-gray mb-6'>Crie com as Engines mais<br />
        Utilizadas pela Comunidade</h2>}
      aditionalTitle='Snippets para as engines mais utilizadas'
      description='Com suporte a engines amplamente adotadas, como Tyra e AthenaENV, nossa
        plataforma oferece snippets específicos para cada ferramenta, ajudando você a
        desenvolver jogos PS2 com eficiência e inovação.' />
      </div>
      </header>
      
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <li className='h-full' key={index}>
            <EngineSectionCard description={step.description} number={index+1} title={step.title} />
          </li>
        ))}
      </ol>
      
      <div className="text-center mt-12">
        <Link
          to="/colecao"
        >
          <Button>
          Ver Coleção
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default EngineSection