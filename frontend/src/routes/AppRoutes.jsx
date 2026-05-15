import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './RouteWrappers';
import AppLayout from '../layouts/AppLayout';
import ErrorBoundary from '../components/ErrorBoundary';
import { ROUTES } from '../utils/constants';

// Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import NotesList from '../pages/notes/NotesList';
import Dashboard from '../pages/dashboard/Dashboard';
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
        </Route>

        {/* Root Redirect */}
        <Route path="/" element={<Navigate to={ROUTES.APP.BASE} replace />} />

        {/* Protected App Routes */}
        <Route path={ROUTES.APP.BASE} element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="notes" element={<NotesList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<div className="p-6 text-slate-500 dark:text-slate-400">Settings (Phase 4)</div>} />
            {/* Default redirect to notes */}
            <Route index element={<Navigate to="notes" replace />} />
          </Route>
        </Route>

        {/* Public Share Route (Phase 4) */}
        <Route path={ROUTES.SHARED} element={<div className="p-6">Public Note View</div>} />

        {/* 404 Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default AppRoutes;
