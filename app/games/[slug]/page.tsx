"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { Card, CardContent } from "@/components/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/carousel"
import { mockGames } from "@/lib/mock-data"
import type { Game } from "@/lib/types"
import { ArrowLeft, Download, Clock, Share2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function GamePage() {
  const params = useParams()
  const router = useRouter()
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundGame = mockGames.find((g) => g.slug === params.slug)
    setGame(foundGame || null)
    setLoading(false)

    return
  }, [params.slug])

  if (loading) {
    return (
      <div className="container py-8 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="container py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Game not found</h1>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-1 md:col-span-8">
          <div className="mb-6">
            <div className="flex flex-wrap gap-3 mb-3">
              <Badge className="bg-primary">{game.category}</Badge>
              <Badge variant="outline">v{game.version}</Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">{game.title}</h1>
            <p className="text-xl text-muted-foreground mt-2">{game.description}</p>
          </div>

          <Carousel className="mb-8">
            <CarouselContent>
              {game.screenshots.map((screenshot, index) => (
                <CarouselItem key={index}>
                  <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden">
                    <Image
                      src={screenshot || "/placeholder.svg"}
                      alt={`Screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{game.content}</ReactMarkdown>
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={game.author.avatar_url} />
                <AvatarFallback>{game.author.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{game.author.username}</p>
                <p className="text-sm text-muted-foreground">Developer</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="col-span-1 md:col-span-4">
          <div className="sticky top-24">
            <Card className="mb-6">
              <CardContent className="p-6">
                <Button className="w-full mb-4" size="lg" asChild>
                  <a href={game.download_url} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-5 w-5" />
                    Download ({game.size_mb}MB)
                  </a>
                </Button>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Download className="mr-1 h-4 w-4" />
                    {game.download_count.toLocaleString()} downloads
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {format(new Date(game.updated_at), "MMM dd, yyyy")}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Game Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Developer:</span>
                      <span className="font-medium">{game.author.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="font-medium">{game.version}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Release Date:</span>
                      <span className="font-medium">{format(new Date(game.created_at), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span className="font-medium">{format(new Date(game.updated_at), "MMM dd, yyyy")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">File Size:</span>
                      <span className="font-medium">{game.size_mb} MB</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">More From This Developer</h3>
                <div className="space-y-4">
                  {mockGames
                    .filter((g) => g.id !== game.id && g.author.id === game.author.id)
                    .slice(0, 3)
                    .map((relatedGame) => (
                      <div
                        key={relatedGame.id}
                        className="flex items-start space-x-2 cursor-pointer"
                        onClick={() => router.push(`/games/${relatedGame.slug}`)}
                      >
                        <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={relatedGame.coverImage || "/placeholder.svg"}
                            alt={relatedGame.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium line-clamp-2">{relatedGame.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Download className="mr-1 h-3 w-3" />
                            {relatedGame.download_count.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

