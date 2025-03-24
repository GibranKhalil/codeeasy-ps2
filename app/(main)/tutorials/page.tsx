"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/card"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Button } from "@/components/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/tabs"
import { mockTutorials } from "@/lib/mock-data"
import { Search, Clock, Tag, PlusCircle } from "lucide-react"
import Validator from "@/data/utils/validator.utils"
import { useAuth } from "@/hooks/use-auth"
import { tutorialsService } from "@/data/services/tutorials/tutorials.service"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"

export default function TutorialsPage() {
  const router = useRouter()

  const [tutorials, setTutorials] = useState<Tutorial[]>([])
  const [filteredTutorials, setFilteredTutorials] = useState<Tutorial[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  const categories = ["all", ...Array.from(new Set(mockTutorials.map((tutorial) => tutorial.category)))]


  const fetchTutorials = useCallback(async () => {
    const response = await tutorialsService.find()
    setTutorials(response.data.data)
  }, [])

  useEffect(() => {
    fetchTutorials()
    setLoading(false)

    return
  }, [fetchTutorials])


  const handleTutorialClick = (slug: string) => {
    router.push(`/tutorials/${slug}`)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tutoriais</h1>
          <p className="text-muted-foreground mt-2">
            Aprenda desenvolvimento homebrew para PS2 com nossos tutoriais completos
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={"Busque aqui..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          {Validator.required(user) &&
            <Button onClick={() => router.push("/tutorials/create")} className="gap-2 sm:w-auto w-full">
              <PlusCircle className="h-4 w-4" />
              Criar Tutorial
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
                      <CardHeader className="p-4">
                        <div className="h-6 w-3/4 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-1/2 bg-muted rounded-md"></div>
                      </CardHeader>
                      <CardContent className="px-4 pb-0">
                        <div className="h-4 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 bg-muted rounded-md mb-2"></div>
                        <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                      </CardContent>
                      <CardFooter className="p-4">
                        <div className="h-4 w-1/3 bg-muted rounded-md"></div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            ) : filteredTutorials.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTutorials.map((tutorial) => (
                  <Card
                    key={tutorial.id}
                    className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
                    onClick={() => handleTutorialClick(tutorial.pid)}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={tutorial.coverImage_url || "/placeholder.svg"}
                        alt={tutorial.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="p-4 pb-0">
                      <div className="flex items-start justify-between">
                        <Badge variant="outline" className="mb-2">
                          {tutorial.category.name}
                        </Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          {tutorial.readTime} min read
                        </div>
                      </div>
                      <CardTitle className="line-clamp-2 text-xl">{tutorial.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <p className="text-muted-foreground line-clamp-3">{tutorial.excerpt}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {tutorial.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag.id} variant="secondary" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                        {tutorial.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{tutorial.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 border-t flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                          <Image
                            src={tutorial.creator.avatarUrl || "/placeholder.svg"}
                            alt={tutorial.creator.username}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm">{tutorial.creator.username}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {format(new Date(tutorial.createdAt), "MMM dd, yyyy")}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Tag className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium mt-4">Nenhum tutorial encontrado</h3>
                <p className="text-muted-foreground mt-2">Tente ajustar sua pesquisa ou critérios de filtro</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

