import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="w-full bg-dark-secondary sticky top-0">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-light-gray font-bold text-xl">LOGO</span>
            </Link>
          </div>
          
          <div className="flex space-x-8">
            <Link to="/" className="text-light-gray hover:text-primary transition-colors">
              Início
            </Link>
            <Link to="/colecao" className="text-light-gray hover:text-primary transition-colors">
              Coleção
            </Link>
            <Link to="/suporte" className="text-light-gray hover:text-primary transition-colors">
              Suporte
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header