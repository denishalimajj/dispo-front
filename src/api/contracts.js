import { getApiUrl, getToken } from './client';

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

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
    loadingReference: api.loading_reference ?? '',
    unloadingReference: api.unloading_reference ?? '',
    quantity: api.quantity ?? '',
    quantityUnit: api.quantity_unit ?? 'M',
    itemType: api.item_type ?? '',
    price: api.price ?? '',
    comment: api.comment ?? '',
  };
}

function toApiPayload(form) {
  return {
    client_name: form.clientName,
    carrier_name: form.carrierName,
    loading_date: form.loadingDate,
    unloading_date: form.unloadingDate,
    status: form.status,
    loading_reference: form.loadingReference || null,
    unloading_reference: form.unloadingReference || null,
    quantity: form.quantity || null,
    quantity_unit: form.quantityUnit || null,
    item_type: form.itemType || null,
    price: form.price || null,
    comment: form.comment || null,
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

export async function listContracts(status = null) {
  const base = getApiUrl();
  const url = status
    ? `${base}/contracts/?status=${encodeURIComponent(status)}`
    : `${base}/contracts/`;
  const res = await fetch(url, { headers: authHeaders() });
  const list = await handleResponse(res, 'Failed to load contracts');
  return list.map(toContract);
}

export async function getContract(id) {
  const res = await fetch(`${getApiUrl()}/contracts/${id}`, { headers: authHeaders() });
  return toContract(await handleResponse(res, 'Contract not found'));
}

export async function createContract(form) {
  const res = await fetch(`${getApiUrl()}/contracts/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(toApiPayload(form)),
  });
  return toContract(await handleResponse(res, 'Failed to create contract'));
}

export async function updateContract(id, form) {
  const res = await fetch(`${getApiUrl()}/contracts/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(toApiPayload(form)),
  });
  return toContract(await handleResponse(res, 'Failed to update contract'));
}

export async function deleteContract(id) {
  const res = await fetch(`${getApiUrl()}/contracts/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await handleResponse(res, 'Failed to delete contract');
}
