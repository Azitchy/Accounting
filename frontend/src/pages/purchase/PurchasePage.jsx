import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'

const purchaseViews = {
  bills: {
    pageLabel: 'Purchase Bills',
    path: '/purchase/bills',
    actionLabel: 'Add Purchase Bill',
    summaryTitle: 'Total Purchase Amount',
    summaryFootnote: 'Paid: Rs {paid} | Balance: Rs {balance}',
    emptyState: false,
  },
  'payment-out': {
    pageLabel: 'Payment-Out',
    path: '/purchase/payment-out',
    actionLabel: 'Add Payment-Out',
    summaryTitle: 'Total Amount',
    summaryFootnote: 'Paid: Rs {paid}',
    emptyState: true,
  },
  expenses: {
    pageLabel: 'Expenses',
    path: '/purchase/expenses',
    actionLabel: 'Add Expense',
    summaryTitle: 'Total Expenses',
    summaryFootnote: 'Paid: Rs {paid} | Balance: Rs {balance}',
    emptyState: true,
  },
  orders: {
    pageLabel: 'Purchase Order',
    path: '/purchase/orders',
    actionLabel: 'Add Purchase Order',
    summaryTitle: 'Total Purchase Orders',
    summaryFootnote: 'Placed: Rs {paid} | Balance: Rs {balance}',
    emptyState: true,
  },
  'return-dr-note': {
    pageLabel: 'Purchase Return/ Dr. Note',
    path: '/purchase/return-dr-note',
    actionLabel: 'Add Return',
    summaryTitle: 'Total Returns',
    summaryFootnote: 'Adjusted: Rs {paid} | Balance: Rs {balance}',
    emptyState: true,
  },
}

const initialRecordsByView = {
  bills: [
    {
      id: 'bill-1',
      date: '05/07/2026',
      refNo: 'PB-001',
      partyName: 'abc',
      categoryName: 'General',
      type: 'Purchase Bill',
      total: 1000,
      receivedPaid: 1000,
      balance: 0,
      firm: 'Main Firm',
    },
  ],
  'payment-out': [],
  expenses: [],
  orders: [],
  'return-dr-note': [],
}

const firmOptions = ['All Firms', 'Main Firm', 'West Branch']
const rangeOptions = [
  { label: 'This Month', from: '2026-07-01', to: '2026-07-31' },
  { label: 'Custom', from: '2026-07-01', to: '2026-07-31' },
  { label: 'Last 30 Days', from: '2026-06-11', to: '2026-07-10' },
]
const partyOptions = ['abc', 'XYZ Traders', 'Sunrise Mart']
const paymentTypes = ['Cash', 'Card', 'UPI', 'Credit']
const expenseCategories = ['Petrol', 'Rent', 'Salary', 'Tea', 'Transport']

function PurchasePage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentSlug = pathname.split('/').filter(Boolean).at(-1) || 'bills'
  const currentView = purchaseViews[currentSlug] ?? purchaseViews.bills
  const [recordsByView, setRecordsByView] = useState(() => ({ ...initialRecordsByView }))
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRange, setSelectedRange] = useState(rangeOptions[0])
  const [selectedFirm, setSelectedFirm] = useState('All Firms')
  const [isTitleMenuOpen, setIsTitleMenuOpen] = useState(false)
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false)
  const [isFirmMenuOpen, setIsFirmMenuOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
  const [isPartyMenuOpen, setIsPartyMenuOpen] = useState(false)
  const [isPaymentTypeOpen, setIsPaymentTypeOpen] = useState(false)
  const [isExpenseCategoryOpen, setIsExpenseCategoryOpen] = useState(false)
  const [activeRowMenuId, setActiveRowMenuId] = useState('')
  const [entryDraft, setEntryDraft] = useState({
    partyName: 'abc',
    phoneNo: '',
    paymentType: 'Cash',
    expenseCategory: 'Petrol',
    amount: '',
    description: '',
    taxEnabled: false,
    roundOff: true,
  })
  const searchInputRef = useRef(null)

  const currentRecords = recordsByView[currentSlug] ?? []

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return currentRecords.filter((record) => {
      const matchesSearch =
        !query ||
        [record.date, record.refNo, record.partyName, record.categoryName, record.type, record.paymentType]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))

      const matchesFirm = selectedFirm === 'All Firms' || record.firm === selectedFirm
      const matchesRange = isWithinRange(record.date, selectedRange)

      return matchesSearch && matchesFirm && matchesRange
    })
  }, [currentRecords, searchQuery, selectedFirm, selectedRange])

  const summary = useMemo(() => {
    return visibleRecords.reduce(
      (accumulator, record) => {
        accumulator.paid += Number(record.receivedPaid || 0)
        accumulator.balance += Number(record.balance || 0)
        return accumulator
      },
      { paid: 0, balance: 0 },
    )
  }, [visibleRecords])
  const shouldShowEmptyState = currentView.emptyState && visibleRecords.length === 0

  useEffect(() => {
    setSearchQuery('')
    setActiveRowMenuId('')
    setIsAddOpen(false)
    setIsTitleMenuOpen(false)
    setIsRangeMenuOpen(false)
    setIsFirmMenuOpen(false)
    setIsSettingsMenuOpen(false)
    setIsPartyMenuOpen(false)
    setIsPaymentTypeOpen(false)
    setIsExpenseCategoryOpen(false)
    setSelectedRange(rangeOptions[0])
    setSelectedFirm('All Firms')
    setEntryDraft({
      partyName: 'abc',
      phoneNo: '',
      paymentType: 'Cash',
      expenseCategory: 'Petrol',
      amount: '',
      description: '',
      taxEnabled: false,
      roundOff: true,
    })
  }, [currentSlug])

  useEffect(() => {
    if (!isTitleMenuOpen && !isRangeMenuOpen && !isFirmMenuOpen && !isSettingsMenuOpen && !activeRowMenuId) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      setIsTitleMenuOpen(false)
      setIsRangeMenuOpen(false)
      setIsFirmMenuOpen(false)
      setIsSettingsMenuOpen(false)
      setActiveRowMenuId('')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeRowMenuId, isFirmMenuOpen, isRangeMenuOpen, isSettingsMenuOpen, isTitleMenuOpen])

  const saveRecord = () => {
    const amountValue = Number(entryDraft.amount || 0)
    const next = {
      id: `purchase-${Date.now()}`,
      date: '10/07/2026',
      refNo: `${currentView.pageLabel.slice(0, 2).toUpperCase()}-${String(currentRecords.length + 1).padStart(3, '0')}`,
      partyName: entryDraft.partyName,
      categoryName: currentSlug === 'expenses' ? entryDraft.expenseCategory : 'General',
      type: currentView.pageLabel,
      total: amountValue || 1000,
      receivedPaid: currentSlug === 'expenses' ? amountValue || 1000 : amountValue || 1000,
      balance: 0,
      firm: selectedFirm === 'All Firms' ? 'Main Firm' : selectedFirm,
      paymentType: entryDraft.paymentType,
    }

    setRecordsByView((current) => ({
      ...current,
      [currentSlug]: [next, ...(current[currentSlug] ?? [])],
    }))
    setIsAddOpen(false)
  }

  const exportCsv = () => {
    const rows = [
      ['Date', 'Ref No', 'Party Name', 'Category Name', 'Type', 'Total', 'Received/Paid', 'Balance'].join(','),
      ...visibleRecords.map((record) =>
        [record.date, record.refNo, record.partyName, record.categoryName, record.type, record.total, record.receivedPaid, record.balance]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      ),
    ]

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentView.pageLabel}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const goToView = (nextSlug) => {
    setIsTitleMenuOpen(false)
    navigate(`/purchase/${nextSlug}`)
  }

  return (
    <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
      <header className="relative flex min-h-[54px] items-center justify-between gap-4 border-b border-[#d9e0ea] bg-white px-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[#1d365c]"
          onClick={() => setIsTitleMenuOpen((current) => !current)}
          aria-expanded={isTitleMenuOpen}
        >
          <span>{currentView.pageLabel}</span>
          <Icon name={isTitleMenuOpen ? 'up' : 'down'} />
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
          >
            <Icon name="plus" />
            <span>{currentView.actionLabel}</span>
          </button>
          <div className="h-7 w-px bg-[#d9e0ea]" />
          <button
            type="button"
            aria-label="Settings"
            className="grid h-8 w-8 place-items-center rounded-full text-[#677089] hover:bg-slate-100"
            onClick={() => setIsSettingsMenuOpen((current) => !current)}
          >
            <Icon name="settings" />
          </button>
        </div>

        {isTitleMenuOpen ? (
          <div className="absolute left-4 top-full z-20 mt-2 w-64 overflow-hidden rounded-[14px] border border-[#d8deea] bg-white shadow-[0_18px_35px_rgba(15,23,42,0.16)]">
            {Object.entries(purchaseViews).map(([slug, view]) => (
              <button
                key={slug}
                type="button"
                onClick={() => goToView(slug)}
                className={[
                  'block w-full px-4 py-3 text-left text-[0.92rem] font-semibold hover:bg-slate-50',
                  slug === currentSlug ? 'bg-[#eef4ff] text-[#1d4ed8]' : 'text-[#45526e]',
                ].join(' ')}
              >
                {view.pageLabel}
              </button>
            ))}
          </div>
        ) : null}

        {isSettingsMenuOpen ? (
          <div className="absolute right-4 top-full z-20 mt-2 w-44 overflow-hidden rounded-[14px] border border-[#d8deea] bg-white shadow-[0_18px_35px_rgba(15,23,42,0.16)]">
            <button
              type="button"
              onClick={() => {
                exportCsv()
                setIsSettingsMenuOpen(false)
              }}
              className="block w-full px-4 py-3 text-left text-[0.92rem] font-semibold text-[#45526e] hover:bg-slate-50"
            >
              Export CSV
            </button>
            <button
              type="button"
              onClick={() => {
                window.print()
                setIsSettingsMenuOpen(false)
              }}
              className="block w-full px-4 py-3 text-left text-[0.92rem] font-semibold text-[#45526e] hover:bg-slate-50"
            >
              Print
            </button>
          </div>
        ) : null}
      </header>

      <section className="grid h-[calc(100vh-54px)] min-h-0 grid-rows-[auto_auto_auto_1fr_auto] bg-white">
        <div className="border-b border-[#d9e0ea] bg-white px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.95rem] font-semibold text-[#202d4a]">Filter by :</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsRangeMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]"
              >
                <span>{selectedRange.label}</span>
                <Icon name="down" />
              </button>
              {isRangeMenuOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-[12px] border border-[#d8deea] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
                  {rangeOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        setSelectedRange(option)
                        setIsRangeMenuOpen(false)
                      }}
                      className={[
                        'block w-full px-4 py-2.5 text-left text-[0.9rem] font-semibold hover:bg-slate-50',
                        selectedRange.label === option.label ? 'bg-[#eef4ff] text-[#1d4ed8]' : 'text-[#45526e]',
                      ].join(' ')}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button type="button" className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]">
              <Icon name="calendar" />
              <span>01/07/2026 To 31/07/2026</span>
            </button>

            <div className="relative">
              <button
                type="button"
                onClick={() => setIsFirmMenuOpen((current) => !current)}
                className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]"
              >
                <span>{selectedFirm.toUpperCase()}</span>
                <Icon name="down" />
              </button>
              {isFirmMenuOpen ? (
                <div className="absolute left-0 top-full z-20 mt-2 w-40 overflow-hidden rounded-[12px] border border-[#d8deea] bg-white shadow-[0_14px_30px_rgba(15,23,42,0.16)]">
                  {firmOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSelectedFirm(option)
                        setIsFirmMenuOpen(false)
                      }}
                      className={[
                        'block w-full px-4 py-2.5 text-left text-[0.9rem] font-semibold hover:bg-slate-50',
                        selectedFirm === option ? 'bg-[#eef4ff] text-[#1d4ed8]' : 'text-[#45526e]',
                      ].join(' ')}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-b border-[#d9e0ea] bg-white px-3 py-3">
          <div className="relative w-full max-w-[330px] rounded-[8px] border border-[#e1def4] bg-[#fcf8ff] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[0.95rem] text-[#657198]">{currentView.summaryTitle}</div>
                <div className="mt-1 text-[1.15rem] font-bold text-[#24314d]">Rs {formatAmount(summary.paid)}</div>
              </div>
              <div className="rounded-full bg-[#f1f1f3] px-2.5 py-1 text-[0.72rem] font-semibold text-[#5f6782]">0% ↗</div>
            </div>
            <div className="mt-1 text-right text-[0.68rem] text-[#8d93b0]">vs last month</div>
            <div className="mt-4 text-[0.95rem] text-[#7b85ab]">
              {currentSlug === 'payment-out' ? (
                <span>
                  Paid: <span className="font-semibold text-[#24314d]">Rs {formatAmount(summary.paid)}</span>
                </span>
              ) : (
                <span>
                  Paid: <span className="font-semibold text-[#24314d]">Rs {formatAmount(summary.paid)}</span>
                  {' '}
                  | Balance: <span className="font-semibold text-[#24314d]">Rs {formatAmount(summary.balance)}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-[#d9e0ea] bg-white px-3 py-2">
          {!shouldShowEmptyState ? (
            <div className="flex items-center gap-3">
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search..."
                className="h-[22px] w-[160px] border-none outline-none"
              />
            </div>
          ) : (
            <div className="h-[10px]" />
          )}
        </div>

        <div className="min-h-0 overflow-y-auto bg-white">
          {shouldShowEmptyState ? (
            <div className="flex min-h-[calc(100vh-260px)] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-7 h-40 w-40">
                <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
                  <circle cx="100" cy="100" r="74" fill="#eaf4ff" />
                  <rect x="74" y="68" width="62" height="26" rx="8" fill="#58a5ff" opacity="0.18" />
                  <rect x="82" y="78" width="32" height="6" rx="3" fill="#ffffff" />
                  <rect x="82" y="88" width="22" height="5" rx="2.5" fill="#ffffff" opacity="0.96" />
                  <rect x="58" y="96" width="76" height="18" rx="8" fill="#58a5ff" />
                  <rect x="68" y="100" width="20" height="4" rx="2" fill="#ffffff" />
                  <rect x="68" y="106" width="14" height="4" rx="2" fill="#ffffff" opacity="0.95" />
                  <rect x="66" y="118" width="70" height="22" rx="8" fill="#8fc2ff" opacity="0.9" />
                  <rect x="76" y="124" width="18" height="4" rx="2" fill="#ffffff" />
                  <rect x="76" y="130" width="12" height="4" rx="2" fill="#ffffff" opacity="0.95" />
                  <circle cx="60" cy="62" r="4" fill="#8fc2ff" />
                  <circle cx="144" cy="106" r="4" fill="#8fc2ff" />
                  <circle cx="70" cy="138" r="3" fill="#8fc2ff" />
                </svg>
              </div>
              <h3 className="text-[0.96rem] font-semibold text-[#2c3456]">No Transactions to show</h3>
              <p className="mt-1 text-[0.84rem] text-[#8f95b0]">You haven't added any transactions yet.</p>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-5 py-3 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
              >
                <Icon name="plus" />
                <span>{currentView.actionLabel}</span>
              </button>
            </div>
          ) : (
            <table className="w-full border-collapse text-[0.88rem]">
              <thead className="bg-[#fbfbfc] text-[#6d7488]">
                <tr>
                  {['#', 'Date', 'Ref No.', 'Party Name', 'Category Name', 'Type', 'Total', 'Received/Paid', 'Balance', 'Print / Share'].map((column) => (
                    <th key={column} className="border-b border-[#dde3ee] px-3 py-3 text-left font-medium">
                      <div className="flex items-center justify-between gap-2">
                        <span>{column}</span>
                        {column !== '#' && column !== 'Print / Share' ? <Icon name="filter" /> : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRecords.length > 0 ? (
                  visibleRecords.map((record, index) => (
                    <tr key={record.id} className="border-b border-[#edf0f5] text-[#23314d]">
                      <td className="px-3 py-4 text-center text-[#7c849a]">{index + 1}</td>
                      <td className="px-3 py-4">{record.date}</td>
                      <td className="px-3 py-4">{record.refNo}</td>
                      <td className="px-3 py-4">{record.partyName}</td>
                      <td className="px-3 py-4">{record.categoryName}</td>
                      <td className="px-3 py-4">{record.type}</td>
                      <td className="px-3 py-4 text-right">Rs {formatAmount(record.total)}</td>
                      <td className="px-3 py-4 text-right">Rs {formatAmount(record.receivedPaid)}</td>
                      <td className="px-3 py-4 text-right">Rs {formatAmount(record.balance)}</td>
                      <td className="px-3 py-4 text-right">
                        <button type="button" className="text-[#7f86a0]" aria-label="Print">
                          <Icon name="print" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="px-4 py-14 text-center text-[#8b93a8]">
                      No records to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {!shouldShowEmptyState ? (
          <div className="flex items-center justify-between border-t border-[#d9e0ea] bg-white px-2 py-2 text-[0.8rem] text-[#1d6a9c]">
            <div>Total Amount: Rs {formatAmount(summary.paid)}</div>
            <div>Balance: Rs {formatAmount(summary.balance)}</div>
          </div>
        ) : null}
      </section>

      {isAddOpen ? (
        <div className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.55)] p-0 md:p-3">
          <button type="button" className="absolute inset-0" aria-label="Close add purchase modal" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
            <div className="flex items-center justify-between border-b border-[#dfe4ee] bg-[#f3f3f5] px-3 py-2.5 text-[#122b4b]">
              <div className="flex items-center gap-3">
                <span className="text-[0.82rem] font-medium text-[#2f3d5b]">
                  {currentView.pageLabel} #1
                </span>
                <button type="button" className="text-[#7a8497]" aria-label="Close tab" onClick={() => setIsAddOpen(false)}>
                  <Icon name="x" />
                </button>
                <button
                  type="button"
                  className="grid h-5 w-5 place-items-center rounded-full bg-[#1f87ff] text-white"
                  aria-label="New tab"
                  onClick={() => setEntryDraft((current) => ({ ...current }))}
                >
                  <Icon name="plus" />
                </button>
              </div>
              <div className="flex items-center gap-4 text-[#7d8798]">
                <button type="button" aria-label="Calculator">
                  <Icon name="calculator" />
                </button>
                <button type="button" aria-label="Settings">
                  <Icon name="settings" />
                </button>
                <button type="button" aria-label="Close modal" onClick={() => setIsAddOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>
            </div>

            <div className="border-b border-[#dfe4ee] px-4 py-4 md:px-5">
              <div className="flex items-center gap-4">
                <h3 className="text-[1.08rem] font-bold text-[#11284b]">{currentView.pageLabel.replace('Bills', '').trim() || currentView.pageLabel}</h3>
                {currentSlug === 'expenses' ? (
                  <label className="flex items-center gap-3 text-[0.82rem] font-bold text-[#10264a]">
                    <span>TAX</span>
                    <span className="relative inline-flex h-6 w-12 items-center rounded-full bg-[#cfcfcf]">
                      <span className="absolute left-0.5 h-5 w-5 rounded-full bg-white shadow" />
                    </span>
                  </label>
                ) : null}
              </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-rows-[auto_1fr_auto]">
              <div className="grid gap-4 px-4 py-5 md:grid-cols-[1fr_330px] md:px-5">
                <div className="space-y-5">
                  {currentSlug === 'expenses' ? (
                    <div className="relative max-w-[235px]">
                      <label className="absolute -top-2 left-3 bg-white px-1 text-[0.82rem] font-medium text-[#6f7a93]">
                        Expense Category<span className="text-[#ef445b]">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsExpenseCategoryOpen((current) => !current)}
                        className="flex h-[36px] w-full items-center justify-between rounded-[4px] border-2 border-[#1f6fff] bg-white px-3 text-left text-[0.95rem] text-[#18263f]"
                      >
                        <span>{entryDraft.expenseCategory}</span>
                        <Icon name="down" />
                      </button>
                      {isExpenseCategoryOpen ? (
                        <div className="absolute left-0 top-[38px] z-20 w-full rounded-b-[3px] border border-[#dfe4ee] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
                          <button type="button" className="flex items-center gap-2 px-3 py-2 text-[0.85rem] text-[#1f6fff]">
                            <Icon name="plus" />
                            <span>Add Expense Category</span>
                          </button>
                          {expenseCategories.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => {
                                setEntryDraft((current) => ({ ...current, expenseCategory: option }))
                                setIsExpenseCategoryOpen(false)
                              }}
                              className="block w-full px-4 py-1.5 text-left text-[0.84rem] text-[#171f2f] hover:bg-slate-50"
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="grid max-w-[400px] grid-cols-[1fr_150px] gap-4">
                      <div className="relative">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[0.82rem] font-medium text-[#6f7a93]">
                          {currentSlug === 'payment-out' ? 'Search by Name/Phone' : 'Party'}<span className="text-[#ef445b]">*</span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsPartyMenuOpen((current) => !current)}
                          className="flex h-[36px] w-full items-center justify-between rounded-[4px] border-2 border-[#1f6fff] bg-white px-3 text-left text-[0.95rem] text-[#18263f]"
                        >
                          <span>{entryDraft.partyName || 'Select'}</span>
                          <Icon name="down" />
                        </button>
                        {isPartyMenuOpen ? (
                          <div className="absolute left-0 top-[38px] z-20 w-full rounded-b-[3px] border border-[#dfe4ee] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
                            {partyOptions.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setEntryDraft((current) => ({ ...current, partyName: option }))
                                  setIsPartyMenuOpen(false)
                                }}
                                className="block w-full px-4 py-2 text-left text-[0.85rem] text-[#171f2f] hover:bg-slate-50"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <input
                        value={entryDraft.phoneNo}
                        onChange={(event) => setEntryDraft((current) => ({ ...current, phoneNo: event.target.value }))}
                        placeholder="Phone No."
                        className="h-[36px] rounded-[4px] border border-[#bfc7d6] px-3 text-[0.88rem] text-[#18263f] outline-none"
                      />
                    </div>
                  )}

                  {currentSlug === 'payment-out' ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[0.82rem] font-medium text-[#6f7a93]">Payment Type</label>
                        <button
                          type="button"
                          onClick={() => setIsPaymentTypeOpen((current) => !current)}
                          className="flex h-[44px] w-[138px] items-center justify-between rounded-[4px] border border-[#bfc7d6] bg-[#fafafa] px-3 text-left text-[0.95rem] text-[#18263f]"
                        >
                          <span>{entryDraft.paymentType}</span>
                          <Icon name="down" />
                        </button>
                        {isPaymentTypeOpen ? (
                          <div className="absolute left-0 top-[46px] z-20 w-[160px] overflow-hidden rounded-[4px] border border-[#dfe4ee] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.12)]">
                            {paymentTypes.map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  setEntryDraft((current) => ({ ...current, paymentType: option }))
                                  setIsPaymentTypeOpen(false)
                                }}
                                className="block w-full px-4 py-2 text-left text-[0.85rem] text-[#171f2f] hover:bg-slate-50"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <button type="button" className="flex items-center gap-2 text-[0.84rem] text-[#1f6fff]">
                        <Icon name="plus" />
                        <span>Add Payment type</span>
                      </button>
                      <button type="button" className="flex h-[41px] w-[142px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                        <Icon name="document" />
                        <span>ADD DESCRIPTION</span>
                      </button>
                      <button type="button" className="flex h-[41px] w-[142px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                        <Icon name="camera" />
                        <span>ADD IMAGE</span>
                      </button>
                      <button type="button" className="flex h-[41px] w-[142px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                        <Icon name="document" />
                        <span>ADD DOCUMENT</span>
                      </button>
                    </div>
                  ) : currentSlug === 'expenses' ? (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[0.82rem] font-medium text-[#6f7a93]">Payment Type</label>
                        <button type="button" className="flex h-[44px] w-[138px] items-center justify-between rounded-[4px] border border-[#bfc7d6] bg-[#fafafa] px-3 text-left text-[0.95rem] text-[#18263f]">
                          <span>{entryDraft.paymentType}</span>
                          <Icon name="down" />
                        </button>
                      </div>
                      <button type="button" className="flex items-center gap-2 text-[0.84rem] text-[#1f6fff]">
                        <Icon name="plus" />
                        <span>Add Payment type</span>
                      </button>
                      <button type="button" className="flex h-[41px] w-[142px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                        <Icon name="document" />
                        <span>ADD DESCRIPTION</span>
                      </button>
                      <button type="button" className="flex h-[41px] w-[142px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                        <Icon name="camera" />
                        <span>ADD IMAGE</span>
                      </button>
                      <button type="button" className="flex h-[41px] w-[142px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                        <Icon name="document" />
                        <span>ADD DOCUMENT</span>
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative inline-block">
                        <label className="absolute -top-2 left-3 bg-white px-1 text-[0.82rem] font-medium text-[#6f7a93]">Payment Type</label>
                        <button type="button" className="flex h-[44px] w-[138px] items-center justify-between rounded-[4px] border border-[#bfc7d6] bg-[#fafafa] px-3 text-left text-[0.95rem] text-[#18263f]">
                          <span>{entryDraft.paymentType}</span>
                          <Icon name="down" />
                        </button>
                      </div>
                      <button type="button" className="flex items-center gap-2 text-[0.84rem] text-[#1f6fff]">
                        <Icon name="plus" />
                        <span>Add Payment type</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-4 pt-0 md:pt-2">
                  <div className="flex items-center justify-end gap-4 text-[0.88rem] text-[#808a9f]">
                    <span>{currentSlug === 'payment-out' ? 'Receipt No' : currentSlug === 'expenses' ? 'Expense No' : 'Bill Number'}</span>
                    <div className="w-44 border-b border-[#d9d9d9] pb-1 text-left text-[#18263f]">1</div>
                  </div>
                  <div className="flex items-center justify-end gap-4 text-[0.88rem] text-[#808a9f]">
                    <span>Date</span>
                    <div className="flex w-44 items-center justify-between border-b border-[#d9d9d9] pb-1 text-left text-[#18263f]">
                      <span>10/07/2026</span>
                      <Icon name="calendar" />
                    </div>
                  </div>
                  {currentSlug !== 'payment-out' ? (
                    <div className="flex items-center justify-end gap-4 text-[0.88rem] text-[#808a9f]">
                      <span>Invoice Number</span>
                      <div className="w-44 border-b border-[#d9d9d9] pb-1 text-left text-[#b0b7c6]"> </div>
                    </div>
                  ) : null}
                  <div className="flex items-center justify-end gap-4 text-[0.88rem] text-[#808a9f]">
                    <span>{currentSlug === 'payment-out' ? 'Paid' : currentSlug === 'expenses' ? 'Amount' : 'Total'}</span>
                    <input
                      value={entryDraft.amount}
                      onChange={(event) => setEntryDraft((current) => ({ ...current, amount: event.target.value }))}
                      className="w-[186px] rounded-[4px] border border-[#bfc7d6] px-3 py-2 text-right text-[#18263f] outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="border-y border-[#dfe4ee]">
                {currentSlug === 'payment-out' ? (
                  <div className="grid grid-cols-[40px_1fr_120px_120px_180px_140px_180px] items-stretch text-[0.78rem] font-semibold text-[#37507a]">
                    <div className="border-r border-[#dfe4ee] px-2 py-2">#</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">ITEM</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">QTY</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">UNIT</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">PRICE/UNIT</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">AMOUNT</div>
                    <div className="px-2 py-2 text-right">
                      <button type="button" className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#1f6fff] text-[#1f6fff]">
                        <Icon name="plus" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-[40px_1fr_110px_150px_150px_150px] items-stretch text-[0.78rem] font-semibold text-[#37507a]">
                    <div className="border-r border-[#dfe4ee] px-2 py-2">#</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">ITEM</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">QTY</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">UNIT</div>
                    <div className="border-r border-[#dfe4ee] px-2 py-2">PRICE/UNIT</div>
                    <div className="px-2 py-2">AMOUNT</div>
                  </div>
                )}

                <div className="grid min-h-[78px] grid-cols-[40px_1fr_110px_150px_150px_150px] border-t border-[#dfe4ee] text-[0.78rem] text-[#657189] md:grid-cols-[40px_1fr_110px_150px_150px_150px]">
                  <div className="border-r border-[#dfe4ee] px-2 py-4">1</div>
                  <div className="border-r border-[#dfe4ee] bg-[#f6f7fb] px-2 py-4" />
                  <div className="border-r border-[#dfe4ee] px-2 py-4" />
                  <div className="border-r border-[#dfe4ee] px-2 py-4">NONE</div>
                  <div className="border-r border-[#dfe4ee] px-2 py-4" />
                  <div className="px-2 py-4 text-right">0</div>
                </div>
                <div className="grid min-h-[38px] grid-cols-[40px_1fr_110px_150px_150px_150px] border-t border-[#dfe4ee] text-[0.78rem] text-[#657189]">
                  <div className="border-r border-[#dfe4ee] px-2 py-3">2</div>
                  <div className="border-r border-[#dfe4ee] px-2 py-3" />
                  <div className="border-r border-[#dfe4ee] px-2 py-3" />
                  <div className="border-r border-[#dfe4ee] px-2 py-3">NONE</div>
                  <div className="border-r border-[#dfe4ee] px-2 py-3" />
                  <div className="px-2 py-3 text-right">0</div>
                </div>
              </div>

              <div className="grid gap-4 border-b border-[#dfe4ee] bg-[#f6f6f6] px-4 py-4 md:grid-cols-[1fr_280px_1fr] md:px-5">
                <button type="button" className="flex h-[42px] max-w-[352px] items-center gap-3 rounded-[4px] border border-[#d7d7d7] bg-[#f5f5f5] px-4 text-[0.8rem] font-bold text-[#bababa]">
                  <Icon name="document" />
                  <span>{currentSlug === 'expenses' ? 'ADD TERMS & CONDITIONS' : 'ADD TERMS & CONDITIONS'}</span>
                </button>

                <div className="space-y-3">
                  <div className="relative inline-block">
                    <label className="absolute -top-2 left-3 bg-[#f6f6f6] px-1 text-[0.82rem] text-[#7a8194]">Payment Type</label>
                    <button type="button" className="flex h-[44px] w-[138px] items-center justify-between rounded-[4px] border border-[#bfc7d6] bg-[#fafafa] px-3 text-left text-[0.95rem] text-[#18263f]">
                      <span>{entryDraft.paymentType}</span>
                      <Icon name="down" />
                    </button>
                  </div>
                  <button type="button" className="flex items-center gap-2 text-[0.84rem] text-[#1f6fff]">
                    <Icon name="plus" />
                    <span>Add Payment type</span>
                  </button>
                  <div className="flex flex-col gap-3">
                    <button type="button" className="flex h-[36px] w-[110px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                      <Icon name="document" />
                      <span>ADD DESCRIPTION</span>
                    </button>
                    <button type="button" className="flex h-[36px] w-[110px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                      <Icon name="camera" />
                      <span>ADD IMAGE</span>
                    </button>
                    <button type="button" className="flex h-[36px] w-[110px] items-center gap-2 rounded-[4px] border border-[#d9d9d9] bg-[#fafafa] px-3 text-[0.75rem] font-semibold text-[#b6b6b6]">
                      <Icon name="document" />
                      <span>ADD DOCUMENT</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-start justify-end gap-4 pt-2">
                  <div className="space-y-3 text-[0.9rem] text-[#6f7a93]">
                    {currentSlug === 'expenses' ? (
                      <div className="flex items-center gap-2">
                        <span>Discount</span>
                        <input className="h-8 w-20 rounded-[4px] border border-[#bfc7d6] bg-white px-2 text-right outline-none" />
                        <span>(%)</span>
                        <span>-</span>
                        <input className="h-8 w-24 rounded-[4px] border border-[#bfc7d6] bg-white px-2 text-right outline-none" />
                        <span>(Rs)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Discount</span>
                        <input className="h-8 w-20 rounded-[4px] border border-[#bfc7d6] bg-white px-2 text-right outline-none" />
                        <span>(%)</span>
                        <span>-</span>
                        <input className="h-8 w-24 rounded-[4px] border border-[#bfc7d6] bg-white px-2 text-right outline-none" />
                        <span>(Rs)</span>
                      </div>
                    )}
                    {currentSlug === 'expenses' ? (
                      <div className="flex items-center justify-end gap-2">
                        <label className="flex items-center gap-2 text-[0.8rem] text-[#6f7a93]">
                          <input type="checkbox" checked={entryDraft.roundOff} onChange={(event) => setEntryDraft((current) => ({ ...current, roundOff: event.target.checked }))} />
                          <span>Round Off</span>
                        </label>
                        <input className="h-8 w-12 rounded-[4px] border border-[#bfc7d6] bg-white px-2 outline-none" />
                        <span className="font-semibold text-[#33415d]">Total</span>
                        <input className="h-10 w-40 rounded-[4px] border border-[#bfc7d6] bg-white px-2 text-right outline-none" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>Tax</span>
                        <select className="h-8 w-28 rounded-[4px] border border-[#bfc7d6] bg-white px-2 outline-none">
                          <option>NONE</option>
                        </select>
                        <span className="ml-2 font-semibold text-[#33415d]">0</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-[#dfe4ee] bg-white px-4 py-4 md:px-5">
                <button type="button" className="inline-flex items-center gap-2 rounded-[4px] border border-[#82b4ff] bg-white px-4 py-2.5 text-[0.9rem] font-semibold text-[#1f6fff]">
                  <span>Share</span>
                  <span className="border-l border-[#82b4ff] pl-2">⌄</span>
                </button>
                <button
                  type="button"
                  className="rounded-[4px] bg-[linear-gradient(180deg,#1f87ff_0%,#1671f2_100%)] px-6 py-3 text-[0.95rem] font-bold text-white shadow-[0_8px_16px_rgba(31,135,255,0.25)]"
                  onClick={saveRecord}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

function formatAmount(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value || 0))
}

function isWithinRange(dateString, range) {
  const date = parseDate(dateString)
  if (!date) return false
  return date >= parseDate(range.from) && date <= parseDate(range.to)
}

function parseDate(dateString) {
  const [day, month, year] = String(dateString).split('/').map(Number)
  if (!day || !month || !year) return null
  return new Date(year, month - 1, day)
}

export default PurchasePage
