import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layouts';
import Dashboard from './components/Dashboard';
import Proyek from './components/Proyek';
import Anggaran from './components/Anggaran';
import './App.css'

function App() {
  return (
   <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="proyek" element={<Proyek />} />
        <Route path="anggaran" element={<Anggaran />} />
      </Route>
   </Routes>
  )
}

export default App
