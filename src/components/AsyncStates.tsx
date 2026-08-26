import { Icon } from './Icon'

export function PageLoading({ label = 'Carregando dados' }: { label?: string }) {
  return (
    <div aria-live="polite" className="loading-state container" role="status">
      <span className="loading-state__spinner" />
      <p>{label}…</p>
    </div>
  )
}

interface ErrorStateProps {
  actionLabel?: string
  message: string
  onRetry?: () => void
  title?: string
}

export function ErrorState({
  actionLabel = 'Tentar novamente',
  message,
  onRetry,
  title = 'Algo saiu do radar',
}: ErrorStateProps) {
  return (
    <section className="error-state container" role="alert">
      <span className="error-state__icon">
        <Icon name="alert" size={28} />
      </span>
      <p className="eyebrow">Não foi possível carregar</p>
      <h1>{title}</h1>
      <p>{message}</p>
      {onRetry ? (
        <button className="button button--primary" onClick={onRetry} type="button">
          {actionLabel}
        </button>
      ) : null}
    </section>
  )
}
