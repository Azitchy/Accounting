import MyCompanyTopBar from './components/MyCompanyTopBar'
import MyCompanySidebarHeader from './components/MyCompanySidebarHeader'
import MyCompanyForm from './components/MyCompanyForm'
import MyCompanyFooterActions from './components/MyCompanyFooterActions'

function MyCompanyPage() {
  return (
    <main className="min-w-0 bg-slate-100">
      <MyCompanyTopBar />

      <section className="min-h-[calc(100vh-24px)] bg-[#f2f5fb]">
        <div className="border-b border-[#d0dbe9] bg-white px-4 py-2.5">
          <h1 className="text-[1.15rem] font-semibold text-slate-800">Edit Profile</h1>
        </div>

        <div className="p-4">
          <div className="overflow-hidden rounded-[8px] border border-[#d3deee] bg-white">
            <div className="min-h-[calc(100vh-120px)]">
              <div className="grid gap-8 px-6 py-6 lg:grid-cols-[320px_minmax(0,1fr)] lg:px-10">
                <MyCompanySidebarHeader />
                <MyCompanyForm />
              </div>

              <MyCompanyFooterActions />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default MyCompanyPage
