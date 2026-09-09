export function StatusBadge({ status }) {
  const map = {
    Submitted: { bg: '#F1EDE3', fg: '#7A6A4A' },
    Verified: { bg: '#E9F1FB', fg: '#2F6FB3' },
    Scheduled: { bg: '#EFEBFB', fg: '#7A5CC0' },
    Weighed: { bg: '#EFEBFB', fg: '#7A5CC0' },
    'Quality Checked': { bg: '#FDF3DC', fg: '#B8862F' },
    Approved: { bg: '#E9F5EE', fg: '#3C8A5B' },
    Rejected: { bg: '#FBEFE3', fg: '#9E3B3B' },
    Invoiced: { bg: '#FDF3DC', fg: '#B8862F' },
    Paid: { bg: '#E9F5EE', fg: '#3C8A5B' },
    Open: { bg: '#FBEFE3', fg: '#9E3B3B' },
    Resolved: { bg: '#E9F5EE', fg: '#3C8A5B' },
    Active: { bg: '#E9F5EE', fg: '#3C8A5B' },
  };
  const c = map[status] || { bg: '#EEE', fg: '#555' };
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.fg }}
    >
      {status}
    </span>
  );
}

export function Card({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-black/[0.06] shadow-sm ${className}`}>{children}</div>
  );
}

export function StatCard({ label, value, sub, color }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-black/50">{label}</p>
      <p className="font-display text-3xl mt-1" style={{ color: color || 'var(--ink)' }}>{value}</p>
      {sub && <p className="text-xs text-black/40 mt-1">{sub}</p>}
    </Card>
  );
}

export function PageHeader({ eyebrow, title, sub }) {
  return (
    <div className="mb-6">
      {eyebrow && <p className="text-sm font-medium mb-1" style={{ color: 'var(--harvest)' }}>{eyebrow}</p>}
      <h1 className="font-display text-3xl" style={{ color: 'var(--forest-dark)' }}>{title}</h1>
      {sub && <p className="text-black/55 mt-1.5 max-w-xl">{sub}</p>}
    </div>
  );
}
