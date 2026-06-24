'use client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { donationAPI } from '@/lib/api';
import { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

const categoryIcon: Record<string, string> = { food: '🍱', clothes: '👕', toys: '🧸', books: '📚', other: '♻️' };
const urgencyColors: Record<string, string> = { low: '#22c55e', medium: '#f59e0b', high: '#f97316', critical: '#ef4444' };

export default function MarketplacePage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');

  useEffect(() => {
    donationAPI.getAll({ status: 'pending', category: category || undefined, urgency: urgency || undefined })
      .then(({ data }) => setDonations(data.donations || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, urgency]);

  const filtered = donations.filter(d =>
    d.title?.toLowerCase().includes(search.toLowerCase()) ||
    d.pickupLocation?.city?.toLowerCase().includes(search.toLowerCase()) ||
    d.donor?.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#070d1a', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ paddingTop: '100px', maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 80px' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Live Listings</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 800, color: '#f1f5f9', margin: '12px 0 12px' }}>
            NGO <span className="gradient-text">Marketplace</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '16px' }}>Browse all available donations near you. Accept and coordinate pickups with your volunteers.</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap', padding: '20px', background: '#111827', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by title, city, or donor..." className="input" style={{ paddingLeft: '44px' }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ width: 'auto', minWidth: '150px' }}>
            <option value="">All Categories</option>
            {['food','clothes','toys','books','other'].map(c => <option key={c} value={c} style={{ textTransform: 'capitalize' }}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </select>
          <select value={urgency} onChange={e => setUrgency(e.target.value)} className="input" style={{ width: 'auto', minWidth: '140px' }}>
            <option value="">All Urgency</option>
            {['low','medium','high','critical'].map(u => <option key={u} value={u} style={{ textTransform: 'capitalize' }}>{u.charAt(0).toUpperCase() + u.slice(1)}</option>)}
          </select>
        </div>

        {/* Results count */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: '#475569', fontSize: '14px' }}>
            Showing <span style={{ color: '#22c55e', fontWeight: 700 }}>{filtered.length}</span> available donations
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.1)', borderRadius: '8px', fontSize: '12px', color: '#22c55e', fontWeight: 600 }}>● Live</span>
          </div>
        </div>

        {/* Cards Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#475569' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>🔍</div>
            <p>Loading available donations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px' }} className="card">
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ color: '#f1f5f9', fontWeight: 700, marginBottom: '8px' }}>No donations found</h3>
            <p style={{ color: '#475569', fontSize: '14px', marginBottom: '24px' }}>Try adjusting your filters or check back soon.</p>
            <Link href="/auth/register?role=donor" className="btn-primary" style={{ padding: '12px 28px' }}>Be the first to donate</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {filtered.map(d => (
              <div key={d._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Image or placeholder */}
                <div style={{ height: '140px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '56px', position: 'relative', overflow: 'hidden' }}>
                  {d.images?.[0] ? (
                    <img src={d.images[0]} alt={d.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : categoryIcon[d.category] || '📦'}
                  <div style={{ position: 'absolute', top: '10px', right: '10px', padding: '4px 10px', borderRadius: '100px', fontSize: '11px', fontWeight: 700, background: `${urgencyColors[d.urgency]}20`, color: urgencyColors[d.urgency], border: `1px solid ${urgencyColors[d.urgency]}40`, backdropFilter: 'blur(4px)' }}>
                    {d.urgency?.toUpperCase()}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h3 style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '15px', flex: 1, marginRight: '8px' }}>{d.title}</h3>
                    <span style={{ padding: '2px 10px', background: 'rgba(255,255,255,0.06)', borderRadius: '100px', fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>{d.category}</span>
                  </div>
                  <p style={{ color: '#475569', fontSize: '13px', margin: '0 0 10px', lineHeight: 1.6 }}>{d.description?.slice(0, 80) || 'No description provided'}...</p>
                </div>

                <div style={{ display: 'flex', flex: 1, flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                    <MapPin size={13} /> {d.pickupLocation?.city || d.pickupLocation?.address || 'Location TBD'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '13px' }}>
                    <Clock size={13} /> {formatDistanceToNow(new Date(d.createdAt), { addSuffix: true })}
                  </div>
                  <div style={{ fontWeight: 600, color: '#22c55e', fontSize: '14px' }}>Qty: {d.quantity}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg,#22c55e,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '13px' }}>{d.donor?.name?.[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#f1f5f9' }}>{d.donor?.name}</div>
                    <div style={{ fontSize: '11px', color: '#475569' }}>{d.donor?.organization || 'Individual'}</div>
                  </div>
                  <Link href={`/auth/login`} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#22c55e', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
                    Accept <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
