import type { DashboardStats } from '@/lib/compute';

interface Props {
  stats: DashboardStats;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function TabMIS({ stats }: Props) {
  const monthly = stats.monthly;
  const totalInvoiced = monthly.reduce((s, m) => s + m.invoiced, 0);
  const totalCollected = monthly.reduce((s, m) => s + m.collected, 0);
  const overallRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;
  const maxInvoiced = Math.max(...monthly.map(m => m.invoiced), 1);

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Total Invoiced (6mo)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3' }}>{fmt(totalInvoiced)}</div>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Total Collected (6mo)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#00b49a' }}>{fmt(totalCollected)}</div>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Overall Collection Rate</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: overallRate >= 80 ? '#51cf66' : '#ff6b6b' }}>{overallRate}%</div>
        </div>
      </div>

      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 20, marginBottom: 16 }}>
        <h3 style={{ margin: '0 0 16px', color: '#e6edf3', fontSize: 14, fontWeight: 600 }}>Monthly Bar Chart</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 180 }}>
          {monthly.map((m, i) => {
            const invoicedHeight = Math.round((m.invoiced / maxInvoiced) * 160);
            const collectedHeight = m.invoiced > 0 ? Math.round((m.collected / maxInvoiced) * 160) : 0;
            const label = m.month.slice(0, 7);
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 160 }}>
                  <div
                    title={`Invoiced: ${fmt(m.invoiced)}`}
                    style={{
                      width: 18, height: invoicedHeight, background: '#1c3a4a',
                      border: '1px solid #2d5a70', borderRadius: '3px 3px 0 0',
                      cursor: 'default',
                    }}
                  />
                  <div
                    title={`Collected: ${fmt(m.collected)}`}
                    style={{
                      width: 18, height: collectedHeight, background: '#00b49a',
                      border: '1px solid #00c9ad', borderRadius: '3px 3px 0 0',
                      cursor: 'default',
                    }}
                  />
                </div>
                <div style={{ fontSize: 10, color: '#8b949e', textAlign: 'center' }}>{label}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: '#1c3a4a', border: '1px solid #2d5a70', borderRadius: 2 }} />
            <span style={{ fontSize: 11, color: '#8b949e' }}>Invoiced</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, background: '#00b49a', borderRadius: 2 }} />
            <span style={{ fontSize: 11, color: '#8b949e' }}>Collected</span>
          </div>
        </div>
      </div>

      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', background: '#0d1117' }}>
          <span style={{ color: '#e6edf3', fontSize: 14, fontWeight: 600 }}>Monthly MIS Table</span>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #21262d' }}>
              {['Month', 'Invoiced', 'Collected', 'Outstanding', 'Collection %'].map(h => (
                <th key={h} style={{
                  padding: '10px 16px', color: '#8b949e', fontWeight: 500,
                  textAlign: h === 'Month' ? 'left' : 'right',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {monthly.map((m, i) => {
              const pct = m.invoiced > 0 ? Math.round((m.collected / m.invoiced) * 100) : 0;
              const outstanding = m.invoiced - m.collected;
              return (
                <tr key={i} style={{ borderBottom: '1px solid #21262d' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#1c2128')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 16px', color: '#e6edf3', fontWeight: 500 }}>{m.month}</td>
                  <td style={{ padding: '10px 16px', color: '#e6edf3', textAlign: 'right' }}>{fmt(m.invoiced)}</td>
                  <td style={{ padding: '10px 16px', color: '#00b49a', textAlign: 'right', fontWeight: 600 }}>{fmt(m.collected)}</td>
                  <td style={{ padding: '10px 16px', color: outstanding > 0 ? '#ffd43b' : '#51cf66', textAlign: 'right' }}>{fmt(Math.max(0, outstanding))}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                    <span style={{
                      padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                      background: pct >= 80 ? '#1f3d2c' : pct >= 50 ? '#3d3020' : '#3d1f1f',
                      color: pct >= 80 ? '#51cf66' : pct >= 50 ? '#ffd43b' : '#ff6b6b',
                    }}>
                      {pct}%
                    </span>
                  </td>
                </tr>
              );
            })}
            <tr style={{ borderTop: '2px solid #30363d', background: '#0d1117' }}>
              <td style={{ padding: '10px 16px', color: '#e6edf3', fontWeight: 700 }}>Total</td>
              <td style={{ padding: '10px 16px', color: '#e6edf3', textAlign: 'right', fontWeight: 700 }}>{fmt(totalInvoiced)}</td>
              <td style={{ padding: '10px 16px', color: '#00b49a', textAlign: 'right', fontWeight: 700 }}>{fmt(totalCollected)}</td>
              <td style={{ padding: '10px 16px', color: '#ffd43b', textAlign: 'right', fontWeight: 700 }}>{fmt(Math.max(0, totalInvoiced - totalCollected))}</td>
              <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                <span style={{
                  padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700,
                  background: overallRate >= 80 ? '#1f3d2c' : overallRate >= 50 ? '#3d3020' : '#3d1f1f',
                  color: overallRate >= 80 ? '#51cf66' : overallRate >= 50 ? '#ffd43b' : '#ff6b6b',
                }}>
                  {overallRate}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
