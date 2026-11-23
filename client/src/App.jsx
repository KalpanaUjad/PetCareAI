
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Pets from "./pages/Pets";
import Appointments from "./pages/Appointments";
import Prescriptions from "./pages/Prescription";
import MedicalHistory from "./pages/MedicalHistory";
import AIChat from "./pages/AIChat";
import Login from "./pages/Login";
import Register from "./pages/Register";

import "./App.css";

function ProtectedLayout() {
  const owner = localStorage.getItem("currentOwner");

  if (!owner) return <Navigate to="/login" replace />;

  return (
    <div className="app-layout">
      <Sidebar />

      <main className="main-content">
        <Navbar />

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/prescriptions" element={<Prescriptions />} />
            <Route path="/history" element={<MedicalHistory />} />
            <Route path="/ai" element={<AIChat />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
