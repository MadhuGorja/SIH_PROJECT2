import { Link } from 'react-router-dom';
import { Sprout, ClipboardCheck, ShieldCheck, LayoutDashboard, ArrowRight } from 'lucide-react';

const roles = [
  {
    key: 'farmer',
    label: 'Farmer',
    desc: 'Register your crop, submit a procurement request, and track status and payment.',
    icon: Sprout,
    color: 'var(--farmer)',
    bg: 'var(--farmer-bg)',
    path: '/farmer',
  },
  {
    key: 'officer',
    label: 'Procurement Officer',
    desc: 'Verify farmers, schedule procurement, record weighing, and confirm payment.',
    icon: ClipboardCheck,
    color: 'var(--officer)',
    bg: 'var(--officer-bg)',
    path: '/officer',
  },
  {
    key: 'inspector',
    label: 'Quality Inspector',
    desc: 'Review assigned lots, record grade and moisture, approve or reject.',
    icon: ShieldCheck,
    color: 'var(--inspector)',
    bg: 'var(--inspector-bg)',
    path: '/inspector',
  },
  {
    key: 'admin',
    label: 'Administrator',
    desc: 'Manage users, monitor procurement, review reports, and handle complaints.',
    icon: LayoutDashboard,
    color: 'var(--admin)',
    bg: 'var(--admin-bg)',
    path: '/admin',
  },
];

function BridgeHero() {
  return (
    <svg viewBox="0 0 800 220" className="w-full h-auto" role="img" aria-label="A bridge connecting a farm to a procurement centre">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FDF6E3" />
          <stop offset="100%" stopColor="#F8F6F0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="800" height="220" fill="url(#sky)" rx="16" />
      {/* farm side */}
      <circle cx="90" cy="70" r="30" fill="#E2A63B" opacity="0.9" />
      <path d="M20 170 Q60 150 100 170 Q140 150 180 170 L180 190 L20 190 Z" fill="#C9DDBB" />
      <path d="M40 190 L40 150 M55 190 L55 155 M70 190 L70 148 M85 190 L85 152" stroke="#3C8A5B" strokeWidth="3" strokeLinecap="round" />
      {/* centre side */}
      <rect x="620" y="120" width="140" height="70" rx="4" fill="#E9F1FB" stroke="#2F6FB3" strokeWidth="2" />
      <rect x="640" y="140" width="20" height="20" fill="#2F6FB3" opacity="0.5" />
      <rect x="670" y="140" width="20" height="20" fill="#2F6FB3" opacity="0.5" />
      <rect x="700" y="140" width="20" height="20" fill="#2F6FB3" opacity="0.5" />
      {/* bridge */}
      <path d="M180 175 Q400 90 620 175" fill="none" stroke="#1E4B3A" strokeWidth="6" strokeLinecap="round" />
      <path d="M180 175 Q400 90 620 175" fill="none" stroke="#E2A63B" strokeWidth="2" strokeDasharray="2 10" strokeLinecap="round" />
      {[220, 280, 340, 400, 460, 520, 580].map((x, i) => {
        const t = (x - 180) / 440;
        const y = 175 - Math.sin(t * Math.PI) * 85;
        return <line key={i} x1={x} y1={y} x2={x} y2={y + 20} stroke="#1E4B3A" strokeWidth="3" opacity="0.5" />;
      })}
    </svg>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--paper)' }}>
      <header className="max-w-5xl mx-auto px-6 pt-10 pb-2 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--forest)' }}>
          <Sprout size={18} color="white" />
        </div>
        <div>
          <p className="font-display text-lg leading-none" style={{ color: 'var(--forest-dark)' }}>KisanSetu</p>
          <p className="text-xs text-black/45">Digital procurement for a prosperous farmer</p>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-6 pt-6">
        <div className="rounded-3xl overflow-hidden border border-black/[0.06]">
          <BridgeHero />
        </div>
        <div className="mt-8 max-w-2xl">
          <h1 className="font-display text-4xl leading-tight" style={{ color: 'var(--forest-dark)' }}>
            The bridge between a farmer's harvest and a fair procurement centre.
          </h1>
          <p className="text-black/60 mt-3">
            One booked slot, one live token, one shared record — for the farmer, the officer, and
            the inspector, all in the same system.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <p className="text-sm font-medium text-black/45 mb-4">Continue as</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {roles.map((r) => {
            const Icon = r.icon;
            return (
              <Link
                key={r.key}
                to={r.path}
                className="group flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/[0.06] hover:border-black/[0.12] hover:shadow-md transition-all"
                style={{ borderLeftWidth: 4, borderLeftColor: r.color }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: r.bg }}>
                  <Icon size={20} color={r.color} />
                </div>
                <div className="flex-1">
                  <p className="font-medium" style={{ color: 'var(--ink)' }}>{r.label}</p>
                  <p className="text-sm text-black/50 mt-0.5">{r.desc}</p>
                </div>
                <ArrowRight size={16} className="mt-2 text-black/25 group-hover:text-black/50 transition-colors" />
              </Link>
            );
          })}
        </div>
      </section>

      <footer className="max-w-5xl mx-auto px-6 pb-10 text-xs text-black/35">
        Prototype for Smart India Hackathon · PS 26032 · Farmer Welfare & Agri-Governance
      </footer>
    </div>
  );
}
