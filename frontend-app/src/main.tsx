import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // ✅ ADD THIS
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';
import EmailVerificationPage from './features/auth/EmailVerificationPage';
import ContractorDashboard from './features/dashboard/ContractorDashboard';
import ProfileSetupPage from './features/onboarding/ProfileSetupPage';
import BusinessTradePage from './features/onboarding/BusinessTradePage';
import LegalCredentialsPage from './features/onboarding/LegalCredentialsPage';
import WelcomePage from './features/onboarding/WelcomePage';
import OnboardingStatusPage from './features/onboarding/OnboardingStatusPage';
import HomePage from './pages/Home/HomePage';
import Layout from './pages/Layout/Layout';
import NewJobPage from './pages/Job/NewJobPage';
import JobSuccessPage from './pages/Job/JobSuccessPage';
import PostJobStep1 from './pages/PostJob/Step1';
import PostJobStep2 from './pages/PostJob/Step2';
import PostJobStep3 from './pages/PostJob/Step3';
import PostJobReview from './pages/PostJob/Review';
import { ModalProvider } from './components/ModalManager';
import ProtectedRoute from './pages/ProtectedRoute';
import './index.css';
import CompleteProfilePage from './pages/auth/components/CompleteProfilePage';
import JobSuccess from './features/leadgen/JobSuccess'
import CustomerDashboardRoutes from './features/dashboard/CustomerDashboardRoutes';
import CustomerDashboardLayout from './features/dashboard/CustomerDashboardLayout';
import AddContactPage from './features/dashboard/AddContactPage';
import AddPropertyPage from './features/dashboard/AddPropertyPage';
import DashboardHome from './features/dashboard/DashboardHome';
import EditContactPage from './features/dashboard/EditContactPage';
import EditPropertyPage from './features/dashboard/EditPropertyPage';
import JobDetailPage from './features/dashboard/JobDetailPage';
import JobListPage from './features/dashboard/JobListPage';
import ProfilePage from './features/dashboard/pages/ProfilePage';
import PropertyDetailPage from './features/dashboard/PropertyDetailPage';
import { PropertyListPage } from './features/dashboard/PropertyListPage';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="test">
      <BrowserRouter>
        <ModalProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
             <Route path="/dashboard" element={<ProtectedRoute />}>
                  <Route element={<CustomerDashboardLayout />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="jobs" element={<JobListPage />} />
                    <Route path="jobs/:jobId" element={<JobDetailPage />} />
                    <Route path="properties" element={<PropertyListPage />} />
                    <Route path="properties/add" element={<AddPropertyPage />} />
                    <Route path="properties/:propertyId" element={<PropertyDetailPage />} />
                    <Route path="properties/:propertyId/edit" element={<EditPropertyPage />} />
                    <Route path="properties/:propertyId/contacts/add" element={<AddContactPage />} />
                    <Route path="contacts/:contactId/edit" element={<EditContactPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                  </Route>
                </Route>

              <Route path="/verify-email" element={<EmailVerificationPage />} />
              <Route path="/profile-setup" element={<ProfileSetupPage />} />
              <Route path="/business-profile" element={<BusinessTradePage />} />
              <Route path="/legal-credentials" element={<LegalCredentialsPage />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/onboarding-status" element={<OnboardingStatusPage />} />
              <Route path="/job/new" element={<NewJobPage />} />
              <Route path="/post-job" element={<PostJobStep1 />} />
              <Route path="/post-job/details" element={<PostJobStep2 />} />
              <Route path="/post-job/schedule" element={<PostJobStep3 />} />
              <Route path="/post-job/review" element={<PostJobReview />} />
              <Route path="/complete-profile" element={<CompleteProfilePage />} />
              <Route path="/job/success" element={<JobSuccess />} />
            </Route>
          </Routes>
        </ModalProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
