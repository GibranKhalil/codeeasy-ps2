"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/select"
import { mockSnippets } from "@/lib/mock-data"
import type { Snippet } from "@/lib/types"
import SnippetCard from "@/ui/components/snippetCard"
import { Code, Search, Filter } from "lucide-react"

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [languageFilter, setLanguageFilter] = useState("")
  const [languages, setLanguages] = useState<string[]>([])

  useEffect(() => {
    let filteredSnippets = [...mockSnippets]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filteredSnippets = filteredSnippets.filter(
        (snippet) => snippet.title.toLowerCase().includes(query) || snippet.description.toLowerCase().includes(query),
      )
    }

    if (languageFilter && languageFilter !== "all") {
      filteredSnippets = filteredSnippets.filter((snippet) => snippet.language === languageFilter)
    }

    setSnippets(filteredSnippets)

    const uniqueLanguages = [...new Set(mockSnippets.map((s) => s.language))]
    setLanguages(uniqueLanguages)

    setLoading(false)

    return
  }, [searchQuery, languageFilter])

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Snippets</h1>
        <Button asChild>
          <Link href="/snippets/create">
            <Code className="mr-2 h-4 w-4" />
            Criar Snippet
          </Link>
        </Button>
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
              <SelectItem value="all">Todas</SelectItem>
              {languages.map((lang) => (
                <SelectItem key={lang} value={lang}>
                  {lang}
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
          <h3 className="text-lg font-medium">Nenhum snippet encontrado</h3>
          <p className="text-muted-foreground mt-2">Tente ajustar seus filtros</p>
        </div>
      )}
    </div>
  )
}

