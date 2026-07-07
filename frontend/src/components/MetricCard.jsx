import Icon from './Icon'

function MetricCard({ title, value, note, tone, icon }) {
  const badgeClass = tone === 'green' ? 'bg-emerald-100 text-emerald-500' : 'bg-rose-100 text-rose-400'

  return (
    <article className="flex min-h-[112px] justify-between gap-3 border border-[#dbe4ef] bg-white px-4.5 py-4">
      <div>
        <h2 className="mb-2 text-[1rem] font-medium leading-tight text-[#5b6b9d]">{title}</h2>
        <strong className="block text-[1.2rem] font-extrabold text-[#283351]">{value}</strong>
        <p className="mt-2.5 text-[0.95rem] leading-6 text-[#6f7a98]">{note}</p>
      </div>

      <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${badgeClass}`}>
        <Icon name={icon} />
      </div>
    </article>
  )
}

export default MetricCard
