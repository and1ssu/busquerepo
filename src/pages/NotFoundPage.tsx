import { Link } from 'react-router-dom'
import { Icon } from '../components/Icon'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Página não encontrada')

  return (
    <section className="not-found container">
      <p className="not-found__code">404</p>
      <p className="eyebrow">Fora do radar</p>
      <h1>Essa página não existe.</h1>
      <p>O endereço pode ter mudado ou nunca ter existido.</p>
      <Link className="button button--primary" to="/">
        Voltar ao início
        <Icon name="arrow-right" size={18} />
      </Link>
    </section>
  )
}
