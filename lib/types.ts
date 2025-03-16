export type Snippet = {
  id: string
  title: string
  description: string
  language: string
  code: string
  created_at: string
  updated_at: string
  user_id: string
  user: {
    username: string
    avatar_url: string
  }
}

export type UserProfile = {
  id: string
  username: string
  avatar_url: string
  bio: string
  created_at: string
  updated_at: string
  website: string,
  twitter: string,
  github: string
}

export type Tutorial = {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  author: {
    id: string
    username: string
    avatar_url: string
  }
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  read_time: number
}

export type Game = {
  id: string
  title: string
  slug: string
  description: string
  content: string
  screenshots: string[]
  coverImage: string
  author: {
    id: string
    username: string
    avatar_url: string
  }
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  download_url: string
  download_count: number
  size_mb: number
  version: string
}

export type DonationMethod = {
  id: string
  name: string
  description: string
  icon: string
  url: string
}

export type FeaturedDeveloper = {
  id: string
  username: string
  avatar_url: string
  bio: string
  projects: string[]
  donation_url: string
}

