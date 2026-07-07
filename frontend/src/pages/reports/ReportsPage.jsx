import TopActionBar from '../../components/TopActionBar'
import ReportsNavigator from './components/ReportsNavigator'

function ReportsPage() {
  return (
    <main className="min-w-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.92)),radial-gradient(circle_at_top_right,rgba(101,170,255,0.08),transparent_25%)]">
      <TopActionBar />

      <section className="grid min-h-[calc(100vh-65px)] grid-cols-[390px_minmax(0,1fr)]">
        <ReportsNavigator />
        <div className="border-l border-[#d8dee8] bg-white" />
      </section>
    </main>
  )
}

export default ReportsPage
