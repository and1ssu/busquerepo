const compactNumberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 1,
  notation: 'compact',
})

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const relativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', {
  numeric: 'auto',
})

export function formatCompactNumber(value: number) {
  return compactNumberFormatter.format(value)
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

export function formatRelativeDate(value: string) {
  const date = new Date(value)
  const elapsedDays = Math.round(
    (date.getTime() - Date.now()) / (1_000 * 60 * 60 * 24),
  )

  if (Math.abs(elapsedDays) < 30) {
    return relativeTimeFormatter.format(elapsedDays, 'day')
  }

  const elapsedMonths = Math.round(elapsedDays / 30)
  if (Math.abs(elapsedMonths) < 12) {
    return relativeTimeFormatter.format(elapsedMonths, 'month')
  }

  return relativeTimeFormatter.format(Math.round(elapsedDays / 365), 'year')
}

export function formatRepositorySize(sizeInKilobytes: number) {
  if (sizeInKilobytes < 1_024) return `${sizeInKilobytes} KB`
  return `${(sizeInKilobytes / 1_024).toFixed(1)} MB`
}

export function normalizeExternalUrl(value: string) {
  if (!value) return ''
  return /^https?:\/\//i.test(value) ? value : `https://${value}`
}
