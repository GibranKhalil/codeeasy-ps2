"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { format } from "date-fns"
import { Button } from "@/components/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { mockTutorials } from "@/lib/mock-data"
import type { Tutorial } from "@/lib/types"
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

export default function TutorialPage() {
  const params = useParams()
  const router = useRouter()

  const [tutorial, setTutorial] = useState<Tutorial | null>(null)
  const [loading, setLoading] = useState(true)

  const { slug } = params

  useEffect(() => {
    const timer = setTimeout(() => {
      const foundTutorial = mockTutorials.find((t) => t.slug === params.slug)
      setTutorial(foundTutorial || null)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [params.slug])

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
          Back
        </Button>
        <h1 className="text-2xl font-bold">Tutorial não encontrado</h1>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-lg overflow-hidden mb-8">
        <Image src={tutorial.coverImage || "/placeholder.svg"} alt={tutorial.title} fill className="object-cover" />
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
              {format(new Date(tutorial.created_at), "MMMM dd, yyyy")}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {tutorial.read_time} min read
            </div>
            <Badge variant="outline">{tutorial.category}</Badge>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{tutorial.content}</ReactMarkdown>
          </div>

          <div className="flex items-center justify-between mt-8 pt-8 border-t">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={tutorial.author.avatar_url} />
                <AvatarFallback>{tutorial.author.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{tutorial.author.username}</p>
                <p className="text-sm text-muted-foreground">Author</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
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
              <h3 className="font-medium mb-4">Related Tutorials</h3>
              <div className="space-y-4">
                {mockTutorials
                  .filter((t) => t.id !== tutorial.id && t.category === tutorial.category)
                  .slice(0, 3)
                  .map((relatedTutorial) => (
                    <div
                      key={relatedTutorial.id}
                      className="flex items-start space-x-2 cursor-pointer"
                      onClick={() => router.push(`/tutorials/${relatedTutorial.slug}`)}
                    >
                      <div className="relative h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={relatedTutorial.coverImage || "/placeholder.svg"}
                          alt={relatedTutorial.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium line-clamp-2">{relatedTutorial.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{relatedTutorial.read_time} min read</p>
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

