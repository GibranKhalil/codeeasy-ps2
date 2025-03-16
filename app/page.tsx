"use client"

import { useState, useEffect } from "react"
import { mockSnippets, mockTopContributors, mockTutorials, mockGames } from "@/lib/mock-data"
import HeroSection from "@/components/pages/home/hero-section"
import FeaturedContentTabs from "@/components/pages/home/featured-content-tabs"
import TopContributorsSection from "@/components/pages/home/top-contributors-section"
import CallToActionSection from "@/components/pages/home/call-to-action-section"

export default function Home() {
  const [recentSnippets, setRecentSnippets] = useState<typeof mockSnippets>([])
  const [topContributors, setTopContributors] = useState<typeof mockTopContributors>([])
  const [featuredTutorials, setFeaturedTutorials] = useState<typeof mockTutorials>([])
  const [featuredGames, setFeaturedGames] = useState<typeof mockGames>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setRecentSnippets(mockSnippets.slice(0, 3))
      setTopContributors(mockTopContributors.slice(0, 5))
      setFeaturedTutorials(mockTutorials.slice(0, 3))
      setFeaturedGames(mockGames.slice(0, 3))
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection snippetCode={mockSnippets[0]?.code || ""} snippetLanguage={mockSnippets[0]?.language || "c"} />

      {/* Featured Content Tabs */}
      <FeaturedContentTabs
        recentSnippets={recentSnippets}
        featuredTutorials={featuredTutorials}
        featuredGames={featuredGames}
        loading={loading}
      />

      {/* Top Contributors Section */}
      <TopContributorsSection topContributors={topContributors} loading={loading} />

      {/* Call to Action */}
      <CallToActionSection />
    </div>
  )
}

