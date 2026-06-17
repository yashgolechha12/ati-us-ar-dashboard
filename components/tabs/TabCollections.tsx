import type { DashboardStats } from '@/lib/compute';

interface Props {
  stats: DashboardStats;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function TabCollections({ stats }: Props) {
  const queue = stats.collectionQueue;
  const totalOverdue = queue.reduce((sum, inv) => sum + inv.amount, 0);
  const criticalCount = queue.filter(inv => inv.daysOverdue > 90).length;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Total Overdue (Queue)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#ff6b6b' }}>{fmt(totalOverdue)}</div>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Overdue Invoices</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3' }}>{queue.length}</div>
        </div>
        <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: 16 }}>
          <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', marginBottom: 6 }}>Critical (90+ days)</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: criticalCount > 0 ? '#ff6b6b' : '#51cf66' }}>{criticalCount}</div>
        </div>
      </div>

      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid #21262d', background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#e6edf3', fontSize: 14, fontWeight: 600 }}>Collections Queue</span>
          <span style={{ color: '#8b949e', fontSize: 12 }}>Sorted by days overdue (oldest first)</span>
        </div>

        {queue.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#51cf66', fontSize: 16 }}>
            No overdue invoices — great work!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #21262d' }}>
                  {['Customer', 'Invoice #', 'Amount', 'Due Date', 'Days Overdue', 'Contact'].map(h => (
                    <th key={h} style={{
                      padding: '10px 16px', color: '#8b949e', fontWeight: 500,
                      textAlign: h === 'Customer' || h === 'Invoice #' || h === 'Contact' ? 'left' : 'right',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queue.map((inv, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: '1px solid #21262d' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#1c2128')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '10px 16px', color: '#e6edf3', fontWeight: 500 }}>{inv.customer}</td>
                    <td style={{ padding: '10px 16px', color: '#00b49a' }}>{inv.invoiceNo}</td>
                    <td style={{ padding: '10px 16px', color: '#e6edf3', textAlign: 'right', fontWeight: 600 }}>{fmt(inv.amount)}</td>
                    <td style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'right' }}>{inv.dueDate}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right' }}>
                      <span style={{
                        padding: '2px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
                        background: inv.daysOverdue > 90 ? '#3d1f1f' : inv.daysOverdue > 60 ? '#3d2a1f' : inv.daysOverdue > 30 ? '#3d3020' : '#1f3d2c',
                        color: inv.daysOverdue > 90 ? '#ff6b6b' : inv.daysOverdue > 60 ? '#ff8c42' : inv.daysOverdue > 30 ? '#ffd43b' : '#51cf66',
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
  );
}
