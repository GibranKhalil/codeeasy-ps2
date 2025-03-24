"use client"

import { useState, useEffect, useCallback } from "react"
import { mockSnippets, mockTopContributors, mockTutorials, mockGames } from "@/lib/mock-data"
import HeroSection from "@/components/pages/home/hero-section"
import FeaturedContentTabs from "@/components/pages/home/featured-content-tabs"
import TopContributorsSection from "@/components/pages/home/top-contributors-section"
import CallToActionSection from "@/components/pages/home/call-to-action-section"
import { snippetService } from "@/data/services/snippets/snippets.service"
import { Snippet } from "@/data/@types/models/snippet/entities/snippet.entity"
import { AxiosResponse } from "axios"

export default function Home() {
  const [recentSnippets, setRecentSnippets] = useState<Snippet[]>([])
  const [topContributors, setTopContributors] = useState<typeof mockTopContributors>([])
  const [featuredTutorials, setFeaturedTutorials] = useState<typeof mockTutorials>([])
  const [featuredGames, setFeaturedGames] = useState<typeof mockGames>([])
  const [loading, setLoading] = useState(true)


  const fetchFeaturedSnippets = useCallback(async () => {
    const response = await snippetService.find({ subEndpoint: '/featured' }) as unknown as AxiosResponse<Snippet[]>
    setRecentSnippets(response.data)
  }, [])


  // const fetchFeaturedTutorials = useCallback(async () => {
  //   const response = await tutorialsService.find({ subEndpoint: '/featured' }) as unknown as AxiosResponse<Tutorial[]>
  //   setFeaturedTutorials(response.data)
  // }, [])

  // const fetchFeaturedGames = useCallback(async () => {
  //   const response = await gameService.find({ subEndpoint: '/featured' }) as unknown as AxiosResponse<Game[]>
  //   setFeaturedGames(response.data)
  // }, [])

  useEffect(() => {
    fetchFeaturedSnippets()
    setTopContributors(mockTopContributors.slice(0, 5))
    setFeaturedTutorials(mockTutorials.slice(0, 3))
    setFeaturedGames(mockGames.slice(0, 3))
    setLoading(false)

    return
  }, [fetchFeaturedSnippets])

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection snippetCode={mockSnippets[0]?.code || ""} snippetLanguage={mockSnippets[0]?.language || "c"} />
      <FeaturedContentTabs
        recentSnippets={recentSnippets}
        featuredTutorials={featuredTutorials}
        featuredGames={featuredGames}
        loading={loading}
      />
      <TopContributorsSection topContributors={topContributors} loading={loading} />
      <CallToActionSection />
    </div>
  )
}

