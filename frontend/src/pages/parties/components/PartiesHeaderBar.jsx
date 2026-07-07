function PartiesHeaderBar({ onAddPartyClick, onSettingsClick, onMoreClick }) {
  return (
    <header className="flex h-[59px] items-center justify-between border-b border-[#ccd6e2] bg-white px-3.5">
      <button type="button" className="flex items-center gap-2 text-[1.2rem] font-bold text-[#24314f]">
        <span>Parties</span>
        <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#1172ff]" aria-hidden="true">
          <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onAddPartyClick}
          className="rounded-full bg-[linear-gradient(180deg,#ff2e56_0%,#e71843_100%)] px-5 py-2 text-[0.92rem] font-semibold text-white shadow-sm"
        >
          + Add Party
        </button>

        <button
          type="button"
          onClick={onSettingsClick}
          aria-label="Settings"
          className="grid h-8 w-8 place-items-center rounded-full text-[#77819b] hover:bg-slate-100"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
            <path
              d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-1.5-.9.1-1.8-1.6-1.6-1.8.1-.9-1.5-2.2-.4-.9 1.5-1.8-.1-1.6 1.6.1 1.8L4 12l.9 1.5-.1 1.8 1.6 1.6 1.8-.1.9 1.5 2.2.4.9-1.5 1.8.1 1.6-1.6-.1-1.8L20 12Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button type="button" onClick={onMoreClick} aria-label="More options" className="px-2 text-[1.5rem] leading-none text-[#8e93a7]">
          ⋮
        </button>
      </div>
    </header>
  )
}

export default PartiesHeaderBar
