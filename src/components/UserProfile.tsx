import type { GitHubUser } from '../types/github'
import { formatCompactNumber, normalizeExternalUrl } from '../utils/format'
import { Icon } from './Icon'

export function UserProfile({ user }: { user: GitHubUser }) {
  const externalBlog = normalizeExternalUrl(user.blog)

  return (
    <aside className="profile-card">
      <div className="profile-card__identity">
        <img
          alt={`Avatar de ${user.name ?? user.login}`}
          className="profile-card__avatar"
          height="176"
          src={user.avatar_url}
          width="176"
        />
        <div>
          <h1>{user.name ?? user.login}</h1>
          <a href={user.html_url} rel="noreferrer" target="_blank">
            @{user.login}
          </a>
        </div>
      </div>

      {user.bio ? (
        <p className="profile-card__bio">{user.bio}</p>
      ) : (
        <p className="profile-card__bio profile-card__muted">
          Este perfil ainda não possui uma bio.
        </p>
      )}

      <dl className="profile-stats">
        <div>
          <dt>Seguidores</dt>
          <dd>{formatCompactNumber(user.followers)}</dd>
        </div>
        <div>
          <dt>Seguindo</dt>
          <dd>{formatCompactNumber(user.following)}</dd>
        </div>
        <div>
          <dt>Repositórios</dt>
          <dd>{formatCompactNumber(user.public_repos)}</dd>
        </div>
      </dl>

      <ul className="profile-details">
        {user.company ? (
          <li>
            <Icon name="company" size={18} />
            <span>{user.company}</span>
          </li>
        ) : null}
        {user.location ? (
          <li>
            <Icon name="map-pin" size={18} />
            <span>{user.location}</span>
          </li>
        ) : null}
        {user.email ? (
          <li>
            <Icon name="mail" size={18} />
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </li>
        ) : null}
        {externalBlog ? (
          <li>
            <Icon name="link" size={18} />
            <a href={externalBlog} rel="noreferrer" target="_blank">
              {user.blog.replace(/^https?:\/\//, '').replace(/\/$/, '')}
            </a>
          </li>
        ) : null}
      </ul>

      <a
        className="button button--secondary button--full"
        href={user.html_url}
        rel="noreferrer"
        target="_blank"
      >
        Ver perfil no GitHub
        <Icon name="external-link" size={17} />
      </a>
    </aside>
  )
}
