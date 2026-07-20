import { forwardRef, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../../components/Icon'

const saleViews = {
  invoices: {
    navLabel: 'Sale Invoices',
    pageLabel: 'Sale Invoices',
    path: '/sale/invoices',
    actionLabel: 'Add Sale',
    modalLabel: 'Sale',
    summaryTitle: 'Total Sales Amount',
    summaryFootnote: 'Received: Rs {received} | Balance: Rs {balance}',
    showToolbarSettings: true,
    emptyState: false,
  },
  'estimate-quotation': {
    navLabel: 'Estimate/ Quotation',
    pageLabel: 'Estimate/Quotation',
    path: '/sale/invoices/estimate-quotation',
    actionLabel: 'Add Estimate',
    modalLabel: 'Estimate',
    summaryTitle: 'Total Quotations',
    summaryFootnote: 'Converted: Rs {converted} | Open: Rs {open}',
    showToolbarSettings: false,
    emptyState: true,
  },
  'proforma-invoice': {
    navLabel: 'Proforma Invoice',
    pageLabel: 'Proforma Invoice',
    path: '/sale/invoices/proforma-invoice',
    actionLabel: 'Add Proforma',
    modalLabel: 'Proforma',
    summaryTitle: 'Total Proforma',
    summaryFootnote: 'Converted: Rs {converted} | Open: Rs {open}',
    showToolbarSettings: false,
    emptyState: false,
  },
  'payment-in': {
    navLabel: 'Payment-In',
    pageLabel: 'Payment-In',
    path: '/sale/invoices/payment-in',
    actionLabel: 'Add Payment',
    modalLabel: 'Payment',
    summaryTitle: 'Total Payment-Ins',
    summaryFootnote: 'Collected: Rs {received} | Pending: Rs {balance}',
    showToolbarSettings: false,
    emptyState: false,
  },
  'sale-order': {
    navLabel: 'Sale Order',
    pageLabel: 'Sale Order',
    path: '/sale/invoices/sale-order',
    actionLabel: 'Add Order',
    modalLabel: 'Order',
    summaryTitle: 'Total Sale Orders',
    summaryFootnote: 'Confirmed: Rs {converted} | Open: Rs {open}',
    showToolbarSettings: false,
    emptyState: true,
  },
  'delivery-challan': {
    navLabel: 'Delivery Challan',
    pageLabel: 'Delivery Challan',
    path: '/sale/invoices/delivery-challan',
    actionLabel: 'Add Challan',
    modalLabel: 'Challan',
    summaryTitle: 'Total Challans',
    summaryFootnote: 'Converted: Rs {converted} | Open: Rs {open}',
    showToolbarSettings: false,
    emptyState: true,
  },
  'sale-return-credit-note': {
    navLabel: 'Sale Return/ Credit Note',
    pageLabel: 'Credit Note',
    path: '/sale/invoices/sale-return-credit-note',
    actionLabel: 'Add Credit Note',
    modalLabel: 'Return',
    summaryTitle: 'Total Amount',
    summaryFootnote: 'Received: Rs {received}',
    showToolbarSettings: false,
    emptyState: false,
    tableKind: 'credit-note',
  },
  'vyapar-pos': {
    navLabel: 'Vyapar POS',
    pageLabel: 'Vyapar POS',
    path: '/sale/invoices/vyapar-pos',
    actionLabel: 'Open POS',
    modalLabel: 'POS',
    summaryTitle: 'Total POS Sales',
    summaryFootnote: 'Paid: Rs {received} | Due: Rs {balance}',
    showToolbarSettings: false,
    emptyState: true,
  },
}

const initialTransactions = [
  {
    id: 'sale-2',
    date: '05/07/2026',
    invoiceNo: '2',
    partyName: 'abc',
    transaction: 'Sale',
    paymentType: 'Cash',
    amount: 0,
    balance: 0,
    firm: 'Main Firm',
  },
  {
    id: 'sale-1',
    date: '05/07/2026',
    invoiceNo: '1',
    partyName: 'abc',
    transaction: 'Sale',
    paymentType: 'Cash',
    amount: 1000,
    balance: 1000,
    firm: 'Main Firm',
  },
]

const firmOptions = ['All Firms', 'Main Firm', 'West Branch']
const creditTypeOptions = [
  'All Transaction',
  'Sale',
  'Purchase',
  'Payment-In',
  'Payment-Out',
  'Credit Note',
  'Debit Note',
  'Sale Order',
  'Purchase Order',
  'Estimate',
  'Proforma Invoice',
  'Delivery Challan',
  'Expense',
  'Party to Party [Received]',
  'Party to Party [Paid]',
  'Manufacture',
  'Sale FA',
  'Purchase FA',
  'Sale[Cancelled]',
  'Journal Entry',
]
const rangeOptions = [
  { label: 'Custom', from: '2026-07-01', to: '2026-07-31' },
  { label: 'Today', from: '2026-07-10', to: '2026-07-10' },
  { label: 'This Month', from: '2026-07-01', to: '2026-07-31' },
  { label: 'Last 30 Days', from: '2026-06-11', to: '2026-07-10' },
]

const initialTransactionsByView = {
  invoices: [
    {
      id: 'sale-2',
      date: '05/07/2026',
      invoiceNo: '2',
      partyName: 'abc',
      transaction: 'Sale',
      paymentType: 'Cash',
      amount: 0,
      balance: 0,
      firm: 'Main Firm',
    },
    {
      id: 'sale-1',
      date: '05/07/2026',
      invoiceNo: '1',
      partyName: 'abc',
      transaction: 'Sale',
      paymentType: 'Cash',
      amount: 1000,
      balance: 1000,
      firm: 'Main Firm',
    },
  ],
  'estimate-quotation': [],
  'proforma-invoice': [
    {
      id: 'proforma-2',
      date: '05/07/2026',
      invoiceNo: '2',
      partyName: 'abc',
      transaction: 'Proforma',
      paymentType: 'Credit',
      amount: 0,
      balance: 0,
      firm: 'Main Firm',
    },
    {
      id: 'proforma-1',
      date: '05/07/2026',
      invoiceNo: '1',
      partyName: 'abc',
      transaction: 'Proforma',
      paymentType: 'Credit',
      amount: 1000,
      balance: 1000,
      firm: 'Main Firm',
    },
  ],
  'payment-in': [
    {
      id: 'payment-2',
      date: '05/07/2026',
      invoiceNo: '2',
      partyName: 'abc',
      transaction: 'Payment-In',
      paymentType: 'Cash',
      amount: 0,
      balance: 0,
      firm: 'Main Firm',
    },
    {
      id: 'payment-1',
      date: '05/07/2026',
      invoiceNo: '1',
      partyName: 'abc',
      transaction: 'Payment-In',
      paymentType: 'Cash',
      amount: 1000,
      balance: 1000,
      firm: 'Main Firm',
    },
  ],
  'sale-order': [],
  'delivery-challan': [],
  'sale-return-credit-note': [
    {
      id: 'credit-2',
      date: '05/07/2026',
      refNo: '2',
      partyName: 'abc',
      categoryName: 'General',
      transaction: 'Credit Note',
      paymentType: 'Cash',
      amount: 0,
      balance: 0,
      firm: 'Main Firm',
      receivedPaid: 0,
      total: 0,
    },
    {
      id: 'credit-1',
      date: '05/07/2026',
      refNo: '1',
      partyName: 'abc',
      categoryName: 'General',
      transaction: 'Credit Note',
      paymentType: 'Cash',
      amount: 1000,
      balance: 1000,
      firm: 'Main Firm',
      receivedPaid: 0,
      total: 1000,
    },
  ],
  'vyapar-pos': [],
}

function SaleInvoicesPage() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const currentSlug = pathname.split('/').filter(Boolean).at(-1) || 'invoices'
  const currentView = saleViews[currentSlug] ?? saleViews.invoices
  const searchInputRef = useRef(null)
  const addSaleInputRef = useRef(null)
  const customButtonRef = useRef(null)
  const dateButtonRef = useRef(null)
  const firmButtonRef = useRef(null)
  const creditTypeButtonRef = useRef(null)

  const [transactionsByView, setTransactionsByView] = useState(() => ({ ...initialTransactionsByView }))
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchBar, setShowSearchBar] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [isTitleMenuOpen, setIsTitleMenuOpen] = useState(false)
  const [isRangeMenuOpen, setIsRangeMenuOpen] = useState(false)
  const [isFirmMenuOpen, setIsFirmMenuOpen] = useState(false)
  const [isCustomMenuOpen, setIsCustomMenuOpen] = useState(false)
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [isCreditTypeOpen, setIsCreditTypeOpen] = useState(false)
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false)
  const [activeRowMenuId, setActiveRowMenuId] = useState('')
  const [isEntryOpen, setIsEntryOpen] = useState(false)
  const [presetRange, setPresetRange] = useState(currentSlug === 'estimate-quotation' ? rangeOptions[2] : rangeOptions[0])
  const [draftRange, setDraftRange] = useState(currentSlug === 'estimate-quotation' ? rangeOptions[2] : rangeOptions[0])
  const [selectedFirm, setSelectedFirm] = useState('All Firms')
  const [selectedCreditType, setSelectedCreditType] = useState('Credit Note')
  const [entryForm, setEntryForm] = useState({
    invoiceNo: '',
    partyName: '',
    amount: '',
    paymentType: 'Cash',
    date: '10/07/2026',
  })
  const [creditNoteForm, setCreditNoteForm] = useState({
    refNo: '1',
    partyName: '',
    categoryName: '',
    noteType: 'Credit Note',
    total: '',
    receivedPaid: '',
    balance: '',
    date: '10/07/2026',
  })
  const currentTransactions = transactionsByView[currentSlug] ?? []
  const isEstimateMode = currentSlug === 'estimate-quotation'
  const isCreditNoteMode = currentSlug === 'sale-return-credit-note'

  const visibleTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return currentTransactions.filter((transaction) => {
      const matchesSearch =
        !query ||
        [
          transaction.date,
          transaction.invoiceNo,
          transaction.refNo,
          transaction.partyName,
          transaction.categoryName,
          transaction.transaction,
          transaction.paymentType,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(query))

      const matchesFirm = selectedFirm === 'All Firms' || transaction.firm === selectedFirm
      const matchesRange = isWithinPresetRange(transaction.date, presetRange)

      return matchesSearch && matchesFirm && matchesRange
    })
  }, [currentTransactions, presetRange, searchQuery, selectedFirm])

  const summary = useMemo(() => {
    return visibleTransactions.reduce(
      (accumulator, transaction) => {
        accumulator.total += Number(transaction.amount || 0)
        accumulator.balance += Number(transaction.balance || 0)
        accumulator.received += Number(transaction.amount || 0) - Number(transaction.balance || 0)
        return accumulator
      },
      { total: 0, received: 0, balance: 0 },
    )
  }, [visibleTransactions])

  useEffect(() => {
    if (!showSearchBar) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowSearchBar(false)
    }

    window.addEventListener('keydown', onKeyDown)
    setTimeout(() => searchInputRef.current?.focus(), 0)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showSearchBar])

  useEffect(() => {
    if (!isEntryOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsEntryOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    setTimeout(() => addSaleInputRef.current?.focus(), 0)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isEntryOpen])

  useEffect(() => {
    if (
      !isTitleMenuOpen &&
      !isRangeMenuOpen &&
      !isFirmMenuOpen &&
      !isCustomMenuOpen &&
      !isDatePickerOpen &&
      !isCreditTypeOpen &&
      !isSettingsMenuOpen &&
      !activeRowMenuId
    ) {
      return undefined
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsTitleMenuOpen(false)
        setIsRangeMenuOpen(false)
        setIsFirmMenuOpen(false)
        setIsCustomMenuOpen(false)
        setIsDatePickerOpen(false)
        setIsCreditTypeOpen(false)
        setIsSettingsMenuOpen(false)
        setActiveRowMenuId('')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [
    activeRowMenuId,
    isCustomMenuOpen,
    isDatePickerOpen,
    isCreditTypeOpen,
    isFirmMenuOpen,
    isRangeMenuOpen,
    isSettingsMenuOpen,
    isTitleMenuOpen,
  ])

  useEffect(() => {
    setSearchQuery('')
    setShowSearchBar(false)
    setShowAnalytics(false)
    setIsTitleMenuOpen(false)
    setIsRangeMenuOpen(false)
    setIsFirmMenuOpen(false)
    setIsCustomMenuOpen(false)
    setIsDatePickerOpen(false)
    setIsCreditTypeOpen(false)
    setIsSettingsMenuOpen(false)
    setActiveRowMenuId('')
    setSelectedFirm('All Firms')
    setPresetRange(currentSlug === 'estimate-quotation' ? rangeOptions[2] : rangeOptions[0])
    setDraftRange(currentSlug === 'estimate-quotation' ? rangeOptions[2] : rangeOptions[0])
    setIsEntryOpen(false)
    setSelectedCreditType('Credit Note')
  }, [currentSlug])

  const openEntry = () => {
    if (isCreditNoteMode) {
      const nextRefNo = String(Math.max(0, ...currentTransactions.map((transaction) => Number(transaction.refNo) || 0)) + 1)
      setCreditNoteForm({
        refNo: nextRefNo,
        partyName: '',
        categoryName: '',
        noteType: selectedCreditType || 'Credit Note',
        total: '',
        receivedPaid: '',
        balance: '',
        date: '10/07/2026',
      })
      setIsEntryOpen(true)
      return
    }

    const nextInvoiceNo = String(
      Math.max(0, ...currentTransactions.map((transaction) => Number(transaction.invoiceNo) || 0)) + 1,
    )

    setEntryForm({
      invoiceNo: nextInvoiceNo,
      partyName: '',
      amount: '',
      paymentType: 'Cash',
      date: '10/07/2026',
    })
    setIsEntryOpen(true)
  }

  const saveEntry = () => {
    if (isCreditNoteMode) {
      if (!creditNoteForm.partyName.trim()) return

      const total = Number(creditNoteForm.total || 0)
      const receivedPaid = Number(creditNoteForm.receivedPaid || 0)
      const balance = Number(creditNoteForm.balance || Math.max(total - receivedPaid, 0))
      const nextRecord = {
        id: `credit-${Date.now()}`,
        date: creditNoteForm.date,
        refNo: creditNoteForm.refNo.trim() || String(currentTransactions.length + 1),
        partyName: creditNoteForm.partyName.trim(),
        categoryName: creditNoteForm.categoryName.trim() || 'General',
        transaction: creditNoteForm.noteType || 'Credit Note',
        paymentType: 'Cash',
        amount: total,
        total,
        receivedPaid,
        balance,
        firm: selectedFirm === 'All Firms' ? 'Main Firm' : selectedFirm,
      }

      setTransactionsByView((current) => ({
        ...current,
        [currentSlug]: [nextRecord, ...(current[currentSlug] ?? [])],
      }))
      setIsEntryOpen(false)
      return
    }

    if (!entryForm.partyName.trim()) return

    const amount = Number(entryForm.amount || 0)
    const nextTransaction = {
      id: `sale-${Date.now()}`,
      date: entryForm.date,
      invoiceNo: entryForm.invoiceNo.trim() || String(currentTransactions.length + 1),
      partyName: entryForm.partyName.trim(),
      transaction: isEstimateMode ? 'Estimate' : 'Sale',
      paymentType: entryForm.paymentType,
      amount,
      balance: amount,
      firm: selectedFirm === 'All Firms' ? 'Main Firm' : selectedFirm,
    }

    setTransactionsByView((current) => ({
      ...current,
      [currentSlug]: [nextTransaction, ...(current[currentSlug] ?? [])],
    }))
    setIsEntryOpen(false)
  }

  const exportCsv = () => {
    const headers = ['Date', 'Invoice No', 'Party Name', 'Transaction', 'Payment Type', 'Amount', 'Balance']
    const rows = [
      headers.join(','),
      ...visibleTransactions.map((transaction) =>
        [
          transaction.date,
          transaction.invoiceNo,
          transaction.partyName,
          transaction.transaction,
          transaction.paymentType,
          transaction.amount,
          transaction.balance,
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      ),
    ]

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${sanitizeFilename(currentView.pageLabel)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const shareRow = async (transaction) => {
    const text = [
      `${transaction.partyName} - ${transaction.transaction}`,
      `Invoice No: ${transaction.invoiceNo}`,
      `Date: ${transaction.date}`,
      `Amount: Rs ${formatAmount(transaction.amount)}`,
      `Balance: Rs ${formatAmount(transaction.balance)}`,
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      window.alert('Unable to copy the invoice summary in this browser.')
    }
  }

  const duplicateRow = (transaction) => {
    const duplicate = {
      ...transaction,
      id: `sale-${Date.now()}`,
      invoiceNo: String(Math.max(...currentTransactions.map((item) => Number(item.invoiceNo) || 0)) + 1),
    }

    setTransactionsByView((current) => ({
      ...current,
      [currentSlug]: [duplicate, ...(current[currentSlug] ?? [])],
    }))
  }

  const deleteRow = (transactionId) => {
    setTransactionsByView((current) => ({
      ...current,
      [currentSlug]: (current[currentSlug] ?? []).filter((transaction) => transaction.id !== transactionId),
    }))
    setActiveRowMenuId('')
  }

  const openSelectedView = (path) => {
    navigate(path)
    setIsTitleMenuOpen(false)
  }

  const handleRangeSelect = (option) => {
    setPresetRange(option)
    setIsRangeMenuOpen(false)
  }

  const openCustomMenu = () => {
    setDraftRange(presetRange)
    setIsCustomMenuOpen((current) => !current)
    setIsDatePickerOpen(false)
    setIsRangeMenuOpen(false)
    setIsFirmMenuOpen(false)
  }

  const openDatePicker = () => {
    setDraftRange(presetRange)
    setIsDatePickerOpen((current) => !current)
    setIsCustomMenuOpen(false)
    setIsRangeMenuOpen(false)
    setIsFirmMenuOpen(false)
  }

  const applyDateRange = () => {
    if (!draftRange.from || !draftRange.to) return

    setPresetRange({ label: 'Custom', from: draftRange.from, to: draftRange.to })
    setIsDatePickerOpen(false)
    setIsCustomMenuOpen(false)
  }

  const toggleCreditTypeMenu = () => {
    setIsCreditTypeOpen((current) => !current)
    setIsFirmMenuOpen(false)
    setIsCustomMenuOpen(false)
    setIsDatePickerOpen(false)
  }

  const selectCreditType = (value) => {
    setSelectedCreditType(value)
    setIsCreditTypeOpen(false)
  }

  const handleFirmSelect = (firm) => {
    setSelectedFirm(firm)
    setIsFirmMenuOpen(false)
  }

  const resetFilters = () => {
    setSearchQuery('')
    setShowSearchBar(false)
    setShowAnalytics(false)
    setSelectedFirm('All Firms')
    setPresetRange(rangeOptions[0])
    setIsRangeMenuOpen(false)
    setIsFirmMenuOpen(false)
    setIsSettingsMenuOpen(false)
  }

  if (isCreditNoteMode) {
    return (
      <CreditNotePage
        currentView={currentView}
        summary={summary}
        visibleTransactions={visibleTransactions}
        searchQuery={searchQuery}
        searchInputRef={searchInputRef}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        isTitleMenuOpen={isTitleMenuOpen}
        setIsTitleMenuOpen={setIsTitleMenuOpen}
        isCustomMenuOpen={isCustomMenuOpen}
        customButtonRef={customButtonRef}
        openCustomMenu={openCustomMenu}
        handleRangeSelect={handleRangeSelect}
        setIsCustomMenuOpen={setIsCustomMenuOpen}
        isDatePickerOpen={isDatePickerOpen}
        dateButtonRef={dateButtonRef}
        openDatePicker={openDatePicker}
        draftRange={draftRange}
        setDraftRange={setDraftRange}
        applyDateRange={applyDateRange}
        presetRange={presetRange}
        selectedFirm={selectedFirm}
        setIsFirmMenuOpen={setIsFirmMenuOpen}
        toggleCreditTypeMenu={toggleCreditTypeMenu}
        isCreditTypeOpen={isCreditTypeOpen}
        selectedCreditType={selectedCreditType}
        selectCreditType={selectCreditType}
        creditTypeButtonRef={creditTypeButtonRef}
        isEntryOpen={isEntryOpen}
        openEntry={openEntry}
        saveEntry={saveEntry}
        entryForm={entryForm}
        setEntryForm={setEntryForm}
        creditNoteForm={creditNoteForm}
        setCreditNoteForm={setCreditNoteForm}
        addSaleInputRef={addSaleInputRef}
        isSettingsMenuOpen={isSettingsMenuOpen}
        setIsSettingsMenuOpen={setIsSettingsMenuOpen}
        resetFilters={resetFilters}
        openSelectedView={openSelectedView}
        exportCsv={exportCsv}
        deleteRow={deleteRow}
        duplicateRow={duplicateRow}
        shareRow={shareRow}
        setActiveRowMenuId={setActiveRowMenuId}
        activeRowMenuId={activeRowMenuId}
        currentTransactions={currentTransactions}
        setSearchQuery={setSearchQuery}
        firmButtonRef={firmButtonRef}
        setSelectedFirm={setSelectedFirm}
      />
    )
  }

  return (
    <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
      <header className="flex min-h-[68px] items-center justify-between gap-4 border-b-[3px] border-[#c7d6ea] bg-white px-4 py-2.5">
        <div className="relative flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[1.12rem] font-semibold text-[#30405f]"
            onClick={() => setIsTitleMenuOpen((current) => !current)}
            aria-expanded={isTitleMenuOpen}
            aria-controls="sale-title-menu"
          >
            <span>{currentView.pageLabel}</span>
            <Icon name="down" />
          </button>

          {isTitleMenuOpen ? (
            <Popover onClose={() => setIsTitleMenuOpen(false)} id="sale-title-menu" align="left">
              {Object.values(saleViews).map((view) => (
                <MenuButton
                  key={view.path}
                  label={view.pageLabel}
                  onClick={() => openSelectedView(view.path)}
                  active={view.path === currentView.path}
                />
              ))}
            </Popover>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openEntry}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2.5 text-[0.95rem] font-bold text-white shadow-[0_8px_18px_rgba(235,23,71,0.22)]"
          >
            <Icon name="plus" />
            <span>{currentView.actionLabel}</span>
          </button>

          {currentView.showToolbarSettings ? (
            <>
              <button
                type="button"
                aria-label="Sale settings"
                className="grid h-10 w-10 place-items-center rounded-full border border-[#d8deea] text-[#77819d] hover:bg-slate-50"
                onClick={() => setIsSettingsMenuOpen((current) => !current)}
              >
                <Icon name="settings" />
              </button>

              {isSettingsMenuOpen ? (
                <Popover onClose={() => setIsSettingsMenuOpen(false)} align="right">
                  <MenuButton label="Focus search" onClick={() => setShowSearchBar(true)} />
                  <MenuButton label="Toggle analytics" onClick={() => setShowAnalytics((current) => !current)} />
                  <MenuButton label="Reset filters" onClick={resetFilters} />
                  <MenuButton label="Print invoice list" onClick={() => window.print()} />
                </Popover>
              ) : null}
            </>
          ) : null}
        </div>
      </header>

      <section className="grid h-[calc(100vh-68px)] min-h-0 grid-rows-[auto_auto_auto_1fr]">
        <div className="border-b-[3px] border-[#c7d6ea] bg-white px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-[0.95rem] font-semibold text-[#333d5f]">Filter by :</span>

            <div className="relative">
              <button
                ref={customButtonRef}
                type="button"
                className="inline-flex items-center gap-2 rounded-[18px] bg-[#dceafb] px-4 py-2 text-[0.9rem] font-medium text-[#35456a]"
                onClick={openCustomMenu}
              >
                <span>{presetRange.label}</span>
                <Icon name="down" />
              </button>

              {isCustomMenuOpen ? (
                <AnchoredPopover anchorRef={customButtonRef} onClose={() => setIsCustomMenuOpen(false)}>
                  <div className="px-1">
                    {rangeOptions.map((option) => (
                      <MenuButton
                        key={option.label}
                        label={option.label}
                        onClick={() => handleRangeSelect(option)}
                        active={presetRange.label === option.label}
                      />
                    ))}
                    <div className="my-1 border-t border-[#e8edf5]" />
                    <MenuButton label="Custom dates..." onClick={openDatePicker} />
                  </div>
                </AnchoredPopover>
              ) : null}
            </div>

            <div className="relative">
              <button
                ref={dateButtonRef}
                type="button"
                className="inline-flex items-center gap-2 rounded-[18px] bg-[#dceafb] px-4 py-2 text-[0.9rem] font-medium text-[#35456a]"
                onClick={openDatePicker}
              >
                <Icon name="calendar" />
                <span>
                  {formatDisplayDate(presetRange.from)} To {formatDisplayDate(presetRange.to)}
                </span>
              </button>

              {isDatePickerOpen ? (
                <AnchoredPopover anchorRef={dateButtonRef} onClose={() => setIsDatePickerOpen(false)} widthClass="w-[280px]">
                  <div className="grid gap-3 px-4 py-3">
                    <label className="grid gap-1">
                      <span className="text-[0.8rem] font-semibold text-[#5b6480]">From</span>
                      <input
                        type="date"
                        value={draftRange.from}
                        onChange={(event) => setDraftRange((current) => ({ ...current, from: event.target.value }))}
                        className="rounded-[10px] border border-[#d8deea] px-3 py-2 text-[0.9rem] outline-none focus:border-[#7eaaff]"
                      />
                    </label>
                    <label className="grid gap-1">
                      <span className="text-[0.8rem] font-semibold text-[#5b6480]">To</span>
                      <input
                        type="date"
                        value={draftRange.to}
                        onChange={(event) => setDraftRange((current) => ({ ...current, to: event.target.value }))}
                        className="rounded-[10px] border border-[#d8deea] px-3 py-2 text-[0.9rem] outline-none focus:border-[#7eaaff]"
                      />
                    </label>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-full border border-[#d8deea] px-3 py-2 text-[0.85rem] font-semibold text-[#5f6782]"
                        onClick={() => setIsDatePickerOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-3 py-2 text-[0.85rem] font-semibold text-white"
                        onClick={applyDateRange}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </AnchoredPopover>
              ) : null}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#dceafb] px-4 py-2 text-[0.9rem] font-medium text-[#35456a]"
              onClick={() => {
                setIsFirmMenuOpen((current) => !current)
                setIsRangeMenuOpen(false)
                setIsCustomMenuOpen(false)
                setIsDatePickerOpen(false)
              }}
            >
              <span>{selectedFirm}</span>
              <Icon name="down" />
            </button>
          </div>

          <div className="relative">
            {isFirmMenuOpen ? (
              <Popover onClose={() => setIsFirmMenuOpen(false)} align="left" topOffset="top-[112px]">
                {firmOptions.map((firm) => (
                  <MenuButton
                    key={firm}
                    label={firm}
                    onClick={() => handleFirmSelect(firm)}
                    active={selectedFirm === firm}
                  />
                ))}
              </Popover>
            ) : null}
          </div>
        </div>

        <div className="border-b-[3px] border-[#c7d6ea] bg-white px-3 py-3">
          <div className="grid gap-3 lg:grid-cols-[330px_minmax(0,1fr)]">
            <SummaryCard view={currentView} summary={summary} />
            {showAnalytics && !currentView.emptyState ? <AnalyticsCard transactions={visibleTransactions} /> : <div className="min-h-[96px]" />}
          </div>
        </div>

        {currentView.emptyState ? (
          <EmptyState
            title="No Transactions to show"
            subtitle="You haven't added any transactions yet."
            buttonLabel={currentView.actionLabel}
            onAction={openEntry}
          />
        ) : (
          <>
            <div className="border-b border-[#d8dee8] bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[1rem] font-semibold text-[#24314d]">Transactions</h2>

                <div className="flex items-center gap-4 text-[#7f86a0]">
                  <button type="button" aria-label="Search transactions" onClick={() => setShowSearchBar((current) => !current)}>
                    <Icon name="search" />
                  </button>
                  <button type="button" aria-label="Toggle analytics" onClick={() => setShowAnalytics((current) => !current)}>
                    <Icon name="chart" />
                  </button>
                  <button type="button" aria-label="Export xls" onClick={exportCsv}>
                    <Icon name="xls" />
                  </button>
                  <button type="button" aria-label="Print transactions" onClick={() => window.print()}>
                    <Icon name="print" />
                  </button>
                </div>
              </div>

              {showSearchBar ? (
                <div className="mt-3 max-w-sm">
                  <input
                    ref={searchInputRef}
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search invoice, party, amount..."
                    className="w-full rounded-[12px] border border-[#d8deea] bg-[#fbfcff] px-3 py-2 text-[0.92rem] outline-none ring-0 focus:border-[#8ab6ff]"
                  />
                </div>
              ) : null}
            </div>

            <div className="min-h-0 overflow-x-auto bg-white">
              <table className="min-w-full border-collapse text-[0.88rem]">
                <thead className="bg-[#fbfbfc] text-[#6d7488]">
                  <tr>
                    {['Date', 'Invoice no', 'Party Name', 'Transaction', 'Payment Type', 'Amount', 'Balance', 'Actions'].map((column) => (
                      <th key={column} className="border-b border-[#dde3ee] px-3 py-3 text-left font-medium">
                        <div className="flex items-center justify-between gap-2">
                          <span>{column}</span>
                          <Icon name="filter" />
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {visibleTransactions.length > 0 ? (
                    visibleTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-[#edf0f5] text-[#23314d]">
                        <td className="px-3 py-4">{transaction.date}</td>
                        <td className="px-3 py-4 text-right">{transaction.invoiceNo}</td>
                        <td className="px-3 py-4">{transaction.partyName}</td>
                        <td className="px-3 py-4">{transaction.transaction}</td>
                        <td className="px-3 py-4">{transaction.paymentType}</td>
                        <td className="px-3 py-4 text-right">Rs {formatAmount(transaction.amount)}</td>
                        <td className="px-3 py-4 text-right">Rs {formatAmount(transaction.balance)}</td>
                        <td className="relative px-3 py-4">
                          <div className="relative flex items-center gap-3 text-[#7f86a0]">
                            <button type="button" aria-label="Print invoice" onClick={() => window.print()}>
                              <Icon name="print" />
                            </button>
                            <button type="button" aria-label="Share invoice" onClick={() => shareRow(transaction)}>
                              <Icon name="share" />
                            </button>
                            <button
                              type="button"
                              aria-label="More invoice actions"
                              onClick={() => setActiveRowMenuId((current) => (current === transaction.id ? '' : transaction.id))}
                            >
                              <Icon name="more" />
                            </button>

                            {activeRowMenuId === transaction.id ? (
                              <div className="absolute right-0 top-8 z-20 w-44 rounded-[10px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                                <MenuButton label="View details" onClick={() => setActiveRowMenuId('')} />
                                <MenuButton label="Duplicate" onClick={() => duplicateRow(transaction)} />
                                <MenuButton label="Delete" onClick={() => deleteRow(transaction.id)} danger />
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-14 text-center text-[#8b93a8]">
                        No transactions match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {isEntryOpen ? (
        <ModalShell title={currentView.actionLabel} onClose={() => setIsEntryOpen(false)}>
          <div className="grid gap-3">
            <Field label="Invoice no" value={entryForm.invoiceNo} onChange={(value) => setEntryForm((current) => ({ ...current, invoiceNo: value }))} />
            <Field label="Party name" value={entryForm.partyName} onChange={(value) => setEntryForm((current) => ({ ...current, partyName: value }))} ref={addSaleInputRef} />
            <Field label="Amount" value={entryForm.amount} onChange={(value) => setEntryForm((current) => ({ ...current, amount: value }))} />
            <Field label="Payment type" value={entryForm.paymentType} onChange={(value) => setEntryForm((current) => ({ ...current, paymentType: value }))} />
            <Field label="Date" value={entryForm.date} onChange={(value) => setEntryForm((current) => ({ ...current, date: value }))} />
          </div>

          <div className="mt-5 flex items-center justify-end gap-3">
            <button
              type="button"
              className="rounded-full border border-[#d8deea] px-4 py-2 text-[0.92rem] font-semibold text-[#5f6782]"
              onClick={() => setIsEntryOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.92rem] font-semibold text-white"
              onClick={saveEntry}
            >
              Save {isEstimateMode ? 'Estimate' : 'Sale'}
            </button>
          </div>
        </ModalShell>
      ) : null}
    </main>
  )
}

function SummaryCard({ view, summary }) {
  const converted = formatAmount(summary.received)
  const open = formatAmount(summary.balance)
  const footnote = view.summaryFootnote
    .replace('{received}', converted)
    .replace('{balance}', open)
    .replace('{converted}', converted)
    .replace('{open}', open)

  if (view.emptyState) {
    return (
      <div className="rounded-[10px] border border-[#e1d6f4] bg-[#fcf8ff] p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[0.95rem] font-medium text-[#8a85b8]">{view.summaryTitle}</div>
            <div className="mt-1 text-[1.15rem] font-bold text-[#27314b]">Rs {formatAmount(summary.total)}</div>
          </div>

          <div className="rounded-full bg-white px-2 py-1 text-[0.72rem] font-semibold text-[#4a4f6b] shadow-[0_1px_0_rgba(15,23,42,0.04)]">
            0% ↗
          </div>
        </div>

        <div className="mt-1 text-right text-[0.72rem] text-[#8d93ad]">vs last month</div>

        <div className="mt-4 text-[0.94rem] text-[#8e95b6]">
          <span className="font-semibold text-[#27314b]">{footnote}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[10px] border border-[#e1d6f4] bg-[#fcf8ff] p-4 shadow-[0_1px_0_rgba(255,255,255,0.8)]">
      <div className="text-[0.95rem] font-medium text-[#8a85b8]">{view.summaryTitle}</div>
      <div className="mt-1 text-[1.15rem] font-bold text-[#27314b]">Rs {formatAmount(summary.total)}</div>
      <div className="mt-4 text-[0.94rem] text-[#8e95b6]">
        <span className="font-semibold text-[#27314b]">{footnote}</span>
      </div>
    </div>
  )
}

function EmptyState({ title, subtitle, buttonLabel, onAction }) {
  return (
    <div className="flex min-h-[calc(100vh-276px)] flex-col items-center justify-center bg-white px-6 py-12 text-center">
      <div className="grid h-28 w-28 place-items-center rounded-full bg-[#d7e7ff] text-[#69a7ff]">
        <svg viewBox="0 0 96 96" className="h-24 w-24" aria-hidden="true">
          <circle cx="48" cy="48" r="40" fill="rgba(120,180,255,0.22)" />
          <rect x="26" y="24" width="44" height="12" rx="4" fill="#5fa2ff" opacity="0.9" />
          <rect x="22" y="40" width="52" height="12" rx="4" fill="#4f8ff6" opacity="0.9" />
          <rect x="26" y="56" width="40" height="12" rx="4" fill="#8fc0ff" opacity="0.9" />
          <circle cx="34" cy="30" r="4" fill="#fff" />
          <circle cx="34" cy="46" r="4" fill="#fff" />
          <circle cx="34" cy="62" r="4" fill="#fff" />
        </svg>
      </div>
      <h3 className="mt-4 text-[1rem] font-semibold text-[#4c5575]">{title}</h3>
      <p className="mt-2 text-[0.88rem] text-[#a0a5bf]">{subtitle}</p>
      <button
        type="button"
        onClick={onAction}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2.5 text-[0.95rem] font-bold text-white"
      >
        <Icon name="plus" />
        <span>{buttonLabel}</span>
      </button>
    </div>
  )
}

function CreditNotePage({
  currentView,
  summary,
  visibleTransactions,
  searchQuery,
  searchInputRef,
  showSearchBar,
  setShowSearchBar,
  showAnalytics,
  setShowAnalytics,
  isTitleMenuOpen,
  setIsTitleMenuOpen,
  isCustomMenuOpen,
  customButtonRef,
  openCustomMenu,
  handleRangeSelect,
  setIsCustomMenuOpen,
  isDatePickerOpen,
  dateButtonRef,
  openDatePicker,
  draftRange,
  setDraftRange,
  applyDateRange,
  presetRange,
  selectedFirm,
  setIsFirmMenuOpen,
  firmButtonRef,
  setSelectedFirm,
  toggleCreditTypeMenu,
  isCreditTypeOpen,
  selectedCreditType,
  selectCreditType,
  creditTypeButtonRef,
  isEntryOpen,
  openEntry,
  saveEntry,
  creditNoteForm,
  setCreditNoteForm,
  addSaleInputRef,
  isSettingsMenuOpen,
  setIsSettingsMenuOpen,
  resetFilters,
  openSelectedView,
  exportCsv,
  deleteRow,
  duplicateRow,
  shareRow,
  setActiveRowMenuId,
  activeRowMenuId,
  currentTransactions,
}) {
  return (
    <main className="min-w-0 overflow-hidden bg-[#f6f7fb] text-slate-800">
      <header className="flex min-h-[54px] items-center justify-between gap-4 border-b border-[#d9e0ea] bg-white px-4">
        <div className="relative flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-[1.1rem] font-semibold text-[#1d365c]"
            onClick={() => setIsTitleMenuOpen((current) => !current)}
            aria-expanded={isTitleMenuOpen}
            aria-controls="credit-title-menu"
          >
            <span>{currentView.pageLabel}</span>
            <Icon name="down" />
          </button>

          {isTitleMenuOpen ? (
            <Popover onClose={() => setIsTitleMenuOpen(false)} id="credit-title-menu" align="left">
              {Object.values(saleViews).map((view) => (
                <MenuButton
                  key={view.path}
                  label={view.pageLabel}
                  onClick={() => openSelectedView(view.path)}
                  active={view.path === currentView.path}
                />
              ))}
            </Popover>
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={exportCsv}
            className="grid justify-items-center text-[#3b4a67]"
            aria-label="Excel Report"
          >
            <Icon name="xls" />
            <span className="mt-0.5 text-[0.66rem]">Excel Report</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="grid justify-items-center text-[#3b4a67]"
            aria-label="Print"
          >
            <Icon name="print" />
            <span className="mt-0.5 text-[0.66rem]">Print</span>
          </button>
          <button
            type="button"
            onClick={openEntry}
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

            <button
              type="button"
              ref={customButtonRef}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]"
              onClick={openCustomMenu}
            >
              <span>{presetRange.label}</span>
              <Icon name="down" />
            </button>

            {isCustomMenuOpen ? (
              <AnchoredPopover anchorRef={customButtonRef} onClose={() => setIsCustomMenuOpen(false)}>
                <div className="px-1">
                  {rangeOptions.map((option) => (
                    <MenuButton
                      key={option.label}
                      label={option.label}
                      onClick={() => handleRangeSelect(option)}
                      active={presetRange.label === option.label}
                    />
                  ))}
                  <div className="my-1 border-t border-[#e8edf5]" />
                  <MenuButton label="Custom dates..." onClick={openDatePicker} />
                </div>
              </AnchoredPopover>
            ) : null}

            <button
              type="button"
              ref={dateButtonRef}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]"
              onClick={openDatePicker}
            >
              <Icon name="calendar" />
              <span>
                {formatDisplayDate(presetRange.from)} To {formatDisplayDate(presetRange.to)}
              </span>
            </button>

            {isDatePickerOpen ? (
              <AnchoredPopover anchorRef={dateButtonRef} onClose={() => setIsDatePickerOpen(false)} widthClass="w-[280px]">
                <div className="grid gap-3 px-4 py-3">
                  <label className="grid gap-1">
                    <span className="text-[0.8rem] font-semibold text-[#5b6480]">From</span>
                    <input
                      type="date"
                      value={draftRange.from}
                      onChange={(event) => setDraftRange((current) => ({ ...current, from: event.target.value }))}
                      className="rounded-[10px] border border-[#d8deea] px-3 py-2 text-[0.9rem] outline-none focus:border-[#7eaaff]"
                    />
                  </label>
                  <label className="grid gap-1">
                    <span className="text-[0.8rem] font-semibold text-[#5b6480]">To</span>
                    <input
                      type="date"
                      value={draftRange.to}
                      onChange={(event) => setDraftRange((current) => ({ ...current, to: event.target.value }))}
                      className="rounded-[10px] border border-[#d8deea] px-3 py-2 text-[0.9rem] outline-none focus:border-[#7eaaff]"
                    />
                  </label>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      className="rounded-full border border-[#d8deea] px-3 py-2 text-[0.85rem] font-semibold text-[#5f6782]"
                      onClick={() => setIsDatePickerOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-3 py-2 text-[0.85rem] font-semibold text-white"
                      onClick={applyDateRange}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </AnchoredPopover>
            ) : null}

            <button
              type="button"
              ref={firmButtonRef}
              className="inline-flex items-center gap-2 rounded-[18px] bg-[#deebff] px-4 py-2 text-[0.88rem] font-semibold text-[#31496d]"
              onClick={() => setIsFirmMenuOpen((current) => !current)}
            >
              <span>{selectedFirm}</span>
              <Icon name="down" />
            </button>
            {isFirmMenuOpen ? (
              <AnchoredPopover anchorRef={firmButtonRef} onClose={() => setIsFirmMenuOpen(false)}>
                <div className="px-1">
                  {firmOptions.map((firm) => (
                    <MenuButton
                      key={firm}
                      label={firm}
                      onClick={() => {
                        setSelectedFirm(firm)
                        setIsFirmMenuOpen(false)
                      }}
                      active={selectedFirm === firm}
                    />
                  ))}
                </div>
              </AnchoredPopover>
            ) : null}

            <button
              type="button"
              ref={creditTypeButtonRef}
              className="inline-flex items-center gap-2 rounded-[4px] border border-[#aeb7c8] bg-white px-4 py-2 text-[0.86rem] font-medium text-[#173a71]"
              onClick={toggleCreditTypeMenu}
            >
              <span>{selectedCreditType}</span>
              <Icon name="down" />
            </button>
            {isCreditTypeOpen ? (
              <AnchoredPopover anchorRef={creditTypeButtonRef} onClose={() => setIsCreditTypeOpen(false)} widthClass="w-[170px]">
                <div className="max-h-[280px] overflow-y-auto py-1">
                  {creditTypeOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={[
                        'block w-full px-4 py-2 text-left text-[0.88rem] hover:bg-slate-100',
                        selectedCreditType === item ? 'bg-[#1f63d9] text-white hover:bg-[#1f63d9]' : 'text-[#173a71]',
                      ].join(' ')}
                      onClick={() => selectCreditType(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </AnchoredPopover>
            ) : null}
          </div>
        </div>

        <div className="border-b border-[#d9e0ea] bg-white px-3 py-2">
          <div className="flex items-center gap-3">
            <div className="flex h-[22px] w-[22px] items-center justify-center rounded-sm border border-[#d0d5df] text-[#7d8798]">
              <Icon name="search" />
            </div>
            <input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(event) => {
                setShowSearchBar(true)
                setSearchQuery(event.target.value)
              }}
              placeholder="Search..."
              className="h-[22px] w-[160px] border-none outline-none"
            />
          </div>
        </div>

        <div className="border-b border-[#d9e0ea] bg-white px-2 py-2">
          <div className="grid grid-cols-[34px_110px_110px_170px_160px_120px_120px_130px_120px_1fr] text-[0.75rem] font-semibold uppercase tracking-wide text-[#667085]">
            {['#', 'Date', 'Ref No.', 'Party Name', 'Category Name', 'Type', 'Total', 'Received/Paid', 'Balance', 'Print / Share'].map((column) => (
              <div key={column} className="flex items-center justify-between border-r border-[#e2e6ed] px-2 py-2 last:border-r-0">
                <span>{column}</span>
                {column !== '#' && column !== 'Print / Share' ? <Icon name="filter" /> : null}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto bg-white">
          <div className="min-h-[calc(100vh-360px)]">
            {visibleTransactions.length > 0 ? (
              <table className="w-full border-collapse text-[0.88rem]">
                <tbody>
                  {visibleTransactions.map((transaction, index) => (
                    <tr key={transaction.id} className="border-b border-[#edf0f5] text-[#23314d]">
                      <td className="w-[34px] px-2 py-3 text-center text-[#7c849a]">{index + 1}</td>
                      <td className="px-2 py-3">{transaction.date}</td>
                      <td className="px-2 py-3">{transaction.refNo}</td>
                      <td className="px-2 py-3">{transaction.partyName}</td>
                      <td className="px-2 py-3">{transaction.categoryName}</td>
                      <td className="px-2 py-3">{transaction.transaction}</td>
                      <td className="px-2 py-3 text-right">Rs {formatAmount(transaction.total ?? transaction.amount)}</td>
                      <td className="px-2 py-3 text-right">Rs {formatAmount(transaction.receivedPaid ?? 0)}</td>
                      <td className="px-2 py-3 text-right">Rs {formatAmount(transaction.balance)}</td>
                      <td className="px-2 py-3">
                        <div className="flex items-center justify-end gap-3 text-[#7f86a0]">
                          <button type="button" aria-label="Print credit note" onClick={() => window.print()}>
                            <Icon name="print" />
                          </button>
                          <button type="button" aria-label="Share credit note" onClick={() => shareRow(transaction)}>
                            <Icon name="share" />
                          </button>
                          <button
                            type="button"
                            aria-label="More actions"
                            onClick={() => setActiveRowMenuId((current) => (current === transaction.id ? '' : transaction.id))}
                          >
                            <Icon name="more" />
                          </button>
                          {activeRowMenuId === transaction.id ? (
                            <div className="absolute right-3 mt-8 w-40 rounded-[10px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
                              <MenuButton label="View details" onClick={() => setActiveRowMenuId('')} />
                              <MenuButton label="Duplicate" onClick={() => duplicateRow(transaction)} />
                              <MenuButton label="Delete" onClick={() => deleteRow(transaction.id)} danger />
                            </div>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex min-h-[calc(100vh-412px)] flex-col items-center justify-center px-6 py-10 text-center">
                <div className="mb-5 h-28 w-28 opacity-90">
                  <svg viewBox="0 0 96 96" className="h-full w-full" aria-hidden="true">
                    <circle cx="48" cy="48" r="38" fill="#e8f1ff" />
                    <path d="M35 24h26l6 7v34H29V24h6z" fill="#fff" stroke="#d7d7d7" />
                    <path d="M36 34h24M36 41h24M36 48h16" stroke="#d5d5d5" strokeWidth="2" />
                    <path d="M45 63h6" stroke="#1e78ff" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="text-[0.96rem] font-semibold text-[#4c5575]">No data is available for Credit Note.</h3>
                <p className="mt-1 text-[0.84rem] text-[#8f95b0]">Please try again after making relevant changes.</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#d9e0ea] bg-white px-2 py-2 text-[0.8rem] text-[#1d6a9c]">
          <div>Total Amount: Rs {formatAmount(summary.total)}</div>
          <div>Balance: Rs {formatAmount(summary.balance)}</div>
        </div>
      </section>

      {isEntryOpen ? (
        <ModalShell title={currentView.actionLabel} onClose={() => setIsEntryOpen(false)}>
          <div className="grid gap-3">
            <Field label="Party" value={creditNoteForm.partyName} onChange={(value) => setCreditNoteForm((current) => ({ ...current, partyName: value }))} />
            <Field label="Category Name" value={creditNoteForm.categoryName} onChange={(value) => setCreditNoteForm((current) => ({ ...current, categoryName: value }))} />
            <Field label="Ref No." value={creditNoteForm.refNo} onChange={(value) => setCreditNoteForm((current) => ({ ...current, refNo: value }))} />
            <Field label="Total" value={creditNoteForm.total} onChange={(value) => setCreditNoteForm((current) => ({ ...current, total: value }))} />
            <Field label="Received/Paid" value={creditNoteForm.receivedPaid} onChange={(value) => setCreditNoteForm((current) => ({ ...current, receivedPaid: value }))} />
            <Field label="Balance" value={creditNoteForm.balance} onChange={(value) => setCreditNoteForm((current) => ({ ...current, balance: value }))} />
            <Field label="Date" value={creditNoteForm.date} onChange={(value) => setCreditNoteForm((current) => ({ ...current, date: value }))} />
          </div>
          <div className="mt-5 flex items-center justify-end gap-3">
            <button type="button" className="rounded-full border border-[#d8deea] px-4 py-2 text-[0.92rem] font-semibold text-[#5f6782]" onClick={() => setIsEntryOpen(false)}>
              Cancel
            </button>
            <button type="button" className="rounded-full bg-[linear-gradient(180deg,#ff3058_0%,#eb1747_100%)] px-4 py-2 text-[0.92rem] font-semibold text-white" onClick={saveEntry}>
              Save Credit Note
            </button>
          </div>
        </ModalShell>
      ) : null}
    </main>
  )
}

function AnalyticsCard({ transactions }) {
  const maxAmount = Math.max(1, ...transactions.map((transaction) => Number(transaction.amount) || 0))
  const bars = transactions.slice(0, 5)

  return (
    <div className="rounded-[10px] border border-[#d7e2f1] bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[0.88rem] font-medium text-[#8a93aa]">Sales trend</div>
          <div className="text-[1rem] font-semibold text-[#25314b]">Visible records</div>
        </div>
        <div className="rounded-full bg-[#edf4ff] px-3 py-1 text-[0.8rem] font-semibold text-[#4a74dd]">
          {transactions.length} rows
        </div>
      </div>
      <div className="mt-4 flex h-24 items-end gap-3">
        {bars.map((transaction) => {
          const height = Math.max(12, ((Number(transaction.amount) || 0) / maxAmount) * 100)
          return (
            <div key={transaction.id} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-t-md bg-[linear-gradient(180deg,#6ca8ff_0%,#2d6fed_100%)]"
                style={{ height: `${height}%` }}
              />
              <span className="text-[0.75rem] text-[#8b94ab]">{transaction.invoiceNo}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ModalShell({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[rgba(15,23,42,0.34)] px-4">
      <button type="button" className="absolute inset-0" aria-label={`Close ${title}`} onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-[18px] bg-white p-5 shadow-[0_20px_50px_rgba(15,23,42,0.22)]">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[1.05rem] font-bold text-[#24314d]">{title}</h3>
          <button type="button" aria-label={`Close ${title}`} onClick={onClose} className="text-[#7c849a]">
            <Icon name="x" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const Field = forwardRef(function Field({ label, value, onChange }, ref) {
  return (
    <label className="grid gap-1.5">
      <span className="text-[0.86rem] font-semibold text-[#5b6480]">{label}</span>
      <input
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-[12px] border border-[#d8deea] px-3 py-2.5 text-[0.95rem] outline-none focus:border-[#7eaaff]"
      />
    </label>
  )
})

function Popover({ children, onClose, align = 'left', id, topOffset = 'top-[46px]' }) {
  return (
    <div className="fixed inset-0 z-40">
      <button type="button" className="absolute inset-0" aria-label="Close menu" onClick={onClose} />
      <div
        id={id}
        className={[
          'absolute w-[220px] rounded-[10px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]',
          align === 'right' ? 'right-0' : 'left-0',
          topOffset,
        ].join(' ')}
      >
        {children}
      </div>
    </div>
  )
}

function AnchoredPopover({ children, onClose, anchorRef, widthClass = 'w-[220px]' }) {
  const rect = anchorRef.current?.getBoundingClientRect()
  const top = rect ? Math.round(rect.bottom + 8) : 120
  const left = rect ? Math.round(rect.left) : 16
  const minWidth = rect ? Math.max(Math.round(rect.width), widthClass === 'w-[280px]' ? 280 : 220) : 220

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" className="absolute inset-0" aria-label="Close filter menu" onClick={onClose} />
      <div
        className={`absolute rounded-[10px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)] ${widthClass}`}
        style={{ top, left, minWidth }}
      >
        {children}
      </div>
    </div>
  )
}

function MenuButton({ label, onClick, active = false, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'block w-full px-4 py-3 text-left text-[0.9rem] hover:bg-slate-50',
        active ? 'bg-[#edf4ff] text-[#2b4fa7]' : 'text-[#4f5974]',
        danger ? 'text-rose-600 hover:bg-rose-50' : '',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function formatAmount(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Number(value || 0))
}

function parseDate(value) {
  const text = String(value)

  if (text.includes('-')) {
    const parsed = new Date(`${text}T00:00:00`)
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
  }

  const [day, month, year] = text.split('/').map(Number)
  return new Date(year, month - 1, day)
}

function isWithinPresetRange(value, presetRange) {
  if (!presetRange?.from || !presetRange?.to) return true
  const current = parseDate(value)
  const from = parseDate(presetRange.from)
  const to = parseDate(presetRange.to)
  return current >= from && current <= to
}

function formatDisplayDate(value) {
  if (!value) return ''
  if (value.includes('-')) {
    const [year, month, day] = value.split('-')
    return `${day}/${month}/${year}`
  }
  return value
}

function sanitizeFilename(value) {
  return String(value).replace(/[\\/:*?"<>|]/g, '-')
}

export default SaleInvoicesPage
