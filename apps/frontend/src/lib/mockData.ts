// src/lib/mockData.ts

export const DISASTERS = [
  {
    id: 1, name: 'Valparaíso Earthquake', country: 'Chile', event_type: 'Earthquake',
    severity: 'critical', status: 'active', created_at: '2026-03-15T08:00:00Z',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&q=80',
    raised: 78000, goal: 100000,
    description: 'Magnitude 7.2 earthquake affects the Valparaíso region. More than 40,000 people left homeless. Urgent assistance required for food, water, and temporary shelter.'
  },
  {
    id: 2, name: 'Piura Floods', country: 'Peru', event_type: 'Flood',
    severity: 'high', status: 'active', created_at: '2026-03-10T12:00:00Z',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80',
    raised: 27000, goal: 50000,
    description: 'Torrential rains cause the Piura river to overflow. 15,000 families evacuated. Access infrastructure damaged in multiple areas.'
  },
  {
    id: 3, name: 'Gran Chaco Drought', country: 'Paraguay', event_type: 'Drought',
    severity: 'medium', status: 'active', created_at: '2026-02-28T09:00:00Z',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80',
    raised: 9300, goal: 30000,
    description: 'Prolonged drought in the Chaco region impacts indigenous communities. Critical shortage of drinking water and loss of subsistence crops.'
  },
  {
    id: 4, name: 'Caribbean Coast Flooding', country: 'Colombia', event_type: 'Flood',
    severity: 'critical', status: 'active', created_at: '2026-03-18T07:30:00Z',
    image: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=600&q=80',
    raised: 15000, goal: 75000,
    description: 'Severe flooding on the Caribbean coast leaves over 60,000 people displaced. Roads, bridges, and health centers collapsed. Emergency food and clean water supplies are critically needed.'
  },
  {
    id: 5, name: 'Amazon Wildfire Emergency', country: 'Bolivia', event_type: 'Wildfire',
    severity: 'high', status: 'active', created_at: '2026-03-12T14:00:00Z',
    image: 'https://images.unsplash.com/photo-1562184647-3eba5b6ada6f?w=600&q=80',
    raised: 42000, goal: 80000,
    description: 'Out-of-control wildfires have consumed over 500,000 hectares in the Bolivian Amazon. Indigenous communities cut off from supply routes. Respiratory health emergency declared in three departments.'
  },
  {
    id: 6, name: 'Hurricane Marta', country: 'Honduras', event_type: 'Hurricane',
    severity: 'critical', status: 'active', created_at: '2026-03-20T03:00:00Z',
    image: 'https://images.unsplash.com/photo-1527482937786-6608f6e14c15?w=600&q=80',
    raised: 61000, goal: 120000,
    description: 'Category 4 hurricane makes landfall on the north coast of Honduras. Entire communities swept away by storm surges. Over 80,000 people evacuated, dozens missing. Power grid destroyed.'
  },
  {
    id: 7, name: 'Tungurahua Volcanic Activity', country: 'Ecuador', event_type: 'Volcanic',
    severity: 'medium', status: 'active', created_at: '2026-03-08T11:00:00Z',
    image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?w=600&q=80',
    raised: 8500, goal: 40000,
    description: 'Renewed eruptive activity at Tungurahua forces evacuation of 12,000 residents. Ashfall contaminates water sources and destroys crops across the surrounding provinces.'
  },
]

export const COMPANIES = [
  {
    id: 1, disaster_id: 1, name: 'LogiHumanitas', verification_status: 'active',
    capacity: 'high', trust_score: 92, coverage: 'Metropolitan Valparaíso',
    response_time: '48h', mission_id: 1,
    genlayer_summary: 'Company with 15 years of experience in humanitarian logistics. High operational capacity verified in previous earthquakes in Chile and Ecuador. Own fleet of 15 vehicles. Low risk. Recommended with confidence.',
    assessment: {
      can_execute: 'Distribution of food, drinking water, and emergency kits',
      coverage_area: 'Viña del Mar, Valparaíso, Quilpué, Villa Alemana',
      resources: '15 vehicles, 40 trained volunteers, 3 storage warehouses',
      risks: 'Access to steep terrain areas may be limited after the earthquake',
      limitations: 'No aerial operation capability (drones)',
      evidence: '8 previously documented operations, ISO 9001 humanitarian logistics'
    },
    operational_plan: {
      cargo_capacity: '5 tons/day',
      estimated_time: '72h for first delivery, full coverage in 7 days',
      coverage: 'Urban and peri-urban area of Valparaíso',
      infrastructure: '3 warehouses + 15 vehicles + satellite communications equipment',
      risks: 'Aftershocks, compromised road access',
      last_mile_strategy: 'Distribution via fixed points + mobile brigades for isolated areas',
      human_resources: '40 volunteers + 8 drivers + 2 area coordinators',
      needs: 'Fuel, bottled water, tents, blankets'
    }
  },
  {
    id: 2, disaster_id: 2, name: 'CargoSolidario', verification_status: 'active',
    capacity: 'medium', trust_score: 78, coverage: 'Norte Perú',
    response_time: '72h', mission_id: 2,
    genlayer_summary: 'Regional operator with a track record of 8 operations in earthquake-affected areas in northern Chile. Medium-high capacity. Active in the affected region. Positive evaluation with minor observations on response times.',
    assessment: {
      can_execute: 'Distribution of food and basic construction materials',
      coverage_area: 'Viña del Mar, Concón, Quintero',
      resources: '8 vehicles, 25 volunteers, 1 warehouse',
      risks: 'Logistics capacity strained during demand peaks',
      limitations: 'No cold-chain infrastructure for medications',
      evidence: '8 previous operations, agreement with the Municipality of Viña del Mar'
    },
    operational_plan: {
      cargo_capacity: '3 tons/day',
      estimated_time: '96h for first delivery',
      coverage: 'Northern coastal area of Valparaíso',
      infrastructure: '8 vehicles + 1 warehouse of 500m²',
      risks: 'Bottlenecks in the port area',
      last_mile_strategy: 'Centralized distribution from the main warehouse',
      human_resources: '25 volunteers + 5 drivers',
      needs: 'Fuel, food supplies, shelter materials'
    }
  },
  {
    id: 3, disaster_id: 2, name: 'TransAyuda Perú', verification_status: 'active',
    capacity: 'medium', trust_score: 71, coverage: 'Piura Region',
    response_time: '60h', mission_id: 3,
    genlayer_summary: 'Local company with a permanent presence in Piura. First operation on the HandLend platform. Complete documentation submitted. Preliminary favorable evaluation pending verifiable operational track record.',
    assessment: {
      can_execute: 'Distribution of drinking water and non-perishable food',
      coverage_area: 'City of Piura and surrounding districts',
      resources: '10 4x4 vehicles, 30 local operators',
      risks: 'Flooded roads, compromised bridges',
      limitations: 'No prior track record on HandLend',
      evidence: 'INDECI registration, agreement with Red Cross Peru'
    },
    operational_plan: {
      cargo_capacity: '4 tons/day',
      estimated_time: '60h for first delivery',
      coverage: 'Piura, Castilla, Catacaos',
      infrastructure: '10 4x4 vehicles adapted for flooded areas',
      risks: 'River access may be required in the most affected areas',
      last_mile_strategy: 'Pre-mapped alternative routes for areas without vehicle access',
      human_resources: '30 operators with INDECI training',
      needs: 'Inflatable boats, drinking water, emergency food supplies'
    }
  },
  {
    id: 4, disaster_id: 3, name: 'AyudaChaco', verification_status: 'active',
    capacity: 'medium', trust_score: 65, coverage: 'Gran Chaco',
    response_time: '96h', mission_id: 4,
    genlayer_summary: 'New company on HandLend. Complete documentation submitted. No prior track record on the platform. Preliminary positive evaluation pending verifiable operational history.',
    assessment: {
      can_execute: 'Transport of drinking water and non-perishable food',
      coverage_area: 'Central and Boreal Chaco',
      resources: '6 tanker trucks, 15 collaborators',
      risks: 'Long distances, limited road infrastructure',
      limitations: 'No experience with major emergencies',
      evidence: 'Sworn statement, tax records'
    },
    operational_plan: {
      cargo_capacity: '2 tons/day',
      estimated_time: '96h for first delivery',
      coverage: 'Central Chaco, Boreal Chaco',
      infrastructure: '6 tanker trucks + 1 logistics base',
      risks: 'Extreme heat, limited road access',
      last_mile_strategy: 'Mobile distribution points in indigenous communities',
      human_resources: '15 collaborators + 3 drivers',
      needs: 'Fuel, drinking water, non-perishable food'
    }
  },
]

export const TIMELINE_EVENTS = [
  { id: 1, mission_id: 1, actor_type: 'system', event_type: 'company_selected', title: 'Company selected', description: 'LogiHumanitas was selected to execute the mission in Valparaíso.', status: 'completed', happened_at: '2026-03-19T10:00:00Z' },
  { id: 2, mission_id: 1, actor_type: 'donor', event_type: 'funding_confirmed', title: 'Funds received', description: '500 USDC committed and locked in escrow. Hash: 0xabc...def', status: 'completed', happened_at: '2026-03-19T10:15:00Z' },
  { id: 3, mission_id: 1, actor_type: 'coordinator', event_type: 'plan_published', title: 'Operational plan published', description: 'LogiHumanitas published its distribution plan for the affected area.', status: 'completed', happened_at: '2026-03-19T14:00:00Z' },
  { id: 4, mission_id: 1, actor_type: 'coordinator', event_type: 'operator_assigned', title: 'Operator assigned', description: 'Carlos Mendez was assigned as field operator for this mission.', status: 'completed', happened_at: '2026-03-19T15:30:00Z' },
  { id: 5, mission_id: 1, actor_type: 'operator', event_type: 'delivery_recorded', title: 'Delivery recorded', description: 'Lot #LOT-001 registered with QR, GPS, and timestamp. 200 units distributed in the northern sector.', status: 'completed', happened_at: '2026-03-20T09:20:00Z' },
  { id: 6, mission_id: 1, actor_type: 'system', event_type: 'evidence_validated', title: 'Evidence validated by GenLayer', description: 'Evidence for lot LOT-001 was evaluated. Decision: Accepted. Semantic consistency confirmed.', status: 'completed', happened_at: '2026-03-20T11:00:00Z' },
  { id: 7, mission_id: 1, actor_type: 'system', event_type: 'settlement_processing', title: 'Settlement in progress', description: 'The Avalanche escrow is processing the conditional release of funds.', status: 'in_progress', happened_at: '2026-03-20T11:05:00Z' },
]

export const OPERATORS = [
  { id: 1, company_id: 1, name: 'Carlos Mendez', email: 'carlos@logihumanitas.cl', status: 'active', created_at: '2026-03-18T08:00:00Z' },
  { id: 2, company_id: 1, name: 'Ana Torres', email: 'ana@logihumanitas.cl', status: 'active', created_at: '2026-03-18T08:00:00Z' },
  { id: 3, company_id: 1, name: 'Pedro Soto', email: 'pedro@logihumanitas.cl', status: 'inactive', created_at: '2026-03-18T08:00:00Z' },
]

export const MOCK_SETTLEMENT = {
  delivery_id: 1,
  lot_id: 'LOT-001',
  validation_status: 'accepted',
  settlement_status: 'margin_transferred',
  operational_advance: 50,
  margin_transferred: 450,
  currency: 'USDC',
  steps_completed: ['delivery_recorded', 'evidence_validated', 'settlement_processing', 'advance_deducted', 'margin_transferred'],
  notes: 'Operation completed successfully. Funds transferred to the coordinator.'
}

export const MOCK_ORGANIZATION = {
  id: 1, name: 'LogiHumanitas SpA', legal_rep_name: 'Roberto Fernández',
  legal_rep_email: 'rfernandez@logihumanitas.cl', doc_number: '76.543.210-K',
  status: 'verified', created_at: '2026-03-17T09:00:00Z'
}

export const MOCK_DASHBOARD = {
  total_funds: 2350,
  total_deliveries: 14,
  pending_sync: 2,
  alerts: [
    '2 deliveries pending synchronization from operator Carlos Mendez',
    'Lot LOT-004 requires manual evidence review'
  ]
}

export const MOCK_PLANS = [
  {
    id: 1, company_id: 1, disaster_id: 1, status: 'published',
    cargo_capacity: '5 tons/day', estimated_time: '72h for first delivery',
    coverage: 'Metropolitan Valparaíso', infrastructure: '3 warehouses + 15 vehicles',
    risks: 'Aftershocks, compromised road access',
    last_mile_strategy: 'Distribution via fixed points + mobile brigades',
    human_resources: '40 volunteers + 8 drivers', needs: 'Fuel, water, tents'
  }
]

export const MOCK_QUEUE: DeliveryQueueItem[] = []

export interface DeliveryQueueItem {
  client_event_id: string
  operator_name: string
  lot_id: string
  qr_result: string
  gps_status: string
  note: string
  timestamp: string
  sync_status: 'pending' | 'sending' | 'synced' | 'error'
}

export const MOCK_COORDINATOR_USERS = [
  {
    id: 101,
    name: 'Roberto Fernández',
    email: 'rfernandez@logihumanitas.cl',
    password: 'coord2026',
    role: 'coordinator' as const,
    organization: 'LogiHumanitas SpA',
  },
  {
    id: 102,
    name: 'María López',
    email: 'mlopez@cargosolidario.cl',
    password: 'coord2026',
    role: 'coordinator' as const,
    organization: 'CargoSolidario',
  },
]

export const MOCK_DONOR_USERS = [
  {
    id: 201,
    name: 'Elena Vargas',
    email: 'elena@donor.com',
    password: 'donor2026',
    role: 'donor' as const,
    organization: '',
  },
  {
    id: 202,
    name: 'Marco Ruiz',
    email: 'marco@donor.com',
    password: 'donor2026',
    role: 'donor' as const,
    organization: '',
  },
]
