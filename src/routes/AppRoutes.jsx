// src/routes/AppRoutes.jsx
// Central route configuration — all app routes defined here

import { Routes, Route, Navigate } from 'react-router-dom'

// Layouts
import AdminLayout from '../layouts/AdminLayout'
import ManagerLayout from '../layouts/ManagerLayout'
import StaffLayout from '../layouts/StaffLayout'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import ForgotPasswordPage from '../pages/auth/ForgotPassword'

// Admin Pages
import Dashboard from '../pages/admin/Dashboard'
import CreateBatch from '../pages/admin/CreateBatch'
import Allocation from '../pages/admin/Allocation'
import Reports from '../pages/admin/Reports'
import Branches from '../pages/admin/Branches'
import UsersPage from '../pages/admin/UsersPage'
import AllBatches from '../pages/admin/AllBatches'
import AllocationsList from '../pages/admin/AllocationsList'
import BranchDetails from '../pages/admin/BranchDetails'
import Slaughter from '../pages/admin/Slaughter'

// Manager Pages
import ManagerDashboard from '../pages/manager/ManagerDashboard'
import ReceiveLivestock from '../pages/manager/ReceiveLivestock'
import BranchInventory from '../pages/manager/BranchInventory'
import ManagerSlaughter from '../pages/manager/ManagerSlaughter';
import ManagerProcessingRecords from '../pages/manager/ManagerProcessingRecords';
import ManagerStaff from '../pages/manager/ManagerStaff'

// Staff Pages
import StaffDashboard from '../pages/staff/StaffDashboard'
import QuickEntry from '../pages/staff/QuickEntry'
import DailySummary from '../pages/staff/DailySummary'

const AppRoutes = () => {
    return (
        <Routes>
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Admin — protected layout */}
            <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="batches/create" element={<CreateBatch />} />
                <Route path="batches" element={<AllBatches />} />
                <Route path="allocation" element={<Allocation />} />
                <Route path="allocations-list" element={<AllocationsList />} />
                <Route path="slaughter" element={<Slaughter />} />
                <Route path="reports" element={<Reports />} />
                <Route path="branches" element={<Branches />} />
                <Route path="branches/:id" element={<BranchDetails />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Route>

            {/* Manager — protected layout */}
            <Route path="/manager" element={<ManagerLayout />}>
                <Route index element={<Navigate to="/manager/dashboard" replace />} />
                <Route path="dashboard" element={<ManagerDashboard />} />
                <Route path="receive-livestock" element={<ReceiveLivestock />} />
                <Route path="inventory" element={<BranchInventory />} />
                <Route path="slaughter" element={<ManagerSlaughter />} />
                <Route path="processing-records" element={<ManagerProcessingRecords />} />
                <Route path="staff" element={<ManagerStaff />} />
                <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
            </Route>

            {/* Staff Routes */}
            <Route path="/staff" element={<StaffLayout />}>
                <Route index element={<Navigate to="/staff/dashboard" replace />} />
                <Route path="dashboard" element={<StaffDashboard />} />
                <Route path="quick-entry" element={<QuickEntry />} />
                <Route path="daily-summary" element={<DailySummary />} />
                <Route path="*" element={<Navigate to="/staff/dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    )
}

export default AppRoutes
