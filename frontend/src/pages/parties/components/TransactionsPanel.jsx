function TransactionsPanel({ transactions, onSearchClick, onPrintClick, onExportClick }) {
  const columns = ['Type', 'Number', 'Date', 'Total', 'Balance']

  return (
    <section className="bg-white">
      <div className="flex items-center justify-between px-3 py-3">
        <h2 className="text-[0.96rem] font-semibold text-[#1f2a44]">Transactions</h2>

        <div className="flex items-center gap-3 text-[#c0c7da]">
          <button type="button" aria-label="Search transactions" onClick={onSearchClick}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="1.7" />
              <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" aria-label="Print" onClick={onPrintClick}>
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M7 8V4h10v4M6 17h12M7 13h10M5 9h14a1 1 0 0 1 1 1v5h-4v3H8v-3H4v-5a1 1 0 0 1 1-1Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onExportClick}
            className="rounded bg-[#ebeef8] px-1.5 py-0.5 text-[0.72rem] font-semibold text-[#b2b8cb]"
          >
            xls
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 border-y border-[#d6ddea] bg-[#fbfbfc] text-[0.85rem] text-[#70758d]">
        {columns.map((column) => (
          <button
            key={column}
            type="button"
            className="flex h-[44px] items-center justify-between border-r border-[#d6ddea] px-3 text-left last:border-r-0"
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
          <table className="w-full border-collapse text-[0.88rem]">
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-[#edf0f5]">
                  <td className="px-3 py-3">{transaction.type}</td>
                  <td className="px-3 py-3">{transaction.number}</td>
                  <td className="px-3 py-3">{transaction.date}</td>
                  <td className="px-3 py-3">{transaction.total}</td>
                  <td className="px-3 py-3">{transaction.balance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-272px)] flex-col items-center justify-center px-6 py-10 text-center">
          <div className="mb-4 grid h-28 w-28 place-items-center rounded-full bg-[#d7e7ff] text-[#69a7ff]">
            <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden="true">
              <circle cx="48" cy="48" r="40" fill="rgba(120,180,255,0.22)" />
              <rect x="26" y="24" width="44" height="12" rx="4" fill="#5fa2ff" opacity="0.9" />
              <rect x="22" y="40" width="52" height="12" rx="4" fill="#4f8ff6" opacity="0.9" />
              <rect x="26" y="56" width="40" height="12" rx="4" fill="#8fc0ff" opacity="0.9" />
              <circle cx="34" cy="30" r="4" fill="#fff" />
              <circle cx="34" cy="46" r="4" fill="#fff" />
              <circle cx="34" cy="62" r="4" fill="#fff" />
              <path d="M70 32l4-4 1 5 5 1-4 4 1 5-5-1-4 4-1-5-5-1 4-4-1-5 5 1Z" fill="#a6cfff" opacity="0.95" />
              <path d="M22 28l3-3 .8 3.6 3.6.8-3 3 .8 3.6-3.6-.8-3 3-.8-3.6-3.6-.8 3-3-.8-3.6 3.6.8Z" fill="#a6cfff" opacity="0.95" />
              <path d="M18 60l2-2 .5 2.4 2.4.5-2 2 .5 2.4-2.4-.5-2 2-.5-2.4-2.4-.5 2-2-.5-2.4 2.4.5Z" fill="#a6cfff" opacity="0.95" />
            </svg>
          </div>
          <h3 className="text-[1rem] font-semibold text-[#4c5575]">No Transactions to show</h3>
          <p className="mt-2 text-[0.88rem] text-[#a0a5bf]">You haven&apos;t added any transactions yet.</p>
        </div>
      )}
    </section>
  )
}

export default TransactionsPanel
