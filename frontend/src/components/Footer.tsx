'use client';

import Link from 'next/link';
import { Heart, Mail, Phone, MapPin, Globe, Users, Award, Shield } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ background: '#030712', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '80px', paddingBottom: '40px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '48px', marginBottom: '64px' }}>
          {/* Brand */}
          <div>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '24px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #22c55e, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={22} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif' }}>FoodBridge</span>
            </Link>
            <p style={{ color: '#64748b', lineHeight: 1.8, fontSize: '15px', marginBottom: '24px' }}>
              Connecting surplus with scarcity. We're a technology-driven platform dedicated to reducing food waste and supporting social welfare across India.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              {[Globe, Users, Award, Shield].map((Icon, i) => (
                <a key={i} href="#" style={{ color: '#475569', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#22c55e'} onMouseLeave={e => e.currentTarget.style.color = '#475569'}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '16px', marginBottom: '24px' }}>Platform</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['Marketplace', 'Impact Analytics', 'Volunteer Hub', 'NGO Network'].map(item => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} style={{ color: '#64748b', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '16px', marginBottom: '24px' }}>Company</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {['About Us', 'Contact', 'FAQs', 'Privacy Policy', 'Terms of Service'].map(item => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(' ', '-')}`} style={{ color: '#64748b', textDecoration: 'none', fontSize: '15px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = '#f1f5f9'} onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '16px', marginBottom: '24px' }}>Contact</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <li style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                <Mail size={18} color="#22c55e" /> support@foodbridge.in
              </li>
              <li style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                <Phone size={18} color="#22c55e" /> +91 98765 43210
              </li>
              <li style={{ display: 'flex', gap: '12px', color: '#64748b', fontSize: '14px' }}>
                <MapPin size={18} color="#22c55e" /> Andheri East, Mumbai, MH
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <p style={{ color: '#475569', fontSize: '14px' }}>
            © {currentYear} FoodBridge Welfare Platform. Made with <Heart size={14} color="#ef4444" fill="#ef4444" style={{ display: 'inline', margin: '0 2px' }} /> for social impact.
          </p>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <span style={{ color: '#475569', fontSize: '13px' }}>Status: <span style={{ color: '#22c55e', fontWeight: 600 }}>● All Systems Operational</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
