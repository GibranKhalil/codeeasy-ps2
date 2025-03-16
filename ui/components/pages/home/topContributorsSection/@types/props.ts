import type { mockTopContributors } from "@/lib/mock-data";

export interface TopContributorsSectionProps{
    topContributors: typeof mockTopContributors
    isLoading: boolean
}