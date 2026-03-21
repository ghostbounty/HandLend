"""
Seed the database with initial demo data.
Called at application startup only when the database is empty.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from models import (
    Disaster,
    LogisticsCompany,
    CompanyAssessment,
    OperationalPlan,
    Mission,
    FundingCommitment,
    Operator,
    TimelineEvent,
)


def seed(db: Session) -> None:
    # Guard: skip if already seeded
    if db.query(Disaster).count() > 0:
        return

    now = datetime.utcnow()

    # ── Disasters ──────────────────────────────────────────────────────────
    d1 = Disaster(
        name="Terremoto Valparaíso",
        country="Chile",
        event_type="earthquake",
        severity="critical",
        status="active",
        description="Sismo de magnitud 7.2 afectó la región de Valparaíso, dejando miles de damnificados.",
        created_at=now - timedelta(days=5),
    )
    d2 = Disaster(
        name="Inundaciones Piura",
        country="Peru",
        event_type="flood",
        severity="high",
        status="active",
        description="Lluvias intensas provocaron desborde del río Piura afectando comunidades rurales.",
        created_at=now - timedelta(days=3),
    )
    d3 = Disaster(
        name="Sequía Chaco",
        country="Paraguay",
        event_type="drought",
        severity="medium",
        status="active",
        description="Prolongada sequía en la región del Gran Chaco amenaza la seguridad alimentaria.",
        created_at=now - timedelta(days=10),
    )
    db.add_all([d1, d2, d3])
    db.flush()

    # ── Logistics Companies ────────────────────────────────────────────────
    c1 = LogisticsCompany(
        name="LogiHumanitas",
        verification_status="active",
        capacity="high",
        trust_score=92.0,
        coverage="Valparaíso metropolitana",
        response_time="48h",
        genlayer_summary=(
            "Empresa con 15 años de experiencia en logística humanitaria. "
            "Alta capacidad operativa verificada en terremotos anteriores. "
            "Riesgo bajo. Se recomienda."
        ),
        created_at=now - timedelta(days=30),
    )
    c2 = LogisticsCompany(
        name="CargoSolidario",
        verification_status="active",
        capacity="medium",
        trust_score=78.0,
        coverage="Norte Perú",
        response_time="72h",
        genlayer_summary=(
            "Operador regional con historial de 8 operaciones en zonas inundadas. "
            "Capacidad media. Activo en zona afectada. Evaluación positiva."
        ),
        created_at=now - timedelta(days=20),
    )
    c3 = LogisticsCompany(
        name="TransAyuda",
        verification_status="active",
        capacity="medium",
        trust_score=65.0,
        coverage="Gran Chaco",
        response_time="96h",
        genlayer_summary=(
            "Empresa nueva en plataforma. Documentación completa. "
            "Sin historial previo en HandLend. Evaluación preliminar positiva."
        ),
        created_at=now - timedelta(days=7),
    )
    db.add_all([c1, c2, c3])
    db.flush()

    # ── Company Assessments ────────────────────────────────────────────────
    a1 = CompanyAssessment(
        company_id=c1.id,
        can_execute="Distribución de alimentos y agua",
        coverage_area="Zona urbana y periurbana",
        resources="15 vehículos, 40 voluntarios",
        risks="Acceso a zonas altas limitado",
        limitations="Sin drones",
        evidence="Informe técnico 2023-HC-012, certificación OCHA.",
    )
    a2 = CompanyAssessment(
        company_id=c2.id,
        can_execute="Distribución de kits de emergencia y alimentos secos",
        coverage_area="Zona costera e interior norte",
        resources="8 camiones, 25 voluntarios, 2 embarcaciones",
        risks="Cortes de rutas por inundación",
        limitations="Capacidad frigorífica limitada",
        evidence="Reporte de campo Piura 2022.",
    )
    a3 = CompanyAssessment(
        company_id=c3.id,
        can_execute="Transporte de agua potable y alimentos no perecederos",
        coverage_area="Chaco central y boreal",
        resources="6 camiones cisterna, 15 colaboradores",
        risks="Distancias largas, poca infraestructura vial",
        limitations="Sin experiencia en emergencias mayores previas",
        evidence="Declaración jurada, registros tributarios.",
    )
    db.add_all([a1, a2, a3])
    db.flush()

    # ── Missions ───────────────────────────────────────────────────────────
    m1 = Mission(
        disaster_id=d1.id,
        company_id=c1.id,
        status="active",
        created_at=now - timedelta(days=4),
    )
    m2 = Mission(
        disaster_id=d2.id,
        company_id=c2.id,
        status="active",
        created_at=now - timedelta(days=2),
    )
    db.add_all([m1, m2])
    db.flush()

    # ── Operational Plans ──────────────────────────────────────────────────
    op1 = OperationalPlan(
        company_id=c1.id,
        disaster_id=d1.id,
        cargo_capacity="5 toneladas/día",
        estimated_time="72h para primera entrega",
        coverage="Viña del Mar, Valparaíso, Quilpué",
        infrastructure="3 galpones + 15 vehículos",
        risks="Réplicas sísmicas, acceso a zonas altas",
        last_mile_strategy="Distribución puerta a puerta con voluntarios locales",
        human_resources="40 personas entre conductores, cargadores y coordinadores",
        needs="Combustible, EPP, comunicaciones satelitales",
        status="published",
    )
    db.add(op1)
    db.flush()

    # ── Funding Commitment ─────────────────────────────────────────────────
    fc1 = FundingCommitment(
        mission_id=m1.id,
        donor_address="0xDonor123...",
        amount_usdc=500.0,
        tx_hash="0xabc123def456...",
        status="confirmed",
        timeline_status="funding_confirmed",
        created_at=now - timedelta(days=1),
    )
    db.add(fc1)
    db.flush()

    # ── Timeline Events for Mission 1 ──────────────────────────────────────
    te1 = TimelineEvent(
        mission_id=m1.id,
        actor_type="system",
        event_type="company_selected",
        title="Empresa seleccionada",
        description="LogiHumanitas fue seleccionada para operar en la emergencia.",
        status="completed",
        happened_at=now - timedelta(days=2),
    )
    te2 = TimelineEvent(
        mission_id=m1.id,
        actor_type="donor",
        event_type="funding_confirmed",
        title="Fondos recibidos",
        description="Se confirmó la recepción de 500 USDC del donante.",
        status="completed",
        happened_at=now - timedelta(days=1),
    )
    te3 = TimelineEvent(
        mission_id=m1.id,
        actor_type="coordinator",
        event_type="plan_published",
        title="Plan operativo publicado",
        description="El plan operativo fue publicado y está listo para ejecución.",
        status="completed",
        happened_at=now - timedelta(hours=12),
    )
    db.add_all([te1, te2, te3])
    db.flush()

    # ── Operator ───────────────────────────────────────────────────────────
    op = Operator(
        company_id=c1.id,
        name="Carlos Mendez",
        email="carlos@logihumanitas.cl",
        status="active",
        created_at=now - timedelta(days=25),
    )
    db.add(op)
    db.flush()

    db.commit()
    print("[seed] Database seeded successfully.")
