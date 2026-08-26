import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { githubApi } from '../api/github'
import type {
  GitHubRepository,
  GitHubUserData,
} from '../types/github'

interface AsyncState<T> {
  data: T | null
  error: Error | null
  requestId: string
}

const initialState = {
  data: null,
  error: null,
  requestId: '',
} as const

export function useGitHubUserData(username: string) {
  const [state, setState] = useState<AsyncState<GitHubUserData>>(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const requestId = `${username}:${requestVersion}`

  useEffect(() => {
    const controller = new AbortController()

    Promise.all([
      githubApi.getUser(username, controller.signal),
      githubApi.getUserRepositories(username, controller.signal),
    ])
      .then(([user, repositories]) => {
        setState({
          data: { repositories, user },
          error: null,
          requestId,
        })
      })
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return
        setState({
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          requestId,
        })
      })

    return () => controller.abort()
  }, [requestId, username])

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  const isCurrentRequest = state.requestId === requestId

  return {
    data: isCurrentRequest ? state.data : null,
    error: isCurrentRequest ? state.error : null,
    isLoading: !isCurrentRequest,
    retry,
  }
}

export function useGitHubRepository(owner: string, repository: string) {
  const [state, setState] =
    useState<AsyncState<GitHubRepository>>(initialState)
  const [requestVersion, setRequestVersion] = useState(0)
  const requestId = `${owner}/${repository}:${requestVersion}`

  useEffect(() => {
    const controller = new AbortController()

    githubApi
      .getRepository(owner, repository, controller.signal)
      .then((data) => {
        setState({ data, error: null, requestId })
      })
      .catch((error: unknown) => {
        if (axios.isCancel(error)) return
        setState({
          data: null,
          error: error instanceof Error ? error : new Error(String(error)),
          requestId,
        })
      })

    return () => controller.abort()
  }, [owner, repository, requestId])

  const retry = useCallback(() => {
    setRequestVersion((version) => version + 1)
  }, [])

  const isCurrentRequest = state.requestId === requestId

  return {
    data: isCurrentRequest ? state.data : null,
    error: isCurrentRequest ? state.error : null,
    isLoading: !isCurrentRequest,
    retry,
  }
}
