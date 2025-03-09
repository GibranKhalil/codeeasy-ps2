import  { useState } from 'react'
import { Search } from 'lucide-react'
import { SnippetCard } from '../ui/components/collectionPage/snippetCard'

// interface Snippet {
//   title: string
//   author: string
//   code: string
// }

const CollectionPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [engineFilter, setEngineFilter] = useState('Todas')
  const [gameStyleFilter, setGameStyleFilter] = useState('Todos')
  const [gameTypeFilter, setGameTypeFilter] = useState('Todos')

  return (
    <div className="flex">
      <aside className="w-64 bg-dark-secondary min-h-screen p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-2xl font-bold text-light-gray">LOGO</h1>
        </div>
        <button className="bg-primary text-light-gray px-4 py-2 rounded-lg mb-8">
          Contribuir
        </button>
        <div className="mt-auto">
          <button className="flex items-center text-light-gray hover:text-primary transition-colors">
            <span>Suporte</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 bg-dark-primary">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray" />
            <input
              type="text"
              placeholder="Pesquise aqui..."
              className="w-full bg-dark-secondary text-light-gray pl-10 pr-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Engine:</span>
              <select
                value={engineFilter}
                onChange={(e) => setEngineFilter(e.target.value)}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              >
                <option>Todas</option>
                <option>Tyra</option>
                <option>AthenaENV</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Estilo de Jogo:</span>
              <select
                value={gameStyleFilter}
                onChange={(e) => setGameStyleFilter(e.target.value)}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              >
                <option>Todos</option>
                <option>2D</option>
                <option>3D</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Tipo de Jogo:</span>
              <select
                value={gameTypeFilter}
                onChange={(e) => setGameTypeFilter(e.target.value)}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              >
                <option>Todos</option>
                <option>Plataforma</option>
                <option>Ação</option>
                <option>RPG</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SnippetCard />
        </div>
      </main>
    </div>
  )
}

export default CollectionPage