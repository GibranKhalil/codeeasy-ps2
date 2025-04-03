"use client"

import { useState, useEffect, useCallback } from "react"
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
import { Search, Download, User, Clock } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import Validator from "@/data/utils/validator.utils"
import { gameService } from "@/data/services/games/game.service"
import { Game } from "@/data/@types/models/games/entities/game.entity"
import { categoriesService } from "@/data/services/categories/categories.service"
import { Category } from "@/data/@types/models/categories/entities/category.entity"

export default function GamesPage() {
  const router = useRouter()
  const [filteredGames, setFilteredGames] = useState<Game[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])

  const { user } = useAuth()

  const fetchGames = useCallback(async () => {
    const response = await gameService.find();
    setFilteredGames(response.data.data)
  }, [])

  const fetchCategories = useCallback(async () => {
    const response = await categoriesService.find()
    setCategories(response.data.data)
  }, [])

  useEffect(() => {
    setLoading(false)

    return
  }, [])

  useEffect(() => {
    fetchCategories()
    fetchGames()
  }, [fetchCategories, fetchGames])

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
            {categories.map((category, index) => (
              <TabsTrigger key={index} value={`${category.id}`} className="mb-1">
                {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
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
                {filteredGames.map((game, index) => (
                  <Card
                    key={index}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleGameClick(game.pid)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={game.coverImage_url || "/placeholder.svg"}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <Badge className="bg-primary">{game.category.name}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg line-clamp-1">{game.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{game.description}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {game.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-4 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <User className="mr-1 h-4 w-4" />
                          {game.creator.username}
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Download className="mr-1 h-4 w-4" />
                          {game.downloads.toLocaleString()}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t flex justify-between">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {format(new Date(game.updatedAt), "MMM dd, yyyy")}
                      </div>
                      <div className="flex items-center">
                        <span className="text-xs font-medium mr-1">v{game.version}</span>
                        <span className="text-xs text-muted-foreground">{game.fileSize}MB</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Download className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Nenhum jogo encontrado</h3>
                <p className="text-muted-foreground mt-2">Tente ajustar sua pesquisa ou critérios de filtro</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

