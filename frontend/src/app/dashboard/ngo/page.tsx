'use client';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/context/AuthContext';
import { MapPin, CheckCircle2, Clock, Boxes, Users, ArrowUpRight, Search, Filter } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ngoAPI, donationAPI, usersAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ProtectedRoute from '@/components/ProtectedRoute';

const categoryIcon: Record<string, string> = { food: '🍱', clothes: '👕', toys: '🧸', books: '📚', other: '♻️' };
const urgencyColors: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

export default function NgoDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState<'overview' | 'donations'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [donations, setDonations] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [assignModal, setAssignModal] = useState<{ open: boolean; donationId: string | null }>({ open: false, donationId: null });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [dashRes, donRes, volRes] = await Promise.all([
          ngoAPI.getDashboard(), ngoAPI.getNearbyDonations(), usersAPI.getVolunteers()
        ]);
        setStats(dashRes.data.stats);
        setDonations(donRes.data.donations || []);
        setVolunteers(volRes.data.volunteers || []);
      } catch (e) {} finally { setLoading(false); }
    };
    loadData();
  }, []);

  const acceptDonation = async (donationId: string) => {
    try {
      await donationAPI.updateStatus(donationId, { status: 'accepted' });
      setDonations(prev => prev.filter(d => d._id !== donationId));
      toast.success('Donation accepted!');
    } catch { toast.error('Failed to accept'); }
  };

  const assignVolunteer = async (volunteerId: string) => {
    if (!assignModal.donationId) return;
    try {
      await ngoAPI.assignVolunteer({ donationId: assignModal.donationId, volunteerId });
      setAssignModal({ open: false, donationId: null });
      toast.success('Volunteer assigned!');
    } catch { toast.error('Failed to assign'); }
  };

  const filtered = donations.filter(d =>
    (d.title?.toLowerCase().includes(search.toLowerCase()) || d.pickupLocation?.city?.toLowerCase().includes(search.toLowerCase())) &&
    (!categoryFilter || d.category === categoryFilter)
  );

  const statCards = [
    { label: 'Active Requests', value: stats?.accepted || 0, color: '#0ea5e9', icon: CheckCircle2 },
    { label: 'Pending Nearby', value: stats?.pendingNearby || 0, color: '#f97316', icon: Clock },
    { label: 'Completed', value: stats?.completed || 0, color: '#22c55e', icon: CheckCircle2 },
    { label: 'Volunteers', value: stats?.volunteerCount || 0, color: '#a855f7', icon: Users },
  ];

  return (
    <ProtectedRoute allowedRoles={['ngo']}>
      <div style={{ display: 'flex', background: '#070d1a', minHeight: '100vh' }}>
        <Sidebar />
        <main className="dashboard-content" style={{ flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>NGO Dashboard</h1>
              <p style={{ color: '#64748b', marginTop: '4px' }}>{user?.ngoName || user?.name} • Manage donations & volunteers</p>
            </div>
            <NotificationBell />
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: '32px' }}>
            {statCards.map(s => (
              <div key={s.label} className="card-stat">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={22} color={s.color} />
                  </div>
                  <ArrowUpRight size={16} color="#334155" />
                </div>
                <div style={{ fontSize: '34px', fontWeight: 800, color: s.color, fontFamily: 'Outfit, sans-serif', marginBottom: '4px' }}>{s.value}</div>
                <div style={{ fontSize: '13px', color: '#64748b' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '24px', width: 'fit-content' }}>
            {[['overview', 'Overview'], ['donations', 'Available Donations']].map(([t, l]) => (
              <button key={t} onClick={() => setTab(t as any)}
                style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, background: tab === t ? '#22c55e' : 'transparent', color: tab === t ? 'white' : '#64748b', transition: 'all 0.2s' }}>
                {l}
              </button>
            ))}
          </div>

          {tab === 'overview' ? (
            /* Inventory Preview */
            <div className="card">
              <h2 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '20px', color: '#f1f5f9' }}>Inventory Overview</h2>
              {stats?.inventoryItems === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#475569' }}>
                  <Boxes size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                  <p>No inventory yet. Accept donations to start building your inventory.</p>
                </div>
              ) : (
                <div style={{ padding: '20px', background: 'rgba(34,197,94,0.06)', borderRadius: '14px', border: '1px solid rgba(34,197,94,0.15)', textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', fontWeight: 800, color: '#22c55e', fontFamily: 'Outfit, sans-serif' }}>{stats?.inventoryItems}</div>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>Total items in inventory</div>
                </div>
              )}
            </div>
          ) : (
            /* Available Donations */
            <div>
              {/* Filters */}
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or city..." className="input" style={{ paddingLeft: '40px' }} />
                </div>
                <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="input" style={{ width: 'auto', minWidth: '150px' }}>
                  <option value="">All Categories</option>
                  {['food','clothes','toys','books','other'].map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c}</option>)}
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>Loading nearby donations...</div>
              ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px' }} className="card">
                  <MapPin size={48} color="#1e293b" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#475569' }}>No available donations found.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {filtered.map(d => (
                    <div key={d._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Header */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ fontSize: '32px', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '14px' }}>{categoryIcon[d.category]}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '15px' }}>{d.title}</div>
                            <div style={{ color: '#64748b', fontSize: '12px' }}>{d.quantity}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: urgencyColors[d.urgency] || '#94a3b8', background: `${urgencyColors[d.urgency]}15` || 'rgba(148,163,184,0.1)', padding: '3px 10px', borderRadius: '100px', border: `1px solid ${urgencyColors[d.urgency]}30` }}>
                          {d.urgency?.toUpperCase()}
                        </span>
                      </div>

                      {/* Location */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px' }}>
                        <MapPin size={14} color="#64748b" />
                        {d.pickupLocation?.address || d.pickupLocation?.city || 'Location not specified'}
                      </div>

                      {/* Donor */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#22c55e,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '13px' }}>{d.donor?.name?.[0]}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{d.donor?.name}</div>
                          <div style={{ fontSize: '11px', color: '#475569' }}>{d.donor?.organization || 'Individual Donor'}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#475569' }}>{formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => acceptDonation(d._id)} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Accept</button>
                        <button onClick={() => setAssignModal({ open: true, donationId: d._id })} className="btn-secondary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '14px' }}>Assign Vol.</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Assign Volunteer Modal */}
          {assignModal.open && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
              <div style={{ background: '#111827', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', width: '100%', maxWidth: '480px', padding: '28px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#f1f5f9', marginBottom: '20px' }}>Assign a Volunteer</h3>
                {volunteers.length === 0 ? (
                  <p style={{ color: '#475569', textAlign: 'center', padding: '20px' }}>No volunteers available.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {volunteers.map(v => (
                      <button key={v._id} onClick={() => assignVolunteer(v._id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'left' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#22c55e50', e.currentTarget.style.background = 'rgba(34,197,94,0.05)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)', e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg,#f97316,#f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white' }}>{v.name?.[0]}</div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '14px' }}>{v.name}</div>
                          <div style={{ color: '#64748b', fontSize: '12px' }}>{v.totalPickups} pickups • {v.volunteerPoints} pts</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                <button onClick={() => setAssignModal({ open: false, donationId: null })} className="btn-outline" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>Cancel</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
