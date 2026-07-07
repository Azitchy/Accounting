import { useEffect } from 'react'

const menuItems = [
  'Import from Excel',
  'Import from Phone',
  'Import Via Google Contacts',
  'Party Statement (Report)',
  'All Parties (Report)',
]

function PartyOverflowMenu({ open, onClose }) {
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close overflow menu"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      <div className="absolute right-[86px] top-[70px] w-[214px] rounded-[6px] border border-[#d9dee9] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.18)]">
        {menuItems.map((item) => (
          <button
            key={item}
            type="button"
            className="block w-full px-4 py-3 text-left text-[0.88rem] text-[#525c79] hover:bg-slate-50"
            onClick={onClose}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PartyOverflowMenu
