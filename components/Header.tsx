'use client';

interface HeaderProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
  loading: boolean;
  fetchedAt: Date | null;
  onRefresh: () => void;
  counts: { ageing: number; collections: number; mis: number };
}

const TABS = [
  { label: 'Overview' },
  { label: 'Customer Ageing' },
  { label: 'Customer Drill-down' },
  { label: 'Collections Queue' },
  { label: 'Monthly MIS' },
];

export default function Header({ activeTab, setActiveTab, loading, fetchedAt, onRefresh }: HeaderProps) {
  const fmtDate = (d: Date | null) => {
    if (!d) return '\u2014';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <header style={{ background: '#0d1117', borderBottom: '1px solid #21262d', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ background: '#00b49a', color: '#fff', fontWeight: 800, fontSize: 13, padding: '6px 10px', borderRadius: 6 }}>
            ATI US
          </div>
          <div>
            <div style={{ color: '#e6edf3', fontWeight: 700, fontSize: 16 }}>Ati Motors Inc &mdash; Accounts Receivable</div>
            <div style={{ color: '#8b949e', fontSize: 12 }}>Ati-US ERP &middot; Live data &middot; USD only</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: loading ? '#1c3a33' : '#00b49a',
              color: '#fff', border: 'none', borderRadius: 8,
              padding: '8px 18px', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600, fontSize: 13, opacity: loading ? 0.7 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              style={{ animation: loading ? 'spin 0.8s linear infinite' : 'none' }}>
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          {fetchedAt && (
            <div style={{ color: '#8b949e', fontSize: 11 }}>Last updated: {fmtDate(fetchedAt)}</div>
          )}
        </div>
        {fetchedAt && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#8b949e', fontSize: 12 }}>
              As of <span style={{ color: '#00b49a', fontWeight: 600 }}>{fmtDate(fetchedAt)}</span>
            </div>
          </div>
        )}
      </div>
      <nav style={{ display: 'flex', gap: 0, borderTop: '1px solid #21262d', padding: '0 24px' }}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 20px', fontSize: 13, fontWeight: 500,
              color: activeTab === i ? '#00b49a' : '#8b949e',
              borderBottom: activeTab === i ? '2px solid #00b49a' : '2px solid transparent',
              transition: 'color 0.15s, border-color 0.15s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </header>
  );
}