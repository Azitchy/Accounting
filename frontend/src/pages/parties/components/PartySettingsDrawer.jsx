import { useEffect, useState } from 'react'

function PartySettingsDrawer({ open, onClose }) {
  const [state, setState] = useState({
    partyGrouping: true,
    shippingAddress: true,
    printShippingAddress: true,
    managePartyStatus: false,
    paymentReminder: true,
    reminderDays: '1',
    additionalFields: [true, false, false],
  })

  useEffect(() => {
    if (open) return undefined
    setState({
      partyGrouping: true,
      shippingAddress: true,
      printShippingAddress: true,
      managePartyStatus: false,
      paymentReminder: true,
      reminderDays: '1',
      additionalFields: [true, false, false],
    })
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const toggleAdditionalField = (index) => {
    setState((current) => {
      const next = [...current.additionalFields]
      next[index] = !next[index]
      return { ...current, additionalFields: next }
    })
  }

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close party settings"
        className="absolute inset-0 bg-black/35"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-[370px] flex-col bg-white shadow-[0_0_24px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between px-4 py-4">
          <h2 className="text-[0.98rem] font-semibold text-[#2d3550]">Party Settings</h2>
          <button type="button" onClick={onClose} className="text-[1.4rem] leading-none text-[#8d93a6]">
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3">
          <section className="rounded-[6px] bg-[#fafafa] px-3 py-3">
            <h3 className="text-[0.9rem] font-semibold text-[#4a5473]">General</h3>
          </section>

          <div className="space-y-5 px-2 py-4">
            <SettingCheck
              label="Party Grouping"
              checked={state.partyGrouping}
              onToggle={() => setState((c) => ({ ...c, partyGrouping: !c.partyGrouping }))}
            />
            <SettingCheck
              label="Shipping Address"
              checked={state.shippingAddress}
              onToggle={() => setState((c) => ({ ...c, shippingAddress: !c.shippingAddress }))}
            />
            <SettingCheck
              label="Print Shipping Address"
              checked={state.printShippingAddress}
              onToggle={() => setState((c) => ({ ...c, printShippingAddress: !c.printShippingAddress }))}
            />
            <SettingCheck
              label="Manage Party Status"
              checked={state.managePartyStatus}
              onToggle={() => setState((c) => ({ ...c, managePartyStatus: !c.managePartyStatus }))}
            />
            <SettingCheck
              label="Enable Payment Reminder"
              checked={state.paymentReminder}
              onToggle={() => setState((c) => ({ ...c, paymentReminder: !c.paymentReminder }))}
            />

            <div className="ml-8 rounded-[8px] bg-[#fafbff]">
              <div className="mb-2 text-[0.78rem] text-[#7a819b]">Remind me for payment due in</div>
              <div className="flex items-center gap-2">
                <input
                  value={state.reminderDays}
                  onChange={(event) => setState((c) => ({ ...c, reminderDays: event.target.value }))}
                  className="h-9 w-full rounded-[8px] border border-[#d9deea] px-3 text-[0.9rem] outline-none"
                />
                <span className="text-[0.8rem] text-[#8990aa]">(Days)</span>
              </div>
            </div>

            <section className="rounded-[6px] bg-[#fafafa] px-3 py-3">
              <h3 className="text-[0.9rem] font-semibold text-[#4a5473]">Additional fields</h3>
            </section>

            {['Additional Field 1', 'Additional Field 2', 'Additional Field 3'].map((label, index) => (
              <div key={label} className="space-y-2">
                <SettingCheck
                  label={label}
                  checked={state.additionalFields[index]}
                  onToggle={() => toggleAdditionalField(index)}
                />
                <div className="ml-6">
                  <input
                    className="h-9 w-full rounded-[8px] border border-[#d9deea] px-3 text-[0.9rem] text-[#a1a8bc] outline-none"
                    placeholder="Enter Field Name"
                  />
                </div>
                <div className="ml-6 flex items-center justify-end gap-2 text-[0.75rem] text-[#7b8198]">
                  <span>Show In Print</span>
                  <button
                    type="button"
                    className="flex h-4.5 w-8 items-center justify-end rounded-full bg-[#d6d9e6] p-[2px]"
                    aria-label={`Show in print ${label}`}
                  >
                    <span className="h-3 w-3 rounded-full bg-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-[#eceff6] px-4 py-3">
          <button type="button" className="mx-auto flex items-center gap-2 text-[0.92rem] font-medium text-[#475067]">
            <svg viewBox="0 0 20 20" className="h-4.5 w-4.5" aria-hidden="true">
              <path d="M10 4v12M4 10h12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>More Settings</span>
          </button>
        </div>
      </aside>
    </div>
  )
}

function SettingCheck({ label, checked, onToggle }) {
  return (
    <label className="flex items-center gap-2 text-[0.88rem] text-[#3f4761]">
      <input type="checkbox" checked={checked} onChange={onToggle} className="h-4 w-4 accent-[#1e7cff]" />
      <span>{label}</span>
      <span className="text-[0.75rem] text-[#9ba2b8]">i</span>
    </label>
  )
}

export default PartySettingsDrawer
