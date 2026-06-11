'use client';
import { useState, useEffect, useCallback } from 'react';
import type { DashboardStats } from '@/lib/compute';
import Header from '@/components/Header';
import TabOverview from '@/components/tabs/TabOverview';
import TabCustomerAging from '@/components/tabs/TabCustomerAging';
import TabDrilldown from '@/components/tabs/TabDrilldown';
import TabCollections from '@/components/tabs/TabCollections';
import TabMIS from '@/components/tabs/TabMIS';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<Date | null>(null);

  const [drilldownCustomer, setDrilldownCustomer] = useState<string>('');
  const [agingFilter, setAgingFilter] = useState<string>('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/dashboard', { cache: 'no-store' });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.details || errData.error || 'Failed to fetch data');
      }
      const data: DashboardStats = await res.json();
      setStats(data);
      setFetchedAt(new Date(data.fetchedAt));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleDrilldown(customer: string) {
    setDrilldownCustomer(customer);
    setActiveTab(2);
  }

  const counts = {
    ageing: stats ? stats.customers.filter(c => c.outstanding > 0).length : 0,
    collections: stats ? stats.overdueCount : 0,
    mis: stats ? stats.monthly.length : 0,
  };

  if (loading && !stats) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ width: 40, height: 40, border: '3px solid #21262d', borderTop: '3px solid #00b49a', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <div style={{ color: '#64748b', fontSize: 14 }}>Loading dashboard data...</div>
        <style>{' @keyframes spin { to { transform: rotate(360deg); } } '}</style>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div style={{ minHeight: '100vh', background: '#0d1117', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <div style={{ color: '#ef4444', fontSize: 16, fontWeight: 600 }}>Failed to load data</div>
        <div style={{ color: '#8b949e', fontSize: 13, maxWidth: 500, textAlign: 'center' }}>{error}</div>
        <button onClick={fetchData} style={{ marginTop: 8, padding: '8px 20px', background: '#00b49a', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}>Retry</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        loading={loading}
        fetchedAt={fetchedAt}
        onRefresh={fetchData}
        counts={counts}
      />
      <main>
        {stats && (
          <>
            {activeTab === 0 && <TabOverview stats={stats} onDrilldown={handleDrilldown} />}
            {activeTab === 1 && <TabCustomerAging stats={stats} onDrilldown={handleDrilldown} filter={agingFilter} setFilter={setAgingFilter} />}
            {activeTab === 2 && <TabDrilldown stats={stats} selectedCustomer={drilldownCustomer} setSelectedCustomer={setDrilldownCustomer} />}
            {activeTab === 3 && <TabCollections stats={stats} />}
            {activeTab === 4 && <TabMIS stats={stats} />}
          </>
        )}
      </main>
    </div>
  );
}
