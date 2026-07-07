import { useEffect, useState } from 'react'

function AddPartyModal({
  open,
  activeTab,
  form,
  creditLimitMode,
  onClose,
  onTabChange,
  onChangeField,
  onToggleCreditLimitMode,
  onSave,
}) {
  const [showBillingDetails, setShowBillingDetails] = useState(false)
  const [showShippingDetails, setShowShippingDetails] = useState(false)
  const [shippingEnabled, setShippingEnabled] = useState(false)

  useEffect(() => {
    if (!open) return
    if (activeTab !== 'address') {
      setShowBillingDetails(false)
      setShowShippingDetails(false)
      setShippingEnabled(false)
    }
  }, [open, activeTab])

  useEffect(() => {
    if (!open || activeTab !== 'address') return
    setShippingEnabled(false)
  }, [open, activeTab])

  if (!open) return null

  const tabClasses = (tab) =>
    [
      'relative px-5 py-3 text-[0.92rem] font-semibold transition',
      activeTab === tab ? 'border border-[#1f87ff] bg-[#eaf3ff] text-[#1f87ff]' : 'text-[#c0bfd0]',
    ].join(' ')

  const handleClose = () => {
    setShowBillingDetails(false)
    setShowShippingDetails(false)
    setShippingEnabled(false)
    onClose()
  }

  const handleBillingToggle = () => setShowBillingDetails((current) => !current)
  const handleShippingToggle = () => {
    if (!shippingEnabled) {
      setShippingEnabled(true)
      setShowShippingDetails(true)
      return
    }

    setShowShippingDetails((current) => !current)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/35 p-2.5 pt-4">
      <div className="flex h-[calc(100vh-20px)] w-full max-w-[1120px] flex-col overflow-hidden rounded-[4px] border border-slate-300 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.25)]">
        <div className="flex items-center justify-between border-b border-[#e5e7ef] px-6 py-4">
          <h2 className="text-[1.06rem] font-semibold text-[#2b3a55]">Add Party</h2>

          <div className="flex items-center gap-4 text-[#9aa0b3]">
            <button type="button" aria-label="Settings" className="grid h-7 w-7 place-items-center">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8 3.5-1.4-.8.1-1.8-1.4-1.4-1.8.1-.8-1.4-2.2-.4-.8 1.4-1.8-.1-1.4 1.4.1 1.8-1.4.8.4 2.2-1.4.8.1 1.8 1.4 1.4 1.8-.1.8 1.4 2.2.4.8-1.4 1.8.1 1.4-1.4-.1-1.8 1.4-.8-.4-2.2Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button type="button" aria-label="Close" onClick={handleClose} className="text-[2rem] leading-none">
              ×
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block">
                <span className="mb-1.5 block text-[0.78rem] font-medium text-[#3f72ff]">Party Name *</span>
                <input
                  value={form.name}
                  onChange={(event) => onChangeField('name', event.target.value)}
                  className="h-9 w-full rounded-[4px] border-2 border-[#1e7cff] px-3 text-[0.92rem] outline-none"
                  placeholder="Party Name *"
                />
              </label>
            </div>

            <div>
              <label className="block">
                <span className="mb-1.5 block text-[0.78rem] font-medium text-[#8e97b2]">Phone Number</span>
                <input
                  value={form.phone}
                  onChange={(event) => onChangeField('phone', event.target.value)}
                  className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                  placeholder="Phone Number"
                />
              </label>
            </div>
          </div>

          <div className="mt-9 border-b border-[#d8dce4]">
            <div className="flex items-center gap-9 pl-2 text-[0.94rem] font-semibold">
              {['address', 'credit', 'additional'].map((tab) => {
                const label =
                  tab === 'address'
                    ? 'Address'
                    : tab === 'credit'
                      ? 'Credit & Balance'
                      : 'Additional Fields'
                const isCredit = tab === 'credit'

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => onTabChange(tab)}
                    className={tabClasses(tab)}
                  >
                    <span>{label}</span>
                    {isCredit ? (
                      <span className="ml-2 rounded bg-[#ef2449] px-2 py-0.5 text-[0.72rem] font-bold text-white">
                        New
                      </span>
                    ) : null}
                    {activeTab === tab ? <span className="absolute inset-x-0 -bottom-px h-[3px] bg-[#1e7cff]" /> : null}
                  </button>
                )
              })}
            </div>
          </div>

          {activeTab === 'address' ? (
            <div className="grid grid-cols-[230px_1fr_270px] gap-6 pt-8">
              <div>
                <input
                  value={form.email}
                  onChange={(event) => onChangeField('email', event.target.value)}
                  className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                  placeholder="Email ID"
                />
              </div>

              <div className="border-l border-[#dcdfe8] pl-4">
                <div className="mb-2 text-[0.92rem] font-semibold text-[#4a536f]">Billing Address</div>
                <textarea
                  value={form.billingAddress}
                  onChange={(event) => onChangeField('billingAddress', event.target.value)}
                  className="h-[52px] w-full rounded-[4px] border border-[#c7cad6] px-3 py-2 text-[0.92rem] outline-none"
                  placeholder="Billing Address"
                />

                {showBillingDetails ? (
                  <>
                    <button type="button" onClick={handleBillingToggle} className="mt-2 inline-flex items-center gap-1 text-[0.82rem] text-[#1172ff]">
                      <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                        <path d="M4 10c1.7-3 4-4.5 6-4.5S14.3 7 16 10c-1.7 3-4 4.5-6 4.5S5.7 13 4 10Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        <circle cx="10" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      </svg>
                      <span>Hide Detailed Address</span>
                    </button>

                    <div className="mt-3 space-y-3">
                      <input
                        className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                        placeholder="Address Line 1"
                      />
                      <input
                        className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                        placeholder="Address Line 2"
                      />
                      <div className="grid grid-cols-2 gap-1.5">
                        <input
                          className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                          placeholder="City/Town"
                        />
                        <input
                          className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                          placeholder="State/Province"
                        />
                      </div>
                      <input
                        className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                        placeholder="Zip/Postal Code"
                      />
                      <select className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none">
                        <option>Nepal</option>
                        <option>India</option>
                        <option>United States</option>
                      </select>
                      <div className="flex justify-center gap-2">
                        <button type="button" className="rounded-full bg-[#eef0f7] px-4 py-1.5 text-[0.78rem] font-semibold text-[#8f95ad]">
                          Cancel
                        </button>
                        <button type="button" className="rounded-full bg-[#c9cce4] px-4 py-1.5 text-[0.78rem] font-semibold text-white">
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <button type="button" onClick={handleBillingToggle} className="mt-2 inline-flex items-center gap-1 text-[0.82rem] text-[#1172ff]">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M4 10c1.7-3 4-4.5 6-4.5S14.3 7 16 10c-1.7 3-4 4.5-6 4.5S5.7 13 4 10Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                      <circle cx="10" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                    <span>Show Detailed Address</span>
                  </button>
                )}
              </div>

              <div className="pt-3">
                <div className="mb-2 text-[0.92rem] font-semibold text-[#4a536f]">Shipping Address</div>
                {shippingEnabled ? (
                  <>
                    <textarea
                      className="h-[44px] w-full rounded-[4px] border border-[#c7cad6] px-3 py-2 text-[0.92rem] outline-none"
                      placeholder="Shipping Address"
                    />

                    {showShippingDetails ? (
                      <>
                      <button type="button" onClick={handleShippingToggle} className="mt-2 inline-flex items-center gap-1 text-[0.82rem] text-[#1172ff]">
                        <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" aria-hidden="true">
                          <path d="M4 10c1.7-3 4-4.5 6-4.5S14.3 7 16 10c-1.7 3-4 4.5-6 4.5S5.7 13 4 10Z" fill="none" stroke="currentColor" strokeWidth="1.4" />
                          <circle cx="10" cy="10" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
                        </svg>
                        <span>Hide Detailed Address</span>
                        </button>

                        <div className="mt-3 space-y-3">
                          <input
                            className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                            placeholder="Address Line 1"
                          />
                          <input
                            className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                            placeholder="Address Line 2"
                          />
                          <div className="grid grid-cols-2 gap-1.5">
                            <input
                              className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                              placeholder="City/Town"
                            />
                            <input
                              className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                              placeholder="State/Province"
                            />
                          </div>
                          <input
                            className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                            placeholder="Zip/Postal Code"
                          />
                          <select className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none">
                            <option>Nepal</option>
                            <option>India</option>
                            <option>United States</option>
                          </select>
                          <div className="flex justify-center gap-2">
                            <button type="button" className="rounded-full bg-[#eef0f7] px-4 py-1.5 text-[0.78rem] font-semibold text-[#8f95ad]">
                              Cancel
                            </button>
                            <button type="button" className="rounded-full bg-[#c9cce4] px-4 py-1.5 text-[0.78rem] font-semibold text-white">
                              Save
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <button type="button" onClick={handleShippingToggle} className="mt-2 inline-flex items-center gap-1 text-[0.82rem] text-[#1172ff]">
                        <span>+ Enable Shipping Address</span>
                      </button>
                    )}
                  </>
                ) : (
                  <button type="button" onClick={() => setShippingEnabled(true)} className="text-[0.95rem] font-semibold text-[#1e7cff]">
                    + Enable Shipping Address
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {activeTab === 'credit' ? (
            <div className="grid grid-cols-2 gap-10 pt-8">
              <div>
                <input
                  value={form.openingBalance}
                  onChange={(event) => onChangeField('openingBalance', event.target.value)}
                  className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                  placeholder="Opening Balance"
                />
                <div className="mt-5 text-[0.92rem] text-[#2f2f2f]">
                  Credit Limit
                  <span className="ml-1.5 inline-block align-middle text-[#a5aab8]">i</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-[0.95rem] font-semibold">
                  <button
                    type="button"
                    onClick={() => onToggleCreditLimitMode('no-limit')}
                    className={creditLimitMode === 'no-limit' ? 'text-[#1172ff]' : 'text-[#6f7390]'}
                  >
                    No Limit
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleCreditLimitMode('custom-limit')}
                    className={[
                      'flex h-6 w-12 items-center rounded-full p-1 transition',
                      creditLimitMode === 'custom-limit' ? 'justify-end bg-[#b6d2ff]' : 'justify-start bg-[#cfe2ff]',
                    ].join(' ')}
                    aria-label="Toggle credit limit"
                  >
                    <span className="h-4 w-4 rounded-full bg-[#4f86ff]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onToggleCreditLimitMode('custom-limit')}
                    className={creditLimitMode === 'custom-limit' ? 'text-[#1172ff]' : 'text-[#6f7390]'}
                  >
                    Custom Limit
                  </button>
                </div>
              </div>

              <div>
                <label className="block">
                  <span className="mb-1.5 block text-[0.78rem] text-[#8e97b2]">As Of Date</span>
                  <input
                    value={form.asOfDate}
                    onChange={(event) => onChangeField('asOfDate', event.target.value)}
                    className="h-9 w-full rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                  />
                </label>
              </div>
            </div>
          ) : null}

          {activeTab === 'additional' ? (
            <div className="pt-8">
              {['Additional Field 1 Name', 'Additional Field 2 Name', 'Additional Field 3 Name'].map((label) => (
                <div key={label} className="mb-7 flex items-center gap-4">
                  <button
                    type="button"
                    className="grid h-5 w-5 place-items-center rounded border border-[#b7bccb] text-transparent"
                    aria-label={label}
                  >
                    .
                  </button>
                  <input
                    className="h-9 w-[260px] rounded-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                    placeholder={label}
                  />
                </div>
              ))}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  className="grid h-5 w-5 place-items-center rounded border border-[#b7bccb] text-transparent"
                  aria-label="Additional Field 4 Name"
                >
                  .
                </button>
                <div className="flex">
                  <input
                    className="h-9 w-[210px] rounded-l-[4px] border border-[#c7cad6] px-3 text-[0.92rem] outline-none"
                    placeholder="Additional Field 4 Name"
                  />
                  <input
                    className="h-9 w-[90px] rounded-r-[4px] border-y border-r border-[#c7cad6] px-3 text-[0.88rem] text-[#a8adc0] outline-none"
                    placeholder="dd/mm/yy"
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-[#e5e7ef] px-6 py-4">
          <button
            type="button"
            onClick={() => onSave(true)}
            className="rounded-[6px] border-2 border-[#1e7cff] bg-white px-5 py-2.5 text-[0.92rem] font-semibold text-[#1e7cff]"
          >
            Save &amp; New
          </button>
          <button
            type="button"
            onClick={() => onSave(false)}
            className="rounded-[6px] bg-[linear-gradient(180deg,#1e8bff_0%,#197cf0_100%)] px-7 py-2.5 text-[0.92rem] font-semibold text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddPartyModal
