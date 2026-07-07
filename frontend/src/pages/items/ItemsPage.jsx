import { useEffect, useMemo, useRef, useState } from 'react'
import TopActionBar from '../../components/TopActionBar'
import ItemsListPanel from './components/ItemsListPanel'
import ItemDetailsPanel from './components/ItemDetailsPanel'
import TransactionsPanel from './components/TransactionsPanel'
import StockAdjustmentModal from './components/StockAdjustmentModal'
import AddItemModal from './components/AddItemModal'

const categoryTabs = ['PRODUCTS', 'SERVICES', 'CATEGORY', 'UNITS']

const initialItems = [
  {
    id: 'sample-item',
    name: 'Sample Item',
    quantity: -10,
    salePrice: 'Rs 100.00',
    purchasePrice: 'Rs 0.00',
    stockValue: 'Rs 0.00',
    transactions: [
      {
        id: 'txn-1',
        type: 'Sale',
        invoiceRef: '1',
        name: 'abc',
        date: '05/07/2026',
        quantity: '10',
        priceUnit: 'Rs 100.00',
        status: 'Unpaid',
      },
    ],
  },
  {
    id: 'item-suu',
    name: 'Suu',
    quantity: 0,
    salePrice: 'Rs 0.00',
    purchasePrice: 'Rs 0.00',
    stockValue: 'Rs 0.00',
    transactions: [],
  },
  {
    id: 'item-azit',
    name: 'Azit',
    quantity: 0,
    salePrice: 'Rs 0.00',
    purchasePrice: 'Rs 0.00',
    stockValue: 'Rs 0.00',
    transactions: [],
  },
  {
    id: 'item-abc',
    name: 'Abc',
    quantity: 1000,
    salePrice: 'Rs 100.00',
    purchasePrice: 'Rs 0.00',
    stockValue: 'Rs 0.00',
    transactions: [
      {
        id: 'txn-abc-1',
        type: 'Sale',
        invoiceRef: '1',
        name: 'abc',
        date: '05/07/2026',
        quantity: '10',
        priceUnit: 'Rs 100.00',
        status: 'Unpaid',
      },
    ],
  },
]

const emptyAdjustForm = {
  totalQty: '',
  atPrice: '',
  details: '',
  adjustmentDate: '07/07/2026',
}

function ItemsPage() {
  const [items, setItems] = useState(initialItems)
  const [selectedItemId, setSelectedItemId] = useState(initialItems[0].id)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('PRODUCTS')
  const [isAdjustOpen, setIsAdjustOpen] = useState(false)
  const [adjustMode, setAdjustMode] = useState('add')
  const [adjustForm, setAdjustForm] = useState(emptyAdjustForm)
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false)
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [addItemTab, setAddItemTab] = useState('pricing')
  const [addItemForm, setAddItemForm] = useState({
    itemName: '',
    category: '',
    unit: '',
    itemCode: '',
    productType: 'product',
    salePrice: '',
    wholesalePrice: '',
    purchasePrice: '',
    openingQty: '',
    minStock: '',
    atPrice: '',
    asOfDate: '05/07/2026',
    location: '',
    imageName: '',
  })
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false)
  const [unitMenuOpen, setUnitMenuOpen] = useState(false)
  const searchInputRef = useRef(null)

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? items[0],
    [items, selectedItemId],
  )

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => item.name.toLowerCase().includes(query))
  }, [items, searchQuery])

  useEffect(() => {
    if (!isHeaderMenuOpen) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsHeaderMenuOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isHeaderMenuOpen])

  const openAdjustModal = () => {
    setAdjustMode('add')
    setAdjustForm(emptyAdjustForm)
    setIsAdjustOpen(true)
  }

  const openAddItemModal = () => {
    setIsAddItemOpen(true)
    setAddItemTab('pricing')
    setCategoryMenuOpen(false)
    setUnitMenuOpen(false)
  }

  const closeAddItemModal = () => {
    setIsAddItemOpen(false)
    setCategoryMenuOpen(false)
    setUnitMenuOpen(false)
  }

  const handleEditItem = () => {
    if (!selectedItem) return

    const nextName = window.prompt('Edit item name', selectedItem.name)
    if (!nextName?.trim()) return

    setItems((current) =>
      current.map((item) => (item.id === selectedItem.id ? { ...item, name: nextName.trim() } : item)),
    )
  }

  const handleCreateItem = () => {
    openAddItemModal()
  }

  const handleSaveNewItem = (keepOpen = false) => {
    if (!addItemForm.itemName.trim()) return

    const newItem = {
      id: `item-${Date.now()}`,
      name: addItemForm.itemName.trim(),
      quantity: Number(addItemForm.openingQty || 0),
      salePrice: addItemForm.salePrice || 'Rs 0.00',
      purchasePrice: addItemForm.purchasePrice || 'Rs 0.00',
      stockValue: 'Rs 0.00',
      transactions: [],
    }

    setItems((current) => [newItem, ...current])
    setSelectedItemId(newItem.id)

    if (keepOpen) {
      setAddItemForm((current) => ({
        ...current,
        itemName: '',
        category: '',
        unit: '',
        itemCode: '',
        salePrice: '',
        wholesalePrice: '',
        purchasePrice: '',
        openingQty: '',
        minStock: '',
        atPrice: '',
        location: '',
        imageName: '',
      }))
      setAddItemTab('pricing')
      return
    }

    closeAddItemModal()
  }

  const handleDeleteItem = (itemId) => {
    setItems((current) => {
      const nextItems = current.filter((item) => item.id !== itemId)

      if (selectedItemId === itemId) {
        setSelectedItemId(nextItems[0]?.id ?? '')
      }

      return nextItems
    })
  }

  const handleSaveAdjustment = () => {
    const qty = Number(adjustForm.totalQty || 0)

    setItems((current) =>
      current.map((item) => {
        if (item.id !== selectedItemId) return item

        const nextQuantity = adjustMode === 'add' ? item.quantity + qty : item.quantity - qty

        return {
          ...item,
          quantity: nextQuantity,
          transactions: [
            {
              id: `adj-${Date.now()}`,
              type: adjustMode === 'add' ? 'Adjustment Added' : 'Adjustment Reduced',
              invoiceRef: '-',
              name: item.name,
              date: adjustForm.adjustmentDate,
              quantity: String(qty || 0),
              priceUnit: adjustForm.atPrice || item.salePrice,
              status: 'Saved',
            },
            ...item.transactions,
          ],
        }
      }),
    )

    setIsAdjustOpen(false)
  }

  const handlePrint = () => window.print()

  const handleExport = () => {
    const headers = ['Type', 'Invoice/Ref. No.', 'Name', 'Date', 'Quantity', 'Price/Unit', 'Status']
    const rows = [
      headers.join(','),
      ...(selectedItem?.transactions ?? []).map((transaction) =>
        [
          transaction.type,
          transaction.invoiceRef,
          transaction.name,
          transaction.date,
          transaction.quantity,
          transaction.priceUnit,
          transaction.status,
        ]
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      ),
    ]

    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedItem?.name ?? 'items'}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-w-0 overflow-hidden bg-[#f5f8fd] text-slate-800">
      <TopActionBar onAddClick={openAddItemModal} onMoreClick={() => setIsHeaderMenuOpen((current) => !current)} />

      <div className="border-b border-[#d5deea] bg-white">
        <div className="grid grid-cols-4 text-center text-[0.9rem] font-semibold uppercase tracking-wide text-[#a0a7b8]">
          {categoryTabs.map((tab) => {
            const active = activeTab === tab

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={[
                  'relative py-3.5 transition-colors',
                  active ? 'text-[#2a2f55]' : 'text-[#a0a7b8]',
                ].join(' ')}
              >
                {tab}
                {active ? <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#4d95ff]" /> : null}
              </button>
            )
          })}
        </div>
      </div>

      <section className="grid h-[calc(100vh-102px)] grid-cols-[318px_minmax(0,1fr)]">
        <ItemsListPanel
          items={filteredItems}
          selectedItemId={selectedItemId}
          onSelectItem={setSelectedItemId}
          onDeleteItem={handleDeleteItem}
          onCreateItem={openAddItemModal}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          searchInputRef={searchInputRef}
        />

        <div className="flex min-h-0 min-w-0 flex-col border-l border-[#cfd8e4] bg-white">
          <ItemDetailsPanel item={selectedItem} onAdjustClick={openAdjustModal} onEditClick={handleEditItem} />
          <TransactionsPanel
            transactions={selectedItem?.transactions ?? []}
            onSearchClick={() => searchInputRef.current?.focus()}
            onPrintClick={handlePrint}
            onExportClick={handleExport}
          />
        </div>
      </section>

      <HeaderActionMenu
        open={isHeaderMenuOpen}
        onClose={() => setIsHeaderMenuOpen(false)}
        onCreateItem={openAddItemModal}
      />

      <AddItemModal
        open={isAddItemOpen}
        activeTab={addItemTab}
        categoryMenuOpen={categoryMenuOpen}
        unitMenuOpen={unitMenuOpen}
        form={addItemForm}
        onClose={closeAddItemModal}
        onTabChange={setAddItemTab}
        onChangeField={setAddItemForm}
        onToggleProductType={(value) =>
          setAddItemForm((current) => ({ ...current, productType: value }))
        }
        onSave={handleSaveNewItem}
        onSaveAndNew={() => handleSaveNewItem(true)}
        onToggleCategoryMenu={() => {
          setCategoryMenuOpen((current) => !current)
          setUnitMenuOpen(false)
        }}
        onPickCategory={(value) => {
          setAddItemForm((current) => ({ ...current, category: value }))
          setCategoryMenuOpen(false)
        }}
        onToggleUnitMenu={() => {
          setUnitMenuOpen((current) => !current)
          setCategoryMenuOpen(false)
        }}
        onPickUnit={(value) => {
          setAddItemForm((current) => ({ ...current, unit: value }))
          setUnitMenuOpen(false)
        }}
        onAssignCode={() =>
          setAddItemForm((current) => ({ ...current, itemCode: `ITM-${String(Date.now()).slice(-5)}` }))
        }
        onChangeImageName={(value) => setAddItemForm((current) => ({ ...current, imageName: value }))}
      />

      <StockAdjustmentModal
        open={isAdjustOpen}
        mode={adjustMode}
        form={adjustForm}
        onClose={() => setIsAdjustOpen(false)}
        onChangeForm={setAdjustForm}
        onToggleMode={setAdjustMode}
        onSave={handleSaveAdjustment}
      />
    </main>
  )
}

function HeaderActionMenu({ open, onClose, onCreateItem }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-30">
      <button
        type="button"
        aria-label="Close header menu"
        className="absolute inset-0 bg-transparent"
        onClick={onClose}
      />
      <div className="absolute right-6 top-[62px] w-[220px] rounded-[8px] border border-[#d8deea] bg-white py-1 shadow-[0_12px_30px_rgba(15,23,42,0.16)]">
        <MenuItem label="Create New Item" onClick={onCreateItem} />
        <MenuItem label="Import Items" onClick={onClose} />
        <MenuItem label="Open Item Report" onClick={onClose} />
      </div>
    </div>
  )
}

function MenuItem({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="block w-full px-4 py-3 text-left text-[0.9rem] text-[#505875] hover:bg-slate-50"
    >
      {label}
    </button>
  )
}

export default ItemsPage
