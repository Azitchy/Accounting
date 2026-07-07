function TransactionsPanel({ transactions, onSearchClick, onPrintClick, onExportClick }) {
  const columns = ['TYPE', 'INVOICE/REF. NO.', 'NAME', 'DATE', 'QUANTITY', 'PRICE/UNIT', 'STATUS']
  const gridTemplate = 'grid-cols-[14px_112px_110px_minmax(160px,1fr)_118px_104px_118px_104px]'

  return (
    <section className="flex min-h-0 flex-1 flex-col bg-white">
      <div className="flex items-center justify-between px-3 py-4">
        <h2 className="text-[0.96rem] font-semibold text-[#1f2a44]">TRANSACTIONS</h2>
        <div className="flex items-center gap-3 text-[#c0c7da]">
          <button type="button" aria-label="Search transactions" onClick={onSearchClick}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="Print transactions" onClick={onPrintClick}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path d="M7 9V4h10v5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M6 17H5a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7 14h10v6H7z" fill="none" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
          <button type="button" aria-label="Export transactions" onClick={onExportClick} className="rounded bg-[#dbe1ef] px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase text-[#7380a3]">
            xls
          </button>
        </div>
      </div>

      <div className={`grid ${gridTemplate} border-y border-[#d6ddea] bg-[#fbfbfc] text-[0.82rem] text-[#70758d]`}>
        <div className="px-1 py-3" />
        {columns.map((column) => (
          <button
            key={column}
            type="button"
            className="flex h-[40px] items-center justify-between border-r border-[#d6ddea] px-3 text-left last:border-r-0"
          >
            <span>{column}</span>
            <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#7f7f7f]" aria-hidden="true">
              <path d="M5 7h10l-5 6-5-6Z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px]">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`grid ${gridTemplate} items-center border-b border-[#edf0f5] text-[0.88rem]`}
              >
                <div className="px-3 py-3">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="px-3 py-3">{transaction.type}</div>
                <div className="px-3 py-3">{transaction.invoiceRef}</div>
                <div className="px-3 py-3">{transaction.name}</div>
                <div className="px-3 py-3">{transaction.date}</div>
                <div className="px-3 py-3">{transaction.quantity}</div>
                <div className="px-3 py-3 text-right">{transaction.priceUnit}</div>
                <div className="px-3 py-3">{transaction.status}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-10 text-center">
          <div className="rounded-full bg-[#d7e7ff] p-8 text-[#69a7ff]">
            <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden="true">
              <circle cx="48" cy="48" r="40" fill="rgba(120,180,255,0.22)" />
            </svg>
          </div>
          <h3 className="mt-4 text-[1rem] font-semibold text-[#4c5575]">No Transactions to show</h3>
          <p className="mt-2 text-[0.88rem] text-[#a0a5bf]">You haven&apos;t added any transactions yet.</p>
        </div>
      )}
    </section>
  )
}

export default TransactionsPanel
