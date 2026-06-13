import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, PublicRoute } from './RouteWrappers';
import { ROUTES } from '../utils/constants';
import { Loader2 } from 'lucide-react';

// Lazy-loaded pages for code splitting
const AppLayout = lazy(() => import('../layouts/AppLayout'));
const ErrorBoundary = lazy(() => import('../components/ErrorBoundary'));
const Login = lazy(() => import('../pages/auth/Login'));
const Signup = lazy(() => import('../pages/auth/Signup'));
const LandingPage = lazy(() => import('../pages/LandingPage'));
const NotesList = lazy(() => import('../pages/notes/NotesList'));
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard'));
const SharedNotePage = lazy(() => import('../pages/shared/SharedNotePage'));
const NotFound = lazy(() => import('../pages/NotFound'));
const SettingsPage = lazy(() => import('../pages/settings/SettingsPage'));

// Full-screen loading fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public Auth Routes */}
        <Route element={<PublicRoute />}>
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.SIGNUP} element={<Signup />} />
        </Route>

        {/* Root — Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected App Routes */}
        <Route path={ROUTES.APP.BASE} element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="notes" element={<NotesList />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<SettingsPage />} />
            {/* Default redirect to notes */}
            <Route index element={<Navigate to="notes" replace />} />
          </Route>
        </Route>

        {/* Public Shared Note Route — NO auth required */}
        <Route path="/shared/:shareId" element={<SharedNotePage />} />

        {/* 404 Fallback */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
