// Main app with routing
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Problem from './pages/Problem';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import { useEffect } from 'react';
import { login as loadUser } from './redux/authSlice';  // Assume auto-login logic

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problem/:id" element={<Problem />} />
        <Route path="/profile" element={<Profile />} />
        {user?.role === 'admin' && <Route path="/admin" element={<AdminDashboard />} />}
      </Routes>
    </div>
  );
}

export default App;