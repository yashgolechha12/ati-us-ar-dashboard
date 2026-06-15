import type { DashboardStats } from '@/lib/compute';

interface Props { stats: DashboardStats }

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function TabOverview({ stats }: Props) {
  const cards = [
    { label: 'Total Outstanding', value: fmt(stats.totalOutstanding), color: '#e6edf3' },
    { label: 'Total Overdue', value: fmt(stats.totalOverdue), color: '#ff6b6b' },
    { label: 'Current (Not Due)', value: fmt(stats.currentDue), color: '#51cf66' },
    { label: 'Collected (30d)', value: fmt(stats.collected30d), color: '#00b49a' },
    { label: 'Invoiced (30d)', value: fmt(stats.invoiced30d), color: '#e6edf3' },
    { label: 'Collection Rate', value: stats.collectionRate + '%', color: stats.collectionRate >= 80 ? '#51cf66' : '#ff6b6b' },
    { label: 'Avg DSO (days)', value: String(stats.avgDso), color: '#e6edf3' },
    { label: 'Active Customers', value: String(stats.customerCount), color: '#e6edf3' },
  ];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '16px' }}>
            <div style={{ fontSize: '11px', color: '#8b949e', marginBottom: '6px', textTransform: 'uppercase' }}>{c.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: '8px', padding: '16px' }}>
        <h3 style={{ margin: '0 0 12px', color: '#e6edf3', fontSize: '14px' }}>Aging Buckets (USD)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              {['Current', '1-30 Days', '31-60 Days', '61-90 Days', '90+ Days'].map(h => (
                <th key={h} style={{ padding: '8px 12px', color: '#8b949e', textAlign: 'right' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '10px 12px', color: '#51cf66', textAlign: 'right' }}>{fmt(stats.agingBuckets.current)}</td>
              <td style={{ padding: '10px 12px', color: '#e6edf3', textAlign: 'right' }}>{fmt(stats.agingBuckets.days1_30)}</td>
              <td style={{ padding: '10px 12px', color: '#ffd43b', textAlign: 'right' }}>{fmt(stats.agingBuckets.days31_60)}</td>
              <td style={{ padding: '10px 12px', color: '#ff8c42', textAlign: 'right' }}>{fmt(stats.agingBuckets.days61_90)}</td>
              <td style={{ padding: '10px 12px', color: '#ff6b6b', textAlign: 'right' }}>{fmt(stats.agingBuckets.days91plus)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}