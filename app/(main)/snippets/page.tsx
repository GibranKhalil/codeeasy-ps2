"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import SnippetCard from "@/components/snippetCard"
import { Code, Search, Filter } from "lucide-react"
import { enginesMap, eSnippetEngine } from "@/data/@types/enums/eSnippetEngine.enum"
import { eSnippetLanguage, languageMap } from "@/data/@types/enums/eSnippetLanguage.enum"
import { useAuth } from "@/hooks/use-auth"
import Validator from "@/data/utils/validator.utils"
import { snippetService } from "@/data/services/snippets/snippets.service"
import { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { useFilters } from "@/hooks/use-filters"


export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const { engineFilter, languageFilter, setEngineFilter, searchQuery, setLanguageFilter, setSearchQuery } = useFilters()
  const { user } = useAuth()

  const fetchSnippets = useCallback(async () => {
    const response = await snippetService.find({ params: { engine: engineFilter, language: languageFilter, search: searchQuery } })
    setSnippets(response.data.data)

    setLoading(false)
  }, [engineFilter, languageFilter, searchQuery])

  useEffect(() => {
    fetchSnippets()
  }, [fetchSnippets])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Snippets</h1>
          <p className="text-muted-foreground mt-2">
            Aperfeiçoe seu jogo com código revisado e funcional para qualquer demanda.
          </p>
        </div>
        {Validator.required(user) &&
          <Button asChild>
            <Link href="/snippets/create">
              <Code className="mr-2 h-4 w-4" />
              Criar Snippet
            </Link>
          </Button>}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={"Busque aqui..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Linguagem
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todas</SelectItem>
              {Object.values(eSnippetLanguage).map((lang, index) => (
                <SelectItem key={index} value={lang}>
                  {languageMap.get(lang)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={engineFilter} onValueChange={setEngineFilter}>
            <SelectTrigger>
              <SelectValue
                placeholder={
                  <div className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Engines
                  </div>
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={`ALL`}>Todas</SelectItem>
              {Object.values(eSnippetEngine).map((eng, index) => (
                <SelectItem key={index} value={eng}>
                  {enginesMap.get(eng)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-[250px] animate-pulse bg-muted rounded-lg"></div>
            ))}
        </div>
      ) : snippets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {snippets.map((snippet) => (
            <SnippetCard key={snippet.id} snippet={snippet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Code className="h-12 w-12 mx-auto text-muted-foreground" />
          <h3 className="text-lg font-medium mt-4">Nenhum snippet encontrado</h3>
          <p className="text-muted-foreground mt-2">Tente ajustar sua pesquisa ou critérios de filtro</p>
        </div>
      )}
    </div>
  )
}

