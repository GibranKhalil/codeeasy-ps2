import { useEffect, useReducer, useState } from 'react'
import { Flame, Search } from 'lucide-react'
import { SnippetCard } from '../ui/components/collectionPage/snippetCard'
import snippets from '../data/snippets.json' with { type: 'json' }
import type { Snippet } from '../@types/collection'
import { TextUtils } from '../utils/TextUtils'
import { Button } from '../ui/components/Button'
import { useNavigate } from 'react-router-dom'

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
  const navigateTo = useNavigate()

  const [filtersData, setFiltersData] = useReducer(filtersReducer, initialFiltersData);
  const [snippetCollection, setSnippetCollection] = useState<Snippet[]>([])


  useEffect(() => {
    setSnippetCollection(snippets)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-48 bg-dark-secondary h-screen fixed left-0 p-6 flex flex-col">
        <div onClick={() => navigateTo('/')} className="flex items-center space-x-2 mb-8 cursor-pointer">
          <Flame size={32} fill='#e0e0e0 ' className='text-light-gray' />
          <h1 className="text-2xl font-bold text-light-gray">PlayForge</h1>
        </div>
        <Button>
          Contribuir
        </Button>
      </aside>

      <main className="flex-1 p-8 bg-dark-primary ml-48 h-screen overflow-y-auto">
        <div className="mb-8">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-gray" />
            <input
              type="text"
              placeholder="Pesquise aqui..."
              className="w-full bg-dark-secondary text-light-gray pl-10 pr-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              value={filtersData.searchQuery}
              onChange={(e) => setFiltersData({ searchQuery: e.target.value })}
            />
          </div>

          <div className="flex space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Engine:</span>
              <select
                value={filtersData.engine}
                onChange={(e) => setFiltersData({ engine: Number(e.target.value) })}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              >
                <option value={0}>Todas</option>
                <option value={1}>Tyra</option>
                <option value={2}>AthenaENV</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Estilo de Jogo:</span>
              <select
                value={filtersData.gameStyle}
                onChange={(e) => setFiltersData({ gameStyle: Number(e.target.value) })}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
              >
                <option value={0}>Todos</option>
                <option value={1}>2D</option>
                <option value={2}>3D</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-neutral-gray">Tipo de Jogo:</span>
              <select
                value={filtersData.gameType}
                onChange={(e) => setFiltersData({ gameType: Number(e.target.value) })}
                className="bg-dark-secondary text-light-gray px-4 py-2 rounded-lg border border-dark-gray focus:outline-none focus:border-primary"
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