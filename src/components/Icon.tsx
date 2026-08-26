import type { SVGProps } from 'react'

export type IconName =
  | 'alert'
  | 'arrow-right'
  | 'book'
  | 'calendar'
  | 'chevron-left'
  | 'code'
  | 'company'
  | 'external-link'
  | 'fork'
  | 'github'
  | 'issue'
  | 'link'
  | 'mail'
  | 'map-pin'
  | 'search'
  | 'star'
  | 'users'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height={size}
      viewBox="0 0 24 24"
      width={size}
      {...props}
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      >
        {name === 'search' ? (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-4-4" />
          </>
        ) : null}
        {name === 'arrow-right' ? (
          <>
            <path d="M5 12h14" />
            <path d="m14 7 5 5-5 5" />
          </>
        ) : null}
        {name === 'chevron-left' ? <path d="m15 18-6-6 6-6" /> : null}
        {name === 'star' ? (
          <path d="m12 3 2.78 5.63 6.22.9-4.5 4.39 1.06 6.2L12 17.2l-5.56 2.92 1.06-6.2L3 9.53l6.22-.9L12 3Z" />
        ) : null}
        {name === 'users' ? (
          <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </>
        ) : null}
        {name === 'book' ? (
          <>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
          </>
        ) : null}
        {name === 'map-pin' ? (
          <>
            <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.5" />
          </>
        ) : null}
        {name === 'mail' ? (
          <>
            <rect height="16" rx="2" width="20" x="2" y="4" />
            <path d="m22 7-10 6L2 7" />
          </>
        ) : null}
        {name === 'link' ? (
          <>
            <path d="M10 13a5 5 0 0 0 7.07.07l2-2a5 5 0 0 0-7.07-7.07l-1.15 1.15" />
            <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" />
          </>
        ) : null}
        {name === 'company' ? (
          <>
            <path d="M3 21h18M5 21V7l7-4v18M19 21V11l-7-4" />
            <path d="M8 10h1M8 14h1M8 18h1M15 14h1M15 18h1" />
          </>
        ) : null}
        {name === 'fork' ? (
          <>
            <circle cx="6" cy="4" r="2" />
            <circle cx="18" cy="4" r="2" />
            <circle cx="12" cy="20" r="2" />
            <path d="M6 6v3c0 2 2 3 4 3h2M18 6v3c0 2-2 3-4 3h-2v6" />
          </>
        ) : null}
        {name === 'issue' ? (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4M12 16h.01" />
          </>
        ) : null}
        {name === 'calendar' ? (
          <>
            <rect height="18" rx="2" width="18" x="3" y="4" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </>
        ) : null}
        {name === 'code' ? <path d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14" /> : null}
        {name === 'external-link' ? (
          <>
            <path d="M14 3h7v7M10 14 21 3" />
            <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
          </>
        ) : null}
        {name === 'alert' ? (
          <>
            <path d="M10.3 3.8 2.2 18a2 2 0 0 0 1.74 3h16.12a2 2 0 0 0 1.74-3L13.7 3.8a2 2 0 0 0-3.4 0Z" />
            <path d="M12 9v4M12 17h.01" />
          </>
        ) : null}
        {name === 'github' ? (
          <path d="M15 22v-3.9c.04-1-.35-2-1.1-2.7 3.6-.4 7.4-1.77 7.4-8a6.25 6.25 0 0 0-1.67-4.34A5.8 5.8 0 0 0 19.47.5S18.15.07 15 2.16a15 15 0 0 0-6 0C5.85.07 4.53.5 4.53.5a5.8 5.8 0 0 0-.16 2.56A6.25 6.25 0 0 0 2.7 7.4c0 6.22 3.8 7.6 7.4 8-.74.69-1.13 1.66-1.1 2.66V22M9 19c-3 .93-3-1.5-4.2-2" />
        ) : null}
      </g>
    </svg>
  )
}
