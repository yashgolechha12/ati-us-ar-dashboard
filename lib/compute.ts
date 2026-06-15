import type { DashboardData } from './erpnext';

export interface DashboardStats {
  totalOutstanding: number;
  totalOverdue: number;
  currentDue: number;
  collected30d: number;
  invoiced30d: number;
  collectionRate: number;
  avgDso: number;
  customerCount: number;
  agingBuckets: {
    current: number;
    days1_30: number;
    days31_60: number;
    days61_90: number;
    days91plus: number;
  };
  topCustomers: Array<{
    name: string;
    outstanding: number;
    overdue: number;
    lastPayment: string | null;
  }>;
  monthly: Array<{
    month: string;
    invoiced: number;
    collected: number;
  }>;
  collectionQueue: Array<{
    customer: string;
    invoiceNo: string;
    amount: number;
    dueDate: string;
    daysOverdue: number;
    contact: string | null;
  }>;
}

export function computeDashboardStats(data: DashboardData): DashboardStats {
  const now = new Date();
  const agingBuckets = { current: 0, days1_30: 0, days31_60: 0, days61_90: 0, days91plus: 0 };
  let totalOutstanding = 0;
  let totalOverdue = 0;
  const customerMap = new Map();

  for (const inv of data.invoices) {
    const outstanding = inv.outstanding_amount ?? 0;
    if (outstanding <= 0) continue;
    totalOutstanding += outstanding;
    const due = inv.due_date ? new Date(inv.due_date) : null;
    const daysOverdue = due ? Math.floor((now.getTime() - due.getTime()) / 86400000) : 0;
    if (daysOverdue > 0) totalOverdue += outstanding;
    if (daysOverdue <= 0) agingBuckets.current += outstanding;
    else if (daysOverdue <= 30) agingBuckets.days1_30 += outstanding;
    else if (daysOverdue <= 60) agingBuckets.days31_60 += outstanding;
    else if (daysOverdue <= 90) agingBuckets.days61_90 += outstanding;
    else agingBuckets.days91plus += outstanding;
    const cust = inv.customer;
    if (!customerMap.has(cust)) customerMap.set(cust, { outstanding: 0, overdue: 0, lastPayment: null });
    const c = customerMap.get(cust);
    c.outstanding += outstanding;
    if (daysOverdue > 0) c.overdue += outstanding;
  }

  for (const pe of data.paymentEntries) {
    const c = customerMap.get(pe.party);
    if (c && (!c.lastPayment || pe.posting_date > c.lastPayment)) {
      c.lastPayment = pe.posting_date;
    }
  }

  const topCustomers = Array.from(customerMap.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.outstanding - a.outstanding)
    .slice(0, 10);

  const monthlyMap = new Map();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toISOString().slice(0, 7);
    monthlyMap.set(key, { invoiced: 0, collected: 0 });
  }
  for (const inv of data.invoices) {
    const key = inv.posting_date?.slice(0, 7);
    if (key && monthlyMap.has(key)) monthlyMap.get(key).invoiced += inv.grand_total ?? 0;
  }
  for (const pe of data.paymentEntries) {
    const key = pe.posting_date?.slice(0, 7);
    if (key && monthlyMap.has(key)) monthlyMap.get(key).collected += pe.paid_amount ?? 0;
  }
  const monthly = Array.from(monthlyMap.entries()).map(([month, v]) => ({ month, ...v }));

  const cutoff30 = new Date(now.getTime() - 30 * 86400000).toISOString().slice(0, 10);
  let collected30d = 0, invoiced30d = 0;
  for (const pe of data.paymentEntries) {
    if (pe.posting_date >= cutoff30) collected30d += pe.paid_amount ?? 0;
  }
  for (const inv of data.invoices) {
    if (inv.posting_date >= cutoff30) invoiced30d += inv.grand_total ?? 0;
  }
  const collectionRate = invoiced30d > 0 ? Math.round((collected30d / invoiced30d) * 100) : 0;
  const dailySales = invoiced30d / 30;
  const avgDso = dailySales > 0 ? Math.round(totalOutstanding / dailySales) : 0;

  const collectionQueue = data.invoices
    .filter(inv => {
      if ((inv.outstanding_amount ?? 0) <= 0) return false;
      const due = inv.due_date ? new Date(inv.due_date) : null;
      return due && due < now;
    })
    .map(inv => {
      const due = new Date(inv.due_date);
      const daysOverdue = Math.floor((now.getTime() - due.getTime()) / 86400000);
      return {
        customer: inv.customer,
        invoiceNo: inv.name,
        amount: inv.outstanding_amount ?? 0,
        dueDate: inv.due_date,
        daysOverdue,
        contact: inv.contact_email ?? null,
      };
    })
    .sort((a, b) => b.daysOverdue - a.daysOverdue)
    .slice(0, 50);

  return {
    totalOutstanding,
    totalOverdue,
    currentDue: agingBuckets.current,
    collected30d,
    invoiced30d,
    collectionRate,
    avgDso,
    customerCount: customerMap.size,
    agingBuckets,
    topCustomers,
    monthly,
    collectionQueue,
  };
}