import { Link, useParams } from 'react-router-dom'
import { GitHubApiError } from '../api/github'
import { ErrorState, PageLoading } from '../components/AsyncStates'
import { Icon } from '../components/Icon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { useGitHubRepository } from '../hooks/useGitHubData'
import {
  formatCompactNumber,
  formatDate,
  formatRepositorySize,
  normalizeExternalUrl,
} from '../utils/format'

export default function RepositoryPage() {
  const { repository = '', username = '' } = useParams()
  const { data, error, isLoading, retry } = useGitHubRepository(
    username,
    repository,
  )

  useDocumentTitle(data?.full_name ?? repository)

  if (isLoading) {
    return <PageLoading label={`Carregando ${username}/${repository}`} />
  }

  if (error || !data) {
    const isNotFound = error instanceof GitHubApiError && error.status === 404
    return (
      <ErrorState
        message={error?.message ?? 'Repositório não encontrado.'}
        onRetry={retry}
        title={
          isNotFound ? 'Repositório não encontrado' : 'Projeto indisponível'
        }
      />
    )
  }

  const homepage = normalizeExternalUrl(data.homepage ?? '')

  return (
    <section className="repository-page">
      <div className="container repository-page__container">
        <nav aria-label="Navegação estrutural" className="breadcrumbs">
          <Link to={`/users/${encodeURIComponent(username)}`}>
            <Icon name="chevron-left" size={17} />
            Repositórios de {username}
          </Link>
        </nav>

        <div className="repository-detail">
          <div className="repository-detail__top">
            <div>
              <div className="repository-detail__title">
                <Icon name="book" size={25} />
                <h1>{data.name}</h1>
              </div>
              <div className="repository-detail__badges">
                <span>
                  {data.visibility === 'public' ? 'Público' : data.visibility}
                </span>
                {data.fork ? <span>Fork</span> : null}
                {data.archived ? <span>Arquivado</span> : null}
              </div>
            </div>
            <a
              className="button button--primary"
              href={data.html_url}
              rel="noreferrer"
              target="_blank"
            >
              Abrir no GitHub
              <Icon name="external-link" size={17} />
            </a>
          </div>

          <p className="repository-detail__description">
            {data.description ?? 'Este repositório não possui uma descrição.'}
          </p>

          <dl className="repository-detail__stats">
            <div>
              <dt>
                <Icon name="star" size={18} /> Estrelas
              </dt>
              <dd>{formatCompactNumber(data.stargazers_count)}</dd>
            </div>
            <div>
              <dt>
                <Icon name="fork" size={18} /> Forks
              </dt>
              <dd>{formatCompactNumber(data.forks_count)}</dd>
            </div>
            <div>
              <dt>
                <Icon name="issue" size={18} /> Issues abertas
              </dt>
              <dd>{formatCompactNumber(data.open_issues_count)}</dd>
            </div>
          </dl>

          <div className="repository-detail__content row g-5">
            <div className="col-lg-7">
              <h2>Sobre o projeto</h2>
              <dl className="repository-facts">
                <div>
                  <dt>Linguagem principal</dt>
                  <dd>{data.language ?? 'Não informada'}</dd>
                </div>
                <div>
                  <dt>Branch padrão</dt>
                  <dd>
                    <code>{data.default_branch}</code>
                  </dd>
                </div>
                <div>
                  <dt>Licença</dt>
                  <dd>{data.license?.name ?? 'Não informada'}</dd>
                </div>
                <div>
                  <dt>Tamanho</dt>
                  <dd>{formatRepositorySize(data.size)}</dd>
                </div>
                <div>
                  <dt>Criado em</dt>
                  <dd>{formatDate(data.created_at)}</dd>
                </div>
                <div>
                  <dt>Atualizado em</dt>
                  <dd>{formatDate(data.updated_at)}</dd>
                </div>
              </dl>
            </div>

            <aside className="col-lg-5">
              <div className="repository-links">
                <h2>Links</h2>
                <a href={data.html_url} rel="noreferrer" target="_blank">
                  <span>
                    <Icon name="github" size={19} /> Código-fonte
                  </span>
                  <Icon name="external-link" size={16} />
                </a>
                {homepage ? (
                  <a href={homepage} rel="noreferrer" target="_blank">
                    <span>
                      <Icon name="link" size={19} /> Site do projeto
                    </span>
                    <Icon name="external-link" size={16} />
                  </a>
                ) : null}
              </div>
            </aside>
          </div>

          {data.topics.length > 0 ? (
            <div className="repository-topics">
              <h2>Tópicos</h2>
              <ul>
                {data.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
