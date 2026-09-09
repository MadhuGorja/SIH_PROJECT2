import { useState } from 'react';
import { UserCircle, Sprout, Send, ListChecks, Wallet, Bell } from 'lucide-react';
import PortalShell from '../../components/PortalShell';
import { Card, PageHeader, StatusBadge } from '../../components/ui';
import { useStore } from '../../lib/store';

const CURRENT_FARMER = 'Ramesh Kumar';

const tabs = [
  { key: 'profile', label: 'Profile & Land', icon: UserCircle },
  { key: 'request', label: 'Submit Request', icon: Send },
  { key: 'track', label: 'Track Status', icon: ListChecks },
  { key: 'payment', label: 'Payment', icon: Wallet },
  { key: 'notifications', label: 'Notifications', icon: Bell },
];

function ProfileTab() {
  return (
    <>
      <PageHeader eyebrow="Farmer" title="Profile & land details" sub="Kept on file so you don't re-enter it for every request." />
      <Card className="p-6 max-w-lg">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <Field label="Name" value="Ramesh Kumar" />
          <Field label="Phone" value="98765 00000" />
          <Field label="Village" value="Village X, Dist. Ratlam" />
          <Field label="Bank account" value="XXXX-XXXX-4821" />
          <Field label="Land holding" value="2.4 acres" />
          <Field label="Primary crop" value="Paddy" />
        </div>
      </Card>
    </>
  );
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-black/40 text-xs">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function RequestTab() {
  const { dispatch } = useStore();
  const [form, setForm] = useState({ crop: 'Paddy', quantity: '' });
  const [sent, setSent] = useState(false);

  function submit(e) {
    e.preventDefault();
    dispatch({
      type: 'SUBMIT_REQUEST',
      payload: {
        farmerName: CURRENT_FARMER,
        phone: '98765 00000',
        village: 'Village X, Dist. Ratlam',
        crop: form.crop,
        quantity: Number(form.quantity) || 0,
      },
    });
    setSent(true);
    setForm({ crop: 'Paddy', quantity: '' });
    setTimeout(() => setSent(false), 3500);
  }

  return (
    <>
      <PageHeader eyebrow="Farmer" title="Submit a procurement request" sub="This goes straight to the procurement officer's queue." />
      <Card className="p-6 max-w-md">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm text-black/50">Crop</label>
            <select
              className="mt-1 w-full border border-black/10 rounded-lg px-3 py-2 text-sm"
              value={form.crop}
              onChange={(e) => setForm({ ...form, crop: e.target.value })}
            >
              <option>Paddy</option>
              <option>Wheat</option>
              <option>Maize</option>
              <option>Soybean</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-black/50">Expected quantity (quintals)</label>
            <input
              required
              type="number"
              min="1"
              className="mt-1 w-full border border-black/10 rounded-lg px-3 py-2 text-sm"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g. 40"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg text-white text-sm font-medium"
            style={{ background: 'var(--farmer)' }}
          >
            Submit request
          </button>
          {sent && (
            <p className="text-sm text-center" style={{ color: 'var(--admin)' }}>
              Request submitted — the officer has been notified.
            </p>
          )}
        </form>
      </Card>
    </>
  );
}

function TrackTab() {
  const { state } = useStore();
  const mine = state.requests.filter((r) => r.farmerName === CURRENT_FARMER);
  return (
    <>
      <PageHeader eyebrow="Farmer" title="Track status" sub="Every stage of your request, from submission to payment." />
      <div className="space-y-3">
        {mine.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{r.id} · {r.crop} · {r.quantity} quintals</p>
                <p className="text-sm text-black/45 mt-0.5">
                  {r.scheduledDate ? `Scheduled ${r.scheduledDate}` : 'Awaiting scheduling'}
                  {r.weight ? ` · Weighed ${r.weight} q` : ''}
                  {r.grade ? ` · Grade ${r.grade}` : ''}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
          </Card>
        ))}
        {mine.length === 0 && <p className="text-black/40 text-sm">No requests yet — submit one to see it tracked here.</p>}
      </div>
    </>
  );
}

function PaymentTab() {
  const { state } = useStore();
  const mine = state.requests.filter((r) => r.farmerName === CURRENT_FARMER && r.invoiceAmount);
  return (
    <>
      <PageHeader eyebrow="Farmer" title="Payment status" sub="Visible the moment the officer confirms it — no need to ask." />
      <div className="space-y-3">
        {mine.map((r) => (
          <Card key={r.id} className="p-5 flex items-center justify-between">
            <div>
              <p className="font-medium">{r.id} · {r.crop}</p>
              <p className="text-sm text-black/45 mt-0.5">
                {r.weight} q × ₹{r.price}/q = ₹{r.invoiceAmount?.toLocaleString('en-IN')}
              </p>
            </div>
            <StatusBadge status={r.status} />
          </Card>
        ))}
        {mine.length === 0 && <p className="text-black/40 text-sm">No invoices yet.</p>}
      </div>
    </>
  );
}

function NotificationsTab() {
  const { state } = useStore();
  const mine = state.notifications.filter((n) => n.to === CURRENT_FARMER);
  return (
    <>
      <PageHeader eyebrow="Farmer" title="Notifications" sub="Sent by SMS and shown here in the app." />
      <div className="space-y-2">
        {mine.map((n) => (
          <Card key={n.id} className="p-4 flex items-start gap-3">
            <Bell size={16} className="mt-0.5 text-black/30" />
            <div>
              <p className="text-sm">{n.message}</p>
              <p className="text-xs text-black/35 mt-0.5">{n.time}</p>
            </div>
          </Card>
        ))}
        {mine.length === 0 && <p className="text-black/40 text-sm">No notifications yet.</p>}
      </div>
    </>
  );
}

export default function FarmerPortal() {
  const [tab, setTab] = useState('request');
  return (
    <PortalShell roleName="Ramesh Kumar · Farmer" roleColor="var(--farmer)" roleBg="var(--farmer-bg)" tabs={tabs} active={tab} onChange={setTab}>
      {tab === 'profile' && <ProfileTab />}
      {tab === 'request' && <RequestTab />}
      {tab === 'track' && <TrackTab />}
      {tab === 'payment' && <PaymentTab />}
      {tab === 'notifications' && <NotificationsTab />}
    </PortalShell>
  );
}
