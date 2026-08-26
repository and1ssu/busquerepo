import { useEffect } from 'react'
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom'
import { Icon } from './Icon'
import { SearchForm } from './SearchForm'

function Brand() {
  return (
    <Link aria-label="Busquerepo — página inicial" className="brand" to="/">
      <span className="brand__mark">
        <Icon name="github" size={23} />
      </span>
      <span>Busquerepo</span>
    </Link>
  )
}

export function Layout() {
  const location = useLocation()
  const userMatch = useMatch('/users/:username/*')
  const isHome = location.pathname === '/'
  const currentUsername = userMatch?.params.username ?? ''

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Brand />
          {!isHome ? (
            <div className="header-search">
              <SearchForm
                initialValue={currentUsername}
                key={currentUsername}
              />
            </div>
          ) : (
            <a
              className="header-github-link"
              href="https://github.com"
              rel="noreferrer"
              target="_blank"
            >
              GitHub
              <Icon name="external-link" size={15} />
            </a>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <p>Busquerepo · Dados públicos fornecidos pela API do GitHub.</p>
        </div>
      </footer>
    </div>
  )
}
