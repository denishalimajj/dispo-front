import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const BellIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
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
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  );
}

function Checkbox({ checked, onChange, label, description }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="mt-0.5 flex-shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
        />
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)] group-hover:text-[var(--color-primary)] transition-colors">{label}</p>
        {description && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-[var(--color-bg-subtle)]">
        <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[var(--color-text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

export default function Notifications() {
  const [settings, setSettings] = useState({
    directMessages: true,
    newsUpdates: false,
    feedbackNotifications: false,
    notificationChannels: true,
    moreActivity: true,
    integrationAlerts: false,
    emailChannel: true,
    smsChannel: false,
    mobileApp: true,
    desktopChannel: false,
  });

  const set = (key) => (value) => setSettings((prev) => ({ ...prev, [key]: value }));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <BellIcon />
            <span className="text-xl font-semibold">Notification</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            Get notification what's happening right now, you can turn off at any time.
          </p>
        </div>

        <Section title="Notification Channels">
          <ToggleRow
            label="Notification Channels"
            description="Choose preferred notification channels, including email, SMS, mobile app, or desktop notifications, to receive updates conveniently across different platforms."
            checked={settings.notificationChannels}
            onChange={set('notificationChannels')}
          />
          <div className="border-t border-gray-100 pt-4 grid grid-cols-2 gap-3">
            <Checkbox checked={settings.emailChannel} onChange={set('emailChannel')} label="Email" />
            <Checkbox checked={settings.smsChannel} onChange={set('smsChannel')} label="SMS" />
            <Checkbox checked={settings.mobileApp} onChange={set('mobileApp')} label="Mobile App" />
            <Checkbox checked={settings.desktopChannel} onChange={set('desktopChannel')} label="Desktop" />
          </div>
        </Section>

        <Section title="Notification Settings">
          <ToggleRow
            label="Direct Messages"
            description="Substance can send you email notification for any new direct messages."
            checked={settings.directMessages}
            onChange={set('directMessages')}
          />
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <Checkbox
              checked={settings.newsUpdates}
              onChange={set('newsUpdates')}
              label="News and Update Setting"
              description="The latest news about the latest news, leads, or significant changes in sales and marketing metrics."
            />
            <Checkbox
              checked={settings.feedbackNotifications}
              onChange={set('feedbackNotifications')}
              label="Feedback Notifications"
              description="Receive notifications for customer feedback, reviews, or surveys to promptly address customer concerns and maintain a positive brand reputation."
            />
          </div>
        </Section>

        <Section title="More Activity">
          <ToggleRow
            label="More Activity"
            description="Substance can send you email notification for any new direct messages."
            checked={settings.moreActivity}
            onChange={set('moreActivity')}
          />
          <div className="border-t border-gray-100 pt-4">
            <Checkbox
              checked={settings.integrationAlerts}
              onChange={set('integrationAlerts')}
              label="Integration Alerts"
              description="Configure integration alerts with other tools or platforms used by the team, such as CRM systems, marketing automation platforms, or analytics tools."
            />
          </div>
        </Section>

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
