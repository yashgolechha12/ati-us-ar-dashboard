import type { DashboardStats } from '@/lib/compute';

interface Props {
  stats: DashboardStats;
  onDrilldown: (customer: string) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

const card = (label: string, value: string, color: string) => (
  <div key={label} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
    <div style={{ fontSize: 11, color: '#8b949e', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}</div>
  </div>
);

export default function TabOverview({ stats, onDrilldown }: Props) {
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {cards.map(c => card(c.label, c.value, c.color))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 12px', color: '#e6edf3', fontSize: 14 }}>Aging Buckets (USD)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #21262d' }}>
                {['Current', '1–30d', '31–60d', '61–90d', '90+d'].map(h => (
                  <th key={h} style={{ padding: '8px 12px', color: '#8b949e', textAlign: 'right', fontWeight: 500 }}>{h}</th>
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

        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <h3 style={{ margin: '0 0 12px', color: '#e6edf3', fontSize: 14 }}>Top Customers by Outstanding</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stats.topCustomers.slice(0, 5).map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                  onClick={() => onDrilldown(c.name)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00b49a', fontSize: 13, textAlign: 'left', padding: 0 }}
                >
                  {c.name}
                </button>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#e6edf3', fontSize: 13 }}>{fmt(c.outstanding)}</span>
                  {c.overdue > 0 && (
                    <span style={{ color: '#ff6b6b', fontSize: 11, marginLeft: 8 }}>({fmt(c.overdue)} overdue)</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
        <h3 style={{ margin: '0 0 12px', color: '#e6edf3', fontSize: 14 }}>Monthly Trend (6 months)</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              {['Month', 'Invoiced', 'Collected', 'Collection %'].map(h => (
                <th key={h} style={{ padding: '8px 12px', color: '#8b949e', textAlign: h === 'Month' ? 'left' : 'right', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {stats.monthly.map((m, i) => {
              const pct = m.invoiced > 0 ? Math.round((m.collected / m.invoiced) * 100) : 0;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #21262d' }}>
                  <td style={{ padding: '10px 12px', color: '#e6edf3' }}>{m.month}</td>
                  <td style={{ padding: '10px 12px', color: '#e6edf3', textAlign: 'right' }}>{fmt(m.invoiced)}</td>
                  <td style={{ padding: '10px 12px', color: '#00b49a', textAlign: 'right' }}>{fmt(m.collected)}</td>
                  <td style={{ padding: '10px 12px', color: pct >= 80 ? '#51cf66' : '#ff6b6b', textAlign: 'right' }}>{pct}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
