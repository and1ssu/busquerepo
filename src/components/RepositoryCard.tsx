import { Link } from 'react-router-dom'
import type { GitHubRepository } from '../types/github'
import {
  formatCompactNumber,
  formatRelativeDate,
} from '../utils/format'
import { repositoryPath } from '../utils/repositories'
import { Icon } from './Icon'

const LANGUAGE_COLORS: Record<string, string> = {
  C: '#555555',
  'C#': '#178600',
  'C++': '#f34b7d',
  CSS: '#563d7c',
  Go: '#00add8',
  HTML: '#e34c26',
  Java: '#b07219',
  JavaScript: '#f1e05a',
  Kotlin: '#a97bff',
  PHP: '#4f5d95',
  Python: '#3572a5',
  Ruby: '#701516',
  Rust: '#dea584',
  Swift: '#f05138',
  TypeScript: '#3178c6',
}

export function RepositoryCard({
  repository,
}: {
  repository: GitHubRepository
}) {
  const languageColor = repository.language
    ? (LANGUAGE_COLORS[repository.language] ?? '#66766f')
    : undefined

  return (
    <article className="repository-card">
      <div className="repository-card__header">
        <div>
          <div className="repository-card__title-row">
            <Icon name="book" size={18} />
            <h3>
              <Link
                to={repositoryPath(
                  repository.owner.login,
                  repository.name,
                )}
              >
                {repository.name}
              </Link>
            </h3>
          </div>
          <div className="repository-card__badges">
            {repository.fork ? <span>Fork</span> : null}
            {repository.archived ? <span>Arquivado</span> : null}
          </div>
        </div>
        <span
          aria-label={`${repository.stargazers_count} estrelas`}
          className="repository-card__stars"
          title={`${repository.stargazers_count} estrelas`}
        >
          <Icon name="star" size={17} />
          {formatCompactNumber(repository.stargazers_count)}
        </span>
      </div>

      <p className="repository-card__description">
        {repository.description ?? 'Sem descrição disponível.'}
      </p>

      <div className="repository-card__footer">
        <div className="repository-card__meta">
          {repository.language ? (
            <span>
              <i style={{ backgroundColor: languageColor }} />
              {repository.language}
            </span>
          ) : null}
          <span title={`${repository.forks_count} forks`}>
            <Icon name="fork" size={15} />
            {formatCompactNumber(repository.forks_count)}
          </span>
          <span>Atualizado {formatRelativeDate(repository.updated_at)}</span>
        </div>
        <Link
          aria-label={`Ver detalhes de ${repository.name}`}
          className="repository-card__arrow"
          to={repositoryPath(repository.owner.login, repository.name)}
        >
          <Icon name="arrow-right" size={19} />
        </Link>
      </div>
    </article>
  )
}
