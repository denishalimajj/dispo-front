import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ContractFormModal from '../components/ContractFormModal';
import { listContracts, createContract, updateContract, deleteContract } from '../api/contracts';

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

const CONTRACT_STATUSES = [
  'Loaded',
  'Unl. & New Loading Point',
  'Unloading',
  'Problems',
  'Cross the Border',
  'Still no info',
  'Unloaded',
];

const EDITABLE_FIELDS = ['contractNr', 'clientName', 'carrierName', 'loadingDate', 'unloadingDate', 'status'];
const PAGE_SIZE = 15;

const inputClass = 'w-full min-w-0 px-2 py-1 text-sm border border-[var(--color-primary)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]';

/** Format API date (YYYY-MM-DD) for table display */
function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
}

/** Get YYYY-MM-DD for date inputs */
function toInputDate(iso) {
  if (!iso) return '';
  return String(iso).slice(0, 10);
}

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

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export default function Contracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContract, setEditingContract] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null); // null = all, or status string
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingCell, setEditingCell] = useState(null); // { rowId, field }
  const [savingCell, setSavingCell] = useState(false);
  const [page, setPage] = useState(1);

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await listContracts(statusFilter);
      setContracts(list);
      setPage(1);
    } catch (err) {
      setError(err.message || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingContract(null);
    fetchContracts();
  };

  const handleCreate = () => {
    setEditingContract(null);
    setModalOpen(true);
  };

  const handleEdit = (row) => {
    setEditingContract(row);
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    if (!window.confirm(`Delete contract "${row.contractNr}"?`)) return;
    try {
      await deleteContract(row.id);
      await fetchContracts();
    } catch (err) {
      setError(err.message || 'Failed to delete contract');
    }
  };

  const handleSubmitContract = async (form) => {
    if (editingContract) {
      await updateContract(editingContract.id, form);
    } else {
      await createContract(form);
    }
  };

  const handleCellDoubleClick = (rowId, field) => {
    if (!EDITABLE_FIELDS.includes(field)) return;
    setEditingCell({ rowId, field });
  };

  const handleInlineSave = async (row, field, value) => {
    if (!editingCell || editingCell.rowId !== row.id || editingCell.field !== field) return;
    const trimmed = typeof value === 'string' ? value.trim() : value;
    const current = row[field];
    if (trimmed === current || (field.startsWith('loading') || field.startsWith('unloading') ? trimmed === (current?.slice?.(0, 10) ?? current) : false)) {
      setEditingCell(null);
      return;
    }
    setSavingCell(true);
    setEditingCell(null);
    try {
      const form = {
        contractNr: row.contractNr,
        clientName: row.clientName,
        carrierName: row.carrierName,
        loadingDate: row.loadingDate?.slice?.(0, 10) ?? row.loadingDate,
        unloadingDate: row.unloadingDate?.slice?.(0, 10) ?? row.unloadingDate,
        status: row.status,
      };
      form[field] = trimmed;
      const updated = await updateContract(row.id, form);
      setContracts((prev) => prev.map((c) => (c.id === row.id ? updated : c)));
    } catch (err) {
      setError(err.message || 'Update failed');
    } finally {
      setSavingCell(false);
    }
  };

  const handleInlineKeyDown = (e, row, field, value) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleInlineSave(row, field, value);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    const pageIds = paginated.map((c) => c.id);
    const allSelected = pageIds.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) pageIds.forEach((id) => next.delete(id));
      else pageIds.forEach((id) => next.add(id));
      return next;
    });
  };

  const totalPages = Math.max(1, Math.ceil(contracts.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = contracts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top card: Contracts title + action buttons */}
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <DocumentIcon />
            <span className="text-xl font-semibold">Contracts</span>
          </div>
          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-colors ${
                  statusFilter ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'border-[var(--color-primary)] bg-white text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                }`}
                aria-label="Filter by status"
                aria-expanded={filterOpen}
              >
                <FilterIcon />
              </button>
              {filterOpen && (
                <>
                  <div className="fixed inset-0 z-10" aria-hidden onClick={() => setFilterOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 z-20 py-1 min-w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg">
                    <button
                      type="button"
                      onClick={() => { setStatusFilter(null); setFilterOpen(false); }}
                      className={`w-full text-left px-3 py-2 text-sm ${statusFilter === null ? 'bg-gray-100 font-medium text-[var(--color-primary)]' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      All statuses
                    </button>
                    {CONTRACT_STATUSES.map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => { setStatusFilter(status); setFilterOpen(false); }}
                        className={`w-full text-left px-3 py-2 text-sm ${statusFilter === status ? 'bg-gray-100 font-medium text-[var(--color-primary)]' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <button type="button" onClick={handleCreate} className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Add contract">
              <PlusIcon />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Upload">
              <UploadDocIcon />
            </button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
        )}

        {/* Table card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto" style={{ minHeight: '200px' }}>
            {loading ? (
              <div className="py-12 text-center text-[var(--color-text-secondary)]">Loading contracts…</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-subtle)] border-b border-gray-200">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={paginated.length > 0 && paginated.every((c) => selectedIds.has(c.id))}
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-[var(--color-text-secondary)]">
                        No contracts yet. Click the + button to create one.
                      </td>
                    </tr>
                  ) : (
                    paginated.map((row) => (
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
                        <td
                          className="py-3 px-4 text-[var(--color-text-primary)] cursor-text"
                          onDoubleClick={() => handleCellDoubleClick(row.id, 'contractNr')}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'contractNr' ? (
                            <input
                              type="text"
                              className={inputClass}
                              defaultValue={row.contractNr}
                              autoFocus
                              onBlur={(e) => handleInlineSave(row, 'contractNr', e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, row, 'contractNr', e.target.value)}
                            />
                          ) : (
                            row.contractNr
                          )}
                        </td>
                        <td
                          className="py-3 px-4 text-[var(--color-text-primary)] cursor-text"
                          onDoubleClick={() => handleCellDoubleClick(row.id, 'clientName')}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'clientName' ? (
                            <input
                              type="text"
                              className={inputClass}
                              defaultValue={row.clientName}
                              autoFocus
                              onBlur={(e) => handleInlineSave(row, 'clientName', e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, row, 'clientName', e.target.value)}
                            />
                          ) : (
                            row.clientName
                          )}
                        </td>
                        <td
                          className="py-3 px-4 text-[var(--color-text-primary)] cursor-text"
                          onDoubleClick={() => handleCellDoubleClick(row.id, 'carrierName')}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'carrierName' ? (
                            <input
                              type="text"
                              className={inputClass}
                              defaultValue={row.carrierName}
                              autoFocus
                              onBlur={(e) => handleInlineSave(row, 'carrierName', e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, row, 'carrierName', e.target.value)}
                            />
                          ) : (
                            row.carrierName
                          )}
                        </td>
                        <td
                          className="py-3 px-4 text-[var(--color-text-secondary)] cursor-text"
                          onDoubleClick={() => handleCellDoubleClick(row.id, 'loadingDate')}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'loadingDate' ? (
                            <input
                              type="date"
                              className={inputClass}
                              defaultValue={toInputDate(row.loadingDate)}
                              autoFocus
                              onBlur={(e) => handleInlineSave(row, 'loadingDate', e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, row, 'loadingDate', e.target.value)}
                            />
                          ) : (
                            formatDate(row.loadingDate)
                          )}
                        </td>
                        <td
                          className="py-3 px-4 text-[var(--color-text-secondary)] cursor-text"
                          onDoubleClick={() => handleCellDoubleClick(row.id, 'unloadingDate')}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'unloadingDate' ? (
                            <input
                              type="date"
                              className={inputClass}
                              defaultValue={toInputDate(row.unloadingDate)}
                              autoFocus
                              onBlur={(e) => handleInlineSave(row, 'unloadingDate', e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, row, 'unloadingDate', e.target.value)}
                            />
                          ) : (
                            formatDate(row.unloadingDate)
                          )}
                        </td>
                        <td
                          className="py-3 px-4 cursor-text"
                          onDoubleClick={() => handleCellDoubleClick(row.id, 'status')}
                        >
                          {editingCell?.rowId === row.id && editingCell?.field === 'status' ? (
                            <select
                              className={inputClass}
                              defaultValue={row.status}
                              autoFocus
                              onBlur={(e) => handleInlineSave(row, 'status', e.target.value)}
                              onKeyDown={(e) => handleInlineKeyDown(e, row, 'status', e.target.value)}
                            >
                              {CONTRACT_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          ) : (
                            <span
                              className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                                STATUS_STYLES[row.status] || 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {row.status}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(row)}
                              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[var(--color-primary)] transition-colors"
                              aria-label="Edit contract"
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(row)}
                              className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                              aria-label="Delete contract"
                            >
                              <DeleteIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination footer */}
          {contracts.length > 0 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Showing{' '}
                <span className="font-medium text-[var(--color-text-primary)]">
                  {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, contracts.length)}
                </span>{' '}
                of{' '}
                <span className="font-medium text-[var(--color-text-primary)]">{contracts.length}</span>{' '}
                contracts
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ‹ Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce((acc, p, idx, arr) => {
                    if (idx > 0 && p - arr[idx - 1] > 1) acc.push('…');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === '…' ? (
                      <span key={`ellipsis-${idx}`} className="px-2 py-1.5 text-sm text-gray-400">…</span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPage(item)}
                        className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
                          item === safePage
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ContractFormModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        initialContract={editingContract}
        onSubmit={handleSubmitContract}
      />
    </DashboardLayout>
  );
}
