const API_PREFIX = '/api';

export async function apiRequest(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = auth ? localStorage.getItem('cr_token') : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_PREFIX}${path}`, {
    method,
    headers,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

const titleCase = (value = '') => value.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
const statusLabel = (value = '') => value === 'IN_PROGRESS' ? 'In Progress' : titleCase(value.replaceAll('_', ' '));

export function mapComplaint(row, reporter = 'Community member') {
  const category = row.aiCategory || row.originalCategory || 'Other';
  return {
    id: row.publicId || row.id,
    isMine: Boolean(row.reportedByMe),
    title: row.title,
    description: row.description,
    category,
    originalCategory: row.originalCategory || category,
    location: row.address || 'Bengaluru',
    landmark: row.landmark || '',
    lat: row.latitude,
    lng: row.longitude,
    severity: titleCase(row.severity || 'MEDIUM'),
    urgency: row.urgencyScore ?? 50,
    department: row.department?.name || row.departmentName || 'Unassigned',
    status: statusLabel(row.status || 'REPORTED'),
    time: row.reportedAt ? new Date(row.reportedAt).toLocaleDateString() : 'Recently',
    reporter,
    endorsements: row._count?.endorsements ?? row.endorsements?.length ?? 0,
    image: row.images?.[0]?.url || null,
    timeline: (row.timeline || []).map((event) => typeof event === 'string' ? event : event.event),
    aiExplanation: row.aiExplanation || '',
    recommendedAction: row.recommendedAction || '',
  };
}

export const toApiStatus = (value) => value.toUpperCase().replaceAll(' ', '_');
