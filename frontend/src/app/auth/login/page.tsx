'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Heart, Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please enter email and password'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally { setLoading(false); }
  };

  const demoAccounts = [
    { role: 'Donor', email: 'donor@demo.com', color: '#22c55e' },
    { role: 'NGO', email: 'ngo@demo.com', color: '#0ea5e9' },
    { role: 'Volunteer', email: 'volunteer@demo.com', color: '#f97316' },
    { role: 'Admin', email: 'admin@demo.com', color: '#a855f7' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 70% 30%, rgba(34,197,94,0.1) 0%, transparent 60%), radial-gradient(ellipse at 20% 70%, rgba(14,165,233,0.08) 0%, transparent 60%), #070d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={24} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', background: 'linear-gradient(135deg,#22c55e,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodBridge</span>
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Welcome back</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Sign in to continue your impact.</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '36px' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="input" style={{ paddingLeft: '44px' }} required />
              </div>
            </div>
            <div className="form-group">
              <label className="input-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Your password" className="input" style={{ paddingLeft: '44px', paddingRight: '44px' }} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : <><span>Sign In</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Demo Accounts */}
          <div style={{ marginTop: '28px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px', textAlign: 'center' }}>Demo Accounts (password: demo123)</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {demoAccounts.map(acc => (
                <button key={acc.role} type="button"
                  onClick={() => { setEmail(acc.email); setPassword('demo123'); }}
                  style={{ padding: '10px', background: `${acc.color}10`, border: `1px solid ${acc.color}30`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: acc.color }}>{acc.role}</div>
                  <div style={{ fontSize: '10px', color: '#475569', marginTop: '2px' }}>{acc.email}</div>
                </button>
              ))}
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#475569', fontSize: '14px' }}>
            New to FoodBridge?{' '}
            <Link href="/auth/register" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
