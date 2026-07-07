import { useMemo, useRef, useState } from 'react'
import PartiesHeaderBar from './components/PartiesHeaderBar'
import PartiesListPanel from './components/PartiesListPanel'
import PartyDetailsPanel from './components/PartyDetailsPanel'
import TransactionsPanel from './components/TransactionsPanel'
import AddPartyModal from './components/AddPartyModal'
import PartySettingsDrawer from './components/PartySettingsDrawer'
import PartyOverflowMenu from './components/PartyOverflowMenu'

const initialParties = [
  {
    id: 'suu',
    name: 'suu',
    amount: '0.00',
    phone: '',
    billingAddress: '',
    transactions: [],
  },
  {
    id: 'azit',
    name: 'azit',
    amount: '0.00',
    phone: '',
    billingAddress: '',
    transactions: [],
  },
  {
    id: 'auuu',
    name: 'auuu',
    amount: '0.00',
    phone: '9898989',
    billingAddress: 'brt',
    transactions: [],
  },
  {
    id: 'abc',
    name: 'abc',
    amount: '1,000.00',
    phone: '',
    billingAddress: '',
    transactions: [
      {
        id: 'abc-open',
        type: 'Opening Balance',
        number: '-',
        date: '05/07/2026',
        total: '1,000.00',
        balance: '1,000.00',
      },
    ],
  },
]

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  billingAddress: '',
  openingBalance: '',
  asOfDate: '05/07/2026',
}

function PartiesPage() {
  const [parties, setParties] = useState(initialParties)
  const [selectedPartyId, setSelectedPartyId] = useState('auuu')
  const [isAddPartyOpen, setIsAddPartyOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isOverflowOpen, setIsOverflowOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [modalTab, setModalTab] = useState('address')
  const [form, setForm] = useState(emptyForm)
  const [creditLimitMode, setCreditLimitMode] = useState('no-limit')
  const searchInputRef = useRef(null)

  const selectedParty = useMemo(
    () => parties.find((party) => party.id === selectedPartyId) ?? parties[0],
    [parties, selectedPartyId],
  )

  const filteredParties = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return parties

    return parties.filter((party) =>
      [party.name, party.amount, party.phone, party.billingAddress]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query)),
    )
  }, [parties, searchQuery])

  const selectedTransactions = selectedParty?.transactions ?? []

  const openAddParty = () => {
    setIsAddPartyOpen(true)
    setModalTab('address')
    setForm(emptyForm)
    setCreditLimitMode('no-limit')
  }

  const closeAddParty = () => setIsAddPartyOpen(false)
  const toggleSettings = () => {
    setIsSettingsOpen((current) => !current)
    setIsOverflowOpen(false)
  }
  const closeSettings = () => setIsSettingsOpen(false)
  const toggleOverflow = () => {
    setIsOverflowOpen((current) => !current)
    setIsSettingsOpen(false)
  }
  const closeOverflow = () => setIsOverflowOpen(false)
  const focusSearch = () => searchInputRef.current?.focus()

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleDeleteParty = (partyId) => {
    setParties((current) => {
      const nextParties = current.filter((party) => party.id !== partyId)

      if (selectedPartyId === partyId) {
        setSelectedPartyId(nextParties[0]?.id ?? '')
      }

      return nextParties
    })
  }

  const handleSaveParty = (keepOpen = false) => {
    if (!form.name.trim()) return

    const createdId = `party-${Date.now()}`
    const openingBalance = form.openingBalance.trim() || '0.00'
    const newParty = {
      id: createdId,
      name: form.name.trim(),
      amount: openingBalance === '0.00' ? '0.00' : openingBalance,
      phone: form.phone.trim(),
      billingAddress: form.billingAddress.trim(),
      transactions: [
        {
          id: `${createdId}-txn`,
          type: 'Party Created',
          number: form.phone.trim() || '-',
          date: form.asOfDate,
          total: openingBalance,
          balance: openingBalance,
        },
      ],
    }

    setParties((current) => [newParty, ...current])
    setSelectedPartyId(createdId)

    if (keepOpen) {
      setForm(emptyForm)
      setModalTab('address')
      setCreditLimitMode('no-limit')
      return
    }

    setIsAddPartyOpen(false)
  }

  const handlePrintTransactions = () => {
    window.print()
  }

  const handleExportTransactions = () => {
    const headers = ['Type', 'Number', 'Date', 'Total', 'Balance']
    const rows = [
      headers.join(','),
      ...selectedTransactions.map((transaction) =>
        [transaction.type, transaction.number, transaction.date, transaction.total, transaction.balance]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      ),
    ]

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedParty?.name ?? 'transactions'}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="h-full min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
      <PartiesHeaderBar
        onAddPartyClick={openAddParty}
        onSettingsClick={toggleSettings}
        onMoreClick={toggleOverflow}
      />

      <section className="grid h-[calc(100vh-59px)] grid-cols-[318px_minmax(0,1fr)]">
        <PartiesListPanel
          parties={filteredParties}
          selectedPartyId={selectedPartyId}
          onSelectParty={setSelectedPartyId}
          onDeleteParty={handleDeleteParty}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchInputRef={searchInputRef}
        />

        <div className="min-w-0 border-l border-[#cfd8e4] bg-white">
          <PartyDetailsPanel party={selectedParty} />
          <TransactionsPanel
            transactions={selectedTransactions}
            onSearchClick={focusSearch}
            onPrintClick={handlePrintTransactions}
            onExportClick={handleExportTransactions}
          />
        </div>
      </section>

      <AddPartyModal
        open={isAddPartyOpen}
        activeTab={modalTab}
        form={form}
        creditLimitMode={creditLimitMode}
        onClose={closeAddParty}
        onTabChange={setModalTab}
        onChangeField={updateField}
        onToggleCreditLimitMode={setCreditLimitMode}
        onSave={handleSaveParty}
      />

      <PartySettingsDrawer open={isSettingsOpen} onClose={closeSettings} />
      <PartyOverflowMenu open={isOverflowOpen} onClose={closeOverflow} />
    </main>
  )
}

export default PartiesPage
