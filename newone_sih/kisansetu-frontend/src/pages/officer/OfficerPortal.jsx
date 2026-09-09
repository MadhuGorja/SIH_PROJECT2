import { useState } from 'react';
import { Inbox, ScaleIcon, Receipt, CheckCircle2 } from 'lucide-react';
import PortalShell from '../../components/PortalShell';
import { Card, PageHeader, StatusBadge } from '../../components/ui';
import { useStore } from '../../lib/store';

const tabs = [
  { key: 'pending', label: 'Pending Requests', icon: Inbox },
  { key: 'weighing', label: 'Weighing & Quality', icon: ScaleIcon },
  { key: 'invoice', label: 'Invoice & Payment', icon: Receipt },
];

function PendingTab() {
  const { state, dispatch } = useStore();
  const [dateFor, setDateFor] = useState({});
  const pending = state.requests.filter((r) => r.status === 'Submitted' || r.status === 'Verified');

  return (
    <>
      <PageHeader eyebrow="Procurement Officer" title="Pending requests" sub="Verify the farmer's details, then schedule a procurement slot." />
      <div className="space-y-3">
        {pending.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{r.id} · {r.farmerName}</p>
                <p className="text-sm text-black/45 mt-0.5">{r.crop} · {r.quantity} quintals · {r.village}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            <div className="flex items-center gap-2 mt-4">
              {r.status === 'Submitted' && (
                <button
                  onClick={() => dispatch({ type: 'VERIFY_REQUEST', id: r.id })}
                  className="text-sm px-3 py-1.5 rounded-lg border border-black/10 hover:bg-black/[0.03]"
                >
                  Verify farmer & crop details
                </button>
              )}
              {r.status === 'Verified' && (
                <>
                  <input
                    type="date"
                    className="text-sm border border-black/10 rounded-lg px-2 py-1.5"
                    value={dateFor[r.id] || ''}
                    onChange={(e) => setDateFor({ ...dateFor, [r.id]: e.target.value })}
                  />
                  <button
                    disabled={!dateFor[r.id]}
                    onClick={() => dispatch({ type: 'SCHEDULE_REQUEST', id: r.id, date: dateFor[r.id] })}
                    className="text-sm px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
                    style={{ background: 'var(--officer)' }}
                  >
                    Schedule procurement
                  </button>
                </>
              )}
            </div>
          </Card>
        ))}
        {pending.length === 0 && <p className="text-black/40 text-sm">No pending requests right now.</p>}
      </div>
    </>
  );
}

function WeighingTab() {
  const { state, dispatch } = useStore();
  const [weightFor, setWeightFor] = useState({});
  const scheduled = state.requests.filter((r) => r.status === 'Scheduled' || r.status === 'Weighed');

  return (
    <>
      <PageHeader eyebrow="Procurement Officer" title="Record arrival & weighing" sub="Digital scale reading is logged directly against the request." />
      <div className="space-y-3">
        {scheduled.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{r.id} · {r.farmerName}</p>
                <p className="text-sm text-black/45 mt-0.5">{r.crop} · Scheduled {r.scheduledDate}</p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.status === 'Scheduled' && (
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight (quintals)"
                  className="text-sm border border-black/10 rounded-lg px-2 py-1.5 w-40"
                  value={weightFor[r.id] || ''}
                  onChange={(e) => setWeightFor({ ...weightFor, [r.id]: e.target.value })}
                />
                <button
                  disabled={!weightFor[r.id]}
                  onClick={() => dispatch({ type: 'RECORD_WEIGHING', id: r.id, weight: Number(weightFor[r.id]) })}
                  className="text-sm px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
                  style={{ background: 'var(--officer)' }}
                >
                  Record weighing → sends to quality inspector
                </button>
              </div>
            )}
            {r.status === 'Weighed' && (
              <p className="text-sm text-black/45 mt-3">Weight recorded: {r.weight} q — waiting on quality inspector.</p>
            )}
          </Card>
        ))}
        {scheduled.length === 0 && <p className="text-black/40 text-sm">Nothing scheduled for weighing yet.</p>}
      </div>
    </>
  );
}

function InvoiceTab() {
  const { state, dispatch } = useStore();
  const [priceFor, setPriceFor] = useState({});
  const ready = state.requests.filter((r) => r.status === 'Approved' || r.status === 'Invoiced');

  return (
    <>
      <PageHeader eyebrow="Procurement Officer" title="Invoice & payment" sub="Only lots the quality inspector approved appear here." />
      <div className="space-y-3">
        {ready.map((r) => (
          <Card key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{r.id} · {r.farmerName}</p>
                <p className="text-sm text-black/45 mt-0.5">
                  {r.weight} q · Grade {r.grade} · Moisture {r.moisture}
                  {r.invoiceAmount ? ` · ₹${r.invoiceAmount.toLocaleString('en-IN')}` : ''}
                </p>
              </div>
              <StatusBadge status={r.status} />
            </div>
            {r.status === 'Approved' && (
              <div className="flex items-center gap-2 mt-4">
                <input
                  type="number"
                  placeholder="Price per quintal (₹)"
                  className="text-sm border border-black/10 rounded-lg px-2 py-1.5 w-44"
                  value={priceFor[r.id] || ''}
                  onChange={(e) => setPriceFor({ ...priceFor, [r.id]: e.target.value })}
                />
                <button
                  disabled={!priceFor[r.id]}
                  onClick={() => dispatch({ type: 'GENERATE_INVOICE', id: r.id, price: Number(priceFor[r.id]) })}
                  className="text-sm px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
                  style={{ background: 'var(--officer)' }}
                >
                  Generate invoice
                </button>
              </div>
            )}
            {r.status === 'Invoiced' && (
              <button
                onClick={() => dispatch({ type: 'CONFIRM_PAYMENT', id: r.id })}
                className="mt-4 flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg text-white"
                style={{ background: 'var(--admin)' }}
              >
                <CheckCircle2 size={15} /> Confirm payment & notify farmer
              </button>
            )}
          </Card>
        ))}
        {ready.length === 0 && <p className="text-black/40 text-sm">No approved lots waiting on invoicing.</p>}
      </div>
    </>
  );
}

export default function OfficerPortal() {
  const [tab, setTab] = useState('pending');
  return (
    <PortalShell roleName="Anita Sharma · Procurement Officer" roleColor="var(--officer)" roleBg="var(--officer-bg)" tabs={tabs} active={tab} onChange={setTab}>
      {tab === 'pending' && <PendingTab />}
      {tab === 'weighing' && <WeighingTab />}
      {tab === 'invoice' && <InvoiceTab />}
    </PortalShell>
  );
}
