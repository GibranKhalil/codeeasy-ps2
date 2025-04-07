"use client"

import { useState, useEffect, useCallback } from "react"
import HeroSection from "@/components/pages/home/hero-section"
import FeaturedContentTabs from "@/components/pages/home/featured-content-tabs"
import TopContributorsSection from "@/components/pages/home/top-contributors-section"
import CallToActionSection from "@/components/pages/home/call-to-action-section"
import { snippetService } from "@/data/services/snippets/snippets.service"
import { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { AxiosResponse } from "axios"
import { gameService } from "@/data/services/games/game.service"
import { Game } from "@/data/@types/models/games/entities/game.entity"
import { tutorialsService } from "@/data/services/tutorials/tutorials.service"
import { Tutorial } from "@/data/@types/models/tutorials/entities/tutorial.entity"

export default function Home() {
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([])
  const [featuredTutorials, setFeaturedTutorials] = useState<Tutorial[]>([])
  const [featuredGames, setFeaturedGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)


  const fetchFeaturedSnippets = useCallback(async () => {
    const response = await snippetService.find({ subEndpoint: '/featured' }) as unknown as AxiosResponse<Snippet[]>
    setRecentSnippets(response.data)
  }, [])


  const fetchFeaturedTutorials = useCallback(async () => {
    const response = await tutorialsService.find({ subEndpoint: '/featured' }) as unknown as AxiosResponse<Tutorial[]>
    setFeaturedTutorials(response.data)
  }, [])

  const fetchFeaturedGames = useCallback(async () => {
    const response = await gameService.find({ subEndpoint: '/featured' }) as unknown as AxiosResponse<Game[]>
    setFeaturedGames(response.data)
  }, [])

  useEffect(() => {
    fetchFeaturedSnippets()
    fetchFeaturedGames()
    fetchFeaturedTutorials()
    setLoading(false)

    return
  }, [fetchFeaturedSnippets])

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedContentTabs
        recentSnippets={recentSnippets}
        featuredTutorials={featuredTutorials}
        featuredGames={featuredGames}
        loading={loading}
      />
      {/* <TopContributorsSection topContributors={topContributors} loading={loading} /> */}
      <CallToActionSection />
    </div>
  )
}

