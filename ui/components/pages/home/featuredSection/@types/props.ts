import type { mockGames, mockSnippets, mockTutorials } from "@/lib/mock-data";

export interface FeaturedSectionProps {
    featuredTutorials: typeof mockTutorials,
    featuredSnippets: typeof mockSnippets
    featuredGames: typeof mockGames
    isLoading: boolean
}