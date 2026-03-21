"""
HandLend – FastAPI backend
SQLite via SQLAlchemy · Pydantic v2
"""

from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import Base, engine, get_db
from seed import seed as run_seed


# ── Lifespan ───────────────────────────────────────────────────────────────


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables then seed
    Base.metadata.create_all(bind=engine)
    db = next(get_db())
    try:
        run_seed(db)
    finally:
        db.close()
    yield


# ── App ────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="HandLend API",
    description="Humanitarian funding platform backend",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ══════════════════════════════════════════════════════════════════════════
#  DONOR-FACING ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════


@app.get(
    "/api/disasters",
    response_model=list[schemas.DisasterOut],
    tags=["Donor"],
    summary="List all active disasters",
)
def list_disasters(db: Session = Depends(get_db)):
    return (
        db.query(models.Disaster)
        .filter(models.Disaster.status == "active")
        .order_by(models.Disaster.created_at.desc())
        .all()
    )


@app.get(
    "/api/disasters/{disaster_id}/companies",
    response_model=list[schemas.LogisticsCompanySummaryOut],
    tags=["Donor"],
    summary="List logistics companies operating in a disaster",
)
def list_companies_for_disaster(disaster_id: int, db: Session = Depends(get_db)):
    disaster = db.query(models.Disaster).filter(models.Disaster.id == disaster_id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster not found")

    missions = (
        db.query(models.Mission)
        .filter(models.Mission.disaster_id == disaster_id)
        .all()
    )
    company_ids = {m.company_id for m in missions}
    if not company_ids:
        return []

    companies = (
        db.query(models.LogisticsCompany)
        .filter(models.LogisticsCompany.id.in_(company_ids))
        .all()
    )
    return companies


@app.get(
    "/api/companies/{company_id}",
    response_model=schemas.LogisticsCompanyOut,
    tags=["Donor"],
    summary="Get company profile with assessment",
)
def get_company(company_id: int, db: Session = Depends(get_db)):
    company = (
        db.query(models.LogisticsCompany)
        .filter(models.LogisticsCompany.id == company_id)
        .first()
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    return company


@app.post(
    "/api/contributions/intent",
    response_model=schemas.ContributionIntentOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Donor"],
    summary="Create a pending funding commitment",
)
def create_contribution_intent(
    body: schemas.ContributionIntentIn,
    db: Session = Depends(get_db),
):
    mission = db.query(models.Mission).filter(models.Mission.id == body.mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    commitment = models.FundingCommitment(
        mission_id=body.mission_id,
        donor_address=body.donor_address,
        amount_usdc=body.amount_usdc,
        status="pending",
        timeline_status="intent_created",
    )
    db.add(commitment)
    db.commit()
    db.refresh(commitment)
    return commitment


@app.post(
    "/api/contributions/confirm",
    response_model=schemas.ContributionConfirmOut,
    tags=["Donor"],
    summary="Confirm a funding commitment with tx hash",
)
def confirm_contribution(
    body: schemas.ContributionConfirmIn,
    db: Session = Depends(get_db),
):
    commitment = (
        db.query(models.FundingCommitment)
        .filter(models.FundingCommitment.id == body.intent_id)
        .first()
    )
    if not commitment:
        raise HTTPException(status_code=404, detail="Funding commitment not found")
    if commitment.status == "confirmed":
        raise HTTPException(status_code=409, detail="Commitment already confirmed")

    commitment.tx_hash = body.tx_hash
    commitment.status = "confirmed"
    commitment.timeline_status = "funding_confirmed"

    # Add a timeline event for the confirmation
    timeline_event = models.TimelineEvent(
        mission_id=commitment.mission_id,
        actor_type="donor",
        event_type="funding_confirmed",
        title="Fondos confirmados",
        description=(
            f"Donación de {commitment.amount_usdc} USDC confirmada. "
            f"Tx: {body.tx_hash}"
        ),
        status="completed",
        happened_at=datetime.utcnow(),
    )
    db.add(timeline_event)
    db.commit()
    db.refresh(commitment)
    return commitment


@app.get(
    "/api/missions/{mission_id}/timeline",
    response_model=list[schemas.TimelineEventOut],
    tags=["Donor"],
    summary="Get timeline events for a mission",
)
def get_mission_timeline(mission_id: int, db: Session = Depends(get_db)):
    mission = db.query(models.Mission).filter(models.Mission.id == mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    events = (
        db.query(models.TimelineEvent)
        .filter(models.TimelineEvent.mission_id == mission_id)
        .order_by(models.TimelineEvent.happened_at.asc())
        .all()
    )
    return events


# ══════════════════════════════════════════════════════════════════════════
#  OPERATOR-FACING ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════


@app.post(
    "/api/deliveries",
    response_model=schemas.DeliveryEventOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Operator"],
    summary="Create a single delivery event",
)
def create_delivery(
    body: schemas.DeliveryEventIn,
    db: Session = Depends(get_db),
):
    mission = db.query(models.Mission).filter(models.Mission.id == body.mission_id).first()
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")

    # Deduplicate by client_event_id if provided
    if body.client_event_id:
        existing = (
            db.query(models.DeliveryEvent)
            .filter(models.DeliveryEvent.client_event_id == body.client_event_id)
            .first()
        )
        if existing:
            return existing

    event = models.DeliveryEvent(
        mission_id=body.mission_id,
        operator_id=body.operator_id,
        lot_id=body.lot_id,
        qr_result=body.qr_result,
        timestamp=body.timestamp,
        gps_lat=body.gps_lat,
        gps_lng=body.gps_lng,
        gps_status=body.gps_status,
        note=body.note,
        sync_status=body.sync_status or "pending",
        client_event_id=body.client_event_id,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


@app.post(
    "/api/deliveries/sync-batch",
    response_model=schemas.DeliveryBatchOut,
    tags=["Operator"],
    summary="Batch sync delivery events (deduplicated by client_event_id)",
)
def sync_delivery_batch(
    body: schemas.DeliveryBatchIn,
    db: Session = Depends(get_db),
):
    created_events: list[models.DeliveryEvent] = []
    skipped = 0

    for item in body.events:
        # Validate mission
        mission = db.query(models.Mission).filter(models.Mission.id == item.mission_id).first()
        if not mission:
            skipped += 1
            continue

        # Deduplicate
        if item.client_event_id:
            existing = (
                db.query(models.DeliveryEvent)
                .filter(models.DeliveryEvent.client_event_id == item.client_event_id)
                .first()
            )
            if existing:
                skipped += 1
                continue

        event = models.DeliveryEvent(
            mission_id=item.mission_id,
            operator_id=item.operator_id,
            lot_id=item.lot_id,
            qr_result=item.qr_result,
            timestamp=item.timestamp,
            gps_lat=item.gps_lat,
            gps_lng=item.gps_lng,
            gps_status=item.gps_status,
            note=item.note,
            sync_status=item.sync_status or "pending",
            client_event_id=item.client_event_id,
        )
        db.add(event)
        created_events.append(event)

    db.commit()
    for e in created_events:
        db.refresh(e)

    return schemas.DeliveryBatchOut(
        created=len(created_events),
        skipped=skipped,
        events=created_events,
    )


@app.get(
    "/api/deliveries/{delivery_id}/settlement-state",
    response_model=schemas.SettlementStateOut,
    tags=["Operator"],
    summary="Get settlement and validation state for a delivery event",
)
def get_delivery_settlement_state(delivery_id: int, db: Session = Depends(get_db)):
    event = (
        db.query(models.DeliveryEvent)
        .filter(models.DeliveryEvent.id == delivery_id)
        .first()
    )
    if not event:
        raise HTTPException(status_code=404, detail="Delivery event not found")

    validation = (
        db.query(models.ValidationDecision)
        .filter(models.ValidationDecision.delivery_event_id == delivery_id)
        .order_by(models.ValidationDecision.created_at.desc())
        .first()
    )
    settlement = (
        db.query(models.SettlementRecord)
        .filter(models.SettlementRecord.delivery_event_id == delivery_id)
        .order_by(models.SettlementRecord.created_at.desc())
        .first()
    )

    return schemas.SettlementStateOut(
        delivery_event=event,
        validation=validation,
        settlement=settlement,
    )


# ══════════════════════════════════════════════════════════════════════════
#  COORDINATOR-FACING ENDPOINTS
# ══════════════════════════════════════════════════════════════════════════


@app.get(
    "/api/coordinator/organization",
    response_model=schemas.OrganizationOut,
    tags=["Coordinator"],
    summary="Get the coordinator's organization (returns first or 404)",
)
def get_organization(db: Session = Depends(get_db)):
    org = db.query(models.Organization).first()
    if not org:
        raise HTTPException(status_code=404, detail="No organization found")
    return org


@app.post(
    "/api/coordinator/organization",
    response_model=schemas.OrganizationOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Coordinator"],
    summary="Create or update organization",
)
def upsert_organization(
    body: schemas.OrganizationIn,
    db: Session = Depends(get_db),
):
    org = db.query(models.Organization).first()
    if org:
        # Update
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(org, field, value)
        db.commit()
        db.refresh(org)
        return org

    # Create
    org = models.Organization(**body.model_dump())
    db.add(org)
    db.commit()
    db.refresh(org)
    return org


@app.get(
    "/api/coordinator/plans",
    response_model=list[schemas.OperationalPlanOut],
    tags=["Coordinator"],
    summary="List all operational plans",
)
def list_plans(db: Session = Depends(get_db)):
    return db.query(models.OperationalPlan).all()


@app.post(
    "/api/coordinator/plans",
    response_model=schemas.OperationalPlanOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Coordinator"],
    summary="Create or update operational plan",
)
def upsert_plan(
    body: schemas.OperationalPlanIn,
    db: Session = Depends(get_db),
):
    # If a plan for this company+disaster already exists, update it
    existing = (
        db.query(models.OperationalPlan)
        .filter(
            models.OperationalPlan.company_id == body.company_id,
            models.OperationalPlan.disaster_id == body.disaster_id,
        )
        .first()
    )
    if existing:
        for field, value in body.model_dump(exclude_unset=True).items():
            setattr(existing, field, value)
        db.commit()
        db.refresh(existing)
        return existing

    plan = models.OperationalPlan(**body.model_dump())
    db.add(plan)
    db.commit()
    db.refresh(plan)
    return plan


@app.get(
    "/api/coordinator/operators",
    response_model=list[schemas.OperatorOut],
    tags=["Coordinator"],
    summary="List all operators",
)
def list_operators(db: Session = Depends(get_db)):
    return db.query(models.Operator).order_by(models.Operator.created_at.desc()).all()


@app.post(
    "/api/coordinator/operators",
    response_model=schemas.OperatorOut,
    status_code=status.HTTP_201_CREATED,
    tags=["Coordinator"],
    summary="Create a new operator",
)
def create_operator(
    body: schemas.OperatorIn,
    db: Session = Depends(get_db),
):
    company = (
        db.query(models.LogisticsCompany)
        .filter(models.LogisticsCompany.id == body.company_id)
        .first()
    )
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    operator = models.Operator(**body.model_dump())
    db.add(operator)
    db.commit()
    db.refresh(operator)
    return operator


@app.put(
    "/api/coordinator/operators/{operator_id}",
    response_model=schemas.OperatorOut,
    tags=["Coordinator"],
    summary="Update operator (e.g., toggle active/inactive)",
)
def update_operator(
    operator_id: int,
    body: schemas.OperatorUpdateIn,
    db: Session = Depends(get_db),
):
    operator = (
        db.query(models.Operator)
        .filter(models.Operator.id == operator_id)
        .first()
    )
    if not operator:
        raise HTTPException(status_code=404, detail="Operator not found")

    for field, value in body.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(operator, field, value)

    db.commit()
    db.refresh(operator)
    return operator


@app.get(
    "/api/coordinator/dashboard",
    response_model=schemas.DashboardOut,
    tags=["Coordinator"],
    summary="Dashboard summary: funds, deliveries, pending sync, alerts",
)
def get_dashboard(db: Session = Depends(get_db)):
    # Total confirmed funds
    commitments = (
        db.query(models.FundingCommitment)
        .filter(models.FundingCommitment.status == "confirmed")
        .all()
    )
    total_funds = sum(c.amount_usdc for c in commitments)

    # Total deliveries
    total_deliveries = db.query(models.DeliveryEvent).count()

    # Pending sync
    pending_sync = (
        db.query(models.DeliveryEvent)
        .filter(models.DeliveryEvent.sync_status.in_(["pending", "sending", "error"]))
        .count()
    )

    # Simple alerts
    alerts: list[str] = []
    requires_review = (
        db.query(models.DeliveryEvent)
        .filter(models.DeliveryEvent.sync_status == "requires_review")
        .count()
    )
    if requires_review > 0:
        alerts.append(f"{requires_review} delivery event(s) require manual review.")

    failed_commitments = (
        db.query(models.FundingCommitment)
        .filter(models.FundingCommitment.status == "failed")
        .count()
    )
    if failed_commitments > 0:
        alerts.append(f"{failed_commitments} funding commitment(s) failed.")

    return schemas.DashboardOut(
        total_funds=total_funds,
        total_deliveries=total_deliveries,
        pending_sync=pending_sync,
        alerts=alerts,
    )


# ── Health check ───────────────────────────────────────────────────────────


@app.get("/health", tags=["System"])
def health():
    return {"status": "ok"}
