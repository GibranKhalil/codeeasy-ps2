import  { useState } from 'react'
import { Search } from 'lucide-react'

interface Snippet {
  title: string
  author: string
  code: string
}

const CollectionPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [engineFilter, setEngineFilter] = useState('Todas')
  const [gameStyleFilter, setGameStyleFilter] = useState('Todos')
  const [gameTypeFilter, setGameTypeFilter] = useState('Todos')

  const snippets: Snippet[] = [
    {
      title: 'Movimentação 2D',
      author: 'Gibran Khalil',
      code: `
@description string;
@fileExtension: BEFileLevel1

@OnStarted{
  onComplete: "read"
})

export class LearningMeterService extends CreateService {LearningMeterOwner} {
  constructor(http: HTTPClient) {
    super(databaseId1 = "/learning path", http);
  }

  @override getAll(): Observable<LearningPathFromOwner[]> {
`
    },
    // Duplicate the snippet 5 more times for the grid
    ...Array(5).fill({
      title: 'Movimentação 2D',
      author: 'Gibran Khalil',
      code: `
@description string;
@fileExtension: BEFileLevel1

@OnStarted{
  onComplete: "read"
})

export class LearningMeterService extends CreateService {LearningMeterOwner} {
  constructor(http: HTTPClient) {
    super(databaseId1 = "/learning path", http);
  }

  @override getAll(): Observable<LearningPathFromOwner[]> {
`
    })
  ]

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-secondary min-h-screen p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <h1 className="text-2xl font-bold text-light-gray">LOGO</h1>
        </div>
        <button className="bg-primary-blue text-light-gray px-4 py-2 rounded-lg mb-8">
          Contribuir
        </button>
        <div className="mt-auto">
          <button className="flex items-center text-light-gray hover:text-primary-blue transition-colors">
            <span>Suporte</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-dark-primary">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray" />
            <input
              type="text"
              placeholder="Pesquise aqui..."
              className="w-full bg-dark-secondary text-light-gray pl-10 pr-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary-blue"
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
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary-blue"
              >
                <option>Todas</option>
                <option>TyrA</option>
                <option>AthenaFW</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Estilo de Jogo:</span>
              <select
                value={gameStyleFilter}
                onChange={(e) => setGameStyleFilter(e.target.value)}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary-blue"
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
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary-blue"
              >
                <option>Todos</option>
                <option>Plataforma</option>
                <option>Ação</option>
                <option>RPG</option>
              </select>
            </div>
          </div>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet, index) => (
            <div key={index} className="bg-dark-secondary rounded-lg p-6">
              <pre className="font-mono text-xs text-neutral-gray mb-4 overflow-x-auto">
                <code>{snippet.code}</code>
              </pre>
              <h3 className="text-light-gray font-semibold">{snippet.title}</h3>
              <p className="text-neutral-gray text-sm">{snippet.author}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default CollectionPage