import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const GearIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${checked ? 'bg-[var(--color-primary)]' : 'bg-gray-200'}`}
    >
      <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <label className="text-sm font-medium text-[var(--color-text-primary)] w-1/2">{label}</label>
      <div className="relative w-1/2 max-w-xs">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none pl-3 pr-8 py-2 border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
        >
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <span className="absolute right-2 top-1/2 -translate-y-1/2">
          <ChevronDownIcon />
        </span>
      </div>
    </div>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">{label}</label>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Settings() {
  const [settings, setSettings] = useState({
    systemLanguage: 'English',
    userSignUp: true,
    dateTimeFormat: 'DD/MM/YYYY HH:mm',
    notifications: true,
    agentLanguage: 'English',
    updateFrequency: 'Weekly',
    logFormat: 'PDF',
  });

  const set = (key) => (value) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <GearIcon />
            <span className="text-xl font-semibold">Settings</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4">
          <h2 className="font-semibold text-[var(--color-text-primary)]">System Settings</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Setup and edit system settings and preferences.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-[var(--color-bg-subtle)]">
            <h3 className="font-semibold text-[var(--color-text-primary)]">General</h3>
          </div>
          <div className="px-6 py-2">
            <SelectField
              label="System Language"
              value={settings.systemLanguage}
              onChange={set('systemLanguage')}
              options={['English', 'German', 'Albanian', 'French', 'Italian', 'Spanish']}
            />
            <ToggleField
              label="User Sign up"
              checked={settings.userSignUp}
              onChange={set('userSignUp')}
            />
            <SelectField
              label="Date and Time Format"
              value={settings.dateTimeFormat}
              onChange={set('dateTimeFormat')}
              options={['DD/MM/YYYY HH:mm', 'MM/DD/YYYY HH:mm', 'YYYY-MM-DD HH:mm']}
            />
            <ToggleField
              label="Notifications"
              checked={settings.notifications}
              onChange={set('notifications')}
            />
            <SelectField
              label="Default Agent's Language"
              value={settings.agentLanguage}
              onChange={set('agentLanguage')}
              options={['English', 'German', 'Albanian', 'French', 'Italian', 'Spanish']}
            />
            <SelectField
              label="System Update Frequency"
              value={settings.updateFrequency}
              onChange={set('updateFrequency')}
              options={['Daily', 'Weekly', 'Monthly', 'Manual']}
            />
            <SelectField
              label="Logs/Reports File Format for Download"
              value={settings.logFormat}
              onChange={set('logFormat')}
              options={['PDF', 'Excel (XLSX)', 'CSV', 'JSON']}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
