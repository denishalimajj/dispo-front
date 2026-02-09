import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import UploadContractModal from './UploadContractModal';

// Simple SVG icons for sidebar and header
const Icons = {
  truck: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
      <path d="M21.5 15.5C21.78 15.5 22 15.72 22 16V17C22 18.66 20.66 20 19 20C19 18.35 17.65 17 16 17C14.35 17 13 18.35 13 20H11C11 18.35 9.65 17 8 17C6.35 17 5 18.35 5 20C3.34 20 2 18.66 2 17V15C2 14.45 2.45 14 3 14H12.5C13.163 14 13.7989 13.7366 14.2678 13.2678C14.7366 12.7989 15 12.163 15 11.5V6C15 5.45 15.45 5 16 5H16.84C17.56 5 18.22 5.39 18.58 6.01L19.22 7.13C19.31 7.29 19.19 7.5 19 7.5C18.337 7.5 17.7011 7.76339 17.2322 8.23223C16.7634 8.70107 16.5 9.33696 16.5 10V13C16.5 13.663 16.7634 14.2989 17.2322 14.7678C17.7011 15.2366 18.337 15.5 19 15.5H21.5Z" fill="#485CFF"/>
      <path d="M8 22C8.53043 22 9.03914 21.7893 9.41421 21.4142C9.78929 21.0391 10 20.5304 10 20C10 19.4696 9.78929 18.9609 9.41421 18.5858C9.03914 18.2107 8.53043 18 8 18C7.46957 18 6.96086 18.2107 6.58579 18.5858C6.21071 18.9609 6 19.4696 6 20C6 20.5304 6.21071 21.0391 6.58579 21.4142C6.96086 21.7893 7.46957 22 8 22ZM16 22C16.5304 22 17.0391 21.7893 17.4142 21.4142C17.7893 21.0391 18 20.5304 18 20C18 19.4696 17.7893 18.9609 17.4142 18.5858C17.0391 18.2107 16.5304 18 16 18C15.4696 18 14.9609 18.2107 14.5858 18.5858C14.2107 18.9609 14 19.4696 14 20C14 20.5304 14.2107 21.0391 14.5858 21.4142C14.9609 21.7893 15.4696 22 16 22ZM22 12.53V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L21.74 11.54C21.91 11.84 22 12.18 22 12.53ZM13.08 2H5.69C4.83475 2.00024 4.00614 2.29756 3.34584 2.84112C2.68554 3.38468 2.23456 4.14073 2.07 4.98H6.44C6.82 4.98 7.12 5.29 7.12 5.67C7.12 6.05 6.82 6.35 6.44 6.35H2V7.73H4.6C4.98 7.73 5.29 8.04 5.29 8.42C5.29 8.8 4.98 9.1 4.6 9.1H2V10.48H2.77C3.15 10.48 3.46 10.79 3.46 11.17C3.46 11.55 3.15 11.85 2.77 11.85H2V12.08C2 12.63 2.45 13.08 3 13.08H12.15C13.17 13.08 14 12.25 14 11.23V2.92C14 2.41 13.59 2 13.08 2ZM2.07 4.98H0.94C0.56 4.98 0.25 5.29 0.25 5.67C0.25 6.05 0.56 6.35 0.94 6.35H2V5.69C2 5.45 2.03 5.21 2.07 4.98ZM1.85 7.73H0.94C0.56 7.73 0.25 8.04 0.25 8.42C0.25 8.8 0.56 9.1 0.94 9.1H2V7.73H1.85ZM1.85 10.48H0.94C0.56 10.48 0.25 10.79 0.25 11.17C0.25 11.55 0.56 11.85 0.94 11.85H2V10.48H1.85Z" fill="#485CFF"/>
    </svg>
  ),
  chart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  user: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  document: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  bell: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  gear: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  chevronLeft: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  help: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  chat: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  search: (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  calendar: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  upload: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
};

const mainNavItems = [
  { icon: Icons.chart, label: 'Dashboard', path: '/dashboard' },
  { icon: Icons.user, label: 'Users', path: '/dashboard' },
  { icon: Icons.document, label: 'Contracts', path: '/contracts' },
  { icon: Icons.bell, label: 'Notification', path: '/dashboard' },
];
const footerNavItems = [
  { icon: Icons.gear, label: 'Settings', path: '/dashboard' },
  { icon: Icons.chat, label: 'Help & Support', path: '/dashboard', badge: '24' },
];

export default function DashboardLayout({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const openUploadModal = () => setUploadModalOpen(true);
  const closeUploadModal = () => setUploadModalOpen(false);

  return (
    <div className="min-h-screen flex bg-[#f3f4f6]">
      {/* Left Sidebar - expand on hover */}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`bg-gray-100 border-r border-gray-200 flex flex-col py-4 transition-all duration-300 ease-in-out ${
          expanded ? 'w-56' : 'w-20'
        }`}
      >
        {/* Header: truck + brand + collapse chevron when expanded */}
        <div className={`flex items-center gap-2 mb-4 ${expanded ? 'px-4' : 'px-2 justify-center'}`}>
          <div className="flex-shrink-0">{Icons.truck}</div>
          {expanded && (
            <>
              <span className="flex-1 text-gray-800 font-semibold truncate">Dispo Dron</span>
              <span className="flex-shrink-0 text-gray-400" aria-hidden="true">{Icons.chevronLeft}</span>
            </>
          )}
        </div>

        {/* Search */}
        {expanded && (
          <div className="px-3 mb-4">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">{Icons.search}</span>
              <input
                type="search"
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        )}

        {/* Main navigation */}
        <nav className={`flex-1 space-y-1 ${expanded ? 'px-3' : 'px-2'}`}>
          {mainNavItems.map((item) => (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              className={({ isActive: active }) =>
                `w-full flex items-center gap-3 py-2.5 rounded-lg transition-colors ${
                  expanded ? 'px-3 justify-start' : 'px-0 justify-center'
                } ${active ? 'bg-[var(--color-primary)]/10' : 'hover:bg-[var(--color-primary)]/10'}`
              }
            >
              {({ isActive: active }) => (
                <>
                  <span className="flex-shrink-0 flex items-center justify-center text-[var(--color-primary)]">
                    {item.icon}
                  </span>
                  {expanded && (
                    <span className={`text-sm font-medium truncate ${active ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Settings & Help & Support */}
        <div className={`space-y-1 ${expanded ? 'px-3' : 'px-2'}`}>
          {footerNavItems.map((item) => (
            <NavLink
              key={item.path + item.label}
              to={item.path}
              className={({ isActive: active }) =>
                `w-full flex items-center gap-3 py-2.5 rounded-lg transition-colors ${
                  expanded ? 'px-3 justify-start' : 'px-0 justify-center'
                } ${active ? 'bg-[var(--color-primary)]/10' : 'hover:bg-[var(--color-primary)]/10'}`
              }
            >
              {({ isActive: active }) => (
                <>
                  <span className="flex-shrink-0 relative flex items-center justify-center text-[var(--color-primary)]">
                    {item.icon}
                    {item.badge && expanded && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center px-1">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {expanded && (
                    <span className={`text-sm font-medium truncate ${active ? 'text-[var(--color-primary)]' : 'text-gray-700'}`}>
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Footer: profile */}
        <div className={`mt-auto pt-4 border-t border-gray-200 ${expanded ? 'px-3' : 'px-2'}`}>
          <div className={`flex items-center gap-3 py-2 ${expanded ? 'px-3' : 'justify-center'}`}>
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
              JD
            </div>
            {expanded && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-800 font-medium truncate text-sm">John Doe</p>
                  <p className="text-gray-500 text-xs truncate">Admin</p>
                </div>
                <button
                  className="flex-shrink-0 p-1 rounded text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 transition-colors"
                  aria-label="Logout"
                >
                  {Icons.logout}
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 overflow-auto">
          {typeof children === 'function' ? children(openUploadModal) : children}
        </main>
      </div>

      <UploadContractModal
        isOpen={uploadModalOpen}
        onClose={closeUploadModal}
      />
    </div>
  );
}
