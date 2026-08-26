import { describe, expect, it } from 'vitest'
import type { GitHubRepository } from '../types/github'
import { sortRepositories } from './repositories'

function repository(
  name: string,
  stars: number,
  updatedAt = '2026-01-01T00:00:00Z',
): GitHubRepository {
  return {
    archived: false,
    created_at: '2025-01-01T00:00:00Z',
    default_branch: 'main',
    description: null,
    disabled: false,
    fork: false,
    forks_count: 0,
    full_name: `octocat/${name}`,
    homepage: null,
    html_url: `https://github.com/octocat/${name}`,
    id: name.charCodeAt(0),
    language: 'TypeScript',
    license: null,
    name,
    open_issues_count: 0,
    owner: {
      avatar_url: 'https://avatars.githubusercontent.com/u/1',
      html_url: 'https://github.com/octocat',
      login: 'octocat',
    },
    pushed_at: updatedAt,
    size: 100,
    stargazers_count: stars,
    topics: [],
    updated_at: updatedAt,
    visibility: 'public',
    watchers_count: stars,
  }
}

describe('sortRepositories', () => {
  const repositories = [
    repository('zebra', 2, '2026-01-03T00:00:00Z'),
    repository('alpha', 20, '2026-01-01T00:00:00Z'),
    repository('beta', 20, '2026-01-02T00:00:00Z'),
  ]

  it('ordena por estrelas decrescentes e usa o nome como desempate', () => {
    expect(
      sortRepositories(repositories, 'stars-desc').map(({ name }) => name),
    ).toEqual(['alpha', 'beta', 'zebra'])
  })

  it('suporta as demais opções sem alterar o array original', () => {
    expect(
      sortRepositories(repositories, 'stars-asc').map(({ name }) => name),
    ).toEqual(['zebra', 'alpha', 'beta'])
    expect(
      sortRepositories(repositories, 'updated-desc').map(({ name }) => name),
    ).toEqual(['zebra', 'beta', 'alpha'])
    expect(
      sortRepositories(repositories, 'name-asc').map(({ name }) => name),
    ).toEqual(['alpha', 'beta', 'zebra'])
    expect(repositories.map(({ name }) => name)).toEqual([
      'zebra',
      'alpha',
      'beta',
    ])
  })
})
