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
    default:
      return null
  }
}

export default Icon
