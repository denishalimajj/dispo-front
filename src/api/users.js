import { getApiUrl, getToken } from './client';

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  'Content-Type': 'application/json',
});

function toUser(api) {
  if (!api) return null;
  return {
    id: api.id,
    fullName: api.name,
    email: api.email,
    mobilePhone: api.mobile_phone ?? '',
    dateOfBirth: api.date_of_birth ?? '',
    gender: api.gender ?? '',
    permissions: api.permissions ?? 'Viewer',
    entryDate: api.entry_date ?? '',
    expireDate: api.expire_date ?? '',
    dateAdded: api.date_added ?? '',
    lastActive: api.last_active ?? '',
  };
}

function toApiPayload(form) {
  return {
    name: form.fullName,
    email: form.email,
    mobile_phone: form.mobilePhone || null,
    date_of_birth: form.dateOfBirth || null,
    gender: form.gender || null,
    permissions: form.permissions || 'Viewer',
    entry_date: form.entryDate || null,
    expire_date: form.expireDate || null,
  };
}

async function handleResponse(res, fallback) {
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = Array.isArray(data.detail)
      ? data.detail.map((d) => d.msg || d).join(', ')
      : data.detail || fallback;
    throw new Error(detail);
  }
  return res.status === 204 ? null : res.json();
}

export async function listUsers() {
  const res = await fetch(`${getApiUrl()}/user/`, {
    headers: authHeaders(),
  });
  const list = await handleResponse(res, 'Failed to load users');
  return list.map(toUser);
}

export async function createUser(form) {
  const res = await fetch(`${getApiUrl()}/user/`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ...toApiPayload(form), password: form.password || 'ChangeMe123!' }),
  });
  return toUser(await handleResponse(res, 'Failed to create user'));
}

export async function updateUser(id, form) {
  const payload = toApiPayload(form);
  delete payload.name; // send as name update
  const res = await fetch(`${getApiUrl()}/user/${id}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ name: form.fullName, ...payload }),
  });
  return toUser(await handleResponse(res, 'Failed to update user'));
}

export async function deleteUser(id) {
  const res = await fetch(`${getApiUrl()}/user/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  await handleResponse(res, 'Failed to delete user');
}
