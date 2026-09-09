import { HashRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './lib/store';
import Landing from './pages/Landing';
import FarmerPortal from './pages/farmer/FarmerPortal';
import OfficerPortal from './pages/officer/OfficerPortal';
import InspectorPortal from './pages/inspector/InspectorPortal';
import AdminPortal from './pages/admin/AdminPortal';

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/farmer" element={<FarmerPortal />} />
          <Route path="/officer" element={<OfficerPortal />} />
          <Route path="/inspector" element={<InspectorPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </HashRouter>
    </StoreProvider>
  );
}
