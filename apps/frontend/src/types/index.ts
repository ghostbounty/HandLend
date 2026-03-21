export interface Disaster {
  id: number
  name: string
  country: string
  event_type: string
  severity: string
  status: string
  description: string
  created_at: string
}

export interface LogisticsCompany {
  id: number
  name: string
  verification_status: string
  capacity: string
  trust_score: number
  coverage: string
  response_time: string
  genlayer_summary: string
}

export interface CompanyDetail extends LogisticsCompany {
  assessment: {
    can_execute: string
    coverage_area: string
    resources: string
    risks: string
    limitations: string
    evidence: string
  }
}

export interface Mission {
  id: number
  disaster_id: number
  company_id: number
  status: string
}

export interface TimelineEvent {
  id: number
  mission_id: number
  actor_type: string
  event_type: string
  title: string
  description: string
  status: string
  happened_at: string
}

export interface DeliveryEvent {
  id: number
  lot_id: string
  qr_result: string
  sync_status: string
  client_event_id: string
}

export interface Operator {
  id: number
  company_id: number
  name: string
  email: string
  status: string
}

export interface OperationalPlan {
  id: number
  company_id: number
  disaster_id: number
  cargo_capacity: string
  estimated_time: string
  coverage: string
  infrastructure: string
  risks: string
  last_mile_strategy: string
  human_resources: string
  needs: string
  status: string
}

export interface DashboardData {
  total_funds: number
  total_deliveries: number
  pending_sync: number
  alerts: string[]
}

export interface Organization {
  id: number
  name: string
  legal_rep_name: string
  legal_rep_email: string
  doc_number: string
  status: string
}
