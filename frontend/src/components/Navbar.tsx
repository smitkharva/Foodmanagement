'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, Heart, Bell, User, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const dashboardLink = user ? `/dashboard/${user.role}` : '/auth/login';

  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: scrolled ? 'rgba(7,13,26,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #16a34a, #22c55e)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={20} color="white" fill="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '22px', background: 'linear-gradient(135deg, #22c55e, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FoodBridge
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="hidden-mobile">
          {[['/', 'Home'], ['/about', 'About'], ['/marketplace', 'Marketplace'], ['/impact', 'Impact'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} className="nav-link">{label}</Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px 16px', cursor: 'pointer', color: '#f1f5f9' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#22c55e,#0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700 }}>
                  {user.name[0].toUpperCase()}
                </div>
                <span style={{ fontSize: '14px', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} />
              </button>
              {dropdownOpen && (
                <div style={{ position: 'absolute', right: 0, top: '110%', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '8px', minWidth: '180px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                  <Link href={dashboardLink} onClick={() => setDropdownOpen(false)}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', color: '#94a3b8', textDecoration: 'none', fontSize: '14px' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(34,197,94,0.1)', e.currentTarget.style.color = '#22c55e')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.color = '#94a3b8')}>
                    <User size={15} /> Dashboard
                  </Link>
                  <button onClick={() => { logout(); setDropdownOpen(false); }}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', color: '#ef4444', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '14px', width: '100%' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn-outline" style={{ padding: '10px 20px', fontSize: '14px' }}>Sign In</Link>
              <Link href="/auth/register" className="btn-primary" style={{ padding: '10px 20px', fontSize: '14px' }}>Get Started</Link>
            </>
          )}
          <button onClick={() => setIsOpen(!isOpen)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: '#f1f5f9' }} className="show-mobile">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div style={{ background: 'rgba(7,13,26,0.98)', backdropFilter: 'blur(20px)', padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {[['/', 'Home'], ['/about', 'About'], ['/marketplace', 'Marketplace'], ['/impact', 'Impact'], ['/contact', 'Contact']].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)} style={{ display: 'block', padding: '12px 0', color: '#94a3b8', textDecoration: 'none', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>{label}</Link>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            {!user && <>
              <Link href="/auth/login" className="btn-outline" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Sign In</Link>
              <Link href="/auth/register" className="btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '10px' }}>Get Started</Link>
            </>}
          </div>
        </div>
      )}
    </nav>
  );
}
