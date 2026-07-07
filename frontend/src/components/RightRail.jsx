function RightRail() {
  return (
    <aside className="flex flex-col border-l border-[#dbe4ef] bg-white">
      <section className="border-b border-[#dbe4ef] px-3.5 py-4">
        <div className="mb-1.5 flex items-center gap-2.5">
          <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-[linear-gradient(180deg,#fff_0%,#eef4ff_100%)] text-[0.7rem] font-extrabold text-[#1b73e8]">
            G
          </span>
          <h2 className="text-[1rem] font-medium text-[#5b6b9d]">Google Profile Manager</h2>
        </div>
        <p className="text-[0.95rem] leading-6 text-[#6f7a98]">Google Q&amp;A helps answer customer queries 24/7</p>
        <button
          type="button"
          className="mt-3.5 w-full rounded-full bg-[linear-gradient(180deg,#e9f3ff_0%,#d9ebff_100%)] px-4 py-3.5 font-bold text-[#0070ff]"
        >
          Connect Now
        </button>
      </section>

      <button
        type="button"
        className="mx-3 mb-3 mt-auto flex min-h-[66px] items-center justify-between rounded-xl border border-[#dfe6f1] bg-white px-4 py-3 text-[0.96rem] text-[#7180a8]"
      >
        <span>Add Widget of Your Choice</span>
        <span className="text-[1.8rem] leading-none text-[#7c8db4]">+</span>
      </button>
    </aside>
  )
}

export default RightRail
