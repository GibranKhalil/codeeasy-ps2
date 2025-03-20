"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/card"
import { Badge } from "@/components/badge"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { mockGames } from "@/lib/mock-data"
import type { Game } from "@/lib/types"
import { Search, Download, User, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Validator from "@/data/utils/validator.utils"

export default function GamesPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  const categories = ["all", ...Array.from(new Set(mockGames.map((game) => game.category)))]

  useEffect(() => {
    setGames(mockGames)
    setFilteredGames(mockGames)
    setLoading(false)

    return
  }, [])

  useEffect(() => {
    if (games.length > 0) {
      let filtered = [...games]

      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filtered = filtered.filter(
          (game) =>
            game.title.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query) ||
            game.tags.some((tag) => tag.toLowerCase().includes(query)),
        )
      }

      if (activeCategory !== "all") {
        filtered = filtered.filter((game) => game.category === activeCategory)
      }

      setFilteredGames(filtered)
    }
  }, [searchQuery, activeCategory, games])

  const handleGameClick = (slug: string) => {
    router.push(`/games/${slug}`)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Jogos</h1>
          <p className="text-muted-foreground mt-2">
            Descubra e baixe os jogos criados pela nossa comunidade
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={"Busque aqui..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {Validator.required(user) && <Button asChild>
            <Link href="/games/submit">Envie Seu Jogo</Link>
          </Button>}
        </div>

        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex h-auto flex-wrap justify-start">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="mb-1">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory}>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden animate-pulse">
                      <div className="h-48 bg-muted"></div>
                      <CardContent className="p-4">
                        <div className="h-6 w-3/4 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-full bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                      </CardContent>
                      <CardFooter className="p-4 border-t">
                        <div className="h-4 w-1/3 bg-muted rounded-md"></div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : filteredGames.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredGames.map((game) => (
                  <Card
                    key={game.id}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleGameClick(game.slug)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={game.coverImage || "/placeholder.svg"}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <Badge className="bg-primary">{game.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg line-clamp-1">{game.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{game.description}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {game.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <User className="mr-1 h-4 w-4" />
                          {game.author.username}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Download className="mr-1 h-4 w-4" />
                          {game.download_count.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t flex justify-between">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(new Date(game.updated_at), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium mr-1">v{game.version}</span>
                        <span className="text-xs text-muted-foreground">{game.size_mb}MB</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Download className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">No games found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

