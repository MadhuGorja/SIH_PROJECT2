import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PortalShell({ roleName, roleColor, roleBg, tabs, active, onChange, children }) {
  return (
    <div className="min-h-screen flex" style={{ background: 'var(--paper)' }}>
      <aside className="w-60 shrink-0 flex flex-col" style={{ background: 'var(--forest-dark)' }}>
        <div className="px-5 py-5 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm">
            <ArrowLeft size={15} /> Switch role
          </Link>
        </div>
        <div className="px-5 pt-5 pb-3">
          <p className="text-white/50 text-xs tracking-wide">Signed in as</p>
          <p className="text-white font-display text-lg leading-tight mt-0.5">{roleName}</p>
        </div>
        <nav className="flex-1 px-3 py-2 space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.key;
            return (
              <button
                key={t.key}
                onClick={() => onChange(t.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                  isActive ? 'text-white' : 'text-white/55 hover:text-white/85 hover:bg-white/5'
                }`}
                style={isActive ? { background: roleColor } : {}}
              >
                <Icon size={17} />
                {t.label}
              </button>
            );
          })}
        </nav>
        <div className="px-5 py-4 text-white/35 text-xs border-t border-white/10">KisanSetu · PS 26032</div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
