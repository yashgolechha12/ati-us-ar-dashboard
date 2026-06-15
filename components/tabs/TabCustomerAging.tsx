import type { DashboardStats } from '@/lib/compute';

interface Props { stats: DashboardStats }

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function TabCustomerAging({ stats }: Props) {
  return (
    <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '16px' }}>
      <h3 style={{ margin: '0 0 12px', color: '#e6edf3', fontSize: '14px' }}>Customer Ageing Summary</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              {['Customer', 'Outstanding', 'Overdue', 'Last Payment'].map(h => (
                <th key={h} style={{ padding: '8px 12px', color: '#8b949e', textAlign: h === 'Customer' ? 'left' : 'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.topCustomers.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #21262d' }}>
                <td style={{ padding: '10px 12px', color: '#e6edf3' }}>{c.name}</td>
                <td style={{ padding: '10px 12px', color: '#e6edf3', textAlign: 'right' }}>{fmt(c.outstanding)}</td>
                <td style={{ padding: '10px 12px', color: c.overdue > 0 ? '#ff6b6b' : '#51cf66', textAlign: 'right' }}>{fmt(c.overdue)}</td>
                <td style={{ padding: '10px 12px', color: '#8b949e', textAlign: 'right' }}>{c.lastPayment ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}