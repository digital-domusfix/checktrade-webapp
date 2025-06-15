import { Routes, Route } from 'react-router-dom';
import CustomerDashboardLayout from './CustomerDashboardLayout';
import DashboardHome from './DashboardHome';
import AddContactPage from './AddContactPage';
import AddPropertyPage from './AddPropertyPage';
import EditContactPage from './EditContactPage';
import EditPropertyPage from './EditPropertyPage';
import JobDetailPage from './JobDetailPage';
import JobListPage from './JobListPage';
import PropertyDetailPage from './PropertyDetailPage';
import { PropertyListPage } from './PropertyListPage';
import ProfilePage from './pages/ProfilePage';

const CustomerDashboardRoutes = () => {
  return (
    <Routes>
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
    </Routes>
  );
};

export default CustomerDashboardRoutes;
