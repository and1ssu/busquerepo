import { act, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { githubApi } from '../api/github'
import { SearchForm } from './SearchForm'

vi.mock('../api/github', () => ({
  githubApi: {
    searchUsers: vi.fn(),
  },
}))

function CurrentLocation() {
  const location = useLocation()
  return <output aria-label="Rota atual">{location.pathname}</output>
}

function renderSearchForm() {
  return render(
    <MemoryRouter>
      <SearchForm variant="hero" />
      <CurrentLocation />
    </MemoryRouter>,
  )
}

describe('SearchForm', () => {
  beforeEach(() => {
    vi.mocked(githubApi.searchUsers).mockReset()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exibe uma mensagem para nomes de usuário inválidos', async () => {
    const user = userEvent.setup()
    renderSearchForm()

    await user.type(screen.getByRole('combobox'), '-usuario-invalido')
    await user.click(screen.getByRole('button', { name: /buscar/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Digite um usuário válido do GitHub.',
    )
    expect(screen.getByLabelText('Rota atual')).toHaveTextContent('/')
  })

  it('navega para o perfil informado', async () => {
    const user = userEvent.setup()
    renderSearchForm()

    await user.type(screen.getByRole('combobox'), 'octocat')
    await user.click(screen.getByRole('button', { name: /buscar/i }))

    expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
      '/users/octocat',
    )
  })

  it('busca e exibe sugestões somente após o debounce', async () => {
    vi.useFakeTimers()
    vi.mocked(githubApi.searchUsers).mockResolvedValue({
      hasMore: false,
      items: [
        {
          avatar_url: 'https://avatars.githubusercontent.com/u/1',
          id: 1,
          login: 'octocat',
          type: 'User',
        },
      ],
    })
    renderSearchForm()

    const input = screen.getByRole('combobox', {
      name: 'Usuário do GitHub',
    })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'oct' } })
    act(() => vi.advanceTimersByTime(600))
    fireEvent.change(input, { target: { value: 'octo' } })
    act(() => vi.advanceTimersByTime(699))

    expect(githubApi.searchUsers).not.toHaveBeenCalled()

    await act(async () => {
      vi.advanceTimersByTime(1)
      await Promise.resolve()
    })

    expect(githubApi.searchUsers).toHaveBeenCalledOnce()
    expect(githubApi.searchUsers).toHaveBeenCalledWith(
      'octo',
      1,
      expect.any(AbortSignal),
    )
    expect(
      screen.getByRole('option', { name: /octocat/i }),
    ).toBeInTheDocument()

    fireEvent.mouseDown(screen.getByRole('option', { name: /octocat/i }))
    fireEvent.click(screen.getByRole('option', { name: /octocat/i }))

    expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
      '/users/octocat',
    )
  })

  it('carrega a próxima página ao chegar ao fim das sugestões', async () => {
    vi.useFakeTimers()
    const firstPage = Array.from({ length: 10 }, (_, index) => ({
      avatar_url: `https://avatars.githubusercontent.com/u/${index + 1}`,
      id: index + 1,
      login: `usuario-${index + 1}`,
      type: 'User',
    }))
    vi.mocked(githubApi.searchUsers)
      .mockResolvedValueOnce({ hasMore: true, items: firstPage })
      .mockResolvedValueOnce({
        hasMore: false,
        items: [
          {
            avatar_url: 'https://avatars.githubusercontent.com/u/11',
            id: 11,
            login: 'usuario-11',
            type: 'User',
          },
        ],
      })
    renderSearchForm()

    const input = screen.getByRole('combobox', {
      name: 'Usuário do GitHub',
    })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'usuario' } })

    await act(async () => {
      vi.advanceTimersByTime(700)
      await Promise.resolve()
    })

    const suggestionsPanel = screen.getByRole('listbox').parentElement!
    Object.defineProperties(suggestionsPanel, {
      clientHeight: { configurable: true, value: 300 },
      scrollHeight: { configurable: true, value: 600 },
      scrollTop: { configurable: true, value: 260, writable: true },
    })

    await act(async () => {
      fireEvent.scroll(suggestionsPanel)
      await Promise.resolve()
    })

    expect(githubApi.searchUsers).toHaveBeenNthCalledWith(
      2,
      'usuario',
      2,
      expect.any(AbortSignal),
    )
    expect(
      screen.getByRole('option', { name: /usuario-11/i }),
    ).toBeInTheDocument()
  })

  it('orienta o usuário quando o limite de buscas é atingido', async () => {
    vi.useFakeTimers()
    vi.mocked(githubApi.searchUsers).mockRejectedValue({ status: 429 })
    renderSearchForm()

    const input = screen.getByRole('combobox', {
      name: 'Usuário do GitHub',
    })
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'octocat' } })

    await act(async () => {
      vi.advanceTimersByTime(700)
      await Promise.resolve()
    })

    expect(
      screen.getByText(
        'Limite de buscas do GitHub atingido. Aguarde alguns minutos e tente novamente.',
      ),
    ).toBeInTheDocument()
  })
})
