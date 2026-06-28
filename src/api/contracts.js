import { getApiUrl, getToken } from './client';

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

/**
 * Normalize API contract (snake_case) to frontend shape (camelCase).
 */
function toContract(api) {
  if (!api) return null;
  return {
    id: api.id,
    contractNr: api.contract_number,
    clientName: api.client_name,
    carrierName: api.carrier_name,
    loadingDate: api.loading_date,
    unloadingDate: api.unloading_date,
    status: api.status,
  };
}

/**
 * Build request body for create/update from form (camelCase) to API (snake_case).
 * Dates must be YYYY-MM-DD.
 */
function toApiPayload(form) {
  const payload = {
    contract_number: form.contractNr,
    client_name: form.clientName,
    carrier_name: form.carrierName,
    loading_date: form.loadingDate,
    unloading_date: form.unloadingDate,
    status: form.status,
  };
  return payload;
}

/**
 * GET /contracts/ — list all, or filter by status.
 * @param {string} [status] - optional status filter
 * @returns {Promise<Array>} contracts (camelCase)
 */
export async function listContracts(status = null) {
  const base = getApiUrl();
  const url = status ? `${base}/contracts/?status=${encodeURIComponent(status)}` : `${base}/contracts/`;
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg || d).join(', ') : (data.detail || 'Failed to load contracts');
    throw new Error(detail);
  }
  const list = await res.json();
  return list.map(toContract);
}

/**
 * GET /contracts/{id}
 */
export async function getContract(id) {
  const base = getApiUrl();
  const res = await fetch(`${base}/contracts/${id}`, { headers: authHeaders() });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Contract not found');
  }
  return toContract(await res.json());
}

/**
 * POST /contracts/ — create. Payload: { contractNr, clientName, carrierName, loadingDate, unloadingDate, status }
 */
export async function createContract(form) {
  const base = getApiUrl();
  const res = await fetch(`${base}/contracts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(toApiPayload(form)),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    const detail = Array.isArray(data.detail) ? data.detail.map((d) => d.msg || d).join(', ') : (data.detail || 'Failed to create contract');
    throw new Error(detail);
  }
  return toContract(await res.json());
}

/**
 * PATCH /contracts/{id}
 */
export async function updateContract(id, form) {
  const base = getApiUrl();
  const res = await fetch(`${base}/contracts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(toApiPayload(form)),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to update contract');
  }
  return toContract(await res.json());
}

/**
 * DELETE /contracts/{id}
 */
export async function deleteContract(id) {
  const base = getApiUrl();
  const res = await fetch(`${base}/contracts/${id}`, { method: 'DELETE', headers: authHeaders() });
  if (!res.ok && res.status !== 204) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || 'Failed to delete contract');
  }
}
