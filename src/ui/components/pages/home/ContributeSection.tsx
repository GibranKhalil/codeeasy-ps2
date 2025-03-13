import { Link } from 'react-router-dom'
import { Title } from '../../Title'
import { Button } from '../../Button/Button'

const ContributeSection = () => {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-24 py-20">
      <header className='w-full flex justify-center'>
        <div className='w-9/12'>
          <Title
            title="Contribua e Ajude a Melhorar a Plataforma"
            aditionalTitle="Compartilhe Seu Conhecimento com a Comunidade"
            description="Sua contribuição é fundamental para o crescimento da plataforma. Se você tem código
          aproveitável, uma melhoria ou uma nova ideia, entre na comunidade para enviar seu
          código. Nossos moderadores irão revisar e disponibilizar seu conhecimento de forma
          útil para todos os desenvolvedores de jogos PS2!"
            align='center'
          />
        </div>
      </header>
      <div className="text-center flex justify-center">
        <Link
          to="/collection"
        >
          <Button variant='contained' color='primary'>
            Contribuir
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default ContributeSection