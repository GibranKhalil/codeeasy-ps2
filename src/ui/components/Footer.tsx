import { Link } from 'react-router-dom'
import { Hexagon } from 'lucide-react'

const Footer = () => {
  const footerLinks = {
    coleção: ['AthenaFW', 'TyrA', 'jogos 2D', 'Plataforma'],
    suporte: ['Como Contribuir', 'Como avaliar um código', 'Código na plataforma'],
    contato: ['Discord']
  }

  return (
    <footer className="bg-dark-secondary py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <div className="flex items-center mb-6">
              <Hexagon className="h-8 w-8 text-light-gray" />
              <span className="ml-2 text-light-gray font-bold text-xl">LOGO</span>
            </div>
            <p className="text-neutral-gray text-sm">
              Criado por Desenvolvedores para desenvolvedores
            </p>
            <p className="text-neutral-gray text-sm mt-4">
              Nossa plataforma foi criada para ajudar desenvolvedores a compartilharem tempo,
              experiência e código. Com snippets prontos e revisados pela comunidade, você
              economiza seu tempo com PS2 da forma mais rápida e eficiente.
            </p>
          </div>
          
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-light-gray font-semibold uppercase mb-6">{title}</h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <Link to="#" className="text-neutral-gray hover:text-primary-blue transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-12 pt-8 border-t border-dark-gray">
          <p className="text-neutral-gray text-sm text-center">
            © 2024 NOME | Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer