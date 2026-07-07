import { dashboardReports } from '../../data/dashboardData'
import TopActionBar from '../../components/TopActionBar'
import MetricCard from '../../components/MetricCard'
import SalesOverview from '../../components/SalesOverview'
import ReportsPanel from '../../components/ReportsPanel'
import RightRail from '../../components/RightRail'

function DashboardPage() {
  return (
    <main className="min-w-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.92)),radial-gradient(circle_at_top_right,rgba(101,170,255,0.08),transparent_25%)]">
      <TopActionBar />

      <section className="grid min-h-[calc(100vh-65px)] grid-cols-1 xl:grid-cols-[minmax(0,1fr)_315px]">
        <div className="min-w-0">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <MetricCard
              title="Total Receivable"
              value="Rs 1,000"
              note="From 1 Party"
              tone="green"
              icon="down"
            />
            <MetricCard
              title="Total Payable"
              value="Rs 0"
              note="You don't have any payables as of now."
              tone="red"
              icon="up"
            />
          </div>

          <SalesOverview />
          <ReportsPanel reports={dashboardReports} />
        </div>

        <RightRail />
      </section>
    </main>
  )
}

export default DashboardPage
