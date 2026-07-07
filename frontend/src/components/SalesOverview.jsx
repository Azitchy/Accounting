function SalesOverview() {
  const ticks = ['1 Jul', '4 Jul', '7 Jul', '10 Jul', '13 Jul', '16 Jul', '19 Jul', '22 Jul', '25 Jul', '28 Jul', '31 Jul']

  return (
    <section className="border-x border-b border-[#dbe4ef] bg-white px-4.5 py-4.5">
      <div className="mb-4.5 flex items-start justify-between gap-3">
        <div>
          <h2 className="mb-2 text-[1rem] font-medium leading-tight text-[#5b6b9d]">Total Sale</h2>
          <strong className="block text-[1.2rem] font-extrabold text-[#283351]">Rs 1,000</strong>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-3 rounded-full bg-[#deecff] px-4 py-2.5 text-[0.95rem] font-bold text-[#243b7a]"
        >
          <span>This Month</span>
          <span>v</span>
        </button>
      </div>

      <div className="relative min-h-[250px] pl-10">
        <div className="absolute left-0 top-4 grid h-[240px] w-9 place-items-end gap-[18px] text-[0.84rem] text-[#a0a8c3]">
          <span>1k</span>
          <span>800</span>
          <span>600</span>
          <span>400</span>
          <span>200</span>
          <span>0</span>
        </div>

        <svg viewBox="0 0 1000 320" className="h-[240px] w-full overflow-visible" role="img" aria-label="Sales line chart">
          <line x1="70" y1="30" x2="970" y2="30" className="stroke-slate-200" />
          <line x1="70" y1="78" x2="970" y2="78" className="stroke-slate-200" />
          <line x1="70" y1="126" x2="970" y2="126" className="stroke-slate-200" />
          <line x1="70" y1="174" x2="970" y2="174" className="stroke-slate-200" />
          <line x1="70" y1="222" x2="970" y2="222" className="stroke-slate-200" />
          <line x1="70" y1="270" x2="970" y2="270" className="stroke-slate-200" />
          <path
            d="M70 270 L188 270 L220 270 L248 30 L276 270 L970 270 L970 270 L70 270 Z"
            className="fill-blue-500/20"
          />
          <path d="M70 270 L188 270 L220 270 L248 30 L276 270 L970 270" className="fill-none stroke-blue-500 stroke-[2.5]" />
        </svg>
      </div>

      <div className="ml-9 grid grid-cols-11 text-[0.82rem] text-[#a0a8c3]">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
    </section>
  )
}

export default SalesOverview
