export interface SalesInvoice {
  name: string;
  customer: string;
  posting_date: string;
  due_date?: string;
  grand_total?: number;
  outstanding_amount?: number;
  contact_email?: string;
}

export interface PaymentEntry {
  name: string;
  party: string;
  posting_date: string;
  paid_amount?: number;
}

export interface DashboardData {
  invoices: SalesInvoice[];
  paymentEntries: PaymentEntry[];
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const baseUrl = process.env.ERPNEXT_URL ?? '';
  const apiKey = process.env.ERPNEXT_API_KEY ?? '';
  const apiSecret = process.env.ERPNEXT_API_SECRET ?? '';

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(apiKey && apiSecret
      ? { Authorization: 'token ' + apiKey + ':' + apiSecret }
      : {}),
  };

  const [invoicesRes, paymentsRes] = await Promise.all([
    fetch(
      baseUrl +
        '/api/resource/Sales Invoice?fields=["name","customer","posting_date","due_date","grand_total","outstanding_amount","contact_email"]&filters=[["docstatus","=",1]]&limit_page_length=500',
      { headers }
    ),
    fetch(
      baseUrl +
        '/api/resource/Payment Entry?fields=["name","party","posting_date","paid_amount"]&filters=[["payment_type","=","Receive"],["docstatus","=",1]]&limit_page_length=500',
      { headers }
    ),
  ]);

  if (!invoicesRes.ok || !paymentsRes.ok) {
    throw new Error('ERPNext API request failed');
  }

  const invoicesJson = await invoicesRes.json();
  const paymentsJson = await paymentsRes.json();

  return {
    invoices: invoicesJson.data ?? [],
    paymentEntries: paymentsJson.data ?? [],
  };
}