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
  loadingReference: '',
  unloadingReference: '',
  quantity: '',
  quantityUnit: 'M',
  itemType: '',
  price: '',
  comment: '',
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
          loadingReference: initialContract.loadingReference ?? '',
          unloadingReference: initialContract.unloadingReference ?? '',
          quantity: initialContract.quantity ?? '',
          quantityUnit: initialContract.quantityUnit ?? 'M',
          itemType: initialContract.itemType ?? '',
          price: initialContract.price ?? '',
          comment: initialContract.comment ?? '',
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
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: '90vh' }}
      >
        {/* Fixed header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
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

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable fields */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
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
            {isEdit && form.contractNr && (
              <div>
                <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Contract Nr.</label>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-[var(--color-border)] rounded-[var(--radius-md)]">
                  <span className="text-sm font-semibold text-[var(--color-primary)]">{form.contractNr}</span>
                  <span className="text-xs text-[var(--color-text-secondary)]">(auto-assigned)</span>
                </div>
              </div>
            )}
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

            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Loading Reference</label>
              <input
                type="text"
                value={form.loadingReference}
                onChange={(e) => handleChange('loadingReference', e.target.value)}
                placeholder="Loading reference"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Unloading Reference</label>
              <input
                type="text"
                value={form.unloadingReference}
                onChange={(e) => handleChange('unloadingReference', e.target.value)}
                placeholder="Unloading reference"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Quantity M / KG</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={form.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  placeholder="0"
                  min="0"
                  className={`${inputClass} flex-1`}
                />
                <select
                  value={form.quantityUnit}
                  onChange={(e) => handleChange('quantityUnit', e.target.value)}
                  className="px-3 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
                >
                  <option value="M">M</option>
                  <option value="KG">KG</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Item Type</label>
              <input
                type="text"
                value={form.itemType}
                onChange={(e) => handleChange('itemType', e.target.value)}
                placeholder="Item type"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Price</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Comment</label>
              <textarea
                value={form.comment}
                onChange={(e) => handleChange('comment', e.target.value)}
                placeholder="Write a comment..."
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Fixed footer with action buttons */}
          <div className="flex gap-3 px-6 py-4 border-t border-gray-200 flex-shrink-0">
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
