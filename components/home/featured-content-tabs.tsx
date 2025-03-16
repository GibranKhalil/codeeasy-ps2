"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Code, ArrowRight, BookOpen, Gamepad2, Star, Download, Clock, User } from "lucide-react"
import { Badge } from "../badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../tabs"
import { Card, CardContent, CardFooter } from "../card"
import SnippetCard from "@/ui/components/snippetCard"
import { Button } from "../button"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar"

interface FeaturedContentTabsProps {
  recentSnippets: any[]
  featuredTutorials: any[]
  featuredGames: any[]
  loading: boolean
}

export default function FeaturedContentTabs({
  recentSnippets,
  featuredTutorials,
  featuredGames,
  loading,
}: FeaturedContentTabsProps) {
  const [activeTab, setActiveTab] = useState("snippets")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <section className="w-full py-12 md:py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center mb-8 text-center">
          <Badge className="mb-4" variant="outline">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            Featured Content
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">Explore PS2 Homebrew Resources</h2>
          <p className="mt-2 text-muted-foreground max-w-[700px]">
            Discover code snippets, tutorials, games, and more from our community of PS2 homebrew developers.
          </p>
        </div>

        <Tabs defaultValue="snippets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="snippets" className="flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Code Snippets</span>
                <span className="sm:hidden">Code</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Tutorials</span>
                <span className="sm:hidden">Learn</span>
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-1.5">
                <Gamepad2 className="h-4 w-4" />
                <span className="hidden sm:inline">Games</span>
                <span className="sm:hidden">Play</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-8">
            <TabsContent value="snippets" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "snippets" ? "visible" : "hidden"}
              >
                {loading
                  ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="h-[250px] animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                          <div className="h-4 w-1/2 bg-muted rounded mb-8"></div>
                          <div className="h-24 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))
                  : recentSnippets.map((snippet) => (
                    <motion.div key={snippet.id} variants={cardVariants}>
                      <SnippetCard snippet={snippet} />
                    </motion.div>
                  ))}
              </motion.div>
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/snippets">
                    View All Snippets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="tutorials" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "tutorials" ? "visible" : "hidden"}
              >
                {loading
                  ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="h-[350px] animate-pulse">
                        <div className="h-40 bg-muted"></div>
                        <CardContent className="p-6">
                          <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                          <div className="h-4 w-full bg-muted rounded mb-2"></div>
                          <div className="h-4 w-3/4 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))
                  : featuredTutorials.map((tutorial) => (
                    <motion.div key={tutorial.id} variants={cardVariants}>
                      <Card className="overflow-hidden h-full flex flex-col cursor-pointer transition-all hover:shadow-md">
                        <Link href={`/tutorials/${tutorial.slug}`} className="h-full flex flex-col">
                          <div className="relative h-40 w-full">
                            <Image
                              src={tutorial.coverImage || "/placeholder.svg"}
                              alt={tutorial.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                              {tutorial.category}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {tutorial.read_time} min read
                              </div>
                            </div>
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{tutorial.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{tutorial.excerpt}</p>
                          </CardContent>
                          <CardFooter className="p-4 border-t">
                            <div className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarImage src={tutorial.author.avatar_url} />
                                <AvatarFallback>{tutorial.author.username.charAt(0).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{tutorial.author.username}</span>
                            </div>
                          </CardFooter>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/tutorials">
                    Explore All Tutorials
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="games" className="mt-0">
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate={activeTab === "games" ? "visible" : "hidden"}
              >
                {loading
                  ? Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <Card key={i} className="h-[350px] animate-pulse">
                        <div className="h-40 bg-muted"></div>
                        <CardContent className="p-6">
                          <div className="h-4 w-3/4 bg-muted rounded mb-4"></div>
                          <div className="h-4 w-full bg-muted rounded mb-2"></div>
                          <div className="h-4 w-3/4 bg-muted rounded"></div>
                        </CardContent>
                      </Card>
                    ))
                  : featuredGames.map((game) => (
                    <motion.div key={game.id} variants={cardVariants}>
                      <Card className="overflow-hidden h-full flex flex-col cursor-pointer transition-all hover:shadow-md">
                        <Link href={`/games/${game.slug}`} className="h-full flex flex-col">
                          <div className="relative h-40 w-full">
                            <Image
                              src={game.coverImage || "/placeholder.svg"}
                              alt={game.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            <Badge className="absolute bottom-3 left-3 bg-primary/80 hover:bg-primary/80">
                              {game.category}
                            </Badge>
                          </div>
                          <CardContent className="p-4 flex-1">
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">{game.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-3">{game.description}</p>
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
                          <CardFooter className="p-4 border-t">
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs text-muted-foreground">v{game.version}</span>
                              <span className="text-xs text-muted-foreground">{game.size_mb}MB</span>
                            </div>
                          </CardFooter>
                        </Link>
                      </Card>
                    </motion.div>
                  ))}
              </motion.div>
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/games">
                    Browse All Games
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </section>
  )
}

