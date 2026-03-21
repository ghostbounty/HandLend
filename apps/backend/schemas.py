from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from pydantic import BaseModel, ConfigDict


# ─── Disaster ──────────────────────────────────────────────────────────────


class DisasterOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    country: str
    event_type: str
    severity: str
    status: str
    description: Optional[str] = None
    created_at: datetime


# ─── Company Assessment ────────────────────────────────────────────────────


class CompanyAssessmentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    can_execute: Optional[str] = None
    coverage_area: Optional[str] = None
    resources: Optional[str] = None
    risks: Optional[str] = None
    limitations: Optional[str] = None
    evidence: Optional[str] = None


# ─── Logistics Company ─────────────────────────────────────────────────────


class LogisticsCompanyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    verification_status: str
    capacity: Optional[str] = None
    trust_score: Optional[float] = None
    coverage: Optional[str] = None
    response_time: Optional[str] = None
    genlayer_summary: Optional[str] = None
    created_at: datetime
    assessment: Optional[CompanyAssessmentOut] = None


class LogisticsCompanySummaryOut(BaseModel):
    """Lighter version used in list responses."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    verification_status: str
    capacity: Optional[str] = None
    trust_score: Optional[float] = None
    coverage: Optional[str] = None
    response_time: Optional[str] = None


# ─── Operational Plan ──────────────────────────────────────────────────────


class OperationalPlanIn(BaseModel):
    company_id: int
    disaster_id: int
    cargo_capacity: Optional[str] = None
    estimated_time: Optional[str] = None
    coverage: Optional[str] = None
    infrastructure: Optional[str] = None
    risks: Optional[str] = None
    last_mile_strategy: Optional[str] = None
    human_resources: Optional[str] = None
    needs: Optional[str] = None
    status: Optional[str] = "draft"


class OperationalPlanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    disaster_id: int
    cargo_capacity: Optional[str] = None
    estimated_time: Optional[str] = None
    coverage: Optional[str] = None
    infrastructure: Optional[str] = None
    risks: Optional[str] = None
    last_mile_strategy: Optional[str] = None
    human_resources: Optional[str] = None
    needs: Optional[str] = None
    status: str


# ─── Mission ───────────────────────────────────────────────────────────────


class MissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    disaster_id: int
    company_id: int
    status: str
    created_at: datetime


# ─── Funding Commitment ────────────────────────────────────────────────────


class ContributionIntentIn(BaseModel):
    mission_id: int
    donor_address: str
    amount_usdc: float


class ContributionIntentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mission_id: int
    donor_address: str
    amount_usdc: float
    status: str
    timeline_status: Optional[str] = None
    created_at: datetime


class ContributionConfirmIn(BaseModel):
    intent_id: int
    tx_hash: str


class ContributionConfirmOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mission_id: int
    donor_address: str
    amount_usdc: float
    tx_hash: Optional[str] = None
    status: str
    timeline_status: Optional[str] = None
    created_at: datetime


# ─── Timeline Event ────────────────────────────────────────────────────────


class TimelineEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mission_id: int
    actor_type: Optional[str] = None
    event_type: Optional[str] = None
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    happened_at: datetime
    metadata_json: Optional[str] = None


# ─── Delivery Event ────────────────────────────────────────────────────────


class DeliveryEventIn(BaseModel):
    mission_id: int
    operator_id: Optional[int] = None
    lot_id: Optional[str] = None
    qr_result: Optional[str] = None
    timestamp: Optional[datetime] = None
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    gps_status: Optional[str] = None
    note: Optional[str] = None
    sync_status: Optional[str] = "pending"
    client_event_id: Optional[str] = None


class DeliveryEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mission_id: int
    operator_id: Optional[int] = None
    lot_id: Optional[str] = None
    qr_result: Optional[str] = None
    timestamp: Optional[datetime] = None
    gps_lat: Optional[float] = None
    gps_lng: Optional[float] = None
    gps_status: Optional[str] = None
    note: Optional[str] = None
    sync_status: str
    client_event_id: Optional[str] = None
    created_at: datetime


class DeliveryBatchIn(BaseModel):
    events: list[DeliveryEventIn]


class DeliveryBatchOut(BaseModel):
    created: int
    skipped: int
    events: list[DeliveryEventOut]


# ─── Settlement State ──────────────────────────────────────────────────────


class ValidationDecisionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    delivery_event_id: int
    decision: str
    summary: Optional[str] = None
    created_at: datetime


class SettlementRecordOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    mission_id: int
    delivery_event_id: Optional[int] = None
    operational_advance: Optional[float] = None
    margin_transferred: Optional[float] = None
    status: str
    created_at: datetime


class SettlementStateOut(BaseModel):
    delivery_event: DeliveryEventOut
    validation: Optional[ValidationDecisionOut] = None
    settlement: Optional[SettlementRecordOut] = None


# ─── Operator ──────────────────────────────────────────────────────────────


class OperatorIn(BaseModel):
    company_id: int
    name: str
    email: str
    status: Optional[str] = "active"


class OperatorOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    company_id: int
    name: str
    email: str
    status: str
    created_at: datetime


class OperatorUpdateIn(BaseModel):
    status: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None


# ─── Organization ──────────────────────────────────────────────────────────


class OrganizationIn(BaseModel):
    name: str
    legal_rep_name: Optional[str] = None
    legal_rep_email: Optional[str] = None
    doc_number: Optional[str] = None
    status: Optional[str] = "pending"


class OrganizationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    legal_rep_name: Optional[str] = None
    legal_rep_email: Optional[str] = None
    doc_number: Optional[str] = None
    status: str
    created_at: datetime


# ─── Dashboard ─────────────────────────────────────────────────────────────


class DashboardOut(BaseModel):
    total_funds: float
    total_deliveries: int
    pending_sync: int
    alerts: list[str]
