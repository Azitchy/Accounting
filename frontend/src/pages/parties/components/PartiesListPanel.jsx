function PartiesListPanel({
  parties,
  selectedPartyId,
  onSelectParty,
  onDeleteParty,
  searchQuery,
  onSearchQueryChange,
  searchInputRef,
}) {
  return (
    <aside className="flex min-w-0 flex-col border-r border-[#cfd8e4] bg-white">
      <div className="border-b border-[#d6ddea] px-3 py-3">
        <label className="flex h-10 w-full items-center gap-2 rounded-full border border-[#d6ddea] px-4 text-[0.92rem] text-[#9aa2be] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]">
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5 text-[#90a0c4]" aria-hidden="true">
            <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            className="w-full bg-transparent text-[#24314f] outline-none placeholder:text-[#9aa2be]"
            placeholder="Search Party Name"
          />
        </label>
      </div>

      <div className="grid grid-cols-[1fr_88px] border-b border-[#d6ddea] bg-white text-[0.8rem] font-semibold text-[#6f7390]">
        <button type="button" className="flex items-center gap-2 border-r border-[#d6ddea] px-3 py-3 text-left">
          <span>Party Name</span>
          <span className="text-[#1d7df0]">
            <svg viewBox="0 0 12 16" className="h-4 w-3" aria-hidden="true">
              <path d="M6 0l3 3H3L6 0Z" fill="currentColor" />
              <path d="M6 16l-3-3h6L6 16Z" fill="currentColor" />
            </svg>
          </span>
          <span className="ml-auto text-[#ff2d56]">
            <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
              <path d="M5 4h10l-4 5v4l-2 1v-5L5 4Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <button type="button" className="px-3 py-3 text-left">
          Amount
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {parties.length > 0 ? (
          parties.map((party) => {
          const selected = selectedPartyId === party.id

          return (
            <div
              key={party.id}
              className={[
                'grid h-[48px] w-full grid-cols-[1fr_88px_28px] items-center px-3 text-left text-[0.95rem]',
                selected ? 'bg-[#cbe3f3] font-semibold text-slate-800' : 'bg-white hover:bg-slate-50',
              ].join(' ')}
            >
              <button
                type="button"
                onClick={() => onSelectParty(party.id)}
                className="text-left capitalize"
              >
                {party.name}
              </button>
              <button
                type="button"
                onClick={() => onSelectParty(party.id)}
                className="text-right font-medium text-emerald-400"
              >
                {party.amount}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation()
                  onDeleteParty(party.id)
                }}
                className="grid place-items-center text-[#c4c9d7] transition hover:text-rose-500"
                aria-label={`Delete ${party.name}`}
              >
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
                  <path
                    d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7m-7 0 .7 11.2A1.8 1.8 0 0 0 10.5 20h3a1.8 1.8 0 0 0 1.8-1.8L16 7M10 11v5M14 11v5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          )
          })
        ) : (
          <div className="px-4 py-6 text-[0.9rem] text-[#8d96b4]">No parties found.</div>
        )}
      </div>

      <div className="border-t border-[#d6ddea] p-0">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-none border border-[#bdf0dd] bg-[#e8fff3] px-4 py-4 text-left text-[0.9rem] text-[#30456d]"
        >
          <span>
            Easily convert your <span className="font-semibold">Phone contacts</span> into parties
          </span>
          <svg viewBox="0 0 20 20" className="h-4.5 w-4.5 text-[#00b56b]" aria-hidden="true">
            <path d="M7 4l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  )
}

export default PartiesListPanel
