const reportGroups = [
  {
    heading: 'Transaction report',
    items: [
      'Sale',
      'Purchase',
      'Day book',
      'All Transactions',
      'Profit And Loss',
      'Bill Wise Profit',
      'Cash flow',
      'Trial Balance Report',
      'Balance Sheet',
    ],
  },
  {
    heading: 'Party report',
    items: [
      'Party Statement',
      'Party wise Profit & Loss',
      'All parties',
      'Party Report By Item',
      'Sale Purchase By Party',
      'Sale Purchase By Party Group',
    ],
  },
  {
    heading: 'Item/ Stock report',
    items: ['Stock summary', 'Stock Ledger', 'Valuation Report', 'Batch Summary'],
  },
]

function ReportsNavigator() {
  return (
    <aside className="border-r border-[#d8dee8] bg-white">
      <div className="max-h-[calc(100vh-65px)] overflow-y-auto">
        {reportGroups.map((group) => (
          <section key={group.heading} className="border-b border-[#eef2f6]">
            <div className="bg-[#eaf5f3] px-3 py-2.5 text-[0.82rem] text-slate-500">{group.heading}</div>
            <div className="flex flex-col">
              {group.items.map((item, index) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'border-l-4 border-transparent px-3 py-2.5 text-left text-[0.86rem] text-[#4f2f67] hover:bg-slate-50',
                    index === 0 && group.heading === 'Transaction report' ? 'bg-[#f6fbfc]' : '',
                  ].join(' ')}
                >
                  {item}
                  {item === 'Trial Balance Report' ? <span className="ml-1 text-rose-500">•</span> : null}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  )
}

export default ReportsNavigator
