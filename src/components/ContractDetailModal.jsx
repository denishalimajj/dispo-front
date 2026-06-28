import React from 'react';

const STATUS_STYLES = {
  Loaded: 'bg-blue-100 text-blue-800',
  'Unl. & New Loading Point': 'bg-red-100 text-red-800',
  Unloading: 'bg-green-100 text-green-800',
  'Load/Unload': 'bg-amber-100 text-amber-800',
  Problems: 'bg-red-100 text-red-800',
  'Cross the Border': 'bg-teal-100 text-teal-800',
  'Still no info': 'bg-purple-100 text-purple-800',
  Unloaded: 'bg-emerald-100 text-emerald-800',
};

function formatDate(iso) {
  if (!iso) return '—';
  try {
    const [y, m, d] = String(iso).slice(0, 10).split('-');
    return `${d}/${m}/${y}`;
  } catch {
    return iso;
  }
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm text-[var(--color-text-primary)]">{value}</p>
    </div>
  );
}

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ContractDetailModal({ contract, onClose, onEdit }) {
  if (!contract) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-md mx-4 overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-wide font-medium mb-0.5">Contract</p>
            <h2 className="text-xl font-bold text-[var(--color-text-primary)]">{contract.contractNr}</h2>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[contract.status] || 'bg-gray-100 text-gray-700'}`}>
              {contract.status}
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5 max-h-[65vh] overflow-y-auto">
          {/* Parties */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client" value={contract.clientName} />
            <Field label="Carrier" value={contract.carrierName} />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Loading Date" value={formatDate(contract.loadingDate)} />
            <Field label="Unloading Date" value={formatDate(contract.unloadingDate)} />
          </div>

          {/* References */}
          {(contract.loadingReference || contract.unloadingReference) && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Loading Ref." value={contract.loadingReference} />
              <Field label="Unloading Ref." value={contract.unloadingReference} />
            </div>
          )}

          {/* Cargo */}
          {(contract.itemType || contract.quantity) && (
            <div className="grid grid-cols-2 gap-4">
              <Field label="Item Type" value={contract.itemType} />
              <Field
                label="Quantity"
                value={contract.quantity ? `${contract.quantity} ${contract.quantityUnit || ''}`.trim() : null}
              />
            </div>
          )}

          {/* Price */}
          {contract.price && (
            <Field label="Price" value={`€ ${Number(contract.price).toLocaleString('en-EU', { minimumFractionDigits: 2 })}`} />
          )}

          {/* Comment */}
          {contract.comment && (
            <div>
              <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-1">Comment</p>
              <p className="text-sm text-[var(--color-text-primary)] bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                {contract.comment}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {onEdit && (
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => { onEdit(contract); onClose(); }}
              className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Edit Contract
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
