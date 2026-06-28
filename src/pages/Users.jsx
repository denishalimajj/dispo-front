import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import EditUserModal from '../components/EditUserModal';
import { listUsers, createUser, updateUser, deleteUser } from '../api/users';

const PERMISSION_STYLES = {
  Admin: 'bg-purple-100 text-purple-800',
  Manager: 'bg-blue-100 text-blue-800',
  Dispatcher: 'bg-amber-100 text-amber-800',
  Viewer: 'bg-gray-100 text-gray-700',
};

const AVATAR_COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-teal-500', 'bg-amber-500'];

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return iso;
  }
}

function getInitials(name) {
  return (name || '?').split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
}

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingUser, setEditingUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const list = await listUsers();
      setUsers(list);
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(users.map((u) => u.id)));
  };

  const handleEdit = (user) => { setEditingUser(user); setModalOpen(true); };
  const handleAdd = () => { setEditingUser(null); setModalOpen(true); };
  const handleModalClose = () => { setModalOpen(false); setEditingUser(null); fetchUsers(); };

  const handleDelete = async (user) => {
    if (!window.confirm(`Delete user "${user.fullName}"?`)) return;
    try {
      await deleteUser(user.id);
      await fetchUsers();
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleSubmit = async (form) => {
    if (editingUser) {
      await updateUser(editingUser.id, form);
    } else {
      await createUser(form);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2 text-[var(--color-primary)]">
            <UsersIcon />
            <span className="text-xl font-semibold">Users</span>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="w-10 h-10 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            aria-label="Add user"
          >
            <PlusIcon />
          </button>
        </div>

        {error && <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-sm text-[var(--color-text-secondary)]">
              Manage your team members and their account permissions here.
            </p>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 text-center text-[var(--color-text-secondary)]">Loading users…</div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--color-bg-subtle)] border-b border-gray-200">
                    <th className="text-left py-3 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={users.length > 0 && selectedIds.size === users.length}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                      />
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">User Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Access</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date Added</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Active</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[var(--color-text-secondary)]">
                        No users yet. Click + to add one.
                      </td>
                    </tr>
                  ) : (
                    users.map((user, idx) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(user.id)}
                            onChange={() => toggleSelect(user.id)}
                            className="rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 ${AVATAR_COLORS[idx % AVATAR_COLORS.length]}`}>
                              {getInitials(user.fullName)}
                            </div>
                            <div>
                              <p className="font-medium text-[var(--color-text-primary)]">{user.fullName}</p>
                              <p className="text-xs text-[var(--color-text-secondary)]">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${PERMISSION_STYLES[user.permissions] || 'bg-gray-100 text-gray-700'}`}>
                            {user.permissions || 'Viewer'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-[var(--color-text-secondary)]">{formatDate(user.dateAdded)}</td>
                        <td className="py-3 px-4 text-[var(--color-text-secondary)]">{formatDate(user.lastActive)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleEdit(user)}
                              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[var(--color-primary)] transition-colors"
                              aria-label="Edit user"
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              className="p-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                              aria-label="Delete user"
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
        </div>
      </div>

      <EditUserModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        user={editingUser}
        onSubmit={handleSubmit}
      />
    </DashboardLayout>
  );
}
