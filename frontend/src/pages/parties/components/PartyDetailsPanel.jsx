function PartyDetailsPanel({ party }) {
  return (
    <section className="border-b border-[#cfd8e4] bg-white">
      <div className="flex h-[102px] items-start justify-between border-b border-[#cfd8e4] px-3 py-3">
        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-[0.95rem] font-semibold text-[#1f2a44]">{party?.name ?? 'Party Name'}</h2>
            <button type="button" className="text-[#1172ff]" aria-label="Edit party">
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M13.5 3.5l3 3L8 15l-3.5 1L6 12l7.5-8.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-12 text-[0.82rem]">
            <div>
              <div className="text-[#8d96b4]">Phone Number</div>
              <div className="mt-1 text-[0.92rem] text-[#1f2a44]">{party?.phone || '-'}</div>
            </div>
            <div>
              <div className="text-[#8d96b4]">Billing Address</div>
              <div className="mt-1 text-[0.92rem] text-[#1f2a44]">{party?.billingAddress || '-'}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-0.5">
          <button type="button" className="grid h-6 w-6 place-items-center rounded-full text-[#5fbd4f]" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.1A9 9 0 1 0 12 3Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M10.2 8.8c-.2.3-.4.7-.4 1 0 1 1 2.5 2.7 4.2 1.7 1.7 3.2 2.7 4.2 2.7.3 0 .7-.1 1-.4l.7-.6c.2-.2.3-.5.2-.8l-.4-1.3c-.1-.3-.4-.5-.7-.5l-1.4.2c-.3 0-.7-.1-.9-.4l-1.1-1.1c-.2-.2-.4-.6-.3-.9l.2-1.3c0-.3-.2-.6-.5-.7l-1.4-.4c-.3-.1-.6 0-.8.2l-.8.9Z" fill="currentColor" opacity="0.95" />
            </svg>
          </button>
          <button type="button" className="grid h-6 w-6 place-items-center rounded-full text-[#ffb13b]" aria-label="Notification">
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
              <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              <circle cx="18.5" cy="4.5" r="1.5" fill="#ff4a86" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default PartyDetailsPanel
