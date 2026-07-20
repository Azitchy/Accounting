import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { sidebarSections } from '../data/dashboardData'
import Icon from './Icon'

function SidebarNavigation() {
  const { pathname } = useLocation()
  const [openSections, setOpenSections] = useState(['Sale', 'Purchase & Expense', 'Cash & Bank'])

  useEffect(() => {
    if (pathname.startsWith('/sale')) {
      setOpenSections((current) => (current.includes('Sale') ? current : [...current, 'Sale']))
    }
    if (pathname.startsWith('/purchase')) {
      setOpenSections((current) =>
        current.includes('Purchase & Expense') ? current : [...current, 'Purchase & Expense'],
      )
    }
    if (pathname.startsWith('/cash-bank')) {
      setOpenSections((current) =>
        current.includes('Cash & Bank') ? current : [...current, 'Cash & Bank'],
      )
    }
  }, [pathname])

  const toggleSection = (label) => {
    setOpenSections((current) =>
      current.includes(label) ? current.filter((item) => item !== label) : [...current, label],
    )
  }

  return (
    <aside className="flex h-full flex-col gap-2 bg-slate-950 px-2.5 py-3 text-white shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]">
      <div className="rounded-[18px] bg-[linear-gradient(180deg,#2a305b_0%,#252a4f_100%)] px-4 py-2.5 text-[0.92rem] font-semibold text-slate-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
        Open Anything (Ctrl+F)
      </div>

      <nav className="grid gap-1" aria-label="Primary">
        {sidebarSections.map((item) => (
          <SidebarItem
            key={item.label}
            {...item}
            isOpen={openSections.includes(item.label)}
            onToggle={toggleSection}
          />
        ))}
      </nav>

      <TrialCard />
      <CompanySwitch />
    </aside>
  )
}

function SidebarItem({ label, icon, to, children, isOpen, onToggle }) {
  const showPlus = label === 'Parties' || label === 'Items'
  const itemClasses =
    'grid grid-cols-[22px_1fr_auto] items-center gap-2.5 px-3 py-2.5 text-[0.95rem] font-semibold text-white no-underline'
  const hasChildren = Array.isArray(children) && children.length > 0
  const submenuId = `submenu-${label.toLowerCase().replace(/\s+/g, '-')}`

  if (hasChildren) {
    return (
      <div className="grid gap-1">
        <button
          type="button"
          className={[
            itemClasses,
            'rounded-[10px] transition-colors duration-200',
            isOpen ? 'bg-[#2a2d5f] shadow-[inset_3px_0_0_#ff4f87]' : 'bg-transparent hover:bg-white/5',
          ].join(' ')}
          aria-expanded={isOpen}
          aria-controls={submenuId}
          onClick={() => onToggle(label)}
        >
          <span className="grid place-items-center text-white">
            <Icon name={icon} />
          </span>
          <span className="whitespace-nowrap">{label}</span>
          <span className="text-white/80">
            <Icon name={isOpen ? 'up' : 'down'} />
          </span>
        </button>

        <div
          id={submenuId}
          className={[
            'grid overflow-hidden border-l border-white/10 pl-2.5 transition-all duration-200 ease-out',
            isOpen ? 'ml-5 max-h-96 gap-1 opacity-100' : 'ml-5 max-h-0 gap-0 opacity-0',
          ].join(' ')}
          aria-hidden={!isOpen}
        >
          {children.map((child) =>
            child.to ? (
              <NavLink
                key={child.label}
                to={child.to}
                className={({ isActive }) =>
                  [
                    'grid grid-cols-[1fr_auto] items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[0.88rem] font-semibold text-white/90 no-underline hover:bg-[#272c59]',
                    isActive ? 'bg-[#2f3467] text-white' : '',
                  ].join(' ')
                }
              >
                <span className="whitespace-normal leading-tight">{child.label}</span>
                <span className="text-white/80">+</span>
              </NavLink>
            ) : (
              <button
                key={child.label}
                type="button"
                className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-[10px] px-3 py-2 text-left text-[0.88rem] font-semibold text-white/90 hover:bg-[#272c59]"
              >
                <span className="whitespace-normal leading-tight">{child.label}</span>
                <span className="text-white/80">+</span>
              </button>
            ),
          )}
        </div>
      </div>
    )
  }

  if (!to) {
    return (
      <button type="button" className={itemClasses}>
        <span className="grid place-items-center text-white">
          <Icon name={icon} />
        </span>
        <span className="whitespace-nowrap">{label}</span>
        <span className="text-white/80">{showPlus ? '+' : 'v'}</span>
      </button>
    )
  }

  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        [
          itemClasses,
          isActive ? 'bg-[#2a2d5f] shadow-[inset_3px_0_0_#ff4f87]' : '',
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
