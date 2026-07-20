import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'

const cashBankViews = {
  'bank-accounts': {
    pageLabel: 'Bank Accounts',
    path: '/cash-bank/bank-accounts',
    actionLabel: 'Add Bank Account',
    summaryTitle: 'Total Bank Balance',
    summaryFootnote: 'Active: Rs {active} | Inactive: Rs {inactive}',
    emptyState: false,
    tableColumns: ['Date', 'Account Name', 'Bank', 'Balance', 'Actions'],
  },
  'cash-in-hand': {
    pageLabel: 'Cash In Hand',
    path: '/cash-bank/cash-in-hand',
    actionLabel: 'Add Cash Entry',
    summaryTitle: 'Cash Balance',
    summaryFootnote: 'In: Rs {active} | Out: Rs {inactive}',
    emptyState: false,
    tableColumns: ['Date', 'Ref No.', 'Type', 'Amount', 'Balance', 'Actions'],
  },
  cheques: {
    pageLabel: 'Cheques',
    path: '/cash-bank/cheques',
    actionLabel: 'Add Cheque',
    summaryTitle: 'Cheque Register',
    summaryFootnote: 'Cleared: Rs {active} | Pending: Rs {inactive}',
    emptyState: true,
    tableColumns: ['Date', 'Ref No.', 'Party Name', 'Bank', 'Amount', 'Status', 'Actions'],
  },
  'loan-accounts': {
    pageLabel: 'Loan Accounts',
    path: '/cash-bank/loan-accounts',
    actionLabel: 'Add Loan',
    summaryTitle: 'Loan Balance',
    summaryFootnote: 'Credit: Rs {active} | Due: Rs {inactive}',
    emptyState: true,
    tableColumns: ['Date', 'Loan No.', 'Party Name', 'Category', 'Amount', 'Balance', 'Actions'],
  },
}

const initialRecordsByView = {
  'bank-accounts': [
    {
      id: 'bank-1',
      date: '05/07/2026',
      refNo: 'BA-001',
      name: 'Main Account',
      bank: 'ABC Bank',
      amount: 1000,
      balance: 1000,
    },
    {
      id: 'bank-2',
      date: '05/07/2026',
      refNo: 'BA-002',
      name: 'Savings',
      bank: 'XYZ Bank',
      amount: 500,
      balance: 500,
    },
  ],
  'cash-in-hand': [
    
  ],
  cheques: [],
  'loan-accounts': [],
}

const initialBankTransactionsById = {
  'bank-1': [
    {
      id: 'bank-1-txn-1',
      type: 'Opening Balance',
      name: 'Opening Balance',
      date: '05/07/2026',
      amount: 60000,
    },
  ],
  'bank-2': [
    {
      id: 'bank-2-txn-1',
      type: 'Opening Balance',
      name: 'Opening Balance',
      date: '05/07/2026',
      amount: 12000,
    },
  ],
}

const bankTransferOptions = [
  'Bank to Cash Transfer',
  'Cash to Bank Transfer',
  'Bank to Bank Transfer',
  'Adjust Bank Balance',
]

const bankAccountFormDefaults = {
  displayName: '',
  openingBalance: '',
  asOfDate: '05/07/2026',
  printDetails: false,
}

const transferFormDefaults = {
  name: '',
  amount: '',
  date: '05/07/2026',
  note: '',
}

function CashBankPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentSlug = pathname.split('/').filter(Boolean).at(-1) || 'bank-accounts'
  const currentView = cashBankViews[currentSlug] ?? cashBankViews['bank-accounts']
  const [recordsByView, setRecordsByView] = useState(() => ({ ...initialRecordsByView }))
  const [bankTransactionsById, setBankTransactionsById] = useState(() => ({ ...initialBankTransactionsById }))
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isBankAccountFormOpen, setIsBankAccountFormOpen] = useState(false)
  const [isCashAdjustOpen, setIsCashAdjustOpen] = useState(false)
  const [isLoanAccountFormOpen, setIsLoanAccountFormOpen] = useState(false)
  const [isTransferMenuOpen, setIsTransferMenuOpen] = useState(false)
  const [isTransactionSearchOpen, setIsTransactionSearchOpen] = useState(false)
  const [selectedTransferAction, setSelectedTransferAction] = useState(bankTransferOptions[0])
  const [selectedBankId, setSelectedBankId] = useState(initialRecordsByView['bank-accounts'][0]?.id ?? '')
  const [bankAccountDraft, setBankAccountDraft] = useState(bankAccountFormDefaults)
  const [cashAdjustDraft, setCashAdjustDraft] = useState({
    mode: 'Add Cash',
    amount: '',
    date: '10/07/2026',
    description: '',
  })
  const [loanDraft, setLoanDraft] = useState({
    accountName: '',
    lenderBank: '',
    accountNumber: '',
    description: '',
    currentBalance: '',
    balanceAsOf: '05/07/2026',
    loanReceivedIn: 'Cash',
    interestRate: '',
    termDuration: '',
    processingFee: '',
    processingFeePaidFrom: 'Cash',
  })
  const [transferDraft, setTransferDraft] = useState(transferFormDefaults)
  const [activeRowMenuId, setActiveRowMenuId] = useState('')
  const [accountSearch, setAccountSearch] = useState('')
  const [transactionSearch, setTransactionSearch] = useState('')
  const searchInputRef = useRef(null)

  const currentRecords = recordsByView[currentSlug] ?? []
  const bankAccounts = recordsByView['bank-accounts'] ?? []
  const selectedBank = bankAccounts.find((record) => record.id === selectedBankId) ?? bankAccounts[0] ?? null
  const selectedBankTransactions = selectedBank ? (bankTransactionsById[selectedBank.id] ?? []) : []

  const summary = useMemo(() => {
    return currentRecords.reduce(
      (accumulator, record) => {
        accumulator.active += Number(record.amount || 0)
        accumulator.inactive += Number(record.balance || 0) - Number(record.amount || 0)
        return accumulator
      },
      { active: 0, inactive: 0 },
    )
  }, [currentRecords])

  const visibleRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return currentRecords

    return currentRecords.filter((record) =>
      Object.values(record)
        .filter((value) => typeof value === 'string' || typeof value === 'number')
      .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [currentRecords, searchQuery])

  const visibleBankAccounts = useMemo(() => {
    const query = accountSearch.trim().toLowerCase()
    if (!query) return bankAccounts

    return bankAccounts.filter((record) =>
      [record.name, record.bank, record.accountNumber, record.balance, record.amount]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [accountSearch, bankAccounts])

  const visibleBankTransactions = useMemo(() => {
    const query = transactionSearch.trim().toLowerCase()
    if (!query) return selectedBankTransactions

    return selectedBankTransactions.filter((record) =>
      [record.type, record.name, record.date, record.amount, record.note]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    )
  }, [selectedBankTransactions, transactionSearch])

  useEffect(() => {
    setSearchQuery('')
    setActiveRowMenuId('')
    setIsAddOpen(false)
    setIsBankAccountFormOpen(false)
    setIsCashAdjustOpen(false)
    setIsLoanAccountFormOpen(false)
    setIsTransferMenuOpen(false)
    setIsTransactionSearchOpen(false)
    setSelectedTransferAction(bankTransferOptions[0])
    setBankAccountDraft(bankAccountFormDefaults)
    setCashAdjustDraft({
      mode: 'Add Cash',
      amount: '',
      date: '10/07/2026',
      description: '',
    })
    setLoanDraft({
      accountName: '',
      lenderBank: '',
      accountNumber: '',
      description: '',
      currentBalance: '',
      balanceAsOf: '05/07/2026',
      loanReceivedIn: 'Cash',
      interestRate: '',
      termDuration: '',
      processingFee: '',
      processingFeePaidFrom: 'Cash',
    })
    setTransferDraft(transferFormDefaults)
    setAccountSearch('')
    setTransactionSearch('')
  }, [currentSlug])

  useEffect(() => {
    if (currentSlug !== 'bank-accounts') return
    if (!selectedBankId && bankAccounts[0]?.id) {
      setSelectedBankId(bankAccounts[0].id)
    }
  }, [bankAccounts, currentSlug, selectedBankId])

  useEffect(() => {
    if (!selectedBankId && bankAccounts[0]?.id) {
      setSelectedBankId(bankAccounts[0].id)
    }
  }, [bankAccounts, selectedBankId])

  const addRecord = () => {
    const nextRecord = {
      id: `cashbank-${Date.now()}`,
      date: '10/07/2026',
      refNo: `${currentView.pageLabel.slice(0, 2).toUpperCase()}-${String(currentRecords.length + 1).padStart(3, '0')}`,
      name: 'abc',
      bank: 'ABC Bank',
      type: currentView.pageLabel,
      amount: 1000,
      balance: 1000,
      status: 'Open',
    }

    setRecordsByView((current) => ({
      ...current,
      [currentSlug]: [nextRecord, ...(current[currentSlug] ?? [])],
    }))
    setIsAddOpen(false)
  }

  const saveBankAccount = () => {
    const nextRecord = {
      id: `bank-${Date.now()}`,
      date: bankAccountDraft.asOfDate,
      refNo: `BA-${String(bankAccounts.length + 1).padStart(3, '0')}`,
      name: bankAccountDraft.displayName || 'New Account',
      bank: 'ABC Bank',
      amount: Number(bankAccountDraft.openingBalance || 0),
      balance: Number(bankAccountDraft.openingBalance || 0),
      accountNumber: '12121212',
      status: 'Open',
    }

    setRecordsByView((current) => ({
      ...current,
      'bank-accounts': [nextRecord, ...(current['bank-accounts'] ?? [])],
    }))
    setBankTransactionsById((current) => ({
      ...current,
      [nextRecord.id]: [
        {
          id: `${nextRecord.id}-txn-1`,
          type: 'Opening Balance',
          name: 'Opening Balance',
          date: nextRecord.date,
          amount: Number(bankAccountDraft.openingBalance || 0),
        },
      ],
    }))
    setSelectedBankId(nextRecord.id)
    setIsBankAccountFormOpen(false)
    setBankAccountDraft(bankAccountFormDefaults)
  }

  const saveCashAdjust = () => {
    const amount = Number(cashAdjustDraft.amount || 0)
    const isAdd = cashAdjustDraft.mode === 'Add Cash'
    const nextRecord = {
      id: `cash-${Date.now()}`,
      date: cashAdjustDraft.date,
      refNo: `CIH-${String((currentRecords.length ?? 0) + 1).padStart(3, '0')}`,
      type: cashAdjustDraft.mode,
      amount,
      balance: isAdd ? amount : -amount,
      description: cashAdjustDraft.description || '',
    }

    setRecordsByView((current) => ({
      ...current,
      'cash-in-hand': [nextRecord, ...(current['cash-in-hand'] ?? [])],
    }))
    setIsCashAdjustOpen(false)
    setCashAdjustDraft({
      mode: 'Add Cash',
      amount: '',
      date: '10/07/2026',
      description: '',
    })
  }

  const saveLoanAccount = () => {
    const nextRecord = {
      id: `loan-${Date.now()}`,
      date: loanDraft.balanceAsOf,
      refNo: `LN-${String((currentRecords.length ?? 0) + 1).padStart(3, '0')}`,
      name: loanDraft.accountName || 'New Loan',
      lenderBank: loanDraft.lenderBank || 'ABC Bank',
      accountNumber: loanDraft.accountNumber || '12121212',
      description: loanDraft.description || '',
      currentBalance: Number(loanDraft.currentBalance || 0),
      loanReceivedIn: loanDraft.loanReceivedIn,
      interestRate: loanDraft.interestRate || '',
      termDuration: loanDraft.termDuration || '',
      processingFee: loanDraft.processingFee || '',
      processingFeePaidFrom: loanDraft.processingFeePaidFrom,
      balance: Number(loanDraft.currentBalance || 0),
      amount: Number(loanDraft.currentBalance || 0),
      bank: loanDraft.lenderBank || 'ABC Bank',
    }

    setRecordsByView((current) => ({
      ...current,
      'loan-accounts': [nextRecord, ...(current['loan-accounts'] ?? [])],
    }))
    setIsLoanAccountFormOpen(false)
    setLoanDraft({
      accountName: '',
      lenderBank: '',
      accountNumber: '',
      description: '',
      currentBalance: '',
      balanceAsOf: '05/07/2026',
      loanReceivedIn: 'Cash',
      interestRate: '',
      termDuration: '',
      processingFee: '',
      processingFeePaidFrom: 'Cash',
    })
  }

  const saveTransfer = () => {
    if (!selectedBank) return

    const amount = Number(transferDraft.amount || 0)
    const nextTransaction = {
      id: `txn-${Date.now()}`,
      type: selectedTransferAction,
      name: transferDraft.name || selectedTransferAction,
      date: transferDraft.date,
      amount,
      note: transferDraft.note,
    }

    setBankTransactionsById((current) => ({
      ...current,
      [selectedBank.id]: [nextTransaction, ...(current[selectedBank.id] ?? [])],
    }))
    setIsAddOpen(false)
    setTransferDraft(transferFormDefaults)
  }

  const exportCsv = () => {
    const rows = [
      currentView.tableColumns.join(','),
      ...visibleRecords.map((record) =>
        currentSlug === 'bank-accounts'
          ? [record.date, record.name, record.bank, record.balance]
              .map((value) => `"${String(value).replaceAll('"', '""')}"`)
              .join(',')
          : [record.date, record.refNo, record.type, record.amount, record.balance]
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

  const openTransferAction = (action) => {
    setSelectedTransferAction(action)
    setIsTransferMenuOpen(false)
    setTransferDraft((current) => ({
      ...current,
      name: action,
    }))
    setIsAddOpen(true)
  }

  if (currentSlug === 'bank-accounts') {
    return (
      <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
        <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#d9e0ea] bg-white px-4">
          <div className="inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[#1d365c]">
            <span>Banks</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsBankAccountFormOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
            >
              <Icon name="plus" />
              <span>Add Bank</span>
            </button>
            <div className="h-7 w-px bg-[#d9e0ea]" />
            <button
              type="button"
              aria-label="More"
              className="grid h-8 w-8 place-items-center rounded-full text-[#677089] hover:bg-slate-100"
              onClick={() => setIsTransferMenuOpen((current) => !current)}
            >
              <Icon name="more" />
            </button>
          </div>
        </header>

        <section className="grid h-[calc(100vh-54px)] min-h-0 grid-cols-[310px_1fr] bg-white">
          <aside className="min-h-0 border-r border-[#d9e0ea] bg-white">
            <div className="border-b border-[#d9e0ea] p-3">
              <div className="flex items-center gap-2 rounded-full border border-[#d8dee9] px-4 py-2 text-[0.88rem] text-[#75809c]">
                <Icon name="search" />
                <input
                  value={accountSearch}
                  onChange={(event) => setAccountSearch(event.target.value)}
                  placeholder="Search by Account/Amount"
                  className="w-full border-none bg-transparent outline-none"
                />
              </div>
            </div>

              <div className="grid grid-cols-[1fr_96px] border-b border-[#d9e0ea] bg-[#fafbfd] text-[0.8rem] font-semibold text-[#55627f]">
                <div className="flex items-center gap-1 border-r border-[#d9e0ea] px-3 py-2">
                  <span>Account Name</span>
                  <span className="text-[#8b96ab]">
                    <Icon name="sort" />
                  </span>
                </div>
                <div className="px-3 py-2">Amount</div>
              </div>

            <div className="min-h-0 overflow-y-auto">
              {visibleBankAccounts.map((record) => (
                <button
                  key={record.id}
                  type="button"
                  onClick={() => setSelectedBankId(record.id)}
                  className={[
                    'grid w-full grid-cols-[1fr_96px] border-b border-[#edf0f5] text-left text-[0.88rem]',
                    selectedBankId === record.id ? 'bg-[#cfe5f3]' : 'bg-white hover:bg-slate-50',
                  ].join(' ')}
                >
                  <div className="border-r border-[#edf0f5] px-3 py-3 font-semibold text-[#12233c]">{record.name}</div>
                  <div className="px-3 py-3 text-right font-semibold text-[#14b8a6]">Rs {formatAmount(record.balance)}</div>
                </button>
              ))}
            </div>
          </aside>

          <div className="min-h-0 overflow-hidden">
            <div className="border-b border-[#d9e0ea] bg-white px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[1rem] font-semibold text-[#12233c]">{selectedBank?.name ?? 'Bank Account'}</h2>
                  <div className="mt-5 grid grid-cols-2 gap-8 text-[0.85rem] text-[#6f7a93]">
                    <div>
                      <div className="mb-1">Bank Name</div>
                      <div className="text-[#12233c]">{selectedBank?.bank ?? '-'}</div>
                    </div>
                    <div>
                      <div className="mb-1">Account Number</div>
                      <div className="text-[#12233c]">{selectedBank?.accountNumber ?? '12121212'}</div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center overflow-hidden rounded-full border border-[#ff355c] text-[0.9rem] font-medium text-[#ff355c]"
                    onClick={() => setIsTransferMenuOpen((current) => !current)}
                  >
                    <span className="px-4 py-2">Deposit / Withdraw</span>
                    <span className="border-l border-[#ff355c]/30 px-3 py-2">
                      <Icon name="down" />
                    </span>
                  </button>

                  {isTransferMenuOpen ? (
                    <div className="absolute right-0 top-full z-20 mt-2 w-[230px] overflow-hidden rounded-[14px] border border-[#d8deea] bg-white shadow-[0_18px_35px_rgba(15,23,42,0.16)]">
                      {bankTransferOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => openTransferAction(option)}
                          className="block w-full px-4 py-3 text-left text-[0.92rem] text-[#45526e] hover:bg-slate-50"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="border-b border-[#d9e0ea] px-4 py-3">
              <div className="flex items-center justify-between">
                <h3 className="text-[0.95rem] font-semibold text-[#12233c]">Transactions</h3>
                <button
                  type="button"
                  aria-label="Search transactions"
                  className="grid h-8 w-8 place-items-center rounded-full text-[#7b8598] hover:bg-slate-100"
                  onClick={() => setIsTransactionSearchOpen((current) => !current)}
                >
                  <Icon name="search" />
                </button>
              </div>
              {isTransactionSearchOpen ? (
                <div className="mt-3 flex items-center gap-2 rounded-full border border-[#d8dee9] px-4 py-2 text-[0.88rem] text-[#75809c]">
                  <Icon name="search" />
                  <input
                    value={transactionSearch}
                    onChange={(event) => setTransactionSearch(event.target.value)}
                    placeholder="Search transactions"
                    className="w-full border-none bg-transparent outline-none"
                  />
                </div>
              ) : null}
            </div>

            <div className="min-h-0 overflow-y-auto">
              <table className="w-full border-collapse text-[0.88rem]">
                <thead className="bg-[#fbfbfc] text-[#6d7488]">
                <tr>
                    {['Type', 'Name', 'Date', 'Amount', 'Actions'].map((column) => (
                      <th key={column} className="border-b border-[#dde3ee] px-3 py-3 text-left font-medium">
                        <div className="flex items-center justify-between gap-2">
                          <span>{column}</span>
                          {column === 'Date' || column === 'Type' || column === 'Name' ? <Icon name="sort" /> : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleBankTransactions.length > 0 ? (
                    visibleBankTransactions.map((record) => (
                      <tr key={record.id} className="border-b border-[#edf0f5] text-[#23314d]">
                        <td className="px-3 py-4 font-medium">{record.type}</td>
                        <td className="px-3 py-4">{record.name}</td>
                        <td className="px-3 py-4">{record.date}</td>
                        <td className="px-3 py-4 text-right text-[#14b8a6]">Rs {formatAmount(record.amount)}</td>
                        <td className="px-3 py-4 text-right">
                          <button type="button" className="text-[#7f86a0]" aria-label="More actions" onClick={() => setActiveRowMenuId((current) => (current === record.id ? '' : record.id))}>
                            <Icon name="more" />
                          </button>
                          {activeRowMenuId === record.id ? (
                            <div className="absolute right-4 z-20 mt-2 w-36 rounded-[10px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                              <button type="button" className="block w-full px-4 py-3 text-left text-[0.9rem] text-[#4f5974] hover:bg-slate-50" onClick={() => setActiveRowMenuId('')}>
                                View details
                              </button>
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-16 text-center text-[#8b93a8]">
                        No transactions to show.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {isBankAccountFormOpen ? (
          <div className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.55)]">
            <button type="button" className="absolute inset-0" aria-label="Close bank account modal" onClick={() => setIsBankAccountFormOpen(false)} />
            <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-[#dfe4ee] px-5 py-3">
                <h3 className="text-[1.1rem] font-bold text-[#11284b]">Add Bank Account</h3>
                <button type="button" className="text-[#7f8798]" onClick={() => setIsBankAccountFormOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>

              <div className="grid flex-1 gap-6 px-5 py-5 md:grid-cols-[1fr_1fr_1fr]">
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Account Display Name <span className="text-[#ef445b]">*</span></span>
                  <input
                    value={bankAccountDraft.displayName}
                    onChange={(event) => setBankAccountDraft((current) => ({ ...current, displayName: event.target.value }))}
                    placeholder="Enter Account Display Name"
                    className="h-10 w-full rounded-[8px] border border-[#cfd6ea] px-3 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Opening Balance</span>
                  <input
                    value={bankAccountDraft.openingBalance}
                    onChange={(event) => setBankAccountDraft((current) => ({ ...current, openingBalance: event.target.value }))}
                    placeholder="Enter Opening Balance"
                    className="h-10 w-full rounded-[8px] border border-[#cfd6ea] px-3 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">As of Date</span>
                  <div className="flex h-10 items-center justify-between rounded-[8px] border border-[#cfd6ea] px-3">
                    <input
                      value={bankAccountDraft.asOfDate}
                      onChange={(event) => setBankAccountDraft((current) => ({ ...current, asOfDate: event.target.value }))}
                      className="w-full border-none outline-none"
                    />
                    <Icon name="calendar" />
                  </div>
                </label>

                <button type="button" className="flex items-center gap-2 text-left text-[0.95rem] font-semibold text-[#1f6fff]">
                  <Icon name="plus" />
                  <span>Add more fields</span>
                </button>
                <label className="flex items-center gap-2 text-[0.9rem] text-[#31496d] md:col-span-2">
                  <input
                    type="checkbox"
                    checked={bankAccountDraft.printDetails}
                    onChange={(event) => setBankAccountDraft((current) => ({ ...current, printDetails: event.target.checked }))}
                  />
                  <span>Print Bank Details on Invoices</span>
                  <span className="text-[#7e879a]"><Icon name="info" /></span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#dfe4ee] bg-white px-5 py-4">
                <button type="button" className="rounded-full bg-[#f4f5f7] px-5 py-2.5 font-semibold text-[#6b7590]" onClick={() => setIsBankAccountFormOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-5 py-2.5 font-semibold text-white" onClick={saveBankAccount}>
                  Save Details
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {isAddOpen ? (
          <div className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.55)]">
            <button type="button" className="absolute inset-0" aria-label="Close transfer modal" onClick={() => setIsAddOpen(false)} />
            <div className="relative z-10 flex h-full w-full flex-col overflow-hidden bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-[#dfe4ee] px-5 py-3">
                <h3 className="text-[1.1rem] font-bold text-[#11284b]">{selectedTransferAction}</h3>
                <button type="button" className="text-[#7f8798]" onClick={() => setIsAddOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>

              <div className="grid flex-1 gap-6 px-5 py-5 md:grid-cols-[1fr_320px]">
                <div className="space-y-5">
                  <label className="block">
                    <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Name</span>
                    <input
                      value={transferDraft.name}
                      onChange={(event) => setTransferDraft((current) => ({ ...current, name: event.target.value }))}
                      className="h-10 w-full max-w-md rounded-[8px] border border-[#cfd6ea] px-3 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Amount</span>
                    <input
                      value={transferDraft.amount}
                      onChange={(event) => setTransferDraft((current) => ({ ...current, amount: event.target.value }))}
                      className="h-10 w-full max-w-md rounded-[8px] border border-[#cfd6ea] px-3 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Date</span>
                    <div className="flex h-10 w-full max-w-md items-center justify-between rounded-[8px] border border-[#cfd6ea] px-3">
                      <input
                        value={transferDraft.date}
                        onChange={(event) => setTransferDraft((current) => ({ ...current, date: event.target.value }))}
                        className="w-full border-none outline-none"
                      />
                      <Icon name="calendar" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Note</span>
                    <textarea
                      value={transferDraft.note}
                      onChange={(event) => setTransferDraft((current) => ({ ...current, note: event.target.value }))}
                      className="min-h-[96px] w-full max-w-md rounded-[8px] border border-[#cfd6ea] px-3 py-2 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                    />
                  </label>
                </div>

                <div className="flex items-end justify-end">
                  <div className="rounded-[16px] border border-[#dfe4ee] bg-[#f8fbff] p-4 text-[0.9rem] text-[#4f5974]">
                    <div className="font-semibold text-[#12233c]">Action</div>
                    <div className="mt-2">{selectedTransferAction}</div>
                    <div className="mt-3 text-[#6f7a93]">This menu is fully clickable and adds a transaction row to the selected bank.</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-[#dfe4ee] bg-white px-5 py-4">
                <button type="button" className="rounded-full bg-[#f4f5f7] px-5 py-2.5 font-semibold text-[#6b7590]" onClick={() => setIsAddOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-5 py-2.5 font-semibold text-white" onClick={saveTransfer}>
                  Save Details
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    )
  }

  if (currentSlug === 'cash-in-hand') {
    const cashBalance = visibleRecords.reduce((total, record) => total + Number(record.balance || record.amount || 0), 0)

    return (
      <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
        <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#d9e0ea] bg-white px-4">
          <div className="inline-flex items-center gap-3 text-[1.1rem] font-semibold text-[#1d365c]">
            <span>Cash In Hand</span>
            <span className="h-6 border-l border-[#d9e0ea]" />
            <span className="text-[0.95rem] font-semibold text-[#00a651]">Rs {formatAmount(cashBalance)}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCashAdjustOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
            >
              <Icon name="plus" />
              <span>Adjust Cash</span>
            </button>
            <button
              type="button"
              aria-label="More"
              className="grid h-8 w-8 place-items-center rounded-full text-[#677089] hover:bg-slate-100"
              onClick={() => setIsTransferMenuOpen((current) => !current)}
            >
              <Icon name="more" />
            </button>
          </div>
        </header>

        <section className="grid h-[calc(100vh-54px)] min-h-0 grid-rows-[1fr_auto] bg-white">
          <div className="min-h-0 overflow-y-auto">
            {visibleRecords.length > 0 ? (
              <table className="w-full border-collapse text-[0.88rem]">
                <thead className="bg-[#fbfbfc] text-[#6d7488]">
                  <tr>
                    {['Type', 'Description', 'Date', 'Amount', 'Actions'].map((column) => (
                      <th key={column} className="border-b border-[#dde3ee] px-3 py-3 text-left font-medium">
                        <div className="flex items-center justify-between gap-2">
                          <span>{column}</span>
                          {column !== 'Actions' ? <Icon name="sort" /> : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[#edf0f5] text-[#23314d]">
                      <td className="px-3 py-4 font-medium">{record.type}</td>
                      <td className="px-3 py-4">{record.description || '-'}</td>
                      <td className="px-3 py-4">{record.date}</td>
                      <td className="px-3 py-4 text-right text-[#14b8a6]">Rs {formatAmount(record.amount)}</td>
                      <td className="px-3 py-4 text-right">
                        <button type="button" className="text-[#7f86a0]" aria-label="More actions" onClick={() => setActiveRowMenuId((current) => (current === record.id ? '' : record.id))}>
                          <Icon name="more" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex min-h-full flex-col items-center justify-center px-6 py-10 text-center">
                <h2 className="text-[1.12rem] font-bold text-[#12233c]">Cash In Hand</h2>
                <div className="mt-1 text-[0.95rem] font-semibold text-[#00a651]">Rs {formatAmount(cashBalance)}</div>
                <div className="mt-10 mb-6 h-48 w-48">
                  <svg viewBox="0 0 220 220" className="h-full w-full" aria-hidden="true">
                    <ellipse cx="112" cy="114" rx="76" ry="56" fill="#dbeafe" opacity="0.8" />
                    <path d="M82 138c0-26 16-49 28-49s28 23 28 49" fill="#73d7b0" />
                    <rect x="93" y="96" width="22" height="56" rx="10" fill="#f6b27c" />
                    <rect x="74" y="112" width="18" height="28" rx="4" fill="#f6b27c" />
                    <rect x="128" y="112" width="18" height="28" rx="4" fill="#f6b27c" />
                    <path d="M94 98 76 82" stroke="#2f855a" strokeWidth="6" strokeLinecap="round" />
                    <path d="M126 98 144 82" stroke="#2f855a" strokeWidth="6" strokeLinecap="round" />
                    <path d="M87 108l23 15 23-15" stroke="#2f855a" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="88" y="144" width="18" height="28" rx="2" fill="#9ca3af" />
                    <rect x="114" y="144" width="18" height="28" rx="2" fill="#9ca3af" />
                    <rect x="102" y="136" width="14" height="18" rx="2" fill="#d1d5db" />
                  </svg>
                </div>
                <p className="max-w-[430px] text-[0.96rem] leading-6 text-[#6f7a93]">
                  Whenever you choose payment type as cash in your invoices,
                  <br />
                  that amount will be reflected in cash in hand.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCashAdjustOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-5 py-3 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
                >
                  <Icon name="plus" />
                  <span>Adjust Cash</span>
                </button>
              </div>
            )}
          </div>
        </section>

        {isCashAdjustOpen ? (
          <div className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.55)]">
            <button type="button" className="absolute inset-0" aria-label="Close cash adjustment modal" onClick={() => setIsCashAdjustOpen(false)} />
            <div className="absolute right-6 top-6 z-10 w-full max-w-[360px] rounded-[14px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-[#dfe4ee] px-4 py-3">
                <h3 className="text-[1.1rem] font-bold text-[#4a4f68]">Adjust Cash</h3>
                <button type="button" className="text-[#7f8798]" onClick={() => setIsCashAdjustOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>
              <div className="space-y-4 px-4 py-4">
                <div className="flex items-center gap-5 text-[0.92rem] text-[#4a4f68]">
                  {['Add Cash', 'Reduce Cash'].map((mode) => (
                    <label key={mode} className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={cashAdjustDraft.mode === mode}
                        onChange={() => setCashAdjustDraft((current) => ({ ...current, mode }))}
                        name="cash-mode"
                      />
                      <span>{mode}</span>
                    </label>
                  ))}
                </div>

                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Enter Amount<span className="text-[#ef445b]">*</span></span>
                  <input
                    value={cashAdjustDraft.amount}
                    onChange={(event) => setCashAdjustDraft((current) => ({ ...current, amount: event.target.value }))}
                    placeholder="Rs 0"
                    className="h-10 w-full rounded-[8px] border border-[#cfd6ea] px-3 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                  />
                </label>
                <div className="text-[0.82rem] text-[#6f7a93]">Updated Cash: <span className="font-semibold text-[#12233c]">Rs {formatAmount(cashBalance)}</span></div>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Adjustment Date</span>
                  <div className="flex h-10 items-center justify-between rounded-[8px] border border-[#cfd6ea] px-3">
                    <input
                      value={cashAdjustDraft.date}
                      onChange={(event) => setCashAdjustDraft((current) => ({ ...current, date: event.target.value }))}
                      className="w-full border-none outline-none"
                    />
                    <Icon name="calendar" />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Description</span>
                  <input
                    value={cashAdjustDraft.description}
                    onChange={(event) => setCashAdjustDraft((current) => ({ ...current, description: event.target.value }))}
                    placeholder="Enter Description"
                    className="h-10 w-full rounded-[8px] border border-[#cfd6ea] px-3 outline-none focus:border-[#1f6fff] focus:ring-2 focus:ring-[#cfe0ff]"
                  />
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-[#dfe4ee] px-4 py-3">
                <button type="button" className="rounded-full bg-[#f4f5f7] px-5 py-2.5 font-semibold text-[#6b7590]" onClick={() => setIsCashAdjustOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-5 py-2.5 font-semibold text-white" onClick={saveCashAdjust}>
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    )
  }

  if (currentSlug === 'loan-accounts') {
    return (
      <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
        <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#d9e0ea] bg-white px-4">
          <div className="inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[#1d365c]">
            <span>Manage Your Loan Accounts</span>
          </div>
          <button
            type="button"
            onClick={() => setIsLoanAccountFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
          >
            <Icon name="plus" />
            <span>Add Loan Account</span>
          </button>
        </header>

        <section className="grid h-[calc(100vh-54px)] min-h-0 grid-rows-[auto_1fr_auto] bg-white">
          <div className="px-4 pt-3 text-center">
            <h2 className="text-[1rem] font-semibold text-[#12233c]">Manage Your Loan Accounts</h2>
            <p className="mt-1 text-[0.9rem] text-[#6f7a93]">Add your loan accounts and check all loan transactions at one place</p>
          </div>

          <div className="flex min-h-0 flex-col items-center justify-center px-6 py-8 text-center">
            <div className="mb-6 h-56 w-56">
              <svg viewBox="0 0 260 260" className="h-full w-full" aria-hidden="true">
                <circle cx="130" cy="128" r="72" fill="#fff4cc" opacity="0.35" />
                <path d="M66 138h128l-14-54H80z" fill="#f4f4f4" stroke="#bababa" strokeWidth="4" />
                <path d="M54 138h152l-19-70H73z" fill="#fff" stroke="#b4b4b4" strokeWidth="4" />
                <path d="M80 88h100l-50-28z" fill="#e9e9e9" stroke="#b4b4b4" strokeWidth="4" />
                <path d="M92 95h76" stroke="#c2c2c2" strokeWidth="4" />
                <rect x="110" y="120" width="40" height="58" fill="#b5b5b5" />
                <rect x="100" y="120" width="18" height="58" fill="#d0d0d0" />
                <rect x="152" y="120" width="18" height="58" fill="#d0d0d0" />
                <rect x="64" y="120" width="18" height="58" fill="#d0d0d0" />
                <rect x="178" y="120" width="18" height="58" fill="#d0d0d0" />
                <rect x="58" y="178" width="144" height="10" fill="#d7d7d7" />
                <rect x="52" y="188" width="156" height="8" fill="#cfcfcf" />
                <circle cx="52" cy="62" r="10" fill="#f9d24b" stroke="#d4a21e" strokeWidth="4" />
                <circle cx="208" cy="54" r="9" fill="#f9d24b" stroke="#d4a21e" strokeWidth="4" />
                <circle cx="226" cy="122" r="10" fill="#f9d24b" stroke="#d4a21e" strokeWidth="4" />
                <circle cx="40" cy="142" r="10" fill="#f9d24b" stroke="#d4a21e" strokeWidth="4" />
                <path d="M52 58l-1 9 7-4z" fill="#8c6113" />
                <path d="M208 50l-1 9 7-4z" fill="#8c6113" />
                <path d="M226 118l-1 9 7-4z" fill="#8c6113" />
                <path d="M40 138l-1 9 7-4z" fill="#8c6113" />
              </svg>
            </div>

            <div className="grid w-full max-w-[1040px] gap-4 md:grid-cols-3">
              {[
                {
                  title: 'All Loans, One Dashboard',
                  text: 'Easily track business loans kept separate from the daily transactions',
                },
                {
                  title: 'Auto EMI Calculation with Every Entry',
                  text: 'Add loan details and the system instantly breaks it down into EMIs',
                },
                {
                  title: 'Manual Flexibility',
                  text: 'Add notes, interest details etc. Keeps it flexible for varied use cases',
                },
              ].map((card) => (
                <div key={card.title} className="rounded-[10px] border border-[#d8dee9] bg-white p-4 text-left shadow-[0_2px_0_rgba(0,0,0,0.02)]">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#dcebff] text-[#1f87ff]">
                    <Icon name="report" />
                  </div>
                  <div className="text-[0.9rem] font-bold text-[#12233c]">{card.title}</div>
                  <div className="mt-1 text-[0.86rem] text-[#6f7a93]">{card.text}</div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsLoanAccountFormOpen(true)}
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-5 py-3 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
            >
              <Icon name="plus" />
              <span>Add Loan Account</span>
            </button>
          </div>

          <div className="px-4 pb-4">
            {visibleRecords.length > 0 ? (
              <table className="w-full border-collapse text-[0.88rem]">
                <thead className="bg-[#fbfbfc] text-[#6d7488]">
                  <tr>
                    {['Account Name', 'Lender Bank', 'Balance', 'Actions'].map((column) => (
                      <th key={column} className="border-b border-[#dde3ee] px-3 py-3 text-left font-medium">
                        <div className="flex items-center justify-between gap-2">
                          <span>{column}</span>
                          {column !== 'Actions' ? <Icon name="sort" /> : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[#edf0f5] text-[#23314d]">
                      <td className="px-3 py-4 font-medium">{record.name}</td>
                      <td className="px-3 py-4">{record.lenderBank}</td>
                      <td className="px-3 py-4 text-right">Rs {formatAmount(record.balance)}</td>
                      <td className="px-3 py-4 text-right">
                        <button type="button" className="text-[#7f86a0]" aria-label="More actions">
                          <Icon name="more" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}
          </div>
        </section>

        {isLoanAccountFormOpen ? (
          <div className="fixed inset-0 z-40 bg-[rgba(15,23,42,0.55)]">
            <button type="button" className="absolute inset-0" aria-label="Close loan account modal" onClick={() => setIsLoanAccountFormOpen(false)} />
            <div className="absolute inset-4 z-10 overflow-hidden rounded-[8px] bg-white shadow-[0_16px_40px_rgba(15,23,42,0.28)]">
              <div className="flex items-center justify-between border-b border-[#dfe4ee] px-5 py-3">
                <h3 className="text-[1.1rem] font-bold text-[#11284b]">Add Loan Account</h3>
                <button type="button" className="text-[#7f8798]" onClick={() => setIsLoanAccountFormOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>
              <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Account Name <span className="text-[#ef445b]">*</span></span>
                  <input value={loanDraft.accountName} onChange={(event) => setLoanDraft((current) => ({ ...current, accountName: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Lender Bank</span>
                  <input value={loanDraft.lenderBank} onChange={(event) => setLoanDraft((current) => ({ ...current, lenderBank: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Account Number</span>
                  <input value={loanDraft.accountNumber} onChange={(event) => setLoanDraft((current) => ({ ...current, accountNumber: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Description</span>
                  <input value={loanDraft.description} onChange={(event) => setLoanDraft((current) => ({ ...current, description: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Current Balance <span className="text-[#ef445b]">*</span></span>
                  <input value={loanDraft.currentBalance} onChange={(event) => setLoanDraft((current) => ({ ...current, currentBalance: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Balance as of</span>
                  <div className="flex h-10 items-center justify-between rounded-[4px] border border-[#bfc7d6] px-3">
                    <input value={loanDraft.balanceAsOf} onChange={(event) => setLoanDraft((current) => ({ ...current, balanceAsOf: event.target.value }))} className="w-full border-none outline-none" />
                    <Icon name="calendar" />
                  </div>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Loan received In</span>
                  <select value={loanDraft.loanReceivedIn} onChange={(event) => setLoanDraft((current) => ({ ...current, loanReceivedIn: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none">
                    <option>Cash</option>
                    <option>Bank</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Interest Rate <span className="ml-2 text-[#8d93a8]">% per annum</span></span>
                  <input value={loanDraft.interestRate} onChange={(event) => setLoanDraft((current) => ({ ...current, interestRate: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Term Duration(in Months)</span>
                  <input value={loanDraft.termDuration} onChange={(event) => setLoanDraft((current) => ({ ...current, termDuration: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Processing Fee</span>
                  <input value={loanDraft.processingFee} onChange={(event) => setLoanDraft((current) => ({ ...current, processingFee: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[0.88rem] text-[#6f7a93]">Processing Fee Paid from</span>
                  <select value={loanDraft.processingFeePaidFrom} onChange={(event) => setLoanDraft((current) => ({ ...current, processingFeePaidFrom: event.target.value }))} className="h-10 w-full rounded-[4px] border border-[#bfc7d6] px-3 outline-none">
                    <option>Cash</option>
                    <option>Bank</option>
                  </select>
                </label>
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-[#dfe4ee] px-5 py-4">
                <button type="button" className="rounded-full bg-[#f4f5f7] px-5 py-2.5 font-semibold text-[#6b7590]" onClick={() => setIsLoanAccountFormOpen(false)}>
                  Cancel
                </button>
                <button type="button" className="rounded-[4px] bg-[linear-gradient(180deg,#1f87ff_0%,#1671f2_100%)] px-5 py-2.5 font-semibold text-white" onClick={saveLoanAccount}>
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    )
  }

  return (
    <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
      <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#d9e0ea] bg-white px-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[#1d365c]"
          onClick={() => navigate('/cash-bank/bank-accounts')}
        >
          <span>{currentView.pageLabel}</span>
          <Icon name="down" />
        </button>

        <div className="flex items-center gap-3">
          <button type="button" onClick={exportCsv} className="grid justify-items-center text-[#3b4a67]" aria-label="Excel Report">
            <Icon name="xls" />
            <span className="mt-0.5 text-[0.66rem]">Excel Report</span>
          </button>
          <button type="button" onClick={() => window.print()} className="grid justify-items-center text-[#3b4a67]" aria-label="Print">
            <Icon name="print" />
            <span className="mt-0.5 text-[0.66rem]">Print</span>
          </button>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
          >
            <Icon name="plus" />
            <span>{currentView.actionLabel}</span>
          </button>
        </div>
      </header>

      <section className="grid h-[calc(100vh-54px)] min-h-0 grid-rows-[auto_auto_auto_1fr_auto] bg-white">
        <div className="border-b border-[#d9e0ea] bg-white px-3 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.95rem] font-semibold text-[#202d4a]">Filter by :</span>
            <button type="button" className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]">
              <span>This Month</span>
              <Icon name="down" />
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]">
              <Icon name="calendar" />
              <span>01/07/2026 To 31/07/2026</span>
            </button>
            <button type="button" className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]">
              <span>ALL FIRMS</span>
              <Icon name="down" />
            </button>
          </div>
        </div>

        <div className="border-b border-[#d9e0ea] bg-white px-3 py-2">
          <input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search..."
            className="h-[22px] w-[160px] border-none outline-none"
          />
        </div>

        <div className="min-h-0 overflow-y-auto bg-white">
          {currentView.emptyState ? (
            <div className="flex min-h-[calc(100vh-244px)] flex-col items-center justify-center px-6 py-10 text-center">
              <div className="mb-5 h-28 w-28 opacity-90">
                <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
                  <circle cx="48" cy="48" r="38" fill="#e8f1ff" />
                  <path d="M35 24h26l6 7v34H29V24h6z" fill="#fff" stroke="#d7d7d7" />
                  <path d="M36 34h24M36 41h24M36 48h16" stroke="#d5d5d5" strokeWidth="2" />
                </svg>
              </div>
              <h3 className="text-[0.96rem] font-semibold text-[#4c5575]">No records to show.</h3>
              <p className="mt-1 text-[0.84rem] text-[#8f95b0]">Please add a new entry to populate the table.</p>
            </div>
          ) : (
            <table className="w-full border-collapse text-[0.88rem]">
              <thead className="bg-[#fbfbfc] text-[#6d7488]">
                <tr>
                  {currentView.tableColumns.map((column) => (
                    <th key={column} className="border-b border-[#dde3ee] px-3 py-3 text-left font-medium">
                      <div className="flex items-center justify-between gap-2">
                        <span>{column}</span>
                        {column !== 'Actions' ? <Icon name="filter" /> : null}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRecords.length > 0 ? (
                  visibleRecords.map((record) => (
                    <tr key={record.id} className="border-b border-[#edf0f5] text-[#23314d]">
                      {currentSlug === 'bank-accounts' ? (
                        <>
                          <td className="px-3 py-4">{record.date}</td>
                          <td className="px-3 py-4">{record.name}</td>
                          <td className="px-3 py-4">{record.bank}</td>
                          <td className="px-3 py-4 text-right">Rs {formatAmount(record.balance)}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-4">{record.date}</td>
                          <td className="px-3 py-4">{record.refNo}</td>
                          <td className="px-3 py-4">{record.type}</td>
                          <td className="px-3 py-4 text-right">Rs {formatAmount(record.amount)}</td>
                          <td className="px-3 py-4 text-right">Rs {formatAmount(record.balance)}</td>
                        </>
                      )}
                      <td className="relative px-3 py-4">
                        <div className="flex items-center justify-end gap-3 text-[#7f86a0]">
                          <button type="button" aria-label="Print" onClick={() => window.print()}>
                            <Icon name="print" />
                          </button>
                          <button type="button" aria-label="Share" onClick={() => navigator.clipboard?.writeText(record.name ?? record.refNo ?? '')}>
                            <Icon name="share" />
                          </button>
                          <button
                            type="button"
                            aria-label="More actions"
                            onClick={() => setActiveRowMenuId((current) => (current === record.id ? '' : record.id))}
                          >
                            <Icon name="more" />
                          </button>
                          {activeRowMenuId === record.id ? (
                            <div className="absolute right-3 top-8 z-20 w-40 rounded-[10px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                              <button type="button" className="block w-full px-4 py-3 text-left text-[0.9rem] text-[#4f5974] hover:bg-slate-50" onClick={() => setActiveRowMenuId('')}>
                                View details
                              </button>
                              <button type="button" className="block w-full px-4 py-3 text-left text-[0.9rem] text-[#4f5974] hover:bg-slate-50" onClick={() => setRecordsByView((current) => ({ ...current, [currentSlug]: [record, ...(current[currentSlug] ?? [])] }))}>
                                Duplicate
                              </button>
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={currentView.tableColumns.length} className="px-4 py-14 text-center text-[#8b93a8]">
                      No records to show.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[#d9e0ea] bg-white px-2 py-2 text-[0.8rem] text-[#1d6a9c]">
          <div>Total: Rs {formatAmount(summary.active)}</div>
          <div>Balance: Rs {formatAmount(summary.inactive)}</div>
        </div>
      </section>

      {isAddOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.34)] px-4">
          <button type="button" className="absolute inset-0" aria-label="Close modal" onClick={() => setIsAddOpen(false)} />
          <div className="relative z-10 w-full max-w-md rounded-[18px] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
            <h3 className="text-[1.05rem] font-bold text-[#24314d]">{currentView.actionLabel}</h3>
            <p className="mt-2 text-[0.9rem] text-[#76809b]">This button adds a row to the table for the current Cash & Bank view.</p>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button type="button" className="rounded-full border border-[#d8deea] px-4 py-2 text-[0.92rem] font-semibold text-[#5f6782]" onClick={() => setIsAddOpen(false)}>
                Cancel
              </button>
              <button type="button" className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.92rem] font-semibold text-white" onClick={addRecord}>
                Save
              </button>
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

export default CashBankPage
