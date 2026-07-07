import { useEffect } from 'react'

function StockAdjustmentModal({ open, mode, form, onClose, onChangeForm, onToggleMode, onSave }) {
  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const updateForm = (field, value) => onChangeForm((current) => ({ ...current, [field]: value }))

  const toggleMode = () => onToggleMode((current) => (current === 'add' ? 'reduce' : 'add'))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[860px] overflow-hidden rounded-[8px] bg-white shadow-[0_12px_40px_rgba(15,23,42,0.3)]">
        <div className="flex items-center justify-between border-b border-[#eceff6] px-5 py-4">
          <div className="flex items-center gap-5">
            <h2 className="text-[1rem] font-semibold text-[#2b3a55]">Stock Adjustment</h2>
            <button type="button" onClick={toggleMode} className="flex items-center gap-2 text-[0.85rem]">
              <span className={mode === 'add' ? 'font-semibold text-[#1172ff]' : 'font-semibold text-[#a1a8bc]'}>
                Add Stock
              </span>
              <span className="flex h-5 w-10 items-center rounded-full bg-[#197cf0] p-[2px]">
                <span className={`h-4 w-4 rounded-full bg-white transition-transform ${mode === 'reduce' ? 'translate-x-5' : ''}`} />
              </span>
              <span className={mode === 'reduce' ? 'font-semibold text-[#1172ff]' : 'font-semibold text-[#a1a8bc]'}>
                Reduce Stock
              </span>
            </button>
          </div>
          <button type="button" onClick={onClose} className="text-[1.8rem] leading-none text-[#8d93a6]" aria-label="Close">
            ×
          </button>
        </div>

        <div className="px-5 py-5">
          <div className="grid grid-cols-[1fr_180px] gap-6">
            <div>
              <div className="text-[0.78rem] text-[#8d96b4]">Item Name</div>
              <div className="mt-1 text-[0.88rem] font-semibold text-[#2b3a55]">Sample Item</div>
            </div>
            <label className="block">
              <span className="mb-1 block text-right text-[0.78rem] text-[#8d96b4]">Adjustment Date</span>
              <div className="relative">
                <input
                  value={form.adjustmentDate}
                  onChange={(event) => updateForm('adjustmentDate', event.target.value)}
                  className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 pr-8 text-[0.92rem] outline-none"
                />
                <svg viewBox="0 0 24 24" className="absolute right-2 top-2 h-4.5 w-4.5 text-[#a3a8b7]" aria-hidden="true">
                  <rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M4 9h16" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </label>
          </div>

          <div className="mt-3 border-t border-[#eceff6]" />

          <div className="mt-6 grid grid-cols-[146px_188px_1fr] gap-5">
            <input
              value={form.totalQty}
              onChange={(event) => updateForm('totalQty', event.target.value)}
              className="h-9 rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
              placeholder="Total Qty"
            />
            <input
              value={form.atPrice}
              onChange={(event) => updateForm('atPrice', event.target.value)}
              className="h-9 rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
              placeholder="At Price"
            />
            <input
              value={form.details}
              onChange={(event) => updateForm('details', event.target.value)}
              className="h-9 rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
              placeholder="Details"
            />
          </div>

          <div className="mt-9 flex justify-end">
            <button
              type="button"
              onClick={onSave}
              className="rounded-[4px] bg-[linear-gradient(180deg,#1e8bff_0%,#197cf0_100%)] px-7 py-2.5 text-[0.92rem] font-semibold text-white shadow-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockAdjustmentModal
