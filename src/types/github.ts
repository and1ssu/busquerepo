export interface GitHubUser {
  avatar_url: string
  bio: string | null
  blog: string
  company: string | null
  email: string | null
  followers: number
  following: number
  html_url: string
  location: string | null
  login: string
  name: string | null
  public_repos: number
}

export interface GitHubLicense {
  key: string
  name: string
  spdx_id: string | null
}

export interface GitHubRepository {
  archived: boolean
  created_at: string
  default_branch: string
  description: string | null
  disabled: boolean
  fork: boolean
  forks_count: number
  full_name: string
  homepage: string | null
  html_url: string
  id: number
  language: string | null
  license: GitHubLicense | null
  name: string
  open_issues_count: number
  owner: {
    avatar_url: string
    html_url: string
    login: string
  }
  pushed_at: string
  size: number
  stargazers_count: number
  topics: string[]
  updated_at: string
  visibility: string
  watchers_count: number
}

export type RepositorySort =
  | 'stars-desc'
  | 'stars-asc'
  | 'updated-desc'
  | 'name-asc'

export interface GitHubUserData {
  repositories: GitHubRepository[]
  user: GitHubUser
}
