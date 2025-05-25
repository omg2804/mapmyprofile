import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProfileProvider } from './contexts/ProfileContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import MapView from './pages/MapView';
import AdminDashboard from './pages/AdminDashboard';
import ToastContainer, { useToast } from './components/ToastContainer';

function App() {
  const { toasts, removeToast } = useToast();
  
  return (
    <ProfileProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/edit/:id" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer toasts={toasts} removeToast={removeToast} />
        </Layout>
      </Router>
    </ProfileProvider>
  );
}

export default App;