'use client';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { Users, Package, ShieldCheck, TrendingUp, ArrowUpRight, Search, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [tab, setTab] = useState<'overview' | 'users' | 'ngos'>('overview');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([adminAPI.getStats(), adminAPI.getAllUsers()]);
        setStats(statsRes.data.stats);
        setUsers(usersRes.data.users || []);
      } catch {} finally { setLoading(false); }
    };
    load();
  }, []);

  const toggleStatus = async (id: string) => {
    try {
      const { data } = await adminAPI.toggleStatus(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch { toast.error('Action failed'); }
  };

  const verifyNgo = async (id: string) => {
    try {
      await adminAPI.verifyNgo(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, ngoVerified: true, isVerified: true } : u));
      toast.success('NGO verified!');
    } catch { toast.error('Verification failed'); }
  };

  const filtered = users.filter(u =>
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter)
  );

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, color: '#22c55e', sub: `${stats?.totalDonors || 0} donors` },
    { label: 'Active NGOs', value: stats?.totalNgos || 0, color: '#0ea5e9', sub: `${stats?.pendingNgoVerifications || 0} pending` },
    { label: 'Volunteers', value: stats?.totalVolunteers || 0, color: '#f97316', sub: 'active volunteers' },
    { label: 'Total Donations', value: stats?.totalDonations || 0, color: '#a855f7', sub: `${stats?.completedDonations || 0} completed` },
  ];

  const roleColor: Record<string, string> = { donor: '#22c55e', ngo: '#0ea5e9', volunteer: '#f97316', admin: '#a855f7' };

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div style={{ display: 'flex', background: '#070d1a', minHeight: '100vh' }}>
        <Sidebar />
        <main className="dashboard-content" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>Admin Control Panel</h1>
              <p style={{ color: '#64748b', marginTop: '4px' }}>Platform management & oversight</p>
            </div>
            <NotificationBell />
          </div>

          {/* Stat Cards */}
          <div className="grid-4" style={{ marginBottom: '32px' }}>
            {statCards.map(s => (
              <div key={s.label} className="card-stat">
                <div style={{ fontSize: '36px', fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif', marginBottom: '6px' }}>{s.value}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9', marginBottom: '4px' }}>{s.label}</div>
                <div style={{ fontSize: '12px', color: '#475569' }}>{s.sub}</div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${s.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
            {[['overview', 'Overview'], ['users', 'All Users'], ['ngos', 'NGO Verification']].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t as any)}
                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: tab === t ? '#a855f7' : 'transparent', color: tab === t ? 'white' : '#64748b', transition: 'all 0.2s' }}>
                {l}
              </button>
            ))}
          </div>

          {tab === 'overview' && stats && (
            <div className="grid-2">
              <div className="card">
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9', marginBottom: '20px' }}>Donation Overview</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { label: 'Pending', value: stats.pendingDonations, color: '#f59e0b' },
                    { label: 'Completed', value: stats.completedDonations, color: '#22c55e' },
                    { label: 'Total', value: stats.totalDonations, color: '#0ea5e9' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                      <span style={{ color: '#94a3b8', fontSize: '14px' }}>{item.label} Donations</span>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9', marginBottom: '20px' }}>User Distribution</h3>
                {[
                  { role: 'Donors', count: stats.totalDonors, color: '#22c55e' },
                  { role: 'NGOs', count: stats.totalNgos, color: '#0ea5e9' },
                  { role: 'Volunteers', count: stats.totalVolunteers, color: '#f97316' },
                ].map(item => (
                  <div key={item.role} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#94a3b8' }}>{item.role}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: item.color }}>{item.count}</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${stats.totalUsers > 0 ? (item.count / stats.totalUsers) * 100 : 0}%`, background: item.color, borderRadius: '3px', transition: 'width 1s ease' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(tab === 'users' || tab === 'ngos') && (
            <div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="input" style={{ paddingLeft: '40px' }} />
                </div>
                {tab === 'users' && (
                  <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input" style={{ width: 'auto', minWidth: '140px' }}>
                    <option value="">All Roles</option>
                    {['donor','ngo','volunteer','admin'].map(r => <option key={r} value={r} style={{ textTransform: 'capitalize' }}>{r}</option>)}
                  </select>
                )}
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Email</th>
                      {tab === 'ngos' && <th>NGO Name</th>}
                      {tab === 'ngos' && <th>Verified</th>}
                      <th>Status</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(tab === 'ngos' ? filtered.filter(u => u.role === 'ngo') : filtered).map(u => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${roleColor[u.role]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: roleColor[u.role], fontSize: '14px', flexShrink: 0 }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500, fontSize: '14px' }}>{u.name}</span>
                          </div>
                        </td>
                        <td><span className="badge" style={{ background: `${roleColor[u.role]}15`, color: roleColor[u.role], border: `1px solid ${roleColor[u.role]}30`, textTransform: 'capitalize' }}>{u.role}</span></td>
                        <td style={{ color: '#64748b', fontSize: '13px' }}>{u.email}</td>
                        {tab === 'ngos' && <td style={{ color: '#f1f5f9', fontSize: '13px' }}>{u.ngoName || '—'}</td>}
                        {tab === 'ngos' && (
                          <td>
                            {u.ngoVerified
                              ? <span className="badge badge-green"><CheckCircle size={12} /> Verified</span>
                              : <span className="badge badge-orange"><AlertTriangle size={12} /> Pending</span>}
                          </td>
                        )}
                        <td>
                          <span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td style={{ color: '#475569', fontSize: '12px' }}>{formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {tab === 'ngos' && !u.ngoVerified && (
                              <button onClick={() => verifyNgo(u._id)} style={{ padding: '6px 14px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '8px', color: '#22c55e', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                Verify
                              </button>
                            )}
                            <button onClick={() => toggleStatus(u._id)}
                              style={{ padding: '6px 14px', background: u.isActive ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${u.isActive ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}`, borderRadius: '8px', color: u.isActive ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                              {u.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
