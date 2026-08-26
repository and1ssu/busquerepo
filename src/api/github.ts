import axios from 'axios'
import type { AxiosError } from 'axios'
import type {
  GitHubRepository,
  GitHubUser,
  GitHubUserSearchResult,
} from '../types/github'

const PER_PAGE = 100
const USER_SUGGESTION_LIMIT = 10
const SEARCH_RESULT_LIMIT = 1_000

interface GitHubUserSearchResponse {
  items: GitHubUserSearchResult[]
  total_count: number
}

const client = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  },
  timeout: 12_000,
})

export class GitHubApiError extends Error {
  readonly status?: number
  readonly resetAt?: Date

  constructor(message: string, status?: number, resetAt?: Date) {
    super(message)
    this.name = 'GitHubApiError'
    this.status = status
    this.resetAt = resetAt
  }
}

function getRateLimitReset(error: AxiosError): Date | undefined {
  const reset = error.response?.headers['x-ratelimit-reset']
  if (!reset) return undefined

  const date = new Date(Number(reset) * 1_000)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function toGitHubApiError(error: unknown): GitHubApiError {
  if (!axios.isAxiosError(error)) {
    return new GitHubApiError('Ocorreu um erro inesperado. Tente novamente.')
  }

  if (!error.response) {
    return new GitHubApiError(
      'Não foi possível conectar ao GitHub. Verifique sua internet e tente novamente.',
    )
  }

  const status = error.response.status

  if (status === 404) {
    return new GitHubApiError('Não encontramos esse conteúdo no GitHub.', status)
  }

  if (status === 403 || status === 429) {
    return new GitHubApiError(
      'O limite de consultas públicas do GitHub foi atingido. Aguarde alguns minutos e tente novamente.',
      status,
      getRateLimitReset(error),
    )
  }

  if (status >= 500) {
    return new GitHubApiError(
      'O GitHub está temporariamente indisponível. Tente novamente em instantes.',
      status,
    )
  }

  return new GitHubApiError(
    'Não foi possível concluir a consulta. Tente novamente.',
    status,
  )
}

async function getUser(username: string, signal?: AbortSignal) {
  try {
    const response = await client.get<GitHubUser>(
      `/users/${encodeURIComponent(username)}`,
      { signal },
    )
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) throw error
    throw toGitHubApiError(error)
  }
}

async function searchUsers(
  query: string,
  page = 1,
  signal?: AbortSignal,
) {
  try {
    const response = await client.get<GitHubUserSearchResponse>(
      '/search/users',
      {
        params: {
          page,
          per_page: USER_SUGGESTION_LIMIT,
          q: `${query} in:login`,
        },
        signal,
      },
    )
    const availableResults = Math.min(
      response.data.total_count,
      SEARCH_RESULT_LIMIT,
    )

    return {
      hasMore: page * USER_SUGGESTION_LIMIT < availableResults,
      items: response.data.items,
    }
  } catch (error) {
    if (axios.isCancel(error)) throw error
    throw toGitHubApiError(error)
  }
}

async function getUserRepositories(username: string, signal?: AbortSignal) {
  const repositories: GitHubRepository[] = []
  let page = 1

  try {
    while (true) {
      const response = await client.get<GitHubRepository[]>(
        `/users/${encodeURIComponent(username)}/repos`,
        {
          params: { page, per_page: PER_PAGE, type: 'owner' },
          signal,
        },
      )

      repositories.push(...response.data)

      if (response.data.length < PER_PAGE) break
      page += 1
    }

    return repositories
  } catch (error) {
    if (axios.isCancel(error)) throw error
    throw toGitHubApiError(error)
  }
}

async function getRepository(
  owner: string,
  repository: string,
  signal?: AbortSignal,
) {
  try {
    const response = await client.get<GitHubRepository>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repository)}`,
      { signal },
    )
    return response.data
  } catch (error) {
    if (axios.isCancel(error)) throw error
    throw toGitHubApiError(error)
  }
}

export const githubApi = {
  getRepository,
  getUser,
  getUserRepositories,
  searchUsers,
}
