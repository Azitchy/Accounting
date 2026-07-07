function TopActionBar() {
  return (
    <header className="flex min-h-14 items-center justify-between gap-4 border-b-[3px] border-[#c7d6ea] px-4 pb-1.5">
      <div className="inline-flex items-center gap-2 text-[1.12rem] font-medium text-[#8b8fa8]">
        <span className="h-2 w-2 rounded-full bg-[#ff3d7f] shadow-[0_0_0_4px_rgba(255,61,127,0.15)]" />
        <span>Enter Business Name</span>
      </div>

      <div className="flex items-center gap-3.5">
        <ActionButton color="rose" label="+ Add Sale" />
        <ActionButton color="blue" label="+ Add Purchase" />
        <IconButton label="Add" symbol="+" />
        <IconButton label="More options" symbol="..." ghost />
      </div>
    </header>
  )
}

function ActionButton({ color, label }) {
  const palette =
    color === 'rose'
      ? 'bg-[linear-gradient(180deg,#ff2d57_0%,#e31946_100%)]'
      : 'bg-[linear-gradient(180deg,#1172ff_0%,#0560ea_100%)]'

  return (
    <button type="button" className={`rounded-full px-4.5 py-2.5 text-[0.95rem] font-bold text-white ${palette}`}>
      {label}
    </button>
  )
}

function IconButton({ label, symbol, ghost = false }) {
  return (
    <button
      type="button"
      aria-label={label}
      className={[
        'grid h-9 w-9 place-items-center rounded-full text-[1.2rem] font-bold',
        ghost ? 'bg-transparent text-slate-500' : 'bg-[#eaf2ff] text-[#3c71f3]',
      ].join(' ')}
    >
      {symbol}
    </button>
  )
}

export default TopActionBar
