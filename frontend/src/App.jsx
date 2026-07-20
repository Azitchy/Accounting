import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DashboardPage from './pages/dashboard/DashboardPage'
import ItemsPage from './pages/items'
import PartiesPage from './pages/parties'
import MyCompanyPage from './pages/myCompany'
import SaleInvoicesPage from './pages/sale'
import PurchasePage from './pages/purchase'
import CashBankPage from './pages/cashBank'
import ReportsPage from './pages/reports'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="items" element={<ItemsPage />} />
        <Route path="parties" element={<PartiesPage />} />
        <Route path="sale/invoices" element={<SaleInvoicesPage />} />
        <Route path="sale/invoices/:view" element={<SaleInvoicesPage />} />
        <Route path="purchase/bills" element={<PurchasePage />} />
        <Route path="purchase/:view" element={<PurchasePage />} />
        <Route path="cash-bank/bank-accounts" element={<CashBankPage />} />
        <Route path="cash-bank/:view" element={<CashBankPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="my-company" element={<MyCompanyPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
