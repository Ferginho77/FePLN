import { Routes, Route, Navigate } from 'react-router-dom';

import TataLetak from './layouts/TataLetak';
import Dashboard from './pages/Dashboard';
import Proyek from './pages/Proyek';
import Anggaran from './pages/Anggaran';
import Perizinan from './pages/Perizinan';
import PTanah from './pages/PTanah';
import Row from './pages/Row';
import Sertifikasi from './pages/Sertifikasi';

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
        <Route path="perizinan" element={<Perizinan />} />
        <Route path="pengadaan" element={<PTanah />} />
        <Route path="row" element={<Row />} />
        <Route path="sertifikasi" element={<Sertifikasi />} />

      </Route>
    </Routes>
  );
}

export default App;
