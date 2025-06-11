import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import Dashboard from './features/dashboard/Dashboard';
import './index.css';
import HomePage from './pages/Home/HomePage';
import Layout from './pages/Layout/Layout';
import NewJobPage from './pages/Job/NewJobPage';
import { ModalProvider } from './components/ModalManager'; // ✅ ADD THIS

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider> 
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/job/new" element={<NewJobPage />} />
          </Route>
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
