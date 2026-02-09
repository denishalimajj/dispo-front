import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';

const STATUS_STYLES = {
  Loaded: 'bg-blue-100 text-blue-800',
  'Unl. & New Loading Point': 'bg-red-100 text-red-800',
  Unloading: 'bg-green-100 text-green-800',
  'Load/Unload': 'bg-amber-100 text-amber-800',
  Problems: 'bg-red-100 text-red-800',
  'Cross the Border': 'bg-teal-100 text-teal-800',
  'Still no info': 'bg-purple-100 text-purple-800',
  Unloaded: 'bg-emerald-200 text-emerald-900',
};

const MOCK_CONTRACTS = [
  { id: 1, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Loaded' },
  { id: 2, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Unl. & New Loading Point' },
  { id: 3, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Unloading' },
  { id: 4, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Load/Unload' },
  { id: 5, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Problems' },
  { id: 6, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Cross the Border' },
  { id: 7, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Still no info' },
  { id: 8, contractNr: '1234567890', clientName: 'Client Name', carrierName: 'Carrier Name', loadingDate: '01/03/2025', unloadingDate: '10/03/2025', status: 'Unloaded' },
];

const DocumentIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const BoxIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const BoxOpenIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const UploadDocIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const EllipsisIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
  </svg>
);

export default function Contracts() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedIds, setSelectedIds] = useState(new Set([1]));

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === MOCK_CONTRACTS.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(MOCK_CONTRACTS.map((c) => c.id)));
    }
  };

  const tabs = [
    { id: 'all', label: 'All Contracts', icon: DocumentIcon },
    { id: 'loaded', label: 'Loaded', icon: BoxIcon },
    { id: 'unloaded', label: 'Unloaded', icon: BoxOpenIcon },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top card: Contracts title + action buttons */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <DocumentIcon />
            <span className="text-xl font-semibold">Contracts</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-lg border border-[var(--color-primary)] bg-white text-[var(--color-primary)] flex items-center justify-center hover:bg-[var(--color-primary)]/5 transition-colors" aria-label="Filter">
              <FilterIcon />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Add contract">
              <PlusIcon />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Upload">
              <UploadDocIcon />
            </button>
          </div>
        </div>

        {/* Tabs + table card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs only */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1 px-6 pt-4 pb-3">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === id
                      ? 'bg-gray-100 text-[var(--color-text-primary)]'
                      : 'text-[var(--color-text-secondary)] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${activeTab === id ? 'text-gray-700' : 'text-gray-400'}`} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--color-bg-subtle)] border-b border-gray-200">
                  <th className="text-left py-3 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={selectedIds.size === MOCK_CONTRACTS.length}
                      onChange={toggleSelectAll}
                      className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                    />
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contract Nr.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Client Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Carrier Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Loading Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Unloading Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_CONTRACTS.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(row.id)}
                        onChange={() => toggleSelect(row.id)}
                        className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                    </td>
                    <td className="py-3 px-4 text-[var(--color-text-primary)]">{row.contractNr}</td>
                    <td className="py-3 px-4 text-[var(--color-text-primary)]">{row.clientName}</td>
                    <td className="py-3 px-4 text-[var(--color-text-primary)]">{row.carrierName}</td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">{row.loadingDate}</td>
                    <td className="py-3 px-4 text-[var(--color-text-secondary)]">{row.unloadingDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-1 rounded hover:bg-gray-200 text-gray-500 transition-colors" aria-label="Row actions">
                        <EllipsisIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
