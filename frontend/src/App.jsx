import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import { useAuth } from './context/AuthContext';
import { FileText } from 'lucide-react';

// Lazy Load Pages to reduce initial bundle size
const Login = lazy(() => import('./pages/Login'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Companies = lazy(() => import('./pages/Companies'));
const Team = lazy(() => import('./pages/Team'));
const Settings = lazy(() => import('./pages/Settings'));
const SalesDashboard = lazy(() => import('./pages/SalesDashboard'));
const MonthlyOverview = lazy(() => import('./pages/MonthlyOverview'));
const Clients = lazy(() => import('./pages/Clients'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const ProjectDashboard = lazy(() => import('./pages/ProjectDashboard'));
const SetupPassword = lazy(() => import('./pages/SetupPassword'));
const DocumentList = lazy(() => import('./pages/DocumentList'));
const InvoiceCreator = lazy(() => import('./pages/InvoiceCreator'));
const QuotationCreator = lazy(() => import('./pages/QuotationCreator'));
const ActivityLog = lazy(() => import('./pages/ActivityLog'));

import { ProjectsPage, LeadsPage, BillingPage } from './pages/PlaceholderPages';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
        </div>
      }>
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/setup-password" element={<SetupPassword />} />
          
          {/* Default / Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                {user?.role === 'super-admin' ? (
                  <div className="p-8"><h1 className="text-2xl font-bold">Super Admin Panel (Company Management)</h1></div>
                ) : user?.role === 'admin' ? (
                  <AdminDashboard />
                ) : user?.role === 'sales-manager' ? (
                  <SalesDashboard mode="dashboard" />
                ) : user?.role === 'project-manager' || user?.role === 'project-team' ? (
                  <ProjectDashboard />
                ) : user?.role === 'accounts-manager' || user?.role === 'accounts-team' ? (
                  <div className="min-h-[80vh] flex items-center justify-center">
                    <div className="text-center space-y-6 max-w-md animate-in fade-in zoom-in duration-700">
                      <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                         <FileText size={40} className="text-brand-primary" />
                      </div>
                      <div className="space-y-2">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Accounts Portal</h1>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed">
                          Your account is restricted to financial operations. Please use the sidebar to manage 
                          <span className="text-brand-primary font-bold"> Invoices</span> and 
                          <span className="text-brand-primary font-bold"> Quotations</span>.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <UserDashboard />
                )}
              </ProtectedRoute>
            } 
          />

          {/* Roles specific routes can be added here */}
          <Route 
            path="/team" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'sales-manager', 'sales-team', 'project-manager']}>
                <Team />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/companies" 
            element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <Companies />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/projects" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'project-manager', 'project-team']}>
                <ProjectsPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/leads" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'sales-manager', 'sales-team']}>
                <SalesDashboard mode="leads" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sales/month/:monthId" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'sales-manager', 'sales-team']}>
                <MonthlyOverview />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/clients" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'sales-manager', 'sales-team', 'project-manager']}>
                <Clients />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/invoices" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'accounts-manager', 'accounts-team']}>
                <DocumentList type="invoice" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoices/create" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'accounts-manager', 'accounts-team']}>
                <InvoiceCreator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/invoices/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'accounts-manager', 'accounts-team']}>
                <InvoiceCreator />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/quotations" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'accounts-manager', 'accounts-team']}>
                <DocumentList type="quotation" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/activity-logs" 
            element={
              <ProtectedRoute>
                <ActivityLog />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/quotations/create" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'accounts-manager', 'accounts-team']}>
                <QuotationCreator />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quotations/edit/:id" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'accounts-manager', 'accounts-team']}>
                <QuotationCreator />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/billing" 
            element={
              <ProtectedRoute allowedRoles={['super-admin', 'admin', 'project-manager']}>
                <BillingPage />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
