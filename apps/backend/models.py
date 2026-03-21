from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Text, DateTime,
    ForeignKey, Boolean,
)
from sqlalchemy.orm import relationship
from database import Base


class Disaster(Base):
    __tablename__ = "disasters"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    country = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    severity = Column(String, nullable=False)   # critical / high / medium / low
    status = Column(String, nullable=False, default="active")  # active / closed
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    missions = relationship("Mission", back_populates="disaster")
    operational_plans = relationship("OperationalPlan", back_populates="disaster")


class LogisticsCompany(Base):
    __tablename__ = "logistics_companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    verification_status = Column(String, nullable=False, default="draft")
    # draft / under_review / active / disabled
    capacity = Column(String, nullable=True)   # high / medium / low
    trust_score = Column(Float, nullable=True)
    coverage = Column(String, nullable=True)
    response_time = Column(String, nullable=True)
    genlayer_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assessment = relationship("CompanyAssessment", back_populates="company", uselist=False)
    missions = relationship("Mission", back_populates="company")
    operators = relationship("Operator", back_populates="company")
    operational_plans = relationship("OperationalPlan", back_populates="company")


class CompanyAssessment(Base):
    __tablename__ = "company_assessments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("logistics_companies.id"), nullable=False)
    can_execute = Column(Text, nullable=True)
    coverage_area = Column(Text, nullable=True)
    resources = Column(Text, nullable=True)
    risks = Column(Text, nullable=True)
    limitations = Column(Text, nullable=True)
    evidence = Column(Text, nullable=True)

    company = relationship("LogisticsCompany", back_populates="assessment")


class OperationalPlan(Base):
    __tablename__ = "operational_plans"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("logistics_companies.id"), nullable=False)
    disaster_id = Column(Integer, ForeignKey("disasters.id"), nullable=False)
    cargo_capacity = Column(String, nullable=True)
    estimated_time = Column(String, nullable=True)
    coverage = Column(String, nullable=True)
    infrastructure = Column(String, nullable=True)
    risks = Column(Text, nullable=True)
    last_mile_strategy = Column(Text, nullable=True)
    human_resources = Column(Text, nullable=True)
    needs = Column(Text, nullable=True)
    status = Column(String, nullable=False, default="draft")
    # draft / published / suspended

    company = relationship("LogisticsCompany", back_populates="operational_plans")
    disaster = relationship("Disaster", back_populates="operational_plans")


class Mission(Base):
    __tablename__ = "missions"

    id = Column(Integer, primary_key=True, index=True)
    disaster_id = Column(Integer, ForeignKey("disasters.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("logistics_companies.id"), nullable=False)
    status = Column(String, nullable=False, default="active")  # active / completed / failed
    created_at = Column(DateTime, default=datetime.utcnow)

    disaster = relationship("Disaster", back_populates="missions")
    company = relationship("LogisticsCompany", back_populates="missions")
    funding_commitments = relationship("FundingCommitment", back_populates="mission")
    delivery_events = relationship("DeliveryEvent", back_populates="mission")
    timeline_events = relationship("TimelineEvent", back_populates="mission")
    settlement_records = relationship("SettlementRecord", back_populates="mission")


class FundingCommitment(Base):
    __tablename__ = "funding_commitments"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    donor_address = Column(String, nullable=False)
    amount_usdc = Column(Float, nullable=False)
    tx_hash = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")
    # pending / confirmed / failed
    timeline_status = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mission = relationship("Mission", back_populates="funding_commitments")


class Operator(Base):
    __tablename__ = "operators"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("logistics_companies.id"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    status = Column(String, nullable=False, default="active")  # active / inactive
    created_at = Column(DateTime, default=datetime.utcnow)

    company = relationship("LogisticsCompany", back_populates="operators")
    delivery_events = relationship("DeliveryEvent", back_populates="operator")


class DeliveryEvent(Base):
    __tablename__ = "delivery_events"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    operator_id = Column(Integer, ForeignKey("operators.id"), nullable=True)
    lot_id = Column(String, nullable=True)
    qr_result = Column(String, nullable=True)
    timestamp = Column(DateTime, nullable=True)
    gps_lat = Column(Float, nullable=True)
    gps_lng = Column(Float, nullable=True)
    gps_status = Column(String, nullable=True)
    note = Column(Text, nullable=True)
    sync_status = Column(String, nullable=False, default="pending")
    # pending / sending / synced / error / requires_review
    client_event_id = Column(String, nullable=True, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    mission = relationship("Mission", back_populates="delivery_events")
    operator = relationship("Operator", back_populates="delivery_events")
    evidence_bundles = relationship("EvidenceBundle", back_populates="delivery_event")
    validation_decisions = relationship("ValidationDecision", back_populates="delivery_event")
    settlement_records = relationship("SettlementRecord", back_populates="delivery_event")


class EvidenceBundle(Base):
    __tablename__ = "evidence_bundles"

    id = Column(Integer, primary_key=True, index=True)
    delivery_event_id = Column(Integer, ForeignKey("delivery_events.id"), nullable=False)
    data_json = Column(Text, nullable=True)

    delivery_event = relationship("DeliveryEvent", back_populates="evidence_bundles")


class ValidationDecision(Base):
    __tablename__ = "validation_decisions"

    id = Column(Integer, primary_key=True, index=True)
    delivery_event_id = Column(Integer, ForeignKey("delivery_events.id"), nullable=False)
    decision = Column(String, nullable=False)  # accepted / requires_review / rejected
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    delivery_event = relationship("DeliveryEvent", back_populates="validation_decisions")


class SettlementRecord(Base):
    __tablename__ = "settlement_records"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    delivery_event_id = Column(Integer, ForeignKey("delivery_events.id"), nullable=True)
    operational_advance = Column(Float, nullable=True)
    margin_transferred = Column(Float, nullable=True)
    status = Column(String, nullable=False, default="processing")
    # processing / advance_deducted / margin_transferred / closed
    created_at = Column(DateTime, default=datetime.utcnow)

    mission = relationship("Mission", back_populates="settlement_records")
    delivery_event = relationship("DeliveryEvent", back_populates="settlement_records")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    mission_id = Column(Integer, ForeignKey("missions.id"), nullable=False)
    actor_type = Column(String, nullable=True)
    event_type = Column(String, nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, nullable=True)
    happened_at = Column(DateTime, default=datetime.utcnow)
    metadata_json = Column(Text, nullable=True)

    mission = relationship("Mission", back_populates="timeline_events")


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    legal_rep_name = Column(String, nullable=True)
    legal_rep_email = Column(String, nullable=True)
    doc_number = Column(String, nullable=True)
    status = Column(String, nullable=False, default="pending")
    # pending / under_review / verified / rejected
    created_at = Column(DateTime, default=datetime.utcnow)
