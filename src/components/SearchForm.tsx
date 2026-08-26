import { useId, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from './Icon'

const GITHUB_USERNAME_PATTERN = /^(?!.*--)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i

interface SearchFormProps {
  autoFocus?: boolean
  initialValue?: string
  variant?: 'compact' | 'hero'
}

export function SearchForm({
  autoFocus = false,
  initialValue = '',
  variant = 'compact',
}: SearchFormProps) {
  const [username, setUsername] = useState(initialValue)
  const [error, setError] = useState('')
  const errorId = useId()
  const navigate = useNavigate()

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedUsername = username.trim()

    if (!GITHUB_USERNAME_PATTERN.test(normalizedUsername)) {
      setError('Digite um usuário válido do GitHub.')
      return
    }

    setError('')
    navigate(`/users/${encodeURIComponent(normalizedUsername)}`)
  }

  return (
    <form
      className={`search-form search-form--${variant}`}
      noValidate
      onSubmit={handleSubmit}
      role="search"
    >
      <label className="visually-hidden" htmlFor={`github-user-${errorId}`}>
        Usuário do GitHub
      </label>
      <div className="search-form__control">
        <Icon className="search-form__icon" name="search" size={20} />
        <input
          aria-describedby={error ? errorId : undefined}
          aria-invalid={Boolean(error)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          id={`github-user-${errorId}`}
          onChange={(event) => {
            setUsername(event.target.value)
            if (error) setError('')
          }}
          placeholder="Digite um usuário do GitHub"
          spellCheck="false"
          type="search"
          value={username}
        />
        <button type="submit">
          <span>Buscar</span>
          <Icon name="arrow-right" size={18} />
        </button>
      </div>
      {error ? (
        <p className="search-form__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
