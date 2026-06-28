import React, { useState, useEffect } from 'react';
import Button from './ui/Button';

const PERMISSIONS = ['Admin', 'Manager', 'Dispatcher', 'Viewer'];
const GENDERS = ['Male', 'Female', 'Other'];

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const inputClass = 'w-full px-4 py-2.5 border border-[var(--color-border)] rounded-[var(--radius-md)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white';

const emptyForm = () => ({
  fullName: '',
  email: '',
  mobilePhone: '',
  dateOfBirth: '',
  gender: 'Male',
  permissions: 'Viewer',
  entryDate: '',
  expireDate: '',
});

export default function EditUserModal({ isOpen, onClose, user, onSubmit }) {
  const [form, setForm] = useState(emptyForm());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (user) {
        setForm({
          fullName: user.fullName ?? '',
          email: user.email ?? '',
          mobilePhone: user.mobilePhone ?? '',
          dateOfBirth: user.dateOfBirth ?? '',
          gender: user.gender ?? 'Male',
          permissions: user.permissions ?? 'Viewer',
          entryDate: user.entryDate ?? '',
          expireDate: user.expireDate ?? '',
        });
      } else {
        setForm(emptyForm());
      }
    }
  }, [isOpen, user]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">Edit User</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" aria-label="Close">
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Full Name</label>
            <input type="text" value={form.fullName} onChange={(e) => handleChange('fullName', e.target.value)} placeholder="John Doe" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="johndoe@dispo.dron" required className={inputClass} />
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Mobile Phone</label>
            <input type="tel" value={form.mobilePhone} onChange={(e) => handleChange('mobilePhone', e.target.value)} placeholder="+49100200300" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Date of Birth</label>
              <input type="date" value={form.dateOfBirth} onChange={(e) => handleChange('dateOfBirth', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Gender</label>
              <select value={form.gender} onChange={(e) => handleChange('gender', e.target.value)} className={inputClass}>
                {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Permissions</label>
            <select value={form.permissions} onChange={(e) => handleChange('permissions', e.target.value)} className={inputClass}>
              {PERMISSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Entry Date</label>
              <input type="date" value={form.entryDate} onChange={(e) => handleChange('entryDate', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm text-[var(--color-text-secondary)] mb-1">Expire Date</label>
              <input type="date" value={form.expireDate} onChange={(e) => handleChange('expireDate', e.target.value)} className={inputClass} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" onClick={onClose} className="flex-1" variant="secondary">Cancel</Button>
            <Button type="submit" className="flex-1" loading={loading}>Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
