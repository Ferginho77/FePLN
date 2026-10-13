import { Routes, Route, Navigate } from 'react-router-dom';

import TataLetak from './layouts/TataLetak';
import Dashboard from './pages/Dashboard';
import Proyek from './pages/Proyek';
import Anggaran from './pages/Anggaran';

import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<TataLetak />}>
        <Route
          index
          element={<Navigate to="/dashboard" replace />}
        />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="proyek" element={<Proyek />} />
        <Route path="anggaran" element={<Anggaran />} />
      </Route>
    </Routes>
  );
}

export default App;
