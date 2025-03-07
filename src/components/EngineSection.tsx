import React from 'react'
import { Link } from 'react-router-dom'

const EngineSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Explore a Coleção de Snippets',
      description: 'Explore nossa vasta coleção de snippets, onde você encontrará soluções de código para diversos cenários no desenvolvimento de jogos PS2.'
    },
    {
      number: '2',
      title: 'Utilize Filtros e Busque pelo Snippet Ideal',
      description: 'Aplique filtros por engine, linguagem ou categoria para encontrar exatamente o que você precisa. Nossa plataforma garante que você não perca tempo na busca.'
    },
    {
      number: '3',
      title: 'Incorpore o Snippet no Seu Jogo',
      description: 'Uma vez encontrado o snippet, copie para visualizar o código completo. Confira a documentação e exemplos de implementação para garantir que ele atenda às suas necessidades.'
    }
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <p className="text-primary-blue text-center mb-4">Snippets para as engines mais utilizadas</p>
      <h2 className="text-4xl font-bold text-light-gray text-center mb-16">
        Crie com as Engines mais<br />
        Utilizadas pela Comunidade
      </h2>
      <p className="text-neutral-gray text-center mb-16 max-w-3xl mx-auto">
        Com suporte a engines amplamente adotadas, como TyrA e AthenaFW, nossa
        plataforma oferece snippets específicos para cada ferramenta, ajudando você a
        desenvolver jogos PS2 com eficiência e inovação.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step) => (
          <div key={step.number} className="bg-dark-secondary p-8 rounded-lg">
            <div className="text-primary-blue text-4xl font-bold mb-4">{step.number}</div>
            <h3 className="text-light-gray text-xl font-semibold mb-4">{step.title}</h3>
            <p className="text-neutral-gray">{step.description}</p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-12">
        <Link
          to="/colecao"
          className="inline-block bg-primary-blue text-light-gray px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Ver Coleção
        </Link>
      </div>
    </section>
  )
}

export default EngineSection