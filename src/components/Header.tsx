import React from 'react'
import { Hexagon } from 'lucide-react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="w-full bg-dark-primary">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Hexagon className="h-8 w-8 text-light-gray" />
              <span className="ml-2 text-light-gray font-bold text-xl">LOGO</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link to="/" className="text-light-gray hover:text-primary-blue transition-colors">
              Início
            </Link>
            <Link to="/colecao" className="text-light-gray hover:text-primary-blue transition-colors">
              Coleção
            </Link>
            <Link to="/suporte" className="text-light-gray hover:text-primary-blue transition-colors">
              Suporte
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header