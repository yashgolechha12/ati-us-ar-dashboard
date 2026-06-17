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
  const baseUrl = (process.env.ERPNEXT_URL ?? '').replace(/\/$/, '');
  const apiKey = process.env.ERPNEXT_API_KEY ?? '';
  const apiSecret = process.env.ERPNEXT_API_SECRET ?? '';

  if (!baseUrl) {
    throw new Error('ERPNEXT_URL environment variable is not set');
  }
  if (!apiKey || !apiSecret) {
    throw new Error('ERPNEXT_API_KEY or ERPNEXT_API_SECRET environment variable is not set');
  }

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Authorization': `token ${apiKey}:${apiSecret}`,
  };

  console.log('[erpnext] Fetching from:', baseUrl);
  console.log('[erpnext] Using API key:', apiKey.substring(0, 6) + '...');

  const invoiceUrl = baseUrl + '/api/resource/Sales Invoice?fields=["name","customer","posting_date","due_date","grand_total","outstanding_amount","contact_email"]&filters=[["docstatus","=",1]]&limit_page_length=500&order_by=posting_date desc';
  const paymentUrl = baseUrl + '/api/resource/Payment Entry?fields=["name","party","posting_date","paid_amount"]&filters=[["payment_type","=","Receive"],["docstatus","=",1]]&limit_page_length=500';

  const [invoicesRes, paymentsRes] = await Promise.all([
    fetch(invoiceUrl, { headers }),
    fetch(paymentUrl, { headers }),
  ]);

  if (!invoicesRes.ok) {
    const body = await invoicesRes.text().catch(() => '');
    console.error('[erpnext] Invoices fetch failed:', invoicesRes.status, invoicesRes.statusText, body.substring(0, 500));
    throw new Error(`ERPNext Sales Invoice API failed: ${invoicesRes.status} ${invoicesRes.statusText}`);
  }
  if (!paymentsRes.ok) {
    const body = await paymentsRes.text().catch(() => '');
    console.error('[erpnext] Payments fetch failed:', paymentsRes.status, paymentsRes.statusText, body.substring(0, 500));
    throw new Error(`ERPNext Payment Entry API failed: ${paymentsRes.status} ${paymentsRes.statusText}`);
  }

  const invoicesJson = await invoicesRes.json();
  const paymentsJson = await paymentsRes.json();

  console.log('[erpnext] Fetched', invoicesJson.data?.length ?? 0, 'invoices and', paymentsJson.data?.length ?? 0, 'payments');

  return {
    invoices: invoicesJson.data ?? [],
    paymentEntries: paymentsJson.data ?? [],
  };
}
