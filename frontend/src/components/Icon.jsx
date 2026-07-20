function Icon({ name }) {
  const props = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    className: 'h-[18px] w-[18px]',
    'aria-hidden': true,
  }

  switch (name) {
    case 'home':
      return (
        <svg {...props}>
          <path d="M4 11.5 12 4l8 7.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z" />
        </svg>
      )
    case 'users':
      return (
        <svg {...props}>
          <path d="M9 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm7 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3ZM3 19a6 6 0 0 1 12 0M14 19a5 5 0 0 1 7 0" />
        </svg>
      )
    case 'bag':
      return (
        <svg {...props}>
          <path d="M6 8h12l-1 12H7L6 8Zm3 0a3 3 0 0 1 6 0" />
        </svg>
      )
    case 'receipt':
      return (
        <svg {...props}>
          <path d="M7 4h10v16l-2-1.5L13 20l-2-1.5L9 20l-2-1.5z" />
        </svg>
      )
    case 'cart':
      return (
        <svg {...props}>
          <path d="M4 5h2l2 11h9l2-7H7m0 12a1.5 1.5 0 1 0 0-.01M17 21a1.5 1.5 0 1 0 0-.01" />
        </svg>
      )
    case 'trend':
      return (
        <svg {...props}>
          <path d="m4 16 6-6 4 4 6-8" />
          <path d="M14 6h6v6" />
        </svg>
      )
    case 'bank':
      return (
        <svg {...props}>
          <path d="M3 10h18M5 10V20h14V10M4 20h16M6 10l6-5 6 5" />
        </svg>
      )
    case 'report':
      return (
        <svg {...props}>
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
      )
    case 'sync':
      return (
        <svg {...props}>
          <path d="M4 12a8 8 0 0 1 13.5-5.5L20 9M20 4v5h-5M20 12a8 8 0 0 1-13.5 5.5L4 15M4 20v-5h5" />
        </svg>
      )
    case 'tools':
      return (
        <svg {...props}>
          <path d="M14.5 6.5a4 4 0 0 0-5.7 5.7L4 17v3h3l4.8-4.8a4 4 0 0 0 5.7-5.7l-2 2-2-2z" />
        </svg>
      )
    case 'down':
      return (
        <svg {...props}>
          <path d="M12 4v16M5 13l7 7 7-7" />
        </svg>
      )
    case 'up':
      return (
        <svg {...props}>
          <path d="M12 20V4M5 11l7-7 7 7" />
        </svg>
      )
    case 'search':
      return (
        <svg {...props}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="2.2" />
          <path d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.5-2.4.8a7.3 7.3 0 0 0-1.7-1L14.5 3h-5l-.3 2.8a7.3 7.3 0 0 0-1.7 1L5.1 6l-2 3.5 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.5 2.4-.8a7.3 7.3 0 0 0 1.7 1l.3 2.8h5l.3-2.8a7.3 7.3 0 0 0 1.7-1l2.4.8 2-3.5-2-1.5c.1-.3.1-.7.1-1Z" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...props}>
          <path d="M4 20h16" />
          <path d="M7 20V11" />
          <path d="M12 20V7" />
          <path d="M17 20v-4" />
        </svg>
      )
    case 'xls':
      return (
        <svg {...props}>
          <path d="M5 4h9l5 5v11H5z" />
          <path d="M14 4v6h6" />
          <path d="M8 11l2 2m0-2-2 2m5-2 2 4m0-4-2 4" />
        </svg>
      )
    case 'print':
      return (
        <svg {...props}>
          <path d="M7 8V4h10v4" />
          <path d="M6 17h12" />
          <path d="M7 13h10" />
          <path d="M5 9h14a1 1 0 0 1 1 1v5h-4v3H8v-3H4v-5a1 1 0 0 1 1-1Z" />
        </svg>
      )
    case 'share':
      return (
        <svg {...props}>
          <path d="M16 8a3 3 0 1 0-2.8-4" />
          <path d="M8 13l8-4" />
          <path d="M8 11l8 5" />
          <circle cx="6" cy="12" r="2.2" />
          <circle cx="18" cy="6" r="2.2" />
          <circle cx="18" cy="17" r="2.2" />
        </svg>
      )
    case 'more':
      return (
        <svg {...props}>
          <circle cx="12" cy="5" r="1.2" />
          <circle cx="12" cy="12" r="1.2" />
          <circle cx="12" cy="19" r="1.2" />
        </svg>
      )
    case 'plus':
      return (
        <svg {...props}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      )
    case 'calculator':
      return (
        <svg {...props}>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 8h8M8 12h2M12 12h2M16 12h0M8 16h2M12 16h2M16 16h0" />
        </svg>
      )
    case 'camera':
      return (
        <svg {...props}>
          <path d="M4 8h3l2-3h6l2 3h3v10H4z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      )
    case 'document':
      return (
        <svg {...props}>
          <path d="M7 4h7l4 4v12H7z" />
          <path d="M14 4v4h4" />
          <path d="M9 11h6M9 14h6" />
        </svg>
      )
    case 'calendar':
      return (
        <svg {...props}>
          <path d="M7 4v3M17 4v3M5 8h14" />
          <rect x="4" y="6" width="16" height="14" rx="2" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...props}>
          <path d="M5 6h14l-5.5 6v5l-3 1v-6Z" />
        </svg>
      )
    case 'sort':
      return (
        <svg {...props}>
          <path d="M8 7l4-4 4 4M12 3v18M16 17l-4 4-4-4" />
        </svg>
      )
    case 'info':
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 10v6M12 7h.01" />
        </svg>
      )
    case 'x':
      return (
        <svg {...props}>
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
      )
    default:
      return null
  }
}

export default Icon
