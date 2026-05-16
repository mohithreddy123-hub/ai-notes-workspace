import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BookText, 
  BarChart2, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { ROUTES } from '../utils/constants';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigation = [
    { name: 'Notes', href: ROUTES.APP.NOTES, icon: BookText },
    { name: 'Dashboard', href: ROUTES.APP.DASHBOARD, icon: BarChart2 },
    { name: 'Settings', href: ROUTES.APP.SETTINGS, icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-surface-light dark:bg-surface-dark flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out lg:static lg:translate-x-0
          flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        `}
        aria-label="Sidebar Navigation"
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center px-4 border-b border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 text-brand-600 dark:text-brand-400 min-w-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
              <BookText className="w-5 h-5 text-white" />
            </div>
            {!isSidebarCollapsed && (
              <span className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight truncate animate-fade-in">
                MindNotes
              </span>
            )}
          </div>
          
          <button 
            className="ml-auto hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            aria-label={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`} />
          </button>

          <button 
            className="ml-auto lg:hidden p-1.5 rounded-lg text-slate-400"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* New Note Button */}
        <div className="p-4 overflow-hidden">
          <Button 
            variant="primary" 
            className={`w-full justify-start ${isSidebarCollapsed ? 'px-0 justify-center' : ''}`}
            icon={Plus}
          >
            {!isSidebarCollapsed && <span className="animate-fade-in">New Note</span>}
          </Button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
                ${isActive 
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400 shadow-sm ring-1 ring-brand-500/10' 
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-300'
                }
                ${isSidebarCollapsed ? 'justify-center px-0' : ''}
              `}
              title={isSidebarCollapsed ? item.name : ''}
            >
              <item.icon className={`w-5 h-5 shrink-0 ${isSidebarCollapsed ? 'w-6 h-6' : ''}`} />
              {!isSidebarCollapsed && <span className="truncate animate-fade-in">{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer / Profile */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 shrink-0 bg-slate-50/50 dark:bg-slate-900/50 overflow-hidden">
          <div className={`flex items-center gap-3 mb-4 ${isSidebarCollapsed ? 'justify-center px-0' : 'px-2'}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-brand-500/20">
              {user?.initials}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0 animate-fade-in">
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {user?.display_name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={`w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ${isSidebarCollapsed ? 'justify-center px-0' : 'justify-start'}`}
            icon={LogOut}
          >
            {!isSidebarCollapsed && <span className="animate-fade-in">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 lg:hidden flex items-center justify-between px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0 z-30">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-display font-bold text-xl text-slate-900 dark:text-white tracking-tight">MindNotes</div>
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50/30 dark:bg-transparent">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

