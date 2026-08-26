import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { SearchForm } from './SearchForm'

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
  it('exibe uma mensagem para nomes de usuário inválidos', async () => {
    const user = userEvent.setup()
    renderSearchForm()

    await user.type(screen.getByRole('searchbox'), '-usuario-invalido')
    await user.click(screen.getByRole('button', { name: /buscar/i }))

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Digite um usuário válido do GitHub.',
    )
    expect(screen.getByLabelText('Rota atual')).toHaveTextContent('/')
  })

  it('navega para o perfil informado', async () => {
    const user = userEvent.setup()
    renderSearchForm()

    await user.type(screen.getByRole('searchbox'), 'octocat')
    await user.click(screen.getByRole('button', { name: /buscar/i }))

    expect(screen.getByLabelText('Rota atual')).toHaveTextContent(
      '/users/octocat',
    )
  })
})
