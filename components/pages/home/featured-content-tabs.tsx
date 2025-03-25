"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Code, ArrowRight, BookOpen, Gamepad2, Star } from "lucide-react"
import { Badge } from "../../badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../tabs"
import { Card, CardContent } from "../../card"
import SnippetCard from "@/components/snippetCard"
import { Button } from "../../button"
import { TutorialCard } from "@/components/trainingCard"
import { GameCard } from "@/components/gameCard"

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
          <Badge className="mb-4">
            <Star className="h-3.5 w-3.5 mr-1.5" />
            Conteúdo em Destaque
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight">Explore os Conteúdos de PS2 Homebrew</h2>
          <p className="mt-2 text-muted-foreground max-w-[700px]">
            Procure códigos, tutoriais, jogos, e mais de nossa comunidade de desenvolvedores PS2 homebrew.
          </p>
        </div>

        <Tabs defaultValue="snippets" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="snippets" className="flex items-center gap-1.5">
                <Code className="h-4 w-4" />
                <span className="hidden sm:inline">Códigos</span>
                <span className="sm:hidden">Códigos</span>
              </TabsTrigger>
              <TabsTrigger value="tutorials" className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                <span className="hidden sm:inline">Tutoriais</span>
                <span className="sm:hidden">Aprenda</span>
              </TabsTrigger>
              <TabsTrigger value="games" className="flex items-center gap-1.5">
                <Gamepad2 className="h-4 w-4" />
                <span className="hidden sm:inline">Jogos</span>
                <span className="sm:hidden">Jogue</span>
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
                  : recentSnippets && recentSnippets.map((snippet, index) => (
                    <motion.div key={index} variants={cardVariants}>
                      <SnippetCard snippet={snippet} />
                    </motion.div>
                  ))}
              </motion.div>
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/snippets">
                    Ver Todos Snippets
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
                  : featuredTutorials.map((tutorial, index) => (
                    <TutorialCard tutorial={tutorial} key={index} />
                  ))}
              </motion.div>
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/tutorials">
                    Explorar Tutoriais
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
                  : featuredGames.map((game, index) => (
                    <GameCard game={game} key={index} />
                  ))}
              </motion.div>
              <div className="flex justify-center mt-8">
                <Button asChild>
                  <Link href="/games">
                    Ver Todos Jogos
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

