import { createContext, useContext, useReducer } from 'react';

const StoreContext = createContext(null);

const initialRequests = [
  {
    id: 'REQ-1042',
    farmerName: 'Ramesh Kumar',
    phone: '98765 00000',
    village: 'Village X, Dist. Ratlam',
    crop: 'Paddy',
    quantity: 40,
    status: 'Submitted',
    scheduledDate: null,
    weight: null,
    grade: null,
    moisture: null,
    price: null,
    invoiceAmount: null,
    lotId: 'LOT-A1',
  },
  {
    id: 'REQ-1039',
    farmerName: 'Sunita Devi',
    phone: '98765 11111',
    village: 'Village Y, Dist. Ratlam',
    crop: 'Wheat',
    quantity: 65,
    status: 'Scheduled',
    scheduledDate: '2026-09-12',
    weight: null,
    grade: null,
    moisture: null,
    price: null,
    invoiceAmount: null,
    lotId: 'LOT-A2',
  },
  {
    id: 'REQ-1031',
    farmerName: 'Prakash Yadav',
    phone: '98765 22222',
    village: 'Village Z, Dist. Ratlam',
    crop: 'Paddy',
    quantity: 52,
    status: 'Paid',
    scheduledDate: '2026-09-05',
    weight: 51.6,
    grade: 'A',
    moisture: '13%',
    price: 2150,
    invoiceAmount: 110940,
    lotId: 'LOT-A0',
  },
];

const initialUsers = [
  { id: 'U-1', name: 'Ramesh Kumar', role: 'Farmer', phone: '98765 00000', status: 'Active' },
  { id: 'U-2', name: 'Anita Sharma', role: 'Procurement Officer', phone: '90000 00001', status: 'Active' },
  { id: 'U-3', name: 'Vikram Singh', role: 'Quality Inspector', phone: '90000 00002', status: 'Active' },
  { id: 'U-4', name: 'Deepak Verma', role: 'Administrator', phone: '90000 00003', status: 'Active' },
];

const initialState = {
  requests: initialRequests,
  users: initialUsers,
  notifications: [
    { id: 1, to: 'Prakash Yadav', message: 'Payment of ₹1,10,940 credited to your account.', time: '2 days ago' },
    { id: 2, to: 'Sunita Devi', message: 'Your procurement is scheduled for 12 Sept, 8–10 AM.', time: '1 day ago' },
  ],
  complaints: [
    { id: 'C-201', from: 'Sunita Devi', subject: 'Slot time changed without notice', status: 'Open' },
  ],
};

function pushNotification(state, to, message) {
  const note = { id: Date.now() + Math.random(), to, message, time: 'just now' };
  return [note, ...state.notifications];
}

function reducer(state, action) {
  switch (action.type) {
    case 'SUBMIT_REQUEST': {
      const req = {
        id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Submitted',
        scheduledDate: null,
        weight: null,
        grade: null,
        moisture: null,
        price: null,
        invoiceAmount: null,
        lotId: `LOT-${Math.floor(Math.random() * 999)}`,
        ...action.payload,
      };
      return {
        ...state,
        requests: [req, ...state.requests],
        notifications: pushNotification(state, req.farmerName, `Request ${req.id} submitted and awaiting verification.`),
      };
    }
    case 'VERIFY_REQUEST': {
      const requests = state.requests.map((r) => (r.id === action.id ? { ...r, status: 'Verified' } : r));
      return { ...state, requests };
    }
    case 'SCHEDULE_REQUEST': {
      const requests = state.requests.map((r) =>
        r.id === action.id ? { ...r, status: 'Scheduled', scheduledDate: action.date } : r
      );
      const req = state.requests.find((r) => r.id === action.id);
      return {
        ...state,
        requests,
        notifications: pushNotification(state, req.farmerName, `Procurement scheduled for ${action.date}.`),
      };
    }
    case 'RECORD_WEIGHING': {
      const requests = state.requests.map((r) =>
        r.id === action.id ? { ...r, status: 'Weighed', weight: action.weight } : r
      );
      return { ...state, requests };
    }
    case 'RECORD_QUALITY': {
      const requests = state.requests.map((r) =>
        r.id === action.id ? { ...r, status: 'Quality Checked', grade: action.grade, moisture: action.moisture } : r
      );
      return { ...state, requests };
    }
    case 'APPROVE_LOT': {
      const requests = state.requests.map((r) => (r.id === action.id ? { ...r, status: 'Approved' } : r));
      const req = state.requests.find((r) => r.id === action.id);
      return {
        ...state,
        requests,
        notifications: pushNotification(state, req.farmerName, `Your lot ${req.lotId} was approved by the quality inspector.`),
      };
    }
    case 'REJECT_LOT': {
      const requests = state.requests.map((r) => (r.id === action.id ? { ...r, status: 'Rejected' } : r));
      const req = state.requests.find((r) => r.id === action.id);
      return {
        ...state,
        requests,
        notifications: pushNotification(state, req.farmerName, `Your lot ${req.lotId} did not pass quality check.`),
      };
    }
    case 'GENERATE_INVOICE': {
      const requests = state.requests.map((r) =>
        r.id === action.id
          ? { ...r, status: 'Invoiced', price: action.price, invoiceAmount: Math.round(action.price * r.weight) }
          : r
      );
      return { ...state, requests };
    }
    case 'CONFIRM_PAYMENT': {
      const requests = state.requests.map((r) => (r.id === action.id ? { ...r, status: 'Paid' } : r));
      const req = state.requests.find((r) => r.id === action.id);
      return {
        ...state,
        requests,
        notifications: pushNotification(state, req.farmerName, `Payment of ₹${req.invoiceAmount?.toLocaleString('en-IN')} credited to your account.`),
      };
    }
    case 'ADD_USER': {
      const user = { id: `U-${Date.now()}`, status: 'Active', ...action.payload };
      return { ...state, users: [user, ...state.users] };
    }
    case 'RESOLVE_COMPLAINT': {
      const complaints = state.complaints.map((c) => (c.id === action.id ? { ...c, status: 'Resolved' } : c));
      return { ...state, complaints };
    }
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
