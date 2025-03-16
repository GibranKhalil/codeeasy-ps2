"use client"

import Link from "next/link"
import { Code, Users, ArrowRight, Star } from "lucide-react"
import { Badge } from "../badge"
import { Button } from "../button"
import { Card, CardContent } from "../card"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

interface TopContributorsSectionProps {
  topContributors: any[]
  loading: boolean
}

export default function TopContributorsSection({ topContributors, loading }: TopContributorsSectionProps) {

  return (
    <section className="w-full py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-2" variant="outline">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              Comunidade
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight">Principais Contribuidores</h2>
            <p className="text-muted-foreground mt-1">Conheça os desenvolvedores mais engajados em nossa comunidade</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/ranking" className="hidden sm:flex items-center">
              Ver Todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {loading
            ? Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="h-16 w-16 bg-muted rounded-full mb-4"></div>
                    <div className="h-4 w-20 bg-muted rounded mb-2"></div>
                    <div className="h-3 w-12 bg-muted rounded"></div>
                  </CardContent>
                </Card>
              ))
            : topContributors.map((contributor, index) => (
              <Card key={contributor.id} className="overflow-hidden transition-all hover:shadow-md">
                <Link href={`/profile/${contributor.id}`}>
                  <CardContent className="p-6 flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-16 w-16 mb-4">
                        <AvatarImage src={contributor.avatar_url} />
                        <AvatarFallback>{contributor.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      {index < 3 && (
                        <div
                          className={`absolute -top-1 -right-1 rounded-full p-1 
                            ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-700"}`}
                        >
                          <Star className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-center">{contributor.username}</h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1">
                      <Code className="inline h-3 w-3 mr-1" />
                      {contributor.snippets_count} {contributor.snippets_count === 1 ? "snippet" : "snippets"}
                    </p>
                  </CardContent>
                </Link>
              </Card>
            ))}
        </div>

        <div className="flex justify-center mt-8 sm:hidden">
          <Button asChild>
            <Link href="/ranking">
              Ver todos os contribuidores
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

