import { useState } from 'react';
import type { DashboardStats } from '@/lib/compute';

interface Props {
  stats: DashboardStats;
  onDrilldown: (customer: string) => void;
  filter: string;
  setFilter: (f: string) => void;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

export default function TabCustomerAging({ stats, onDrilldown, filter, setFilter }: Props) {
  const [sortKey, setSortKey] = useState<'outstanding' | 'overdue' | 'name'>('outstanding');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = stats.topCustomers
    .filter(c => !filter || c.name.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'name') return dir * a.name.localeCompare(b.name);
      return dir * (a[sortKey] - b[sortKey]);
    });

  const handleSort = (key: 'outstanding' | 'overdue' | 'name') => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: string }) => (
    <span style={{ marginLeft: 4, opacity: sortKey === k ? 1 : 0.3 }}>
      {sortKey === k ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
    </span>
  );

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Filter by customer name..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          style={{
            background: '#161b22', border: '1px solid #30363d', borderRadius: 6,
            color: '#e6edf3', padding: '8px 14px', fontSize: 13, width: 280,
            outline: 'none',
          }}
        />
        {filter && (
          <button
            onClick={() => setFilter('')}
            style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer', fontSize: 13 }}
          >
            Clear
          </button>
        )}
        <span style={{ color: '#8b949e', fontSize: 12 }}>{filtered.length} customers</span>
      </div>

      <div style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #21262d', background: '#0d1117' }}>
                <th
                  style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'left', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('name')}
                >
                  Customer <SortIcon k="name" />
                </th>
                <th
                  style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'right', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('outstanding')}
                >
                  Outstanding <SortIcon k="outstanding" />
                </th>
                <th
                  style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'right', cursor: 'pointer', userSelect: 'none' }}
                  onClick={() => handleSort('overdue')}
                >
                  Overdue <SortIcon k="overdue" />
                </th>
                <th style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'right' }}>Overdue %</th>
                <th style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'right' }}>Last Payment</th>
                <th style={{ padding: '10px 16px', color: '#8b949e', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#8b949e' }}>
                    No customers found
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => {
                  const overduePercent = c.outstanding > 0 ? Math.round((c.overdue / c.outstanding) * 100) : 0;
                  return (
                    <tr
                      key={i}
                      style={{
                        borderBottom: '1px solid #21262d',
                        transition: 'background 0.1s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#1c2128')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px', color: '#e6edf3' }}>
                        <button
                          onClick={() => onDrilldown(c.name)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#00b49a', fontSize: 13, textAlign: 'left', padding: 0, textDecoration: 'underline' }}
                        >
                          {c.name}
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#e6edf3', textAlign: 'right', fontWeight: 600 }}>
                        {fmt(c.outstanding)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', color: c.overdue > 0 ? '#ff6b6b' : '#51cf66', fontWeight: 600 }}>
                        {fmt(c.overdue)}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: 12, fontSize: 11,
                          background: overduePercent > 50 ? '#3d1f1f' : overduePercent > 20 ? '#3d3020' : '#1f3d2c',
                          color: overduePercent > 50 ? '#ff6b6b' : overduePercent > 20 ? '#ffd43b' : '#51cf66',
                        }}>
                          {overduePercent}%
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#8b949e', textAlign: 'right' }}>
                        {c.lastPayment ?? '—'}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => onDrilldown(c.name)}
                          style={{
                            background: '#1c2736', border: '1px solid #30363d', borderRadius: 4,
                            color: '#00b49a', cursor: 'pointer', fontSize: 12, padding: '4px 10px',
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
