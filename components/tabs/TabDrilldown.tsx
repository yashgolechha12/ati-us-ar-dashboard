import { useState } from 'react';
import type { DashboardStats } from '@/lib/compute';

interface Props {
  stats: DashboardStats;
  selectedCustomer: string;
  setSelectedCustomer: (c: string) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function TabDrilldown({ stats, selectedCustomer, setSelectedCustomer }: Props) {
  const customers = Array.from(new Set(stats.topCustomers.map(c => c.name)));
  const [localCustomer, setLocalCustomer] = useState(selectedCustomer || '');

  const current = localCustomer || selectedCustomer;

  const customerStats = current
    ? stats.topCustomers.find(c => c.name === current)
    : null;

  const customerInvoices = stats.collectionQueue.filter(
    inv => inv.customer === current
  );

  const handleSelect = (name: string) => {
    setLocalCustomer(name);
    setSelectedCustomer(name);
  };

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ color: '#8b949e', fontSize: 12, display: 'block', marginBottom: 6 }}>
          SELECT CUSTOMER
        </label>
        <select
          value={current}
          onChange={e => handleSelect(e.target.value)}
          style={{
            background: '#161b22', border: '1px solid #30363d', borderRadius: 6,
            color: '#e6edf3', padding: '8px 14px', fontSize: 13, width: 360,
            cursor: 'pointer',
          }}
        >
          <option value="">-- Select a customer --</option>
          {customers.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      {!current && (
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 40, textAlign: 'center', color: '#8b949e' }}>
          Select a customer to view their detailed AR breakdown
        </div>
      )}

      {current && customerStats && (
        <div>
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, color: '#e6edf3', fontSize: 18, fontWeight: 700 }}>{current}</h2>
            <button
              onClick={() => handleSelect('')}
              style={{ background: 'none', border: '1px solid #30363d', borderRadius: 6, color: '#8b949e', cursor: 'pointer', padding: '6px 12px', fontSize: 12 }}
            >
              Clear
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Total Outstanding</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3' }}>{fmt(customerStats.outstanding)}</div>
            </div>
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Overdue Amount</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: customerStats.overdue > 0 ? '#ff6b6b' : '#51cf66' }}>{fmt(customerStats.overdue)}</div>
            </div>
            <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Last Payment</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#00b49a' }}>{customerStats.lastPayment ?? '—'}</div>
            </div>
          </div>

          <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', background: '#0d1117' }}>
              <span style={{ color: '#e6edf3', fontSize: 14, fontWeight: 600 }}>Overdue Invoices</span>
              <span style={{ color: '#8b949e', fontSize: 12, marginLeft: 8 }}>({customerInvoices.length} invoices)</span>
            </div>
            {customerInvoices.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#51cf66' }}>
                No overdue invoices for this customer
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #21262d' }}>
                      {['Invoice #', 'Amount', 'Due Date', 'Days Overdue', 'Contact'].map(h => (
                        <th key={h} style={{ padding: '10px 16px', color: '#8b949e', textAlign: h === 'Invoice #' || h === 'Contact' ? 'left' : 'right', fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {customerInvoices.map((inv, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #21262d' }}>
                        <td style={{ padding: '10px 16px', color: '#00b49a' }}>{inv.invoiceNo}</td>
                        <td style={{ padding: '10px 16px', color: '#e6edf3', textAlign: 'right', fontWeight: 600 }}>{fmt(inv.amount)}</td>
                        <td style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'right' }}>{inv.dueDate}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 12, fontSize: 11,
                            background: inv.daysOverdue > 90 ? '#3d1f1f' : inv.daysOverdue > 30 ? '#3d3020' : '#1f3d2c',
                            color: inv.daysOverdue > 90 ? '#ff6b6b' : inv.daysOverdue > 30 ? '#ffd43b' : '#51cf66',
                          }}>
                            {inv.daysOverdue}d
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#8b949e' }}>{inv.contact ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
