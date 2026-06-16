import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  User,
  Palette,
  Shield,
  ChevronRight,
  Sun,
  Moon,

  Bot,
  Lock,
  Save,
  Eye,
  EyeOff,
  Sparkles,
  Check,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { API_ROUTES } from '../../utils/constants';

/* ─── Sidebar navigation items ─────────────────────────────── */
const SECTIONS = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'preferences', label: 'Preferences', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
];

/* ─── Reusable field wrapper ────────────────────────────────── */
const SettingRow = ({ label, description, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-4 py-5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{description}</p>
      )}
    </div>
    <div className="sm:w-72 flex-shrink-0">{children}</div>
  </div>
);

/* ─── Section header ────────────────────────────────────────── */
const SectionHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
      <Icon className="w-5 h-5 text-brand-600 dark:text-brand-400" />
    </div>
    <div>
      <h2 className="text-base font-semibold text-slate-900 dark:text-white">{title}</h2>
      <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
    </div>
  </div>
);

/* ─── Styled input ──────────────────────────────────────────── */
const SettingInput = ({ disabled, ...props }) => (
  <input
    disabled={disabled}
    className={`
      w-full px-3 py-2 text-sm rounded-lg border outline-none transition-all duration-200
      bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200
      border-slate-200 dark:border-slate-700
      placeholder:text-slate-400 dark:placeholder:text-slate-500
      focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 dark:focus:border-brand-400
      disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50 dark:disabled:bg-slate-800/50
    `}
    {...props}
  />
);

/* ─── Toggle switch ─────────────────────────────────────────── */
const Toggle = ({ checked, onChange, id }) => (
  <button
    id={id}
    role="switch"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-brand-500/30
      ${checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
);

/* ─── Provider option card ──────────────────────────────────── */
const ProviderCard = ({ value, label, description, icon, selected, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200
      ${selected
        ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 dark:border-brand-400'
        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-900'
      }
    `}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className={`text-sm font-medium ${selected ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-200'}`}>
            {label}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
        </div>
      </div>
      {selected && (
        <div className="w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
          <Check className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  </button>
);

/* ═══════════════════════════════════════════════════════════ */
/*  SECTION: Profile                                          */
/* ═══════════════════════════════════════════════════════════ */
const ProfileSection = () => {
  const { user, updateProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, formState: { isDirty } } = useForm({
    defaultValues: {
      full_name: user?.full_name || '',
      bio: user?.bio || '',
    },
  });

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await updateProfile(data);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err?.response?.data?.detail || 'Failed to save profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SectionHeader icon={User} title="My Profile" subtitle="Manage your personal information" />

      {/* Avatar preview */}
      <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl mb-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-500/20 flex-shrink-0">
          {user?.initials}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{user?.display_name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">@{user?.username}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800/60">
        <SettingRow label="Full Name" description="Your display name across the app.">
          <SettingInput
            placeholder="Your full name"
            {...register('full_name')}
          />
        </SettingRow>

        <SettingRow label="Username" description="Your unique @handle. Cannot be changed.">
          <SettingInput value={user?.username || ''} disabled readOnly />
        </SettingRow>

        <SettingRow label="Email" description="Used to sign in. Cannot be changed here.">
          <SettingInput value={user?.email || ''} disabled readOnly />
        </SettingRow>

        <SettingRow label="Bio" description="A short introduction about yourself.">
          <textarea
            rows={3}
            placeholder="Tell us a little about yourself…"
            className="
              w-full px-3 py-2 text-sm rounded-lg border outline-none resize-none transition-all duration-200
              bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200
              border-slate-200 dark:border-slate-700
              placeholder:text-slate-400 dark:placeholder:text-slate-500
              focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500
            "
            {...register('bio')}
          />
        </SettingRow>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-brand-500/20"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isSaving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  SECTION: Preferences                                      */
/* ═══════════════════════════════════════════════════════════ */
const AI_PROVIDERS = [
  {
    value: 'groq',
    label: 'Groq (Llama)',
    description: 'Fast & free · Recommended',
    icon: '⚡',
  },
  {
    value: 'gemini',
    label: 'Google Gemini',
    description: 'Powerful · Requires Gemini API key',
    icon: '✨',
  },
  {
    value: 'openai',
    label: 'OpenAI GPT',
    description: 'Premium · Requires OpenAI API key',
    icon: '🤖',
  },
];

const PreferencesSection = () => {
  const { user, updateProfile } = useAuth();
  const isDark = document.documentElement.classList.contains('dark');
  const [darkMode, setDarkMode] = useState(isDark);
  const [provider, setProvider] = useState(user?.ai_provider_preference || 'groq');
  const [isSaving, setIsSaving] = useState(false);
  const hasChanges =
    darkMode !== isDark || provider !== (user?.ai_provider_preference || 'groq');

  const handleThemeToggle = (value) => {
    setDarkMode(value);
    if (value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        theme: darkMode ? 'dark' : 'light',
        ai_provider_preference: provider,
      });
      toast.success('Preferences saved!');
    } catch (err) {
      toast.error('Failed to save preferences.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader icon={Palette} title="Preferences" subtitle="Customize your workspace experience" />

      <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800/60">
        {/* Appearance */}
        <SettingRow
          label="Appearance"
          description="Switch between light and dark mode."
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleThemeToggle(false)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${!darkMode
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light
            </button>
            <button
              onClick={() => handleThemeToggle(true)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${darkMode
                  ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-400'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark
            </button>
          </div>
        </SettingRow>

        {/* AI Provider */}
        <SettingRow
          label="AI Provider"
          description="Choose which AI model powers your summaries, action items, and title suggestions."
        >
          <div className="space-y-2">
            {AI_PROVIDERS.map((p) => (
              <ProviderCard
                key={p.value}
                {...p}
                selected={provider === p.value}
                onClick={() => setProvider(p.value)}
              />
            ))}
          </div>
        </SettingRow>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-brand-500/20"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {isSaving ? 'Saving…' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  SECTION: Security                                         */
/* ═══════════════════════════════════════════════════════════ */
const SecuritySection = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const newPwd = watch('new_password');

  const onSubmit = async (data) => {
    setIsSaving(true);
    try {
      await api.post(API_ROUTES.AUTH.CHANGE_PASSWORD, {
        current_password: data.current_password,
        new_password: data.new_password,
        new_password_confirm: data.new_password_confirm,
      });
      toast.success('Password changed successfully!');
      reset();
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        'Failed to change password.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const PwdField = ({ label, name, show, setShow, rules, placeholder }) => (
    <SettingRow label={label}>
      <div className="relative">
        <SettingInput
          type={show ? 'text' : 'password'}
          placeholder={placeholder}
          {...register(name, rules)}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        {errors[name] && (
          <p className="mt-1 text-xs text-red-500">{errors[name].message}</p>
        )}
      </div>
    </SettingRow>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SectionHeader icon={Shield} title="Security" subtitle="Keep your account safe" />

      {/* Password strength hint */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl mb-6">
        <Lock className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
          Use a strong password with at least 8 characters, including letters and numbers.
        </p>
      </div>

      <div className="space-y-0 divide-y divide-slate-100 dark:divide-slate-800/60">
        <PwdField
          label="Current Password"
          name="current_password"
          show={showCurrent}
          setShow={setShowCurrent}
          placeholder="Enter your current password"
          rules={{ required: 'Current password is required.' }}
        />
        <PwdField
          label="New Password"
          name="new_password"
          show={showNew}
          setShow={setShowNew}
          placeholder="At least 8 characters"
          rules={{
            required: 'New password is required.',
            minLength: { value: 8, message: 'Must be at least 8 characters.' },
          }}
        />
        <PwdField
          label="Confirm New Password"
          name="new_password_confirm"
          show={showConfirm}
          setShow={setShowConfirm}
          placeholder="Repeat new password"
          rules={{
            required: 'Please confirm your password.',
            validate: (v) => v === newPwd || 'Passwords do not match.',
          }}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={!isDirty || isSaving}
          className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 text-white text-sm font-medium rounded-lg hover:bg-brand-700 transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm shadow-brand-500/20"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Lock className="w-4 h-4" />
          )}
          {isSaving ? 'Updating…' : 'Update Password'}
        </button>
      </div>
    </form>
  );
};

/* ═══════════════════════════════════════════════════════════ */
/*  MAIN: SettingsPage                                        */
/* ═══════════════════════════════════════════════════════════ */
const SECTION_COMPONENTS = {
  profile: ProfileSection,
  preferences: PreferencesSection,
  security: SecuritySection,
};

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const ActiveComponent = SECTION_COMPONENTS[activeSection];

  return (
    <div className="min-h-full p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account, preferences, and security settings.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left Nav ── */}
        <nav
          className="lg:w-56 flex-shrink-0 flex lg:flex-col gap-1"
          aria-label="Settings navigation"
        >
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                id={`settings-nav-${section.id}`}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left
                  transition-all duration-150 w-full
                  ${isActive
                    ? 'bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 shadow-sm ring-1 ring-brand-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{section.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-60" />}
              </button>
            );
          })}
        </nav>

        {/* ── Content Panel ── */}
        <div className="flex-1 min-w-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
            >
              <ActiveComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
