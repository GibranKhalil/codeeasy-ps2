"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { ArrowLeft, Clock, Calendar, Share2, Edit, Trash } from "lucide-react"
import { tutorialsService } from "@/data/services/tutorials/tutorials.service"
import { AxiosResponse } from "axios"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"
import { ptBR } from "date-fns/locale"
import { Interactions } from "@/data/@types/interactions.type"
import { useAuth } from "@/hooks/use-auth"
import ReactMarkdown from 'react-markdown'

export default function TutorialPage() {
  const params = useParams()
  const router = useRouter()

  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [similarTutorials, setSimilarTutorials] = useState<Tutorial[]>([])
  const [loading, setLoading] = useState(true)

  const { user } = useAuth()

  const { slug } = params

  const fetchTutorial = useCallback(async () => {
    setLoading(true)
    const response = await tutorialsService.find({ subEndpoint: `/pid/${slug}` }) as unknown as AxiosResponse<Tutorial>
    setTutorial(response.data)
    console.log(response.data)
    setLoading(false)
  }, [slug])

  const fetchSimilarTutorials = useCallback(async () => {
    const response = await tutorialsService.find({ subEndpoint: `/similar/${slug}`, params: { page: 1, limit: 3 } })
    setSimilarTutorials(response.data.data)
  }, [slug])

  const interactWithTutorial = async (type: keyof Interactions) => {
    await tutorialsService.addInteraction(slug as string, { type })
  }

  useEffect(() => {
    interactWithTutorial("views")
  }, [slug])

  useEffect(() => {
    fetchTutorial()
    fetchSimilarTutorials()
    return;
  }, [fetchTutorial, fetchSimilarTutorials])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!tutorial) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Tutorial não encontrado</h1>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        {Number(user?.id) === Number(tutorial.creator.id) &&
          <div className="flex gap-2 items-center">
            <Button onClick={() => router.push(`/tutorials/edit/${tutorial.pid}`)} variant={"outline"}>
              <Edit />
            </Button>
            <Button variant={"destructive"}>
              <Trash />
            </Button>
          </div>
        }
      </div>

      <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden mb-8">
        <Image src={tutorial.coverImage_url || "/placeholder.svg"} alt={tutorial.title} fill className="object-cover" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-1 md:col-span-9">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold">{tutorial.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{tutorial.excerpt}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8 text-muted-foreground text-sm">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {format(new Date(tutorial.createdAt), "dd/MM/yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {tutorial.readTime} minutos de leitura
            </div>
            <Badge variant="outline">{tutorial.category.name}</Badge>
          </div>

          <div className="markdown max-w-none">
            <ReactMarkdown children={tutorial.content} />
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={tutorial.creator.avatarUrl} />
                <AvatarFallback>{tutorial.creator.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{tutorial.creator.username}</p>
                <p className="text-sm text-muted-foreground">Autor</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-3">
          <div className="sticky top-24">
            <div className="rounded-lg border p-4 mb-6">
              <h3 className="font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tutorial.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="font-medium mb-4">Tutoriais Relacionados</h3>
              <div className="space-y-4">
                {similarTutorials
                  .map((relatedTutorial) => (
                    <div
                      key={relatedTutorial.id}
                      className="flex items-start space-x-2 cursor-pointer"
                      onClick={() => router.push(`/tutorials/${relatedTutorial.pid}`)}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={relatedTutorial.coverImage_url || "/placeholder.svg"}
                          alt={relatedTutorial.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium line-clamp-2">{relatedTutorial.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{relatedTutorial.readTime} min</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

