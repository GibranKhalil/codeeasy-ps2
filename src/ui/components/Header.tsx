import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="w-full bg-dark-2 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-24 w-full">
        <div className="flex items-center justify-between h-16 w-full">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="ml-2 text-dark-12 font-bold text-xl ">LOGO</span>
            </Link>
          </div>

          <div className="flex space-x-8">
            <Link to="/" className="text-dark-12 hover:text-primary-9--dark transition-colors">
              Início
            </Link>
            <Link to="/collection" className="text-dark-12 hover:text-primary-9--dark transition-colors">
              Coleção
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header