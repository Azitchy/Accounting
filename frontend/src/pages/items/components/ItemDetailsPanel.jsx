function ItemDetailsPanel({ item, onAdjustClick, onEditClick }) {
  return (
    <section className="border-b border-[#cfd8e4] bg-white">
      <div className="flex min-h-[116px] items-start justify-between border-b border-[#cfd8e4] px-3 py-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[0.95rem] font-semibold text-[#1f2a44]">{item?.name ?? 'Item Name'}</h2>
            <button type="button" onClick={onEditClick} className="text-[#1172ff]" aria-label="Edit item">
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

          <div className="mt-5 grid grid-cols-2 gap-10 text-[0.82rem]">
            <div>
              <div className="text-[#8d96b4]">
                SALE PRICE: <span className="text-[#00a56b]">{item?.salePrice ?? 'Rs 0.00'}</span>
              </div>
            </div>
            <div>
              <div className="text-[#8d96b4]">
                PURCHASE PRICE: <span className="text-[#00a56b]">{item?.purchasePrice ?? 'Rs 0.00'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pt-0.5">
          <button
            type="button"
            onClick={onAdjustClick}
            className="rounded-[4px] bg-[#1172ff] px-3 py-2 text-[0.75rem] font-bold text-white shadow-sm"
          >
            ADJUST ITEM
          </button>
          <div className="text-[0.8rem] text-[#8d96b4]">
            STOCK QUANTITY: <span className={item?.quantity < 0 ? 'text-rose-500' : 'text-[#00a56b]'}>{item?.quantity ?? 0}</span>
          </div>
          <div className="text-[0.8rem] text-[#8d96b4]">
            STOCK VALUE: <span className="text-[#00a56b]">{item?.stockValue ?? 'Rs 0.00'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ItemDetailsPanel
