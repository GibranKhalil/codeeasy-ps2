"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/tabs"
import { mockTopContributors } from "@/lib/mock-data"
import { Search, Trophy, Code, Star, Users } from "lucide-react"

const expandedContributors = [
  ...mockTopContributors,
  {
    id: "user-303",
    username: "memory_master",
    avatar_url: "/placeholder.svg?height=100&width=100",
    snippets_count: 4,
  },
  {
    id: "user-404",
    username: "network_ninja",
    avatar_url: "/placeholder.svg?height=100&width=100",
    snippets_count: 4,
  },
  {
    id: "user-505",
    username: "file_wizard",
    avatar_url: "/placeholder.svg?height=100&width=100",
    snippets_count: 3,
  },
  {
    id: "user-606",
    username: "usb_guru",
    avatar_url: "/placeholder.svg?height=100&width=100",
    snippets_count: 3,
  },
  {
    id: "user-707",
    username: "controller_pro",
    avatar_url: "/placeholder.svg?height=100&width=100",
    snippets_count: 2,
  },
  {
    id: "user-808",
    username: "ps2_newbie",
    avatar_url: "/placeholder.svg?height=100&width=100",
    snippets_count: 1,
  },
]

type Contributor = {
  id: string
  username: string
  avatar_url: string
  snippets_count: number
}

export default function RankingPage() {
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [filteredContributors, setFilteredContributors] = useState<Contributor[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState("all-time")

  useEffect(() => {
    setContributors(expandedContributors)
    setFilteredContributors(expandedContributors)
    setLoading(false)

    return
  }, [])

  useEffect(() => {
    if (contributors.length > 0) {
      const filtered = contributors.filter((contributor) =>
        contributor.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredContributors(filtered)
    }
  }, [searchQuery, contributors])

  const getRankBadge = (index: number) => {
    if (index === 0) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (index === 1) return <Trophy className="h-5 w-5 text-gray-400" />
    if (index === 2) return <Trophy className="h-5 w-5 text-amber-700" />
    return null
  }

  const getRankLabel = (index: number) => {
    if (index === 0) return "Gold"
    if (index === 1) return "Silver"
    if (index === 2) return "Bronze"
    return `#${index + 1}`
  }

  const getRankColor = (index: number) => {
    if (index === 0) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    if (index === 1) return "bg-gray-400/10 text-gray-400 border-gray-400/20"
    if (index === 2) return "bg-amber-700/10 text-amber-700 border-amber-700/20"
    return "bg-muted/50"
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-4">
        <h1 className="text-3xl font-bold">Ranking</h1>
        <p className="text-muted-foreground">Top contribuidores da comunidade</p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <Tabs defaultValue="all-time" value={timeframe} onValueChange={setTimeframe} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all-time">Tudo</TabsTrigger>
              <TabsTrigger value="monthly">Mensal</TabsTrigger>
              <TabsTrigger value="weekly">Semanal</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={"Busque aqui..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-muted"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-3 w-16 bg-muted rounded"></div>
                      </div>
                      <div className="h-8 w-8 bg-muted rounded-full"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContributors.map((contributor, index) => (
              <Card key={contributor.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center">
                    <div
                      className={`w-2 self-stretch ${index < 3 ? ["bg-yellow-500", "bg-gray-400", "bg-amber-700"][index] : "bg-muted"}`}
                    ></div>
                    <div className="flex items-center gap-4 p-4 flex-1">
                      <div className="flex items-center justify-center w-10 font-bold">
                        {index < 3 ? getRankBadge(index) : index + 1}
                      </div>

                      <Avatar className="h-12 w-12 border-2 border-background">
                        <AvatarImage src={contributor.avatar_url} />
                        <AvatarFallback>{contributor.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                          <h3 className="font-semibold">{contributor.username}</h3>
                          {index < 3 && (
                            <Badge variant="outline" className={getRankColor(index)}>
                              {getRankLabel(index)} Contributor
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Code className="h-3.5 w-3.5 mr-1" />
                            {contributor.snippets_count} {contributor.snippets_count === 1 ? "snippet" : "snippets"}
                          </div>
                        </div>
                      </div>

                      <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-muted/50">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredContributors.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">Nenhum contribuidor encontrado</h3>
                <p className="text-muted-foreground mt-2">Tente ajustar seus filtros de busca e tente novamente</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

