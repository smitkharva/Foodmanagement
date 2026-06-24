'use client';
import Sidebar from '@/components/Sidebar';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/context/AuthContext';
import { Truck, CheckCircle2, Star, MapPin, Camera, ArrowUpRight, Navigation } from 'lucide-react';
import { useEffect, useState } from 'react';
import { volunteerAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ProtectedRoute from '@/components/ProtectedRoute';

const categoryIcon: Record<string, string> = { food: '🍱', clothes: '👕', toys: '🧸', books: '📚', other: '♻️' };

export default function VolunteerDashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    volunteerAPI.getDashboard().then(({ data }) => setDashData(data))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (pickupId: string, status: string) => {
    setUpdatingId(pickupId);
    try {
      const formData = new FormData();
      formData.append('status', status);
      await volunteerAPI.updatePickup(pickupId, formData);
      toast.success(`Status updated to ${status.replace('_', ' ')}!`);
      const { data } = await volunteerAPI.getDashboard();
      setDashData(data);
    } catch { toast.error('Failed to update status'); }
    finally { setUpdatingId(null); }
  };

  const stats = [
    { label: 'Assigned', value: dashData?.stats?.assigned || 0, color: '#0ea5e9', icon: Truck },
    { label: 'Picked Up', value: dashData?.stats?.pickedUp || 0, color: '#f97316', icon: CheckCircle2 },
    { label: 'Completed', value: dashData?.stats?.completed || 0, color: '#22c55e', icon: CheckCircle2 },
    { label: 'Points Earned', value: dashData?.stats?.points || 0, color: '#f59e0b', icon: Star },
  ];

  return (
    <ProtectedRoute allowedRoles={['volunteer']}>
      <div style={{ display: 'flex', background: '#070d1a', minHeight: '100vh' }}>
        <Sidebar />
        <main className="dashboard-content" style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>
                Volunteer Hub 🚗
              </h1>
              <p style={{ color: '#64748b', marginTop: '4px' }}>Manage your pickups and track your impact</p>
            </div>
            <NotificationBell />
          </div>

          {/* Stats */}
          <div className="grid-4" style={{ marginBottom: '32px' }}>
            {stats.map(s => (
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

          {/* Active Pickups */}
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', marginBottom: '20px' }}>Active Pickups</h2>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>Loading your assignments...</div>
          ) : !dashData?.myPickups?.length ? (
            <div className="card" style={{ textAlign: 'center', padding: '60px' }}>
              <Truck size={56} color="#1e293b" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ color: '#475569', marginBottom: '8px' }}>No active pickups</h3>
              <p style={{ color: '#334155', fontSize: '14px' }}>Your NGO will assign pickups to you. Stay available!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
              {dashData.myPickups.map((p: any) => (
                <div key={p._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ fontSize: '32px', width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '14px' }}>{categoryIcon[p.category] || '📦'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, color: '#f1f5f9' }}>{p.title}</div>
                      <div style={{ color: '#64748b', fontSize: '13px' }}>{p.quantity}</div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: p.status === 'assigned' ? 'rgba(14,165,233,0.15)' : 'rgba(249,115,22,0.15)', color: p.status === 'assigned' ? '#0ea5e9' : '#f97316', border: `1px solid ${p.status === 'assigned' ? '#0ea5e930' : '#f9731630'}` }}>
                      {p.status === 'assigned' ? 'ASSIGNED' : 'PICKED UP'}
                    </span>
                  </div>

                  <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: 600, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      <MapPin size={12} /> Pickup Location
                    </div>
                    <div style={{ color: '#f1f5f9', fontSize: '14px' }}>{p.pickupLocation?.address || 'Address not provided'}</div>
                    <div style={{ color: '#64748b', fontSize: '12px', marginTop: '2px' }}>{p.donor?.phone}</div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#0ea5e9,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '13px' }}>{p.assignedNgo?.name?.[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', color: '#94a3b8' }}>Assigned by: <span style={{ color: '#f1f5f9', fontWeight: 600 }}>{p.assignedNgo?.ngoName || p.assignedNgo?.name}</span></div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(p.pickupLocation?.address || '')}`} target="_blank" rel="noreferrer" className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '13px' }}>
                      <Navigation size={14} /> Navigate
                    </a>
                    {p.status === 'assigned' && (
                      <button onClick={() => updateStatus(p._id, 'picked_up')} disabled={updatingId === p._id} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '13px' }}>
                        {updatingId === p._id ? 'Updating...' : 'Mark Picked Up'}
                      </button>
                    )}
                    {p.status === 'picked_up' && (
                      <button onClick={() => updateStatus(p._id, 'delivered')} disabled={updatingId === p._id} className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px', fontSize: '13px', background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
                        {updatingId === p._id ? 'Updating...' : 'Mark Delivered'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
