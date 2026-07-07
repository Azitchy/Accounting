function ReportsPanel({ reports }) {
  return (
    <section className="border-b border-x border-[#dbe4ef] bg-white px-4.5 py-3.5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-[1rem] font-medium text-[#5b6b9d]">Most Used Reports</h2>
        <a href="#reports" className="font-semibold text-[#0063ff] no-underline">
          View All
        </a>
      </div>

      <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-4">
        {reports.map((title) => (
          <button
            key={title}
            type="button"
            className="flex min-h-[54px] items-center justify-between rounded-xl border border-[#dfe6f1] bg-white px-4 py-3 text-[0.96rem] font-bold text-[#2a3557]"
          >
            <span>{title}</span>
            <span>&gt;</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default ReportsPanel
