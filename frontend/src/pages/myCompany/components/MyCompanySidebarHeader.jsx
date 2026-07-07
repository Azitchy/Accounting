function MyCompanySidebarHeader() {
  return (
    <div className="flex flex-col items-center justify-start pt-2 lg:items-start">
      <div className="relative mt-2 h-32 w-32 rounded-full border-8 border-[#dbe8f7] bg-[#d9e9fb] text-center text-[1.05rem] leading-6 text-[#9a9fc2]">
        <div className="flex h-full flex-col items-center justify-center">
          <span>Add</span>
          <span>Logo</span>
        </div>
        <div className="absolute right-1 bottom-1 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-[1rem] text-[#7b84a8] shadow-sm">
          ✎
        </div>
        <div className="absolute right-0 top-0 h-10 w-10 rounded-full border-4 border-transparent border-t-[#0c72ff]" />
      </div>
    </div>
  )
}

export default MyCompanySidebarHeader
