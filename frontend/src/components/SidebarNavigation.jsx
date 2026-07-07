import { NavLink } from 'react-router-dom'
import { sidebarSections } from '../data/dashboardData'
import Icon from './Icon'

function SidebarNavigation() {
  return (
    <aside className="flex flex-col gap-2 bg-slate-950 px-2.5 py-3 text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)] lg:min-h-screen">
      <div className="rounded-[18px] bg-[linear-gradient(180deg,#2a305b_0%,#252a4f_100%)] px-4 py-2.5 text-[0.92rem] font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        Open Anything (Ctrl+F)
      </div>

      <nav className="grid gap-1" aria-label="Primary">
        {sidebarSections.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>

      <TrialCard />
      <CompanySwitch />
    </aside>
  )
}

function SidebarItem({ label, icon, active = false }) {
  const showPlus = label === 'Parties' || label === 'Items'
  const to = label === 'My Company' ? '/my-company' : '/'

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'grid grid-cols-[22px_1fr_auto] items-center gap-2.5 px-3 py-2.5 text-[0.95rem] font-semibold text-white no-underline',
          active || isActive ? 'bg-[#2a2d5f] shadow-[inset_3px_0_0_#ff4f87]' : '',
        ].join(' ')
      }
    >
      <span className="grid place-items-center text-white">
        <Icon name={icon} />
      </span>
      <span className="whitespace-nowrap">{label}</span>
      <span className="text-white/80">{showPlus ? '+' : 'v'}</span>
    </NavLink>
  )
}

function TrialCard() {
  return (
    <section className="mt-auto rounded-xl bg-[linear-gradient(180deg,#ffefdd_0%,#f9ddb3_100%)] p-3 text-slate-900">
      <div className="mb-2.5 text-[0.95rem] font-bold">6 days Free Trial left</div>
      <div className="mb-3.5 h-2 rounded-full bg-white/85">
        <div className="h-full w-[18%] rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600" />
      </div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-xl bg-[linear-gradient(180deg,#ffbd1a_0%,#f7a200_100%)] px-3 py-2.5 text-[0.92rem] font-bold text-white"
      >
        <span className="grid h-[18px] w-[18px] place-items-center rounded-full bg-white/25 text-[0.7rem]">o</span>
        <span className="flex-1 px-2 text-left">Get Vyapar Premium</span>
        <span>-&gt;</span>
      </button>
    </section>
  )
}

function CompanySwitch() {
  return (
    <NavLink
      to="/my-company"
      className={({ isActive }) =>
        [
          'grid grid-cols-[26px_1fr_auto] items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-[0.95rem] font-bold text-white no-underline',
          isActive ? 'bg-[#2a2d5f] shadow-[inset_3px_0_0_#8bb8ff]' : 'bg-[#26294f]',
        ].join(' ')
      }
    >
      <span className="grid h-[26px] w-[26px] place-items-center rounded-full bg-[linear-gradient(180deg,#5ac8ff_0%,#2d7bff_100%)] text-[0.82rem]">
        M
      </span>
      <span className="whitespace-nowrap">My Company</span>
      <span>&gt;</span>
    </NavLink>
  )
}

export default SidebarNavigation
