import { useEffect, useMemo, useRef, useState } from 'react'

const categoryOptions = ['noodles', 'rice', 'drinks', 'snacks']
const unitOptions = ['pcs', 'kg', 'litre', 'box', 'pack']

function AddItemModal({
  open,
  activeTab,
  categoryMenuOpen,
  unitMenuOpen,
  form,
  onClose,
  onTabChange,
  onChangeField,
  onToggleProductType,
  onSave,
  onSaveAndNew,
  onToggleCategoryMenu,
  onPickCategory,
  onToggleUnitMenu,
  onPickUnit,
  onAssignCode,
  onChangeImageName,
}) {
  const [categorySearch, setCategorySearch] = useState('')
  const imageInputRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  const filteredCategories = useMemo(() => {
    const query = categorySearch.trim().toLowerCase()
    if (!query) return categoryOptions
    return categoryOptions.filter((option) => option.toLowerCase().includes(query))
  }, [categorySearch])

  if (!open) return null

  const updateField = (field, value) => onChangeField((current) => ({ ...current, [field]: value }))

  const handleImagePick = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    onChangeImageName(file.name)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#d9e1eb] p-2">
      <div className="flex h-full flex-col overflow-hidden border border-[#ccd6e2] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]">
        <div className="flex h-[48px] items-center justify-between border-b border-[#e1e6ef] px-3.5">
          <div className="flex items-center gap-6">
            <h2 className="text-[0.92rem] font-semibold text-[#1f2a44]">Add Item</h2>
            <div className="flex items-center gap-2 text-[0.8rem]">
              <span className="font-medium text-[#1f7cff]">Product</span>
              <button
                type="button"
                onClick={() => onToggleProductType(form.productType === 'product' ? 'service' : 'product')}
                className="flex h-[20px] w-[32px] items-center rounded-full bg-[#0f74e8] p-[2px]"
                aria-label="Toggle product service"
              >
                <span
                  className={[
                    'h-[16px] w-[16px] rounded-full bg-white transition-transform',
                    form.productType === 'service' ? 'translate-x-[12px]' : '',
                  ].join(' ')}
                />
              </button>
              <span className="font-medium text-[#6d7690]">Service</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[#8a92a6]">
            <button type="button" aria-label="Settings" className="grid h-7 w-7 place-items-center">
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
                <path
                  d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-1.5-.9.1-1.8-1.6-1.6-1.8.1-.9-1.5-2.2-.4-.9 1.5-1.8-.1-1.6 1.6.1 1.8L4 12l.9 1.5-.1 1.8 1.6 1.6 1.8-.1.9 1.5 2.2.4.9-1.5 1.8.1 1.6-1.6-.1-1.8L20 12Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" onClick={onClose} className="text-[1.75rem] leading-none" aria-label="Close">
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          <div className="grid gap-4 lg:grid-cols-[186px_186px_106px_minmax(260px,1fr)] lg:items-start">
            <FieldInput
              value={form.itemName}
              onChange={(event) => updateField('itemName', event.target.value)}
              placeholder="Item Name *"
              focused
            />

            <div className="relative">
              <FieldButton label={form.category || 'Category'} onClick={onToggleCategoryMenu} />
              {categoryMenuOpen ? (
                <div className="absolute left-0 top-[44px] z-20 w-[286px] rounded-[10px] border border-[#d9dee8] bg-white p-3 shadow-[0_10px_30px_rgba(15,23,42,0.18)]">
                  <div className="flex h-9 items-center gap-2 rounded-full border border-[#dbe2ef] px-3 text-[#97a1ba]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                      <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M20 20l-3.5-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <input
                      value={categorySearch}
                      onChange={(event) => setCategorySearch(event.target.value)}
                      className="w-full bg-transparent text-[0.85rem] outline-none"
                      placeholder="Search Category"
                    />
                    <button type="button" onClick={() => setCategorySearch('')} className="text-[0.9rem] text-[#97a1ba]">
                      ×
                    </button>
                  </div>

                  <button type="button" className="mt-3 flex items-center gap-2 text-[0.88rem] font-semibold text-[#2166ff]">
                    <span className="text-[1rem] leading-none">+</span>
                    <span>Add New Category</span>
                  </button>

                  <div className="mt-2 max-h-36 overflow-y-auto">
                    {filteredCategories.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onPickCategory(option)}
                        className="flex w-full items-center gap-2 rounded-[6px] px-2 py-2 text-left text-[0.88rem] text-[#394259] hover:bg-slate-50"
                      >
                        <span className="h-4 w-4 rounded-[3px] border border-[#7e8aa6]" />
                        <span>{option}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative">
              <FieldButton label={form.unit || 'Select Unit'} onClick={onToggleUnitMenu} active />
              {unitMenuOpen ? (
                <div className="absolute left-0 top-[44px] z-20 w-[200px] rounded-[10px] border border-[#d9dee8] bg-white py-1 shadow-[0_10px_30px_rgba(15,23,42,0.18)]">
                  {unitOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => onPickUnit(option)}
                      className="block w-full px-4 py-2.5 text-left text-[0.88rem] text-[#4b556c] hover:bg-slate-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="flex items-center gap-2 pt-[4px] text-[0.86rem] text-[#1f7cff]"
            >
              <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" aria-hidden="true">
                <path d="M4 7h3l2-3h6l2 3h3v11H4z" fill="none" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              <span>Add Item Image</span>
            </button>
            <input ref={imageInputRef} type="file" className="hidden" accept="image/*" onChange={handleImagePick} />
          </div>

          <div className="mt-6 max-w-[186px]">
            <FieldInput
              value={form.itemCode}
              onChange={(event) => updateField('itemCode', event.target.value)}
              placeholder="Item Code"
              suffixButton="Assign Code"
              onSuffixClick={onAssignCode}
            />
          </div>

          <div className="mt-8 border-b border-[#d9dfe8]">
            <div className="flex items-center gap-8 px-1 text-[0.82rem] font-semibold">
              <TabButton active={activeTab === 'pricing'} label="Pricing" onClick={() => onTabChange('pricing')} />
              <TabButton active={activeTab === 'stock'} label="Stock" onClick={() => onTabChange('stock')} />
            </div>
          </div>

          {activeTab === 'pricing' ? (
            <div className="mt-6 rounded-[2px] border border-[#e1e6ef] bg-white p-6">
              <div className="text-[0.8rem] font-semibold text-[#1b2233]">Sale Price</div>
              <div className="mt-3 max-w-[182px]">
                <FieldInput
                  value={form.salePrice}
                  onChange={(event) => updateField('salePrice', event.target.value)}
                  placeholder="Sale Price"
                />
              </div>
              <button type="button" className="mt-6 flex items-center gap-2 text-[0.86rem] font-semibold text-[#1f7cff]">
                <span className="text-[1rem] leading-none">+</span>
                <span>Add Wholesale Price</span>
              </button>

              <div className="mt-4 text-[0.8rem] font-semibold text-[#1b2233]">Purchase Price</div>
              <div className="mt-3 max-w-[182px]">
                <FieldInput
                  value={form.purchasePrice}
                  onChange={(event) => updateField('purchasePrice', event.target.value)}
                  placeholder="Purchase Price"
                />
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="grid gap-3 sm:grid-cols-[180px_180px_180px]">
                <FieldInput
                  value={form.openingQty}
                  onChange={(event) => updateField('openingQty', event.target.value)}
                  placeholder="Opening Quantity"
                />
                <FieldInput value={form.atPrice} onChange={(event) => updateField('atPrice', event.target.value)} placeholder="At Price" />
                <FieldInput value={form.asOfDate} onChange={(event) => updateField('asOfDate', event.target.value)} placeholder="As Of Date" />
              </div>
              <div className="grid gap-3 sm:grid-cols-[180px_180px]">
                <FieldInput
                  value={form.minStock}
                  onChange={(event) => updateField('minStock', event.target.value)}
                  placeholder="Min Stock To Maintain"
                />
                <FieldInput value={form.location} onChange={(event) => updateField('location', event.target.value)} placeholder="Location" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-[#d9dee8] px-3 py-2.5">
          <button
            type="button"
            onClick={onSaveAndNew}
            className="rounded-[5px] border border-[#3d8cff] bg-white px-4 py-2 text-[0.88rem] font-medium text-[#2b84ff]"
          >
            Save & New
          </button>
          <button type="button" onClick={onSave} className="rounded-[5px] bg-[#2b84ff] px-5 py-2 text-[0.88rem] font-semibold text-white">
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

function FieldInput({ value, onChange, placeholder, focused = false, suffixButton, onSuffixClick }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={focused}
        className="h-9 w-full rounded-[3px] border border-[#22314e] bg-white px-3 text-[0.82rem] text-[#24324d] outline-none placeholder:text-[#a5adc0] focus:border-[#1f7cff]"
      />
      {suffixButton ? (
        <button
          type="button"
          onClick={onSuffixClick}
          className="absolute right-1 top-1 rounded-full bg-[#e6f0ff] px-3 py-0.5 text-[0.76rem] font-semibold text-[#2166ff]"
        >
          {suffixButton}
        </button>
      ) : null}
    </div>
  )
}

function FieldButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-9 w-full items-center justify-between rounded-[3px] border border-[#22314e] px-3 text-left text-[0.82rem] text-[#a5adc0]"
    >
      <span>{label}</span>
      <svg viewBox="0 0 20 20" className="h-4 w-4 text-[#9098aa]" aria-hidden="true">
        <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}

function TabButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={['relative pb-2', active ? 'text-[#ff2d56]' : 'text-[#a8aec0]'].join(' ')}
    >
      {label}
      {active ? <span className="absolute inset-x-0 -bottom-[1px] h-0.5 bg-[#ff2d56]" /> : null}
    </button>
  )
}

export default AddItemModal
