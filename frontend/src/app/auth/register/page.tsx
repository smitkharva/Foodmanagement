'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Heart, Eye, EyeOff, ArrowRight, User, Mail, Phone, Lock, Building2, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    role: searchParams.get('role') || 'donor',
    organization: '', donorType: 'restaurant',
    ngoName: '', ngoRegNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const { data } = await authAPI.register(form);
      if (data.success) {
        localStorage.setItem('foodbridge_token', data.token);
        localStorage.setItem('foodbridge_user', JSON.stringify(data.user));
        toast.success('Registration successful! Welcome to FoodBridge.');
        router.push(`/dashboard/${data.user.role}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const roles = [
    { value: 'donor', label: 'Food Donor', desc: 'Share surplus food & items', icon: '🍱' },
    { value: 'ngo', label: 'NGO', desc: 'Manage and distribute donations', icon: '🏢' },
    { value: 'volunteer', label: 'Volunteer', desc: 'Help with pickup & delivery', icon: '🚗' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(ellipse at 30% 50%, rgba(34,197,94,0.1) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(14,165,233,0.08) 0%, transparent 60%), #070d1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '8px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg,#16a34a,#22c55e)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={24} color="white" fill="white" />
            </div>
            <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '24px', background: 'linear-gradient(135deg,#22c55e,#0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FoodBridge</span>
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: '#64748b', fontSize: '15px' }}>Join the movement. Make a difference today.</p>
        </div>

        {/* Card */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '36px' }}>
          {/* Role Selector */}
          <div style={{ marginBottom: '24px' }}>
            <label className="input-label">I am a...</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {roles.map(r => (
                <button key={r.value} type="button" onClick={() => setForm(p => ({ ...p, role: r.value }))}
                  style={{ padding: '14px 8px', borderRadius: '14px', border: `2px solid ${form.role === r.value ? '#22c55e' : 'rgba(255,255,255,0.08)'}`, background: form.role === r.value ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>{r.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: form.role === r.value ? '#22c55e' : '#94a3b8' }}>{r.label}</div>
                  <div style={{ fontSize: '11px', color: '#475569', marginTop: '2px' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="form-group">
              <label className="input-label">Full Name *</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input name="name" value={form.name} onChange={handleChange} placeholder="Arjun Mehta" className="input" style={{ paddingLeft: '44px' }} required />
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="input-label">Email Address *</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="arjun@example.com" className="input" style={{ paddingLeft: '44px' }} required />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="input-label">Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <Phone size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input" style={{ paddingLeft: '44px' }} required />
              </div>
            </div>

            {/* Role-specific fields */}
            {form.role === 'donor' && (
              <div className="form-group">
                <label className="input-label">Organization (Optional)</label>
                <input name="organization" value={form.organization} onChange={handleChange} placeholder="Restaurant / Hotel name" className="input" />
              </div>
            )}
            {form.role === 'ngo' && (
              <>
                <div className="form-group">
                  <label className="input-label">NGO Name *</label>
                  <div style={{ position: 'relative' }}>
                    <Building2 size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                    <input name="ngoName" value={form.ngoName} onChange={handleChange} placeholder="Hope Foundation" className="input" style={{ paddingLeft: '44px' }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="input-label">NGO Registration Number</label>
                  <input name="ngoRegNumber" value={form.ngoRegNumber} onChange={handleChange} placeholder="REG/2024/001234" className="input" />
                </div>
              </>
            )}

            {/* Password */}
            <div className="form-group">
              <label className="input-label">Password *</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="At least 6 characters" className="input" style={{ paddingLeft: '44px', paddingRight: '44px' }} required />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px', marginTop: '8px', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating Account...' : <><span>Create Account</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '24px', color: '#475569', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/auth/login" style={{ color: '#22c55e', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
