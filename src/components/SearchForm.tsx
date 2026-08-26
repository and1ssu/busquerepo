import { useEffect, useId, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { githubApi } from '../api/github'
import type { GitHubUserSearchResult } from '../types/github'
import { Icon } from './Icon'

const GITHUB_USERNAME_PATTERN = /^(?!.*--)[a-z\d](?:[a-z\d-]{0,37}[a-z\d])?$/i
const GITHUB_USERNAME_QUERY_PATTERN = /^[a-z\d-]{3,39}$/i
const SEARCH_DEBOUNCE_MS = 700
const RATE_LIMIT_MESSAGE =
  'Limite de buscas do GitHub atingido. Aguarde alguns minutos e tente novamente.'

function isRateLimitError(error: unknown) {
  if (typeof error !== 'object' || error === null || !('status' in error)) {
    return false
  }

  const { status } = error as { status?: unknown }
  return status === 403 || status === 429
}

interface SearchFormProps {
  autoFocus?: boolean
  initialValue?: string
  variant?: 'compact' | 'hero'
}

interface CachedSuggestions {
  hasMore: boolean
  items: GitHubUserSearchResult[]
  page: number
}

export function SearchForm({
  autoFocus = false,
  initialValue = '',
  variant = 'compact',
}: SearchFormProps) {
  const [username, setUsername] = useState(initialValue)
  const [error, setError] = useState('')
  const [suggestions, setSuggestions] = useState<GitHubUserSearchResult[]>([])
  const [suggestionStatus, setSuggestionStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [suggestionErrorMessage, setSuggestionErrorMessage] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMoreSuggestions, setHasMoreSuggestions] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [loadMoreErrorMessage, setLoadMoreErrorMessage] = useState('')
  const componentId = useId()
  const suggestionCache = useRef(new Map<string, CachedSuggestions>())
  const isLoadingMoreRef = useRef(false)
  const loadMoreControllerRef = useRef<AbortController | null>(null)
  const latestQueryRef = useRef(initialValue.trim())
  const navigate = useNavigate()
  const normalizedUsername = username.trim()
  const canSuggest = GITHUB_USERNAME_QUERY_PATTERN.test(normalizedUsername)
  const inputId = `github-user-${componentId}`
  const errorId = `github-user-error-${componentId}`
  const listboxId = `github-user-suggestions-${componentId}`
  const activeSuggestionId =
    activeSuggestion >= 0
      ? `${listboxId}-option-${suggestions[activeSuggestion]?.id}`
      : undefined
  const showSuggestions = isDropdownOpen && canSuggest

  useEffect(() => {
    if (!canSuggest || !isDropdownOpen) return

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      const cacheKey = normalizedUsername.toLowerCase()
      const cachedSuggestions = suggestionCache.current.get(cacheKey)

      if (cachedSuggestions) {
        setSuggestions(cachedSuggestions.items)
        setCurrentPage(cachedSuggestions.page)
        setHasMoreSuggestions(cachedSuggestions.hasMore)
        setSuggestionErrorMessage('')
        setSuggestionStatus('success')
        return
      }

      setSuggestionErrorMessage('')
      setSuggestionStatus('loading')

      try {
        const result = await githubApi.searchUsers(
          normalizedUsername,
          1,
          controller.signal,
        )

        if (controller.signal.aborted) return

        suggestionCache.current.set(cacheKey, {
          hasMore: result.hasMore,
          items: result.items,
          page: 1,
        })
        setSuggestions(result.items)
        setCurrentPage(1)
        setHasMoreSuggestions(result.hasMore)
        setSuggestionStatus('success')
      } catch (error) {
        if (controller.signal.aborted) return
        setSuggestions([])
        setSuggestionErrorMessage(
          isRateLimitError(error)
            ? RATE_LIMIT_MESSAGE
            : 'Não foi possível carregar sugestões.',
        )
        setSuggestionStatus('error')
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
      loadMoreControllerRef.current?.abort()
    }
  }, [canSuggest, isDropdownOpen, normalizedUsername])

  async function loadMoreSuggestions() {
    if (
      !hasMoreSuggestions ||
      suggestionStatus !== 'success' ||
      isLoadingMoreRef.current
    ) {
      return
    }

    const requestedQuery = normalizedUsername
    const nextPage = currentPage + 1
    const controller = new AbortController()
    loadMoreControllerRef.current?.abort()
    loadMoreControllerRef.current = controller
    isLoadingMoreRef.current = true
    setIsLoadingMore(true)
    setLoadMoreErrorMessage('')

    try {
      const result = await githubApi.searchUsers(
        requestedQuery,
        nextPage,
        controller.signal,
      )

      if (
        controller.signal.aborted ||
        latestQueryRef.current !== requestedQuery
      ) {
        return
      }

      const knownIds = new Set(suggestions.map(({ id }) => id))
      const newItems = result.items.filter(({ id }) => !knownIds.has(id))
      const mergedSuggestions = [...suggestions, ...newItems]
      const cacheKey = requestedQuery.toLowerCase()

      suggestionCache.current.set(cacheKey, {
        hasMore: result.hasMore,
        items: mergedSuggestions,
        page: nextPage,
      })
      setSuggestions(mergedSuggestions)
      setCurrentPage(nextPage)
      setHasMoreSuggestions(result.hasMore)
    } catch (error) {
      if (!controller.signal.aborted) {
        setLoadMoreErrorMessage(
          isRateLimitError(error)
            ? RATE_LIMIT_MESSAGE
            : 'Não foi possível carregar mais usuários.',
        )
      }
    } finally {
      if (loadMoreControllerRef.current === controller) {
        isLoadingMoreRef.current = false
        setIsLoadingMore(false)
      }
    }
  }

  function handleSuggestionsScroll(
    event: React.UIEvent<HTMLDivElement>,
  ) {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= 48

    if (isNearBottom) void loadMoreSuggestions()
  }

  function selectUser(login: string) {
    setUsername(login)
    setSuggestions([])
    setSuggestionStatus('idle')
    setSuggestionErrorMessage('')
    setCurrentPage(0)
    setHasMoreSuggestions(false)
    setLoadMoreErrorMessage('')
    setIsDropdownOpen(false)
    setActiveSuggestion(-1)
    setError('')
    navigate(`/users/${encodeURIComponent(login)}`)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const normalizedUsername = username.trim()

    if (!GITHUB_USERNAME_PATTERN.test(normalizedUsername)) {
      setError('Digite um usuário válido do GitHub.')
      return
    }

    setError('')
    setIsDropdownOpen(false)
    navigate(`/users/${encodeURIComponent(normalizedUsername)}`)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showSuggestions) return

    if (event.key === 'ArrowDown' && suggestions.length > 0) {
      event.preventDefault()
      setActiveSuggestion((current) =>
        current >= suggestions.length - 1 ? 0 : current + 1,
      )
      return
    }

    if (event.key === 'ArrowUp' && suggestions.length > 0) {
      event.preventDefault()
      setActiveSuggestion((current) =>
        current <= 0 ? suggestions.length - 1 : current - 1,
      )
      return
    }

    if (event.key === 'Enter' && activeSuggestion >= 0) {
      event.preventDefault()
      selectUser(suggestions[activeSuggestion].login)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setIsDropdownOpen(false)
      setActiveSuggestion(-1)
    }
  }

  return (
    <form
      className={`search-form search-form--${variant}`}
      noValidate
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsDropdownOpen(false)
          setActiveSuggestion(-1)
        }
      }}
      onFocus={() => setIsDropdownOpen(true)}
      onSubmit={handleSubmit}
      role="search"
    >
      <label className="visually-hidden" htmlFor={inputId}>
        Usuário do GitHub
      </label>
      <div className="search-form__control">
        <Icon className="search-form__icon" name="search" size={20} />
        <input
          aria-activedescendant={activeSuggestionId}
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-describedby={error ? errorId : undefined}
          aria-expanded={showSuggestions}
          aria-haspopup="listbox"
          aria-invalid={Boolean(error)}
          autoCapitalize="none"
          autoComplete="off"
          autoCorrect="off"
          autoFocus={autoFocus}
          id={inputId}
          onChange={(event) => {
            latestQueryRef.current = event.target.value.trim()
            setUsername(event.target.value)
            setSuggestions([])
            setSuggestionStatus('idle')
            setSuggestionErrorMessage('')
            setCurrentPage(0)
            setHasMoreSuggestions(false)
            setLoadMoreErrorMessage('')
            loadMoreControllerRef.current?.abort()
            isLoadingMoreRef.current = false
            setIsLoadingMore(false)
            setIsDropdownOpen(true)
            setActiveSuggestion(-1)
            if (error) setError('')
          }}
          onKeyDown={handleKeyDown}
          placeholder="Digite um usuário do GitHub"
          role="combobox"
          spellCheck="false"
          type="search"
          value={username}
        />
        <button type="submit">
          <span>Buscar</span>
          <Icon name="arrow-right" size={18} />
        </button>
      </div>
      {showSuggestions ? (
        <div
          className="search-form__suggestions"
          onScroll={handleSuggestionsScroll}
        >
          {suggestionStatus === 'loading' ? (
            <p aria-live="polite" className="search-form__suggestion-status">
              Buscando usuários…
            </p>
          ) : null}
          {suggestionStatus === 'error' ? (
            <p className="search-form__suggestion-status" role="status">
              {suggestionErrorMessage}
            </p>
          ) : null}
          {suggestionStatus === 'success' && suggestions.length === 0 ? (
            <p className="search-form__suggestion-status" role="status">
              Nenhum usuário encontrado.
            </p>
          ) : null}
          {suggestions.length > 0 ? (
            <ul aria-label="Sugestões de usuários" id={listboxId} role="listbox">
              {suggestions.map((suggestion, index) => (
                <li
                  aria-selected={activeSuggestion === index}
                  className={
                    activeSuggestion === index
                      ? 'search-form__suggestion search-form__suggestion--active'
                      : 'search-form__suggestion'
                  }
                  id={`${listboxId}-option-${suggestion.id}`}
                  key={suggestion.id}
                  onClick={() => selectUser(suggestion.login)}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  role="option"
                >
                  <img alt="" src={suggestion.avatar_url} />
                  <span>
                    <strong>{suggestion.login}</strong>
                    <small>
                      {suggestion.type === 'Organization'
                        ? 'Organização'
                        : 'Usuário'}
                    </small>
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
          {isLoadingMore ? (
            <p aria-live="polite" className="search-form__suggestion-status">
              Carregando mais usuários…
            </p>
          ) : null}
          {loadMoreErrorMessage ? (
            <p className="search-form__suggestion-status" role="status">
              {loadMoreErrorMessage}
            </p>
          ) : null}
        </div>
      ) : null}
      {error ? (
        <p className="search-form__error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  )
}
