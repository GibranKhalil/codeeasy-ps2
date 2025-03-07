
import { Link } from 'react-router-dom'

const ContributeSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <p className="text-primary text-center mb-4">Compartilhe Seu Conhecimento com a Comunidade</p>
      <h2 className="text-4xl font-bold text-light-gray text-center mb-8">
        Contribua e Ajude a<br />
        Enriquecer a Plataforma
      </h2>
      <p className="text-neutral-gray text-center mb-12 max-w-3xl mx-auto">
        Sua contribuição é fundamental para o crescimento da plataforma. Se você tem código
        aproveitável, uma melhoria ou uma nova ideia, entre na comunidade para enviar seu
        código. Nossos moderadores irão revisar e disponibilizar seu conhecimento de forma
        útil para todos os desenvolvedores de jogos PS2!
      </p>
      <div className="text-center">
        <Link
          to="/contribuir"
          className="inline-block bg-primary text-light-gray px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contribuir
        </Link>
      </div>
    </section>
  )
}

export default ContributeSection