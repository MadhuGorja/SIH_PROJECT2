import { useState } from 'react';
import { FlaskConical, CheckCircle2, XCircle } from 'lucide-react';
import PortalShell from '../../components/PortalShell';
import { Card, PageHeader, StatusBadge } from '../../components/ui';
import { useStore } from '../../lib/store';

const tabs = [{ key: 'lots', label: 'Assigned Lots', icon: FlaskConical }];

function LotsTab() {
  const { state, dispatch } = useStore();
  const [form, setForm] = useState({});
  const lots = state.requests.filter((r) => r.status === 'Weighed' || r.status === 'Quality Checked');

  function setField(id, field, value) {
    setForm({ ...form, [id]: { ...form[id], [field]: value } });
  }

  return (
    <>
      <PageHeader eyebrow="Quality Inspector" title="Assigned lots" sub="Record grade and moisture, then approve or reject each lot." />
      <div className="space-y-3">
        {lots.map((r) => {
          const f = form[r.id] || {};
          return (
            <Card key={r.id} className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.lotId} · {r.id} · {r.farmerName}</p>
                  <p className="text-sm text-black/45 mt-0.5">{r.crop} · {r.weight} quintals</p>
                </div>
                <StatusBadge status={r.status} />
              </div>

              {r.status === 'Weighed' && (
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <select
                    className="text-sm border border-black/10 rounded-lg px-2 py-1.5"
                    value={f.grade || ''}
                    onChange={(e) => setField(r.id, 'grade', e.target.value)}
                  >
                    <option value="">Grade</option>
                    <option>A</option>
                    <option>B</option>
                    <option>C</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Moisture % e.g. 13%"
                    className="text-sm border border-black/10 rounded-lg px-2 py-1.5 w-36"
                    value={f.moisture || ''}
                    onChange={(e) => setField(r.id, 'moisture', e.target.value)}
                  />
                  <button
                    disabled={!f.grade || !f.moisture}
                    onClick={() => dispatch({ type: 'RECORD_QUALITY', id: r.id, grade: f.grade, moisture: f.moisture })}
                    className="text-sm px-3 py-1.5 rounded-lg text-white disabled:opacity-40"
                    style={{ background: 'var(--inspector)' }}
                  >
                    Save quality parameters
                  </button>
                </div>
              )}

              {r.status === 'Quality Checked' && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-black/50">Grade {r.grade} · Moisture {r.moisture}</span>
                  <button
                    onClick={() => dispatch({ type: 'APPROVE_LOT', id: r.id })}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-white"
                    style={{ background: 'var(--admin)' }}
                  >
                    <CheckCircle2 size={14} /> Approve lot
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'REJECT_LOT', id: r.id })}
                    className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg text-white"
                    style={{ background: '#9E3B3B' }}
                  >
                    <XCircle size={14} /> Reject lot
                  </button>
                </div>
              )}
            </Card>
          );
        })}
        {lots.length === 0 && <p className="text-black/40 text-sm">No lots waiting on quality assessment.</p>}
      </div>
    </>
  );
}

export default function InspectorPortal() {
  const [tab, setTab] = useState('lots');
  return (
    <PortalShell roleName="Vikram Singh · Quality Inspector" roleColor="var(--inspector)" roleBg="var(--inspector-bg)" tabs={tabs} active={tab} onChange={setTab}>
      {tab === 'lots' && <LotsTab />}
    </PortalShell>
  );
}
