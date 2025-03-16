"use client"

import { useState, useEffect } from "react"
import { mockSnippets, mockTopContributors, mockTutorials, mockGames } from "@/lib/mock-data"
import SupportSection from "@/ui/components/pages/home/supportSection"
import TopContributorsSection from "@/ui/components/pages/home/topContributorsSection"
import FeaturedSection from "@/ui/components/pages/home/featuredSection"
import HeroSection from "@/ui/components/pages/home/heroSection"

export default function Home() {
  const [recentSnippets, setRecentSnippets] = useState<typeof mockSnippets>([])
  const [topContributors, setTopContributors] = useState<typeof mockTopContributors>([])
  const [featuredTutorials, setFeaturedTutorials] = useState<typeof mockTutorials>([])
  const [featuredGames, setFeaturedGames] = useState<typeof mockGames>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setRecentSnippets(mockSnippets.slice(0, 3))
    setTopContributors(mockTopContributors.slice(0, 5))
    setFeaturedTutorials(mockTutorials.slice(0, 3))
    setFeaturedGames(mockGames.slice(0, 3))
    setLoading(false)

    return
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedSection featuredGames={featuredGames} featuredTutorials={featuredTutorials} featuredSnippets={recentSnippets} isLoading={loading} />
      <TopContributorsSection isLoading={loading} topContributors={topContributors} />
      <SupportSection />
    </div>
  )
}

