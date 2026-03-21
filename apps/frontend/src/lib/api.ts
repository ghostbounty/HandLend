// src/lib/api.ts
import * as mock from './mockData'

const API = 'http://localhost:8000/api'

async function tryFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(2000) })
    if (!res.ok) return fallback
    return res.json()
  } catch {
    return fallback
  }
}

async function tryPost<T>(url: string, body: unknown, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), signal: AbortSignal.timeout(2000)
    })
    if (!res.ok) return fallback
    return res.json()
  } catch {
    return fallback
  }
}

export const getDisasters = () => tryFetch(`${API}/disasters`, mock.DISASTERS)
export const getCompaniesByDisaster = (id: number) =>
  tryFetch(`${API}/disasters/${id}/companies`, mock.COMPANIES.filter(c => c.disaster_id === id))
export const getDisasterCompanies = (id: number) =>
  tryFetch(`${API}/disasters/${id}/companies`, mock.COMPANIES.filter(c => c.disaster_id === id))
export const getCompany = (id: number) =>
  tryFetch(`${API}/companies/${id}`, mock.COMPANIES.find(c => c.id === id) ?? mock.COMPANIES[0])
export const getMissionTimeline = (missionId: number) =>
  tryFetch(`${API}/missions/${missionId}/timeline`, mock.TIMELINE_EVENTS.filter(e => e.mission_id === missionId))
export const getSettlementState = (eventId: number | string) =>
  tryFetch(`${API}/deliveries/${eventId}/settlement-state`, mock.MOCK_SETTLEMENT)
export const getOrganization = () =>
  tryFetch(`${API}/coordinator/organization`, mock.MOCK_ORGANIZATION)
export const getCoordinatorOrganization = () =>
  tryFetch(`${API}/coordinator/organization`, mock.MOCK_ORGANIZATION)
export const getPlans = () =>
  tryFetch(`${API}/coordinator/plans`, mock.MOCK_PLANS)
export const getCoordinatorPlans = () =>
  tryFetch(`${API}/coordinator/plans`, mock.MOCK_PLANS)
export const getOperators = () =>
  tryFetch(`${API}/coordinator/operators`, mock.OPERATORS)
export const getCoordinatorOperators = () =>
  tryFetch(`${API}/coordinator/operators`, mock.OPERATORS)
export const getDashboard = () =>
  tryFetch(`${API}/coordinator/dashboard`, mock.MOCK_DASHBOARD)
export const getCoordinatorDashboard = () =>
  tryFetch(`${API}/coordinator/dashboard`, mock.MOCK_DASHBOARD)

export const postContributionIntent = (body: unknown) =>
  tryPost(`${API}/contributions/intent`, body, { id: 1, mission_id: 1, intent_id: 'mock-intent-1' })
export const postContributionConfirm = (body: unknown) =>
  tryPost(`${API}/contributions/confirm`, body, { id: 1, status: 'confirmed', mission_id: 1 })
export const postOrganization = (body: unknown) =>
  tryPost(`${API}/coordinator/organization`, body, { ...mock.MOCK_ORGANIZATION, ...body as object })
export const postCoordinatorOrganization = (body: unknown) =>
  tryPost(`${API}/coordinator/organization`, body, { ...mock.MOCK_ORGANIZATION, ...body as object })
export const postPlan = (body: unknown) =>
  tryPost(`${API}/coordinator/plans`, body, { id: Date.now(), ...body as object, status: 'draft' })
export const postCoordinatorPlan = (body: unknown) =>
  tryPost(`${API}/coordinator/plans`, body, { id: Date.now(), ...body as object, status: 'draft' })
export const postOperator = (body: unknown) =>
  tryPost(`${API}/coordinator/operators`, body, { id: Date.now(), company_id: 1, status: 'active', created_at: new Date().toISOString(), ...body as object })
export const postCoordinatorOperator = (body: unknown) =>
  tryPost(`${API}/coordinator/operators`, body, { id: Date.now(), company_id: 1, status: 'active', created_at: new Date().toISOString(), ...body as object })
export const putOperator = (id: number, body: unknown) =>
  tryPost(`${API}/coordinator/operators/${id}`, body, { id, ...body as object })
export const putCoordinatorOperator = (id: number, body: unknown) =>
  tryPost(`${API}/coordinator/operators/${id}`, body, { id, ...body as object })
export const syncDeliveries = (events: unknown[]) =>
  tryPost(`${API}/deliveries/sync-batch`, { events }, events.map(e => ({ ...(e as object), sync_status: 'synced' })))
export const syncDeliveryBatch = (events: unknown[]) =>
  tryPost(`${API}/deliveries/sync-batch`, { events }, { results: events.map((e: unknown) => ({ client_event_id: (e as { client_event_id?: string }).client_event_id, status: 'ok' })) })
