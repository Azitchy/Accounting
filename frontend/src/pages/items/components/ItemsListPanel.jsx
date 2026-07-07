import { useEffect, useState } from 'react'

function ItemsListPanel({
  items,
  selectedItemId,
  onSelectItem,
  onDeleteItem,
  onCreateItem,
  searchQuery,
  onSearchQueryChange,
  searchInputRef,
}) {
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false)
  const [openRowMenuId, setOpenRowMenuId] = useState('')

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsAddMenuOpen(false)
        setOpenRowMenuId('')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <aside className="flex min-w-0 flex-col border-r border-[#cfd8e4] bg-white">
      <div className="flex items-center gap-3 border-b border-[#d6ddea] px-3 py-3">
        <button
          type="button"
          onClick={() => searchInputRef.current?.focus()}
          className="grid h-8 w-8 place-items-center rounded-full bg-[#efefef] text-[#626b82]"
          aria-label="Search items"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={onCreateItem}
            className="flex h-9 items-center gap-2 rounded-[6px] bg-[linear-gradient(180deg,#f3a437_0%,#ea951e_100%)] px-4 pr-10 text-[0.88rem] font-semibold text-white shadow-sm"
          >
            <span>+ Add Item</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddMenuOpen((current) => !current)}
            className="absolute right-0 top-0 flex h-9 w-8 items-center justify-center rounded-r-[6px] text-white/95"
            aria-label="Open add item options"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path
                d="M5 7l5 5 5-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {isAddMenuOpen ? (
            <div className="absolute left-0 top-[44px] z-20 w-[180px] rounded-[8px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_24px_rgba(15,23,42,0.15)]">
              <MenuButton
                label="Create Item"
                onClick={() => {
                  setIsAddMenuOpen(false)
                  onCreateItem()
                }}
              />
              <MenuButton
                label="Import Items"
                onClick={() => {
                  setIsAddMenuOpen(false)
                }}
              />
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setIsAddMenuOpen((current) => !current)}
          className="ml-auto"
          aria-label="More actions"
        >
          <svg viewBox="0 0 4 16" className="h-4 w-1.5 text-[#8d93a6]" aria-hidden="true">
            <circle cx="2" cy="2" r="1.2" fill="currentColor" />
            <circle cx="2" cy="8" r="1.2" fill="currentColor" />
            <circle cx="2" cy="14" r="1.2" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="border-b border-[#d6ddea] px-3 py-3">
        <label className="flex h-9 w-full items-center gap-2 rounded-full border border-[#d6ddea] px-3 text-[0.92rem] text-[#9aa2be]">
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#90a0c4]" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-[#9aa2be]"
            placeholder="Search Item"
          />
        </label>
      </div>

      <div className="grid grid-cols-[1fr_88px] border-b border-[#d6ddea] bg-white text-[0.8rem] font-semibold text-[#6f7390]">
        <button type="button" className="flex items-center gap-2 border-r border-[#d6ddea] px-3 py-3 text-left">
          <span>ITEM</span>
          <span className="ml-auto text-[#ff2d56]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path d="M5 4h10l-4 5v4l-2 1v-5L5 4Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <button type="button" className="px-3 py-3 text-left">
          QUANTITY
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {items.length > 0 ? (
          items.map((item) => {
            const selected = selectedItemId === item.id
            const rowMenuOpen = openRowMenuId === item.id

            return (
              <div key={item.id} className="relative grid grid-cols-[1fr_88px_28px] items-center text-[0.92rem]">
                <button
                  type="button"
                  onClick={() => {
                    onSelectItem(item.id)
                    setOpenRowMenuId('')
                  }}
                  className={[
                    'col-span-2 grid h-[42px] grid-cols-[1fr_88px] items-center px-3 text-left',
                    selected ? 'bg-[#cbe3f3] font-semibold text-slate-800' : 'bg-white hover:bg-slate-50',
                  ].join(' ')}
                >
                  <span className="capitalize">{item.name}</span>
                  <span className={item.quantity < 0 ? 'text-right text-rose-500' : 'text-right text-emerald-500'}>
                    {item.quantity}
                  </span>
                </button>

                <button
                  type="button"
                  aria-label={`Row actions for ${item.name}`}
                  onClick={() => setOpenRowMenuId((current) => (current === item.id ? '' : item.id))}
                  className="grid h-full place-items-center text-[#7d839b] hover:bg-slate-50"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                    <circle cx="12" cy="5" r="1.6" fill="currentColor" />
                    <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                    <circle cx="12" cy="19" r="1.6" fill="currentColor" />
                  </svg>
                </button>

                {rowMenuOpen ? (
                  <div className="absolute right-2 top-[40px] z-10 w-[150px] rounded-[8px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_24px_rgba(15,23,42,0.15)]">
                    <MenuButton
                      label="Select Item"
                      onClick={() => {
                        onSelectItem(item.id)
                        setOpenRowMenuId('')
                      }}
                    />
                    <MenuButton
                      label="Delete Item"
                      onClick={() => {
                        onDeleteItem(item.id)
                        setOpenRowMenuId('')
                      }}
                    />
                  </div>
                ) : null}
              </div>
            )
          })
        ) : (
          <div className="px-4 py-6 text-[0.9rem] text-[#8d96b4]">No items found.</div>
        )}
      </div>
    </aside>
  )
}

function MenuButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full px-4 py-2.5 text-left text-[0.88rem] text-[#525c79] hover:bg-slate-50"
    >
      {label}
    </button>
  )
}

export default ItemsListPanel
