function MyCompanyFooterActions() {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-[#d3deee] bg-white px-6 py-4">
      <button
        type="button"
        className="rounded-full bg-[#f3f4f7] px-5 py-2.5 text-[0.92rem] font-semibold text-[#8c96b7]"
      >
        Cancel
      </button>
      <button
        type="button"
        className="rounded-full bg-[linear-gradient(180deg,#ff2d57_0%,#e31946_100%)] px-5 py-2.5 text-[0.92rem] font-semibold text-white"
      >
        Save Changes
      </button>
    </div>
  )
}

export default MyCompanyFooterActions
