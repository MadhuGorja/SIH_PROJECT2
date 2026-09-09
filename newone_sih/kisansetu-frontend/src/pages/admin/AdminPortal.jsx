import { useState } from 'react';
import { Users, BarChart3, MessageSquareWarning, UserPlus } from 'lucide-react';
import PortalShell from '../../components/PortalShell';
import { Card, PageHeader, StatCard, StatusBadge } from '../../components/ui';
import { useStore } from '../../lib/store';

const tabs = [
  { key: 'monitor', label: 'Monitor Procurement', icon: BarChart3 },
  { key: 'users', label: 'Manage Users', icon: Users },
  { key: 'complaints', label: 'Complaints', icon: MessageSquareWarning },
];

function MonitorTab() {
  const { state } = useStore();
  const total = state.requests.length;
  const paid = state.requests.filter((r) => r.status === 'Paid').length;
  const pending = state.requests.filter((r) => !['Paid', 'Rejected'].includes(r.status)).length;
  const totalValue = state.requests.reduce((sum, r) => sum + (r.invoiceAmount || 0), 0);

  return (
    <>
      <PageHeader eyebrow="Administrator" title="Monitor procurement" sub="Live view across all farmers, officers, and centres." />
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total requests" value={total} />
        <StatCard label="In progress" value={pending} color="var(--inspector)" />
        <StatCard label="Paid out" value={paid} color="var(--admin)" />
        <StatCard label="Value settled" value={`₹${totalValue.toLocaleString('en-IN')}`} color="var(--harvest)" />
      </div>
      <div className="space-y-2">
        {state.requests.map((r) => (
          <Card key={r.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{r.id} · {r.farmerName}</p>
              <p className="text-xs text-black/40 mt-0.5">{r.crop} · {r.quantity} q</p>
            </div>
            <StatusBadge status={r.status} />
          </Card>
        ))}
      </div>
    </>
  );
}

function UsersTab() {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({ name: '', role: 'Farmer', phone: '' });

  function submit(e) {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    dispatch({ type: 'ADD_USER', payload: form });
    setForm({ name: '', role: 'Farmer', phone: '' });
  }

  return (
    <>
      <PageHeader eyebrow="Administrator" title="Manage users" sub="Role-based access for farmers, officers, inspectors, and admins." />
      <Card className="p-5 mb-6 max-w-xl">
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-black/50">Name</label>
            <input
              className="mt-1 w-full border border-black/10 rounded-lg px-2 py-1.5 text-sm"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="min-w-[150px]">
            <label className="text-xs text-black/50">Role</label>
            <select
              className="mt-1 w-full border border-black/10 rounded-lg px-2 py-1.5 text-sm"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option>Farmer</option>
              <option>Procurement Officer</option>
              <option>Quality Inspector</option>
              <option>Administrator</option>
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-black/50">Phone</label>
            <input
              className="mt-1 w-full border border-black/10 rounded-lg px-2 py-1.5 text-sm"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <button type="submit" className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg text-white" style={{ background: 'var(--admin)' }}>
            <UserPlus size={14} /> Add user
          </button>
        </form>
      </Card>
      <div className="space-y-2">
        {state.users.map((u) => (
          <Card key={u.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{u.name}</p>
              <p className="text-xs text-black/40 mt-0.5">{u.role} · {u.phone}</p>
            </div>
            <StatusBadge status={u.status} />
          </Card>
        ))}
      </div>
    </>
  );
}

function ComplaintsTab() {
  const { state, dispatch } = useStore();
  return (
    <>
      <PageHeader eyebrow="Administrator" title="Complaints & grievances" sub="Raised by farmers or officers, resolved by admin." />
      <div className="space-y-2">
        {state.complaints.map((c) => (
          <Card key={c.id} className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{c.id} · {c.subject}</p>
              <p className="text-xs text-black/40 mt-0.5">From {c.from}</p>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={c.status} />
              {c.status === 'Open' && (
                <button
                  onClick={() => dispatch({ type: 'RESOLVE_COMPLAINT', id: c.id })}
                  className="text-xs px-2.5 py-1 rounded-lg border border-black/10 hover:bg-black/[0.03]"
                >
                  Mark resolved
                </button>
              )}
            </div>
          </Card>
        ))}
        {state.complaints.length === 0 && <p className="text-black/40 text-sm">No complaints on file.</p>}
      </div>
    </>
  );
}

export default function AdminPortal() {
  const [tab, setTab] = useState('monitor');
  return (
    <PortalShell roleName="Deepak Verma · Administrator" roleColor="var(--admin)" roleBg="var(--admin-bg)" tabs={tabs} active={tab} onChange={setTab}>
      {tab === 'monitor' && <MonitorTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'complaints' && <ComplaintsTab />}
    </PortalShell>
  );
}
