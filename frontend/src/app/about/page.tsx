import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Heart, Target, Globe, Users, Award, Linkedin, Twitter } from 'lucide-react';

const team = [
  { name: 'Arjun Mehta', role: 'Founder & CEO', desc: 'Former food tech entrepreneur passionate about zero hunger.', avatar: 'A', color: '#22c55e' },
  { name: 'Priya Sharma', role: 'Head of NGO Relations', desc: '10+ years working with social impact organizations across India.', avatar: 'P', color: '#0ea5e9' },
  { name: 'Kiran Rao', role: 'CTO', desc: 'Built scalable platforms for millions of users in food & logistics.', avatar: 'K', color: '#f97316' },
  { name: 'Meena Joseph', role: 'Volunteer Operations', desc: 'Coordinates 1000+ volunteers across 45 cities every month.', avatar: 'M', color: '#a855f7' },
];

const values = [
  { icon: Heart, title: 'Compassion First', desc: 'Every decision we make is guided by empathy and a desire to reduce suffering.', color: '#22c55e' },
  { icon: Globe, title: 'Transparency', desc: 'We build trust through complete visibility into how donations flow from donor to beneficiary.', color: '#0ea5e9' },
  { icon: Target, title: 'Zero Waste', desc: 'Our mission is a world where no food, clothes, or usable item goes to waste.', color: '#f97316' },
  { icon: Users, title: 'Community Power', desc: 'We believe communities are most resilient when they support each other.', color: '#a855f7' },
];

const milestones = [
  { year: '2021', title: 'FoodBridge Founded', desc: 'Started in Mumbai with 5 partner NGOs and 50 donors.' },
  { year: '2022', title: 'Expanded to 10 Cities', desc: '50,000 meals saved in our first full year of operations.' },
  { year: '2023', title: 'Launched Volunteer Platform', desc: 'Added volunteer management, reaching 45 cities and 1,000+ volunteers.' },
  { year: '2024', title: '250,000 Meals & Beyond', desc: 'Now the largest food donation platform in India with 180+ NGO partners.' },
];

export default function AboutPage() {
  return (
    <div style={{ background: '#070d1a', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ paddingTop: '140px', paddingBottom: '80px', textAlign: 'center', background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 60%)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px' }}>
          <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px' }}>Our Story</span>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(36px,5vw,56px)', fontWeight: 800, color: '#f1f5f9', margin: '16px 0 20px' }}>
            About <span className="gradient-text">FoodBridge</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '18px', lineHeight: 1.8 }}>
            We started with a simple belief: No meal should go to waste when millions go to bed hungry. FoodBridge was built to bridge that gap — connecting surplus with scarcity, one donation at a time.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section style={{ padding: '80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.03))', borderColor: 'rgba(34,197,94,0.2)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Heart size={26} color="#22c55e" />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '22px', color: '#f1f5f9', marginBottom: '12px' }}>Our Mission</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '15px' }}>To create a world where every surplus meal, garment, and resource reaches those who need them — using technology to make giving as frictionless as possible. We empower donors, empower NGOs, and celebrate volunteers who make it happen.</p>
          </div>
          <div className="card" style={{ background: 'linear-gradient(135deg, rgba(14,165,233,0.08), rgba(14,165,233,0.03))', borderColor: 'rgba(14,165,233,0.2)' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <Globe size={26} color="#0ea5e9" />
            </div>
            <h2 style={{ fontWeight: 800, fontSize: '22px', color: '#f1f5f9', marginBottom: '12px' }}>Our Vision</h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '15px' }}>A zero-hunger, zero-waste India by 2030. We envision a country where every city has an active FoodBridge network, where any surplus item can find a beneficiary within hours, and where communities thrive through a culture of giving.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '0 24px 80px', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, color: '#f1f5f9', marginBottom: '40px', textAlign: 'center' }}>What We Stand For</h2>
        <div className="grid-4">
          {values.map(v => (
            <div key={v.title} className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${v.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <v.icon size={28} color={v.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9', marginBottom: '10px' }}>{v.title}</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '0 24px 80px', maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, color: '#f1f5f9', marginBottom: '48px', textAlign: 'center' }}>Our Journey</h2>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #22c55e, #0ea5e9)', transform: 'translateX(-50%)' }} />
          {milestones.map((m, i) => (
            <div key={m.year} style={{ display: 'flex', gap: '40px', marginBottom: '48px', alignItems: 'flex-start', flexDirection: i % 2 === 0 ? 'row' : 'row-reverse' }}>
              <div style={{ flex: 1, textAlign: i % 2 === 0 ? 'right' : 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>{m.year}</div>
                <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9', marginBottom: '8px' }}>{m.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#22c55e', border: '4px solid #070d1a', flexShrink: 0, marginTop: '4px', position: 'relative', zIndex: 1, boxShadow: '0 0 16px rgba(34,197,94,0.5)' }} />
              <div style={{ flex: 1 }} />
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '0 24px 100px', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '36px', fontWeight: 800, color: '#f1f5f9', marginBottom: '48px', textAlign: 'center' }}>Meet the Team</h2>
        <div className="grid-4">
          {team.map(t => (
            <div key={t.name} className="card" style={{ textAlign: 'center' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '20px', background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'white', margin: '0 auto 16px' }}>{t.avatar}</div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#f1f5f9', marginBottom: '4px' }}>{t.name}</h3>
              <div style={{ fontSize: '13px', color: t.color, fontWeight: 600, marginBottom: '12px' }}>{t.role}</div>
              <p style={{ color: '#64748b', fontSize: '13px', lineHeight: 1.7 }}>{t.desc}</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
