import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { GitHubApiError } from '../api/github'
import { ErrorState, PageLoading } from '../components/AsyncStates'
import { RepositoryCard } from '../components/RepositoryCard'
import { UserProfile } from '../components/UserProfile'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useGitHubUserData } from '../hooks/useGitHubData'
import {
  DEFAULT_REPOSITORY_SORT,
  isRepositorySort,
  REPOSITORY_SORT_OPTIONS,
  sortRepositories,
} from '../utils/repositories'

export default function UserPage() {
  const { username = '' } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const { data, error, isLoading, retry } = useGitHubUserData(username)
  const requestedSort = searchParams.get('sort')
  const sort = isRepositorySort(requestedSort)
    ? requestedSort
    : DEFAULT_REPOSITORY_SORT

  useDocumentTitle(data?.user.name ?? username)

  const sortedRepositories = useMemo(
    () => sortRepositories(data?.repositories ?? [], sort),
    [data?.repositories, sort],
  )

  if (isLoading) {
    return <PageLoading label={`Buscando @${username}`} />
  }

  if (error || !data) {
    const isNotFound = error instanceof GitHubApiError && error.status === 404
    return (
      <ErrorState
        message={error?.message ?? 'Usuário não encontrado.'}
        onRetry={retry}
        title={isNotFound ? 'Usuário não encontrado' : 'Perfil indisponível'}
      />
    )
  }

  function handleSortChange(value: string) {
    const nextParams = new URLSearchParams(searchParams)

    if (value === DEFAULT_REPOSITORY_SORT) {
      nextParams.delete('sort')
    } else {
      nextParams.set('sort', value)
    }

    setSearchParams(nextParams, { replace: true })
  }

  return (
    <section className="user-page">
      <div className="container">
        <div className="row g-4 g-xl-5 align-items-start">
          <div className="col-lg-4 col-xl-3">
            <UserProfile user={data.user} />
          </div>

          <div className="col-lg-8 col-xl-9">
            <div className="repository-heading">
              <div>
                <h2>Repositórios</h2>
                <p>
                  {data.repositories.length === 1
                    ? '1 projeto encontrado'
                    : `${data.repositories.length} projetos encontrados`}
                </p>
              </div>
              <div className="sort-control">
                <label htmlFor="repository-sort">Ordenar por</label>
                <select
                  id="repository-sort"
                  onChange={(event) => handleSortChange(event.target.value)}
                  value={sort}
                >
                  {REPOSITORY_SORT_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {sortedRepositories.length > 0 ? (
              <div className="repository-list">
                {sortedRepositories.map((item) => (
                  <RepositoryCard key={item.id} repository={item} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>Nenhum repositório público</h3>
                <p>Este usuário ainda não publicou projetos no GitHub.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
