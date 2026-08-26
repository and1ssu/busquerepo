import type { GitHubRepository, RepositorySort } from '../types/github'

export const DEFAULT_REPOSITORY_SORT: RepositorySort = 'stars-desc'

export const REPOSITORY_SORT_OPTIONS: ReadonlyArray<{
  label: string
  value: RepositorySort
}> = [
  { label: 'Mais estrelas', value: 'stars-desc' },
  { label: 'Menos estrelas', value: 'stars-asc' },
  { label: 'Atualizados recentemente', value: 'updated-desc' },
  { label: 'Nome (A–Z)', value: 'name-asc' },
]

const validSorts = new Set<RepositorySort>(
  REPOSITORY_SORT_OPTIONS.map(({ value }) => value),
)

export function isRepositorySort(value: string | null): value is RepositorySort {
  return value !== null && validSorts.has(value as RepositorySort)
}

export function sortRepositories(
  repositories: GitHubRepository[],
  sort: RepositorySort,
) {
  return repositories.toSorted((first, second) => {
    switch (sort) {
      case 'stars-asc':
        return (
          first.stargazers_count - second.stargazers_count ||
          first.name.localeCompare(second.name)
        )
      case 'updated-desc':
        return (
          Date.parse(second.updated_at) - Date.parse(first.updated_at) ||
          first.name.localeCompare(second.name)
        )
      case 'name-asc':
        return first.name.localeCompare(second.name)
      case 'stars-desc':
        return (
          second.stargazers_count - first.stargazers_count ||
          first.name.localeCompare(second.name)
        )
    }
  })
}

export function repositoryPath(owner: string, repository: string) {
  return `/users/${encodeURIComponent(owner)}/repositories/${encodeURIComponent(repository)}`
}
