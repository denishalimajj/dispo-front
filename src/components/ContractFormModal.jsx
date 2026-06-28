import React, { useState, useEffect } from 'react';
import ErrorMessage from './ui/ErrorMessage';
import Button from './ui/Button';

const CONTRACT_STATUSES = [
  'Loaded',
  'Unl. & New Loading Point',
  'Unloading',
  'Problems',
  'Cross the Border',
  'Still no info',
  'Unloaded',
];

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

/** Format YYYY-MM-DD for display as DD/MM/YYYY or keep as-is for input[type=date] */
function toInputDate(iso) {
  if (!iso) return '';
  return iso.slice(0, 10);
}

const emptyForm = () => ({
  clientName: '',
  carrierName: '',
  contractNr: '',
  loadingDate: '',
  unloadingDate: '',
  status: 'Still no info',
});

export default function ContractFormModal({ isOpen, onClose, initialContract, onSubmit, loading: externalLoading }) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(initialContract?.id);
  const loadingState = externalLoading ?? loading;

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (initialContract) {
        setForm({
          clientName: initialContract.clientName ?? '',
          carrierName: initialContract.carrierName ?? '',
          contractNr: initialContract.contractNr ?? '',
          loadingDate: toInputDate(initialContract.loadingDate),
          unloadingDate: toInputDate(initialContract.unloadingDate),
          status: initialContract.status ?? 'Still no info',
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [isOpen, initialContract]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message || (isEdit ? 'Update failed' : 'Create failed'));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {isEdit ? 'Edit Contract' : 'Create Contract'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <ErrorMessage message={error} onDismiss={() => setError('')} />

          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Client Name</label>
            <input
              type="text"
              value={form.clientName}
              onChange={(e) => handleChange('clientName', e.target.value)}
              placeholder="Client Name"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Carrier Name</label>
            <input
              type="text"
              value={form.carrierName}
              onChange={(e) => handleChange('carrierName', e.target.value)}
              placeholder="Carrier Name"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Contract Nr.</label>
            <input
              type="text"
              value={form.contractNr}
              onChange={(e) => handleChange('contractNr', e.target.value)}
              placeholder="Contract Nr."
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Loading date</label>
            <div className="relative">
              <input
                type="date"
                value={form.loadingDate}
                onChange={(e) => handleChange('loadingDate', e.target.value)}
                required
                className={`${inputClass} pr-10`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <CalendarIcon />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Unloading date</label>
            <div className="relative">
              <input
                type="date"
                value={form.unloadingDate}
                onChange={(e) => handleChange('unloadingDate', e.target.value)}
                required
                className={`${inputClass} pr-10`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <CalendarIcon />
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`${inputClass} appearance-none bg-white`}
            >
              {CONTRACT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} className="flex-1" variant="secondary">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" loading={loadingState}>
              {isEdit ? 'Save' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
