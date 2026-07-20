export const sidebarSections = [
  { label: 'Home', icon: 'home', to: '/' },
  { label: 'Parties', icon: 'users', to: '/parties' },
  { label: 'Items', icon: 'bag', to: '/items' },
  {
    label: 'Sale',
    icon: 'receipt',
    children: [
      { label: 'Sale Invoices', to: '/sale/invoices' },
      { label: 'Estimate/ Quotation', to: '/sale/invoices/estimate-quotation' },
      { label: 'Proforma Invoice', to: '/sale/invoices/proforma-invoice' },
      { label: 'Payment-In', to: '/sale/invoices/payment-in' },
      { label: 'Sale Order', to: '/sale/invoices/sale-order' },
      { label: 'Delivery Challan', to: '/sale/invoices/delivery-challan' },
      { label: 'Sale Return/ Credit Note', to: '/sale/invoices/sale-return-credit-note' },
      { label: 'Vyapar POS', to: '/sale/invoices/vyapar-pos' },
    ],
  },
  {
    label: 'Purchase & Expense',
    icon: 'cart',
    children: [
      { label: 'Purchase Bills', to: '/purchase/bills' },
      { label: 'Payment-Out', to: '/purchase/payment-out' },
      { label: 'Expenses', to: '/purchase/expenses' },
      { label: 'Purchase Order', to: '/purchase/orders' },
      { label: 'Purchase Return/ Dr. Note', to: '/purchase/return-dr-note' },
    ],
  },
  {
    label: 'Cash & Bank',
    icon: 'bank',
    children: [
      { label: 'Bank Accounts', to: '/cash-bank/bank-accounts' },
      { label: 'Cash In Hand', to: '/cash-bank/cash-in-hand' },
      { label: 'Cheques', to: '/cash-bank/cheques' },
      { label: 'Loan Accounts', to: '/cash-bank/loan-accounts' },
    ],
  },
  { label: 'Grow Your Business', icon: 'trend' },
  { label: 'Reports', icon: 'report', to: '/reports' },
  { label: 'Sync, Share & Backup', icon: 'sync' },
  { label: 'Utilities', icon: 'tools' },
]

export const dashboardReports = ['Sale Report', 'All Transactions', 'Daybook Report', 'Party Statement']
