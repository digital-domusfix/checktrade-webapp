import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import EmailVerificationPage from './features/auth/EmailVerificationPage';
import Dashboard from './features/dashboard/Dashboard';
import ProfileSetupPage from './features/onboarding/ProfileSetupPage';
import WelcomePage from './features/onboarding/WelcomePage';
import './index.css';
import HomePage from './pages/Home/HomePage';
import Layout from './pages/Layout/Layout';
import NewJobPage from './pages/Job/NewJobPage';
import PostJobStep1 from './pages/PostJob/Step1';
import PostJobStep2 from './pages/PostJob/Step2';
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
            <Route path="/verify-email" element={<EmailVerificationPage />} />
            <Route path="/profile-setup" element={<ProfileSetupPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/job/new" element={<NewJobPage />} />
            <Route path="/post-job" element={<PostJobStep1 />} />
            <Route path="/post-job/details" element={<PostJobStep2 />} />
          </Route>
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
