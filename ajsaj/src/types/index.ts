export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  cover_image?: string
  author_id: string
  author_name: string
  author_avatar?: string
  category: string
  tags: string[]
  published: boolean
  view_count: number
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  post_id: string
  user_id: string
  user_name: string
  user_email: string
  content: string
  parent_id?: string
  created_at: string
  updated_at: string
}

export interface PortfolioItem {
  id: string
  title: string
  description: string
  project_url?: string
  github_url?: string
  image_url?: string
  technologies: string[]
  featured: boolean
  order: number
  created_at: string
  updated_at: string
}