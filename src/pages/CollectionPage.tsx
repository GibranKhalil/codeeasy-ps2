import { useEffect, useReducer, useState } from 'react'
import { Search } from 'lucide-react'
import { SnippetCard } from '../ui/components/pages/collection/snippetCard'
import snippets from '../data/snippets.json' with { type: 'json' }
import type { Snippet } from '../@types/collection'
import { TextUtils } from '../utils/TextUtils'
// import { useNavigate } from 'react-router-dom'
import { Sidebar } from '../ui/components/Sidebar/Sidebar'

const initialFiltersData = {
  searchQuery: '',
  engine: 0,
  gameStyle: 0,
  gameType: 0,
}

function filtersReducer(state: typeof initialFiltersData, action: Partial<typeof initialFiltersData>): typeof initialFiltersData {
  return { ...state, ...action };
}

const CollectionPage = () => {
  // const navigateTo = useNavigate()

  const [filtersData, setFiltersData] = useReducer(filtersReducer, initialFiltersData);
  const [snippetCollection, setSnippetCollection] = useState<Snippet[]>([])


  useEffect(() => {
    setSnippetCollection(snippets)
  }, [])

  return (
    <div className="flex gap-6 h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 py-6 bg-dark-1 h-screen overflow-y-auto pr-6">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-11" />
            <input
              type="text"
              placeholder="Pesquise aqui..."
              className="w-full bg-dark-2 text-dark-12 pl-10 pr-4 py-2 rounded-lg border border-dark-6 focus:outline-none focus:border-primary"
              value={filtersData.searchQuery}
              onChange={(e) => setFiltersData({ searchQuery: e.target.value })}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-dark-11">Engine:</span>
              <select
                value={filtersData.engine}
                onChange={(e) => setFiltersData({ engine: Number(e.target.value) })}
                className="bg-dark-2 text-dark-12 px-4 py-2 rounded-lg border border-dark-6 focus:outline-none focus:border-primary"
              >
                <option value={0}>Todas</option>
                <option value={1}>Tyra</option>
                <option value={2}>AthenaENV</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-dark-11">Estilo de Jogo:</span>
              <select
                value={filtersData.gameStyle}
                onChange={(e) => setFiltersData({ gameStyle: Number(e.target.value) })}
                className="bg-dark-2 text-dark-12 px-4 py-2 rounded-lg border border-dark-6 focus:outline-none focus:border-primary"
              >
                <option value={0}>Todos</option>
                <option value={1}>2D</option>
                <option value={2}>3D</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-dark-11">Tipo de Jogo:</span>
              <select
                value={filtersData.gameType}
                onChange={(e) => setFiltersData({ gameType: Number(e.target.value) })}
                className="bg-dark-2 text-dark-12 px-4 py-2 rounded-lg border border-dark-6 focus:outline-none focus:border-primary"
              >
                <option value={0}>Todos</option>
                <option value={1}>Plataforma</option>
                <option value={2}>Ação</option>
                <option value={3}>RPG</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippetCollection.map((snippet, index) => (
            <SnippetCard description={TextUtils.truncatedText(snippet.description, 255)} pid={snippet.pid} title={snippet.title} engine={snippet.engine} last_modifier={snippet.last_modifier} last_update={snippet.last_update} key={index} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default CollectionPage