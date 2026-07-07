function MyCompanyTopBar() {
  return (
    <header className="flex h-6 items-center justify-between border-b border-slate-300 bg-white px-4 text-[0.72rem] text-slate-700">
      <div className="flex items-center gap-4">
        <span className="font-bold text-orange-500">▲</span>
        <nav className="flex items-center gap-4">
          <span>Company</span>
          <span>Help</span>
          <span>Versions</span>
          <span>Shortcuts</span>
          <span>C</span>
        </nav>
      </div>

      <div className="flex items-center gap-3 text-[0.72rem] text-blue-600">
        <span className="font-medium text-slate-700">WhatsApp Chat Support</span>
        <span className="text-emerald-500">(+91) 8050 298 743</span>
        <a href="#support" className="underline">
          Get Instant Online Support
        </a>
      </div>
    </header>
  )
}

export default MyCompanyTopBar
