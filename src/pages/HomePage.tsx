import { Link } from 'react-router-dom'
import { SearchForm } from '../components/SearchForm'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function HomePage() {
  useDocumentTitle()

  return (
    <section className="home-hero">
      <div className="container home-hero__content">
        <p className="eyebrow">Consulta de repositórios</p>
        <h1>Explore perfis do GitHub</h1>
        <p className="home-hero__lead">
          Busque um usuário e veja seus repositórios públicos ordenados por
          popularidade.
        </p>

        <SearchForm autoFocus variant="hero" />

        <p className="home-hero__hint">
          Exemplo: <Link to="/users/and1ssu">and1ssu</Link>
        </p>

        <div className="home-features" aria-label="Recursos disponíveis">
          <span>Perfil completo</span>
          <span>Ordenação por estrelas</span>
          <span>Detalhes do repositório</span>
        </div>
      </div>
    </section>
  )
}
